import { ARTICLE_CATEGORIES as CMS_ARTICLE_CATEGORIES } from '../../../constants/article-categories';
import sanitizeHtml from 'sanitize-html';
import {
  unsubscribeHeaders,
  unsubscribeLinks,
  type MailingListRecipient,
} from '../../../utils/mailing-list-unsubscribe';

const POST_UID = 'api::post.post';
const APPLICATION_UID = 'api::writer-application.writer-application';
const COMMENT_UID = 'api::article-comment.article-comment';
const LIKE_UID = 'api::article-like.article-like';
const SUBSCRIPTION_UID = 'api::mailing-list-subscription.mailing-list-subscription';
const WRITER_ROLES = new Set(['editor', 'admin', 'super-admin']);
const ADMIN_ROLES = new Set(['admin', 'super-admin']);
const WORKFLOW_STATUSES = new Set(['draft', 'pending-review', 'published', 'rejected', 'update-requested']);
const MAX_ARTICLE_IMAGE_SIZE = 8 * 1024 * 1024;
const EMAIL_SEND_CONCURRENCY = 5;
const UNSUBSCRIBE_URL_PLACEHOLDER = '__TECH_DERBY_UNSUBSCRIBE_URL__';
const ARTICLE_IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const ARTICLE_CATEGORIES = new Set<string>(CMS_ARTICLE_CATEGORIES);
const ARTICLE_CONTENT_FORMATS = new Set(['markdown', 'html']);

const ARTICLE_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'hr',
    'pre', 'code',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
    'figure', 'figcaption', 'div', 'span',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    p: ['style'],
    h1: ['style'],
    h2: ['style'],
    h3: ['style'],
    h4: ['style'],
    th: ['colspan', 'rowspan', 'scope', 'style'],
    td: ['colspan', 'rowspan', 'style'],
    pre: ['data-language'],
    code: ['class'],
    figure: ['class'],
    div: ['class'],
  },
  allowedClasses: {
    code: [/^language-[a-zA-Z0-9_+#.-]+$/],
    figure: ['article-split', 'article-split-left', 'article-split-right'],
    div: ['tableWrapper'],
  },
  allowedStyles: {
    '*': {
      'text-align': [/^(left|right|center|justify)$/],
    },
    img: {
      width: [/^\d+(?:\.\d+)?(?:px|%)$/],
      'max-width': [/^100%$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https'],
  },
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', {
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
    img: sanitizeHtml.simpleTransform('img', {
      loading: 'lazy',
    }),
  },
};

class InputError extends Error {}

function field(value: unknown) {
  return String(Array.isArray(value) ? value[0] ?? '' : value ?? '').trim();
}

function arrayField(value: unknown) {
  if (Array.isArray(value)) return value.map(field).filter(Boolean);
  const raw = field(value);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(field).filter(Boolean);
  } catch {
    // Fall through to comma-separated values.
  }
  return raw.split(',').map((item) => item.trim()).filter(Boolean);
}

function sanitiseArticleHtml(value: string) {
  return sanitizeHtml(value, ARTICLE_HTML_OPTIONS).trim();
}

function articleText(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function makeSlug(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

async function uniqueSlug(title: string) {
  const base = makeSlug(title) || `article-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  while (await strapi.db.query(POST_UID).findOne({ where: { slug }, select: ['id'] })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

async function currentUser(ctx: any) {
  const userId = ctx.state.user?.id;
  if (!userId) return null;
  return (await strapi.db.connection('up_users').where({ id: userId }).first()) ?? null;
}

async function requireUser(ctx: any) {
  const user = await currentUser(ctx);
  if (!user) {
    ctx.unauthorized('You must be logged in.');
    return null;
  }
  return user;
}

async function requireWriter(ctx: any) {
  const user = await requireUser(ctx);
  if (!user) return null;
  const role = user.memberRole ?? user.member_role;
  if (!WRITER_ROLES.has(role)) {
    ctx.forbidden('Approved writer access is required.');
    return null;
  }
  return user;
}

async function requireAdmin(ctx: any) {
  const user = await requireUser(ctx);
  if (!user) return null;
  const role = user.memberRole ?? user.member_role;
  if (!ADMIN_ROLES.has(role)) {
    ctx.forbidden('Administrator access is required.');
    return null;
  }
  return user;
}

function displayName(user: any) {
  const first = user.firstName ?? user.first_name ?? '';
  const last = user.lastName ?? user.last_name ?? '';
  return `${first} ${last}`.trim() || user.username || 'Tech Derby Writer';
}

function uploadedImage(ctx: any) {
  const supplied = ctx.request.files?.featuredImage ?? ctx.request.files?.image ?? ctx.request.files?.files;
  return (Array.isArray(supplied) ? supplied[0] : supplied) as any;
}

function storeArticleImage(image: any) {
  if (!image) throw new InputError('Select a featured image.');
  const extension = ARTICLE_IMAGE_EXTENSIONS[String(image.mimetype ?? image.type ?? '')];
  if (!extension) throw new InputError('Only JPEG, PNG and WebP article images are allowed.');
  if (Number(image.size ?? 0) > MAX_ARTICLE_IMAGE_SIZE) throw new InputError('The featured image must be 8 MB or smaller.');
  const sourcePath = image.filepath ?? image.path;
  if (!sourcePath) throw new InputError('The uploaded image could not be read.');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  const uploadDir = path.join(strapi.dirs.static.public, 'uploads', 'articles');
  fs.mkdirSync(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`;
  const destination = path.join(uploadDir, filename);
  fs.copyFileSync(sourcePath, destination);
  return { publicPath: `/uploads/articles/${filename}`, destination };
}

function removeFile(destination?: string) {
  if (!destination) return;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  if (fs.existsSync(destination)) fs.unlinkSync(destination);
}

function removeOldImage(publicPath?: string | null) {
  if (!publicPath?.startsWith('/uploads/articles/')) return;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  const destination = path.join(strapi.dirs.static.public, 'uploads', 'articles', path.basename(publicPath));
  if (fs.existsSync(destination)) fs.unlinkSync(destination);
}

function parseArticle(body: Record<string, unknown> = {}) {
  const title = field(body.title);
  const excerpt = field(body.excerpt);
  const requestedFormat = field(body.contentFormat) || 'markdown';
  const contentFormat = ARTICLE_CONTENT_FORMATS.has(requestedFormat) ? requestedFormat : 'markdown';
  const rawContent = String(body.content ?? '').trim();
  const content = contentFormat === 'html' ? sanitiseArticleHtml(rawContent) : rawContent;
  const category = field(body.category) || 'Others';
  const tags = arrayField(body.tags).slice(0, 12);
  const hasArticleContent = contentFormat === 'html'
    ? Boolean(articleText(content) || /<img\b/i.test(content) || /<table\b/i.test(content))
    : Boolean(content);
  if (!title || !excerpt || !hasArticleContent) throw new InputError('Title, excerpt and article content are required.');
  if (title.length > 200) throw new InputError('The title must be 200 characters or fewer.');
  if (excerpt.length > 600) throw new InputError('The excerpt must be 600 characters or fewer.');
  if (content.length > 250_000) throw new InputError('The article content is too large.');
  if (!ARTICLE_CATEGORIES.has(category)) throw new InputError('Select a valid article category.');
  return { title, excerpt, content, contentFormat, category, tags };
}

async function allArticleDocuments() {
  const documents = strapi.documents(POST_UID) as any;
  const [drafts, published] = await Promise.all([
    documents.findMany({ status: 'draft', populate: ['featuredImage'], sort: { updatedAt: 'desc' } }),
    documents.findMany({ status: 'published', populate: ['featuredImage'], sort: { updatedAt: 'desc' } }),
  ]);
  const map = new Map<string, any>();
  for (const article of published) map.set(article.documentId, article);
  for (const article of drafts) map.set(article.documentId, article);
  return [...map.values()];
}

function articleStats(articles: any[]) {
  const count = (status: string) => articles.filter((article) => (article.workflowStatus ?? 'draft') === status).length;
  const published = count('published');
  return {
    total: articles.length,
    draft: count('draft'),
    pendingReview: count('pending-review'),
    published,
    rejected: count('rejected'),
    updateRequested: count('update-requested'),
    totalReads: articles.reduce((sum, article) => sum + Number(article.readCount ?? 0), 0),
    totalLikes: articles.reduce((sum, article) => sum + Number(article.likeCount ?? 0), 0),
    totalComments: articles.reduce((sum, article) => sum + Number(article.commentCount ?? 0), 0),
    badges: [
      ...(articles.length >= 1 ? ['First Draft'] : []),
      ...(published >= 1 ? ['Published Voice'] : []),
      ...(published >= 5 ? ['Prolific Writer'] : []),
      ...(articles.reduce((sum, article) => sum + Number(article.readCount ?? 0), 0) >= 100 ? ['Read Magnet'] : []),
      ...(articles.reduce((sum, article) => sum + Number(article.likeCount ?? 0), 0) >= 10 ? ['Community Favourite'] : []),
    ],
  };
}

function publicImage(article: any) {
  if (article.featuredImageUrl) return article.featuredImageUrl;
  return article.featuredImage?.url ?? article.featuredImage?.data?.attributes?.url ?? '';
}

function serialiseArticle(article: any) {
  return { ...article, featuredImageUrl: publicImage(article) };
}

async function listWritersWithStats() {
  const writers = await strapi.db.connection('up_users')
    .whereIn('member_role', ['editor', 'admin', 'super-admin'])
    .select('id', 'username', 'first_name', 'last_name', 'email', 'member_role', 'created_at', 'updated_at')
    .orderBy('updated_at', 'desc');

  const articles = await allArticleDocuments();
  const comments = await strapi.db.query(COMMENT_UID).findMany({
    select: ['id', 'userId', 'postDocumentId'],
  });

  return writers.map((writer: any) => {
    const fullName = `${writer.first_name ?? ''} ${writer.last_name ?? ''}`.trim() || writer.username;
    const writerArticles = articles.filter((article) => Number(article.authorUserId) === Number(writer.id));
    const publishedArticles = writerArticles.filter((article) => article.workflowStatus === 'published');
    const pendingArticles = writerArticles.filter((article) => article.workflowStatus === 'pending-review');
    const writerComments = comments.filter((comment: any) => Number(comment.userId) === Number(writer.id));

    return {
      id: writer.id,
      username: writer.username,
      fullName,
      email: writer.email,
      memberRole: writer.member_role,
      createdAt: writer.created_at,
      updatedAt: writer.updated_at,
      stats: {
        articles: writerArticles.length,
        published: publishedArticles.length,
        pending: pendingArticles.length,
        totalReads: writerArticles.reduce((sum, article) => sum + Number(article.readCount ?? 0), 0),
        totalLikes: writerArticles.reduce((sum, article) => sum + Number(article.likeCount ?? 0), 0),
        totalComments: writerArticles.reduce((sum, article) => sum + Number(article.commentCount ?? 0), 0),
        commentsWritten: writerComments.length,
      },
      latestArticle: writerArticles
        .slice()
        .sort((first, second) => new Date(second.updatedAt ?? 0).getTime() - new Date(first.updatedAt ?? 0).getTime())[0] ?? null,
    };
  });
}

async function sendArticlePublishedEmail(article: any) {
  if (article.mailingListNotifiedAt) return;
  const subscribers = await strapi.db.query(SUBSCRIPTION_UID).findMany({
    select: ['id', 'email'],
    where: { subscriptionStatus: 'subscribed' },
  });
  const recipients = [
    ...new Map(
      subscribers
        .map((row: any) => ({ id: Number(row.id), email: field(row.email).toLowerCase() }))
        .filter((recipient: MailingListRecipient) => Number.isInteger(recipient.id) && recipient.id > 0 && Boolean(recipient.email))
        .map((recipient: MailingListRecipient) => [recipient.email, recipient]),
    ).values(),
  ] as MailingListRecipient[];
  if (!recipients.length) return;

  const frontendUrl = (process.env.PUBLIC_FRONTEND_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const link = `${frontendUrl}/wire/${article.slug}`;
  const image = publicImage(article);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  const attachments: any[] = [];
  const logoPath = path.join(strapi.dirs.static.public, 'techderbywhitelogo.webp');
  let logoMarkup = 'Tech Derby <span style="color:#38bdf8;">The Wire</span>';
  if (fs.existsSync(logoPath)) {
    attachments.push({ filename: 'techderby-logo.webp', path: logoPath, cid: 'wire-logo', contentType: 'image/webp' });
    logoMarkup = '<img src="cid:wire-logo" width="150" alt="Tech Derby" style="display:block;width:150px;max-width:100%;height:auto;border:0;">';
  }
  let articleImage = image.startsWith('/') ? `${(process.env.PUBLIC_BACKEND_URL ?? 'http://localhost:1337').replace(/\/$/, '')}${image}` : image;
  if (image.startsWith('/uploads/articles/')) {
    const localImage = path.join(strapi.dirs.static.public, 'uploads', 'articles', path.basename(image));
    if (fs.existsSync(localImage)) {
      attachments.push({ filename: path.basename(image), path: localImage, cid: 'wire-featured-image' });
      articleImage = 'cid:wire-featured-image';
    }
  }
  const html = `<!doctype html><html><body style="margin:0;background:#eef2f7;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px;background:#eef2f7;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:18px;overflow:hidden;"><tr><td style="height:5px;background:#0ea5e9"></td></tr><tr><td style="padding:28px 36px;background:#0f172a;color:#fff;font-size:24px;font-weight:800;">${logoMarkup}</td></tr>${articleImage ? `<tr><td><img src="${escapeHtml(articleImage)}" alt="" width="600" style="display:block;width:100%;height:auto;max-height:320px;object-fit:cover;"></td></tr>` : ''}<tr><td style="padding:36px;"><p style="margin:0 0 10px;color:#0284c7;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;">New on The Wire</p><h1 style="margin:0;color:#0f172a;font-size:32px;line-height:39px;">${escapeHtml(article.title)}</h1><p style="margin:18px 0 8px;color:#64748b;font-size:13px;">By ${escapeHtml(article.author)}</p><p style="margin:12px 0 24px;color:#475569;font-size:16px;line-height:25px;">${escapeHtml(article.excerpt)}</p><a href="${escapeHtml(link)}" style="display:inline-block;padding:14px 24px;border-radius:9px;background:#f97316;color:#fff;text-decoration:none;font-weight:800;">Read the article &rarr;</a></td></tr><tr><td style="padding:24px 36px;background:#0f172a;color:#94a3b8;font-size:12px;">You received this because you joined the Tech Derby mailing list. <a href="${UNSUBSCRIBE_URL_PLACEHOLDER}" style="color:#38bdf8;text-decoration:none;">Unsubscribe</a>.</td></tr></table></td></tr></table></body></html>`;
  const text = `New on The Wire: ${article.title}\n\n${article.excerpt}\n\nRead: ${link}\n\nUnsubscribe: ${UNSUBSCRIBE_URL_PLACEHOLDER}`;
  const from = process.env.SMTP_FROM ?? 'Tech Derby <hello@techderby.org>';
  let sent = 0;
  for (let index = 0; index < recipients.length; index += EMAIL_SEND_CONCURRENCY) {
    const batch = recipients.slice(index, index + EMAIL_SEND_CONCURRENCY);
    const results = await Promise.allSettled(batch.map((recipient) => {
      const links = unsubscribeLinks(recipient);
      return strapi.plugin('email').service('email').send({
        from,
        to: recipient.email,
        subject: `New on The Wire: ${article.title}`,
        html: html.split(UNSUBSCRIBE_URL_PLACEHOLDER).join(links.confirmation),
        text: text.split(UNSUBSCRIBE_URL_PLACEHOLDER).join(links.confirmation),
        attachments,
        headers: unsubscribeHeaders(recipient),
      });
    }));
    results.forEach((result) => {
      if (result.status === 'fulfilled') sent += 1;
      else strapi.log.error('[editorial] Failed to send an article notification email', result.reason);
    });
  }
  if (!sent) throw new Error('Article notification delivery failed for every active subscriber.');
  await strapi.db.query(POST_UID).update({
    where: { id: article.id },
    data: { mailingListNotifiedAt: new Date().toISOString() },
  });
}

export default {
  async publicArticles(ctx: any) {
    const documents = strapi.documents(POST_UID) as any;
    const articles = await documents.findMany({
      status: 'published',
      filters: { workflowStatus: 'published' },
      populate: ['featuredImage'],
      sort: { publishedAt: 'desc' },
    });
    ctx.body = { data: articles.map(serialiseArticle) };
  },

  async publicArticle(ctx: any) {
    const slug = field(ctx.params?.slug);
    const documents = strapi.documents(POST_UID) as any;
    const articles = await documents.findMany({
      status: 'published',
      filters: { slug, workflowStatus: 'published' },
      populate: ['featuredImage'],
      limit: 1,
    });
    if (!articles[0]) return ctx.notFound('Article not found.');
    ctx.body = { data: serialiseArticle(articles[0]) };
  },

  async recordRead(ctx: any) {
    const documentId = field(ctx.params?.documentId);
    const knex = strapi.db.connection;
    await knex('insights').where({ document_id: documentId }).whereNotNull('published_at').increment('read_count', 1);
    const row = await knex('insights').where({ document_id: documentId }).whereNotNull('published_at').first('read_count');
    ctx.body = { readCount: Number(row?.read_count ?? 0) };
  },

  async comments(ctx: any) {
    const documentId = field(ctx.params?.documentId);
    const comments = await strapi.db.query(COMMENT_UID).findMany({
      where: { postDocumentId: documentId, approved: true },
      select: ['id', 'name', 'content', 'createdAt'],
      orderBy: { createdAt: 'asc' },
    });
    ctx.body = { data: comments };
  },

  async addComment(ctx: any) {
    const documentId = field(ctx.params?.documentId);
    const name = field(ctx.request.body?.name);
    const email = field(ctx.request.body?.email).toLowerCase();
    const content = field(ctx.request.body?.content);
    if (!name || !content) return ctx.badRequest('Name and comment are required.');
    if (name.length > 100 || content.length > 3000) return ctx.badRequest('The comment is too long.');
    const user = await currentUser(ctx);
    const created = await strapi.db.query(COMMENT_UID).create({
      data: { postDocumentId: documentId, userId: user?.id ?? null, name, email: email || null, content, approved: true },
    });
    const knex = strapi.db.connection;
    await knex('insights').where({ document_id: documentId }).whereNotNull('published_at').increment('comment_count', 1);
    ctx.status = 201;
    ctx.body = { data: { id: created.id, name: created.name, content: created.content, createdAt: created.createdAt } };
  },

  async toggleLike(ctx: any) {
    const documentId = field(ctx.params?.documentId);
    const voterToken = field(ctx.request.body?.voterToken).slice(0, 120);
    if (!voterToken) return ctx.badRequest('A voter token is required.');
    const user = await currentUser(ctx);
    const existing = await strapi.db.query(LIKE_UID).findOne({ where: { postDocumentId: documentId, voterToken } });
    const knex = strapi.db.connection;
    let liked = false;
    if (existing) {
      await strapi.db.query(LIKE_UID).delete({ where: { id: existing.id } });
      await knex('insights').where({ document_id: documentId }).whereNotNull('published_at').where('like_count', '>', 0).decrement('like_count', 1);
    } else {
      await strapi.db.query(LIKE_UID).create({ data: { postDocumentId: documentId, voterToken, userId: user?.id ?? null } });
      await knex('insights').where({ document_id: documentId }).whereNotNull('published_at').increment('like_count', 1);
      liked = true;
    }
    const row = await knex('insights').where({ document_id: documentId }).whereNotNull('published_at').first('like_count');
    ctx.body = { liked, likeCount: Number(row?.like_count ?? 0) };
  },

  async applicationStatus(ctx: any) {
    const user = await requireUser(ctx);
    if (!user) return;
    const application = await strapi.db.query(APPLICATION_UID).findOne({ where: { userId: user.id } });
    ctx.body = { data: application };
  },

  async applyWriter(ctx: any) {
    const user = await requireUser(ctx);
    if (!user) return;
    const role = user.memberRole ?? user.member_role;
    if (WRITER_ROLES.has(role)) return ctx.badRequest('You already have writer access.');
    const existing = await strapi.db.query(APPLICATION_UID).findOne({ where: { userId: user.id } });
    if (existing?.status === 'pending' || existing?.status === 'approved') return ctx.badRequest('You already have an active writer application.');

    const motivation = field(ctx.request.body?.motivation);
    const experience = field(ctx.request.body?.experience);
    const portfolioUrl = field(ctx.request.body?.portfolioUrl);
    const topics = arrayField(ctx.request.body?.topics);
    if (motivation.length < 50) return ctx.badRequest('Tell us more about why you want to write (at least 50 characters).');
    const data = {
      userId: user.id,
      name: displayName(user),
      email: user.email,
      motivation,
      experience: experience || null,
      portfolioUrl: portfolioUrl || null,
      topics,
      status: 'pending',
      reviewNotes: null,
    };
    const application = existing
      ? await strapi.db.query(APPLICATION_UID).update({ where: { id: existing.id }, data })
      : await strapi.db.query(APPLICATION_UID).create({ data });
    ctx.status = 201;
    ctx.body = { data: application };
  },

  async myArticles(ctx: any) {
    const user = await requireWriter(ctx);
    if (!user) return;
    const articles = (await allArticleDocuments()).filter((article) => Number(article.authorUserId) === Number(user.id));
    ctx.body = { data: articles.map(serialiseArticle), stats: articleStats(articles) };
  },

  async createArticle(ctx: any) {
    const user = await requireWriter(ctx);
    if (!user) return;
    let stored: any;
    try {
      const input = parseArticle(ctx.request.body);
      stored = storeArticleImage(uploadedImage(ctx));
      const documents = strapi.documents(POST_UID) as any;
      const article = await documents.create({
        status: 'draft',
        data: {
          ...input,
          slug: await uniqueSlug(input.title),
          featuredImageUrl: stored.publicPath,
          author: displayName(user),
          authorUserId: user.id,
          workflowStatus: 'draft',
          readCount: 0,
          likeCount: 0,
          commentCount: 0,
        },
      });
      ctx.status = 201;
      ctx.body = { data: serialiseArticle(article) };
    } catch (error) {
      removeFile(stored?.destination);
      if (error instanceof InputError) return ctx.badRequest(error.message);
      strapi.log.error('[editorial] Failed to create article', error);
      return ctx.internalServerError('The article could not be created.');
    }
  },

  async uploadArticleAssets(ctx: any) {
    if (!(await requireWriter(ctx))) return;
    const supplied = ctx.request.files?.files ?? ctx.request.files?.['files[]'] ?? ctx.request.files?.file;
    const files = Array.isArray(supplied) ? supplied : supplied ? [supplied] : [];
    if (!files.length) return ctx.badRequest("Upload images using the 'files' form-data field.");
    if (files.length > 10) return ctx.badRequest('A maximum of 10 inline images can be uploaded at once.');

    const stored: Array<{ publicPath: string; destination: string }> = [];
    try {
      for (const file of files) stored.push(storeArticleImage(file));
      ctx.status = 201;
      ctx.body = { data: stored.map((item) => item.publicPath) };
    } catch (error) {
      stored.forEach((item) => removeFile(item.destination));
      if (error instanceof InputError) return ctx.badRequest(error.message);
      strapi.log.error('[editorial] Failed to upload inline article images', error);
      return ctx.internalServerError('The inline images could not be uploaded.');
    }
  },

  async updateArticle(ctx: any) {
    const user = await requireWriter(ctx);
    if (!user) return;
    const documentId = field(ctx.params?.documentId);
    const documents = strapi.documents(POST_UID) as any;
    const existing = await documents.findOne({ documentId, status: 'draft' }) ?? await documents.findOne({ documentId, status: 'published' });
    if (!existing) return ctx.notFound('Article not found.');
    const role = user.memberRole ?? user.member_role;
    if (!ADMIN_ROLES.has(role) && Number(existing.authorUserId) !== Number(user.id)) return ctx.forbidden('You can only edit your own articles.');

    let stored: any;
    try {
      const input = parseArticle(ctx.request.body);
      if (uploadedImage(ctx)) stored = storeArticleImage(uploadedImage(ctx));
      const updated = await documents.update({
        documentId,
        data: {
          ...input,
          slug: existing.slug,
          featuredImageUrl: stored?.publicPath ?? existing.featuredImageUrl,
          author: existing.author,
          authorUserId: existing.authorUserId,
          workflowStatus: 'draft',
          reviewNotes: null,
          mailingListNotifiedAt: existing.mailingListNotifiedAt ?? null,
        },
      });
      if (stored) removeOldImage(existing.featuredImageUrl);
      ctx.body = { data: serialiseArticle(updated) };
    } catch (error) {
      removeFile(stored?.destination);
      if (error instanceof InputError) return ctx.badRequest(error.message);
      strapi.log.error('[editorial] Failed to update article', error);
      return ctx.internalServerError('The article could not be updated.');
    }
  },

  async submitArticle(ctx: any) {
    const user = await requireWriter(ctx);
    if (!user) return;
    const documentId = field(ctx.params?.documentId);
    const documents = strapi.documents(POST_UID) as any;
    const existing = await documents.findOne({ documentId, status: 'draft' });
    if (!existing) return ctx.notFound('Article not found.');
    const role = user.memberRole ?? user.member_role;
    if (!ADMIN_ROLES.has(role) && Number(existing.authorUserId) !== Number(user.id)) return ctx.forbidden('You can only submit your own articles.');
    const updated = await documents.update({ documentId, data: { workflowStatus: 'pending-review', reviewNotes: null } });
    ctx.body = { data: serialiseArticle(updated) };
  },

  async adminOverview(ctx: any) {
    if (!(await requireAdmin(ctx))) return;
    const articles = await allArticleDocuments();
    const applications = await strapi.db.query(APPLICATION_UID).findMany({ orderBy: { createdAt: 'desc' } });
    const writerRows = await strapi.db.connection('up_users').where({ member_role: 'editor' }).select('id');
    ctx.body = {
      stats: { ...articleStats(articles), writers: writerRows.length, pendingWriters: applications.filter((item: any) => item.status === 'pending').length },
      pendingApplications: applications.filter((item: any) => item.status === 'pending'),
      pendingArticles: articles.filter((item) => item.workflowStatus === 'pending-review').map(serialiseArticle),
      articles: articles.map(serialiseArticle),
    };
  },

  async adminWriters(ctx: any) {
    if (!(await requireAdmin(ctx))) return;
    const writers = await listWritersWithStats();
    ctx.body = { data: writers };
  },

  async reviewApplication(ctx: any) {
    const admin = await requireAdmin(ctx);
    if (!admin) return;
    const id = Number(ctx.params?.id);
    const status = field(ctx.request.body?.status);
    const reviewNotes = field(ctx.request.body?.reviewNotes);
    if (!['approved', 'rejected'].includes(status)) return ctx.badRequest('Status must be approved or rejected.');
    const application = await strapi.db.query(APPLICATION_UID).findOne({ where: { id } });
    if (!application) return ctx.notFound('Application not found.');
    const updated = await strapi.db.query(APPLICATION_UID).update({
      where: { id },
      data: { status, reviewNotes: reviewNotes || null, reviewedAt: new Date().toISOString(), reviewedByUserId: admin.id },
    });
    if (status === 'approved') {
      await strapi.db.connection('up_users').where({ id: application.userId }).update({ member_role: 'editor', updated_at: new Date().toISOString() });
    }
    ctx.body = { data: updated };
  },

  async reviewArticle(ctx: any) {
    if (!(await requireAdmin(ctx))) return;
    const documentId = field(ctx.params?.documentId);
    const status = field(ctx.request.body?.status);
    const reviewNotes = field(ctx.request.body?.reviewNotes);
    if (!WORKFLOW_STATUSES.has(status) || status === 'draft') return ctx.badRequest('Invalid review status.');
    const documents = strapi.documents(POST_UID) as any;
    const existing = await documents.findOne({ documentId, status: 'draft' });
    if (!existing) return ctx.notFound('Article not found.');
    if (status === 'published' && existing.workflowStatus === 'published') {
      return ctx.badRequest('This article is already published and has no pending revision.');
    }

    const updated = await documents.update({
      documentId,
      data: {
        workflowStatus: status,
        reviewNotes: reviewNotes || null,
        mailingListNotifiedAt: status === 'published' ? null : existing.mailingListNotifiedAt ?? null,
      },
    });
    if (status !== 'published') {
      ctx.body = { data: serialiseArticle(updated) };
      return;
    }

    await documents.publish({ documentId });
    const published = await documents.findOne({ documentId, status: 'published', populate: ['featuredImage'] });
    try {
      await sendArticlePublishedEmail(published);
    } catch (error) {
      strapi.log.error(`[editorial] Article ${documentId} published but mailing-list notification failed`, error);
    }
    ctx.body = { data: serialiseArticle(published) };
  },

  async unpublishArticle(ctx: any) {
    if (!(await requireAdmin(ctx))) return;
    const documentId = field(ctx.params?.documentId);
    const documents = strapi.documents(POST_UID) as any;
    const existing = await documents.findOne({ documentId, status: 'published', populate: ['featuredImage'] });
    if (!existing) return ctx.notFound('Published article not found.');

    try {
      await documents.unpublish({ documentId });
    } catch {
      await strapi.db.connection('insights').where({ document_id: documentId }).update({ published_at: null });
    }

    const updated = await documents.findOne({ documentId, status: 'draft', populate: ['featuredImage'] })
      ?? await documents.findOne({ documentId, status: 'published', populate: ['featuredImage'] });
    ctx.body = { data: serialiseArticle(updated ?? existing) };
  },

  async deleteArticle(ctx: any) {
    if (!(await requireAdmin(ctx))) return;
    const documentId = field(ctx.params?.documentId);
    const documents = strapi.documents(POST_UID) as any;
    const existing = await documents.findOne({ documentId, status: 'draft', populate: ['featuredImage'] })
      ?? await documents.findOne({ documentId, status: 'published', populate: ['featuredImage'] });
    if (!existing) return ctx.notFound('Article not found.');

    removeOldImage(existing.featuredImageUrl);

    try {
      await documents.delete({ documentId });
    } catch {
      await strapi.db.connection('insights').where({ document_id: documentId }).delete();
    }

    ctx.body = { success: true };
  },
};
