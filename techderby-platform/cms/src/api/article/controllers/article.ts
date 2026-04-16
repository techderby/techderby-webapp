/**
 * Article controller — handles all article CRUD, submission, review, likes, and comments.
 *
 * Table: articles (auto-created by Strapi from schema)
 * Table: article_comments (created via migration 0002)
 *
 * Response shape matches frontend Article / ArticleComment types in content.ts.
 */

async function getCallerRole(strapi: any, userId: number): Promise<string> {
  const row = await strapi.db.connection('up_users').where({ id: userId }).select('member_role').first();
  return row?.member_role ?? 'member';
}

function isAdmin(role: string) {
  return role === 'admin' || role === 'super-admin';
}

function isAuthorOrAdmin(role: string) {
  return role === 'author' || role === 'editor' || isAdmin(role);
}

/** Estimate read time in minutes from JSON content (block structure or raw text). */
function estimateReadTime(content: unknown): number {
  try {
    const text = JSON.stringify(content ?? '');
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  } catch {
    return 1;
  }
}

/** Fetch author profile from up_users and merge into article row. */
async function withAuthor(knex: any, article: Record<string, any>) {
  const author = article.author_id
    ? await knex('up_users')
        .where({ id: article.author_id })
        .select('first_name', 'last_name', 'occupation', 'avatar', 'username')
        .first()
    : null;

  const authorName = author
    ? [author.first_name, author.last_name].filter(Boolean).join(' ') || author.username
    : 'Tech Derby Author';

  // Parse tags if stored as JSON string
  let tags: string[] | null = null;
  if (typeof article.tags === 'string') {
    try { tags = JSON.parse(article.tags); } catch { tags = null; }
  } else if (Array.isArray(article.tags)) {
    tags = article.tags;
  }

  // Parse content if stored as JSON string
  let content: Record<string, unknown> | null = null;
  if (typeof article.content === 'string') {
    try { content = JSON.parse(article.content); } catch { content = null; }
  } else if (article.content && typeof article.content === 'object') {
    content = article.content as Record<string, unknown>;
  }

  return {
    id:               article.id,
    title:            article.title,
    slug:             article.slug ?? null,
    excerpt:          article.excerpt ?? null,
    content,
    coverImageUrl:    article.cover_image_url ?? null,
    tags,
    status:           article.status,
    authorName,
    authorAvatar:     author?.avatar ?? null,
    authorOccupation: author?.occupation ?? null,
    readTime:         article.read_time ?? 1,
    views:            article.views ?? 0,
    likes:            article.likes ?? 0,
    createdAt:        article.created_at ?? null,
    publishedAt:      article.published_at ?? null,
  };
}

/** Generate a URL-safe slug from a title. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export default {

  // ── GET /api/articles  — published articles (public) ─────────────────────
  async list(ctx: any) {
    const knex = strapi.db.connection;
    const rows = await knex('articles')
      .where({ status: 'published' })
      .orderBy('published_at', 'desc')
      .select('*');

    const articles = await Promise.all(rows.map((r: any) => withAuthor(knex, r)));
    return ctx.send({ data: articles });
  },

  // ── GET /api/articles/mine  — caller's articles ────────────────────────────
  async mine(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const knex = strapi.db.connection;
    const rows = await knex('articles')
      .where({ author_id: userId })
      .orderBy('created_at', 'desc')
      .select('*');

    const articles = await Promise.all(rows.map((r: any) => withAuthor(knex, r)));
    return ctx.send(articles);
  },

  // ── GET /api/articles/slug/:slug  — single published article by slug ───────
  async findBySlug(ctx: any) {
    const { slug } = ctx.params;
    const knex = strapi.db.connection;

    const row = await knex('articles').where({ slug }).first();
    if (!row || (row.status !== 'published' && !ctx.state.user)) {
      return ctx.notFound('Article not found.');
    }

    // Increment views for published articles
    if (row.status === 'published') {
      await knex('articles').where({ id: row.id }).increment('views', 1);
      row.views = (row.views ?? 0) + 1;
    }

    return ctx.send(await withAuthor(knex, row));
  },

  // ── GET /api/articles/:id  — single article by ID (own or admin) ──────────
  async findOne(ctx: any) {
    const id = parseInt(ctx.params.id, 10);
    if (Number.isNaN(id)) return ctx.badRequest('Invalid article ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const knex = strapi.db.connection;
    const row = await knex('articles').where({ id }).first();
    if (!row) return ctx.notFound();

    const role = await getCallerRole(strapi, userId);
    if (row.author_id !== userId && !isAuthorOrAdmin(role)) {
      return ctx.forbidden();
    }

    return ctx.send(await withAuthor(knex, row));
  },

  // ── POST /api/articles  — create draft ────────────────────────────────────
  async create(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const role = await getCallerRole(strapi, userId);
    if (!isAuthorOrAdmin(role)) {
      return ctx.forbidden('Only authors and admins can create articles.');
    }

    const { title, excerpt, content, tags, coverImageUrl } = ctx.request.body ?? {};
    if (!title || typeof title !== 'string' || !title.trim()) {
      return ctx.badRequest('title is required.');
    }

    const knex = strapi.db.connection;

    // Generate unique slug
    const base = slugify(title.trim());
    let slug = base;
    let suffix = 0;
    while (await knex('articles').where({ slug }).first()) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }

    const now = new Date().toISOString();
    const inserted = await knex('articles').insert({
      title:           title.trim(),
      slug,
      excerpt:         excerpt ?? null,
      content:         content ? JSON.stringify(content) : null,
      cover_image_url: coverImageUrl ?? null,
      tags:            tags ? JSON.stringify(tags) : null,
      status:          'draft',
      author_id:       userId,
      read_time:       estimateReadTime(content),
      views:           0,
      likes:           0,
      created_at:      now,
      updated_at:      now,
      document_id:     Math.random().toString(36).slice(2, 18),
    }).returning('*');

    const article = inserted[0];
    ctx.status = 201;
    return ctx.send(await withAuthor(knex, article));
  },

  // ── PUT /api/articles/:id  — update draft/submitted article ──────────────
  async update(ctx: any) {
    const id = parseInt(ctx.params.id, 10);
    if (Number.isNaN(id)) return ctx.badRequest('Invalid article ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const knex = strapi.db.connection;
    const existing = await knex('articles').where({ id }).first();
    if (!existing) return ctx.notFound();

    const role = await getCallerRole(strapi, userId);
    const isOwner = existing.author_id === userId;

    if (!isOwner && !isAdmin(role)) return ctx.forbidden();

    // Non-admins can only update drafts or submitted articles
    if (!isAdmin(role) && !['draft', 'submitted'].includes(existing.status)) {
      return ctx.forbidden('You cannot edit an article that is in review, published, or rejected.');
    }

    const { title, excerpt, content, tags, coverImageUrl } = ctx.request.body ?? {};

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title     !== undefined) patch.title           = String(title).trim();
    if (excerpt   !== undefined) patch.excerpt         = excerpt;
    if (content   !== undefined) { patch.content       = JSON.stringify(content); patch.read_time = estimateReadTime(content); }
    if (tags      !== undefined) patch.tags            = JSON.stringify(tags);
    if (coverImageUrl !== undefined) patch.cover_image_url = coverImageUrl;

    const rows = await knex('articles').where({ id }).update(patch).returning('*');
    return ctx.send(await withAuthor(knex, rows[0]));
  },

  // ── DELETE /api/articles/:id ───────────────────────────────────────────────
  async delete(ctx: any) {
    const id = parseInt(ctx.params.id, 10);
    if (Number.isNaN(id)) return ctx.badRequest('Invalid article ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const knex = strapi.db.connection;
    const existing = await knex('articles').where({ id }).first();
    if (!existing) return ctx.notFound();

    const role = await getCallerRole(strapi, userId);
    if (existing.author_id !== userId && !isAdmin(role)) return ctx.forbidden();
    if (existing.status === 'published' && !isAdmin(role)) {
      return ctx.forbidden('Published articles cannot be deleted by authors.');
    }

    await knex('article_comments').where({ article_id: id }).delete();
    await knex('articles').where({ id }).delete();
    return ctx.send({ ok: true });
  },

  // ── POST /api/articles/:id/submit ─────────────────────────────────────────
  async submit(ctx: any) {
    const id = parseInt(ctx.params.id, 10);
    if (Number.isNaN(id)) return ctx.badRequest('Invalid article ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const knex = strapi.db.connection;
    const existing = await knex('articles').where({ id }).first();
    if (!existing) return ctx.notFound();
    if (existing.author_id !== userId) return ctx.forbidden();
    if (!['draft', 'rejected'].includes(existing.status)) {
      return ctx.badRequest('Only draft or rejected articles can be submitted.');
    }

    const rows = await knex('articles').where({ id }).update({
      status:     'submitted',
      updated_at: new Date().toISOString(),
    }).returning('*');

    return ctx.send(await withAuthor(knex, rows[0]));
  },

  // ── POST /api/articles/:id/publish  (admin) ────────────────────────────────
  async publish(ctx: any) {
    const id = parseInt(ctx.params.id, 10);
    if (Number.isNaN(id)) return ctx.badRequest('Invalid article ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const role = await getCallerRole(strapi, userId);
    if (!isAdmin(role) && role !== 'editor') return ctx.forbidden();

    const knex = strapi.db.connection;
    const existing = await knex('articles').where({ id }).first();
    if (!existing) return ctx.notFound();

    const now = new Date().toISOString();
    const rows = await knex('articles').where({ id }).update({
      status:       'published',
      published_at: now,
      updated_at:   now,
    }).returning('*');

    return ctx.send(await withAuthor(knex, rows[0]));
  },

  // ── POST /api/articles/:id/reject  (admin) ────────────────────────────────
  async reject(ctx: any) {
    const id = parseInt(ctx.params.id, 10);
    if (Number.isNaN(id)) return ctx.badRequest('Invalid article ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const role = await getCallerRole(strapi, userId);
    if (!isAdmin(role) && role !== 'editor') return ctx.forbidden();

    const knex = strapi.db.connection;
    const existing = await knex('articles').where({ id }).first();
    if (!existing) return ctx.notFound();

    const rows = await knex('articles').where({ id }).update({
      status:     'rejected',
      updated_at: new Date().toISOString(),
    }).returning('*');

    return ctx.send(await withAuthor(knex, rows[0]));
  },

  // ── POST /api/articles/:id/like ───────────────────────────────────────────
  async like(ctx: any) {
    const id = parseInt(ctx.params.id, 10);
    if (Number.isNaN(id)) return ctx.badRequest('Invalid article ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const knex = strapi.db.connection;
    const existing = await knex('articles').where({ id }).first();
    if (!existing || existing.status !== 'published') return ctx.notFound();

    await knex('articles').where({ id }).increment('likes', 1);
    return ctx.send({ likes: (existing.likes ?? 0) + 1 });
  },

  // ── GET /api/articles/:id/comments ────────────────────────────────────────
  async listComments(ctx: any) {
    const articleId = parseInt(ctx.params.id, 10);
    if (Number.isNaN(articleId)) return ctx.badRequest('Invalid article ID.');

    const knex = strapi.db.connection;
    const rows = await knex('article_comments')
      .where({ article_id: articleId })
      .orderBy('created_at', 'asc')
      .select('*');

    const comments = await Promise.all(rows.map(async (c: any) => {
      const author = c.author_id
        ? await knex('up_users').where({ id: c.author_id }).select('first_name', 'last_name', 'username', 'avatar').first()
        : null;
      const authorName = author
        ? [author.first_name, author.last_name].filter(Boolean).join(' ') || author.username
        : 'Member';
      return {
        id:          c.id,
        body:        c.body,
        authorId:    c.author_id,
        authorName,
        authorAvatar: author?.avatar ?? null,
        createdAt:   c.created_at,
      };
    }));

    return ctx.send(comments);
  },

  // ── POST /api/articles/:id/comments ───────────────────────────────────────
  async addComment(ctx: any) {
    const articleId = parseInt(ctx.params.id, 10);
    if (Number.isNaN(articleId)) return ctx.badRequest('Invalid article ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const { body } = ctx.request.body ?? {};
    if (!body || typeof body !== 'string' || !body.trim()) {
      return ctx.badRequest('Comment body is required.');
    }

    const knex = strapi.db.connection;
    const article = await knex('articles').where({ id: articleId, status: 'published' }).first();
    if (!article) return ctx.notFound('Article not found or not published.');

    const now = new Date().toISOString();
    const inserted = await knex('article_comments').insert({
      article_id:  articleId,
      author_id:   userId,
      body:        body.trim(),
      created_at:  now,
      updated_at:  now,
    }).returning('*');

    const c = inserted[0];
    const author = await knex('up_users').where({ id: userId }).select('first_name', 'last_name', 'username', 'avatar').first();
    const authorName = author
      ? [author.first_name, author.last_name].filter(Boolean).join(' ') || author.username
      : 'Member';

    ctx.status = 201;
    return ctx.send({
      id:          c.id,
      body:        c.body,
      authorId:    c.author_id,
      authorName,
      authorAvatar: author?.avatar ?? null,
      createdAt:   c.created_at,
    });
  },

  // ── DELETE /api/article-comments/:id ──────────────────────────────────────
  async deleteComment(ctx: any) {
    const id = parseInt(ctx.params.id, 10);
    if (Number.isNaN(id)) return ctx.badRequest('Invalid comment ID.');

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const knex = strapi.db.connection;
    const comment = await knex('article_comments').where({ id }).first();
    if (!comment) return ctx.notFound();

    const role = await getCallerRole(strapi, userId);
    if (comment.author_id !== userId && !isAdmin(role)) return ctx.forbidden();

    await knex('article_comments').where({ id }).delete();
    return ctx.send({ ok: true });
  },
};
