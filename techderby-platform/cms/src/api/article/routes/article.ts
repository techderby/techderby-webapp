export default {
  routes: [
    // ── Public routes (no auth) ───────────────────────────────────────────
    {
      method: 'GET',
      path: '/articles',
      handler: 'api::article.article.list',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/articles/slug/:slug',
      handler: 'api::article.article.findBySlug',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/articles/:id/comments',
      handler: 'api::article.article.listComments',
      config: { auth: false, policies: [], middlewares: [] },
    },

    // ── Authenticated routes ──────────────────────────────────────────────
    {
      method: 'GET',
      path: '/articles/mine',
      handler: 'api::article.article.mine',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/articles/:id',
      handler: 'api::article.article.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/articles',
      handler: 'api::article.article.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/articles/:id',
      handler: 'api::article.article.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/articles/:id',
      handler: 'api::article.article.delete',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/articles/:id/submit',
      handler: 'api::article.article.submit',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/articles/:id/publish',
      handler: 'api::article.article.publish',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/articles/:id/reject',
      handler: 'api::article.article.reject',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/articles/:id/like',
      handler: 'api::article.article.like',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/articles/:id/comments',
      handler: 'api::article.article.addComment',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/article-comments/:id',
      handler: 'api::article.article.deleteComment',
      config: { policies: [], middlewares: [] },
    },
  ],
};
