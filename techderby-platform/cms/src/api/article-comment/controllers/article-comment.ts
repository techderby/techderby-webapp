import { factories } from '@strapi/strapi';

/** Raw knex lookup for custom columns on up_users */
async function getUser(strapi: any, userId: number) {
  return strapi.db.connection('up_users').where({ id: userId }).first();
}

export default factories.createCoreController('api::article-comment.article-comment', ({ strapi }) => ({

  // ── GET /api/article-comments?articleId=:id ──────────────────────────────
  async list(ctx: any) {
    const { articleId } = ctx.query as Record<string, string>;
    if (!articleId) return ctx.badRequest('articleId is required');

    const comments = await strapi.db.query('api::article-comment.article-comment').findMany({
      where: { articleId: parseInt(articleId, 10) },
      orderBy: { createdAt: 'asc' },
    });

    ctx.body = comments;
  },

  // ── POST /api/article-comments ───────────────────────────────────────────
  async create(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const { articleId, body } = ctx.request.body as { articleId: number; body: string };
    if (!articleId || !body?.trim()) return ctx.badRequest('articleId and body are required');

    // Verify article exists and is published
    const article = await strapi.db.query('api::article.article').findOne({
      where: { id: articleId, status: 'published' },
    });
    if (!article) return ctx.notFound('Article not found or not published');

    const user = await getUser(strapi, userId);

    const comment = await strapi.db.query('api::article-comment.article-comment').create({
      data: {
        articleId,
        authorId: userId,
        authorName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username,
        authorAvatar: user.avatar ?? null,
        body: body.trim(),
      },
    });

    ctx.status = 201;
    ctx.body = comment;
  },

  // ── DELETE /api/article-comments/:id ─────────────────────────────────────
  async remove(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const { id } = ctx.params;
    const comment = await strapi.db.query('api::article-comment.article-comment').findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!comment) return ctx.notFound();

    // Only comment author or admin can delete
    if (comment.authorId !== userId) {
      const user = await getUser(strapi, userId);
      if (!['admin', 'super-admin'].includes(user?.memberRole)) return ctx.forbidden();
    }

    await strapi.db.query('api::article-comment.article-comment').delete({
      where: { id: parseInt(id, 10) },
    });

    ctx.status = 204;
  },
}));
