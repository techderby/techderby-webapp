export default {
  routes: [
    // ── Stats ────────────────────────────────────────────────────────────
    {
      method: 'GET',
      path: '/admin/stats',
      handler: 'api::admin.admin.stats',
      config: { policies: [], middlewares: [] },
    },

    // ── Users ─────────────────────────────────────────────────────────────
    {
      method: 'GET',
      path: '/admin/users',
      handler: 'api::admin.admin.listUsers',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/admin/users',
      handler: 'api::admin.admin.createUser',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PATCH',
      path: '/admin/users/:id/role',
      handler: 'api::admin.admin.updateRole',
      config: { policies: [], middlewares: [] },
    },

    // ── Articles ──────────────────────────────────────────────────────────
    {
      method: 'GET',
      path: '/admin/articles',
      handler: 'api::admin.admin.listArticles',
      config: { policies: [], middlewares: [] },
    },
  ],
};
