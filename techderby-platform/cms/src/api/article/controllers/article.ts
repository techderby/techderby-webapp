import { factories } from '@strapi/strapi';

/** Raw knex lookup — Strapi ORM doesn't expose custom up_users columns */
async function getUser(strapi: any, userId: number) {
  return strapi.db.connection('up_users').where({ id: userId }).first();
}

export default factories.createCoreController('api::article.article', ({ strapi }) => ({

  // ── GET /api/articles/my ─────────────────────────────────────────────────
  async my(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const articles = await strapi.db.query('api::article.article').findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });

    ctx.body = articles;
  },

  // ── GET /api/articles/published ─────────────────────────────────────────
  async published(ctx: any) {
    const { page = '1', pageSize = '12', tag } = ctx.query as Record<string, string>;
    const where: any = { status: 'published' };
    if (tag) where.tags = { $contains: tag };

    const articles = await strapi.db.query('api::article.article').findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      limit: parseInt(pageSize, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(pageSize, 10),
    });

    const total = await strapi.db.query('api::article.article').count({ where });

    ctx.body = { data: articles, meta: { total, page: parseInt(page, 10), pageSize: parseInt(pageSize, 10) } };
  },

  // ── GET /api/articles/admin-list ──────────────────────────────────────────
  async adminList(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const user = await getUser(strapi, userId);
    const role = user?.memberRole;
    if (!['admin', 'super-admin', 'editor'].includes(role)) return ctx.forbidden();

    const { status } = ctx.query as Record<string, string>;
    const where: any = {};
    if (status) where.status = status;

    const articles = await strapi.db.query('api::article.article').findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    ctx.body = articles;
  },

  // ── GET /api/articles/:id ────────────────────────────────────────────────
  async findOne(ctx: any) {
    const { id } = ctx.params;
    const article = await strapi.db.query('api::article.article').findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!article) return ctx.notFound();

    // Only author or admin can see non-published articles
    const userId = ctx.state.user?.id;
    if (article.status !== 'published') {
      if (!userId) return ctx.unauthorized();
      if (article.authorId !== userId) {
        const user = await getUser(strapi, userId);
        const role = user?.memberRole;
        if (!['admin', 'super-admin', 'editor'].includes(role)) return ctx.forbidden();
      }
    }

    ctx.body = article;
  },

  // ── GET /api/articles/by-slug/:slug ──────────────────────────────────────
  async bySlug(ctx: any) {
    const { slug } = ctx.params;
    const article = await strapi.db.query('api::article.article').findOne({
      where: { slug },
    });
    if (!article || article.status !== 'published') return ctx.notFound();

    // Increment views
    await strapi.db.query('api::article.article').update({
      where: { id: article.id },
      data: { views: (article.views || 0) + 1 },
    });

    ctx.body = { ...article, views: (article.views || 0) + 1 };
  },

  // ── POST /api/articles ────────────────────────────────────────────────────
  async create(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const user = await getUser(strapi, userId);
    const memberRole = user?.memberRole;
    const isAuthorized = ['editor', 'admin', 'super-admin'].includes(memberRole);
    if (!isAuthorized) return ctx.forbidden('You must be an approved author to write articles');

    const { title, excerpt, content, tags, featuredImage, coverImageUrl } = ctx.request.body ?? {};
    if (!title) return ctx.badRequest('Title is required');

    const wordsPerMinute = 200;
    const textContent = content ? JSON.stringify(content) : '';
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    const article = await strapi.db.query('api::article.article').create({
      data: {
        title,
        excerpt: excerpt ?? '',
        content: content ?? {},
        tags: tags ?? [],
        featuredImage: featuredImage ?? null,
        coverImageUrl: coverImageUrl ?? null,
        status: 'draft',
        authorId: userId,
        authorName: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username,
        authorOccupation: user.occupation ?? '',
        authorAvatar: user.avatar ?? '',
        readTime,
        views: 0,
        likes: 0,
      },
    });

    ctx.status = 201;
    ctx.body = article;
  },

  // ── PUT /api/articles/:id ─────────────────────────────────────────────────
  async update(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const articleId = parseInt(ctx.params.id, 10);
    const article = await strapi.db.query('api::article.article').findOne({
      where: { id: articleId },
    });

    if (!article) return ctx.notFound();
    if (article.authorId !== userId) return ctx.forbidden();
    if (!['draft', 'rejected'].includes(article.status)) {
      return ctx.badRequest('Cannot edit an article that has been submitted or published');
    }

    const { title, excerpt, content, tags, coverImageUrl } = ctx.request.body ?? {};

    const wordsPerMinute = 200;
    const textContent = content ? JSON.stringify(content) : '';
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    const updated = await strapi.db.query('api::article.article').update({
      where: { id: articleId },
      data: {
        ...(title && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(tags !== undefined && { tags }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        readTime,
      },
    });

    ctx.body = updated;
  },

  // ── DELETE /api/articles/:id ──────────────────────────────────────────────
  async delete(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const articleId = parseInt(ctx.params.id, 10);
    const article = await strapi.db.query('api::article.article').findOne({
      where: { id: articleId },
    });

    if (!article) return ctx.notFound();
    if (article.authorId !== userId) {
      // Admins can delete any article
      const user = await getUser(strapi, userId);
      const role = user?.memberRole;
      if (!['admin', 'super-admin'].includes(role)) return ctx.forbidden();
    }

    await strapi.db.query('api::article.article').delete({ where: { id: articleId } });
    ctx.status = 204;
  },

  // ── POST /api/articles/:id/submit ─────────────────────────────────────────
  async submit(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const articleId = parseInt(ctx.params.id, 10);
    const article = await strapi.db.query('api::article.article').findOne({
      where: { id: articleId },
    });

    if (!article) return ctx.notFound();
    if (article.authorId !== userId) return ctx.forbidden();
    if (!['draft', 'rejected'].includes(article.status)) {
      return ctx.badRequest('Article cannot be submitted in its current state');
    }

    const updated = await strapi.db.query('api::article.article').update({
      where: { id: articleId },
      data: { status: 'submitted' },
    });

    ctx.body = updated;
  },

  // ── POST /api/articles/:id/publish ────────────────────────────────────────
  async publish(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const user = await getUser(strapi, userId);
    const role = user?.memberRole;
    if (!['admin', 'super-admin', 'editor'].includes(role)) return ctx.forbidden();

    const articleId = parseInt(ctx.params.id, 10);
    const updated = await strapi.db.query('api::article.article').update({
      where: { id: articleId },
      data: { status: 'published', publishedAt: new Date() },
    });

    ctx.body = updated;
  },

  // ── POST /api/articles/:id/reject ─────────────────────────────────────────
  async reject(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const user = await getUser(strapi, userId);
    const role = user?.memberRole;
    if (!['admin', 'super-admin', 'editor'].includes(role)) return ctx.forbidden();

    const { reviewNotes } = ctx.request.body ?? {};
    const articleId = parseInt(ctx.params.id, 10);

    const updated = await strapi.db.query('api::article.article').update({
      where: { id: articleId },
      data: { status: 'rejected', reviewNotes: reviewNotes ?? '' },
    });

    ctx.body = updated;
  },

  // ── POST /api/articles/:id/like ───────────────────────────────────────────
  async like(ctx: any) {
    const articleId = parseInt(ctx.params.id, 10);
    const article = await strapi.db.query('api::article.article').findOne({
      where: { id: articleId },
    });
    if (!article) return ctx.notFound();

    const updated = await strapi.db.query('api::article.article').update({
      where: { id: articleId },
      data: { likes: (article.likes || 0) + 1 },
    });

    ctx.body = { likes: updated.likes };
  },
}));
