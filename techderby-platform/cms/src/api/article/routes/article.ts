export default {
  routes: [
    { method: 'GET',    path: '/articles/published',      handler: 'article.published',   config: { auth: false } },
    { method: 'GET',    path: '/articles/my',             handler: 'article.my',           config: { policies: [] } },
    { method: 'GET',    path: '/articles/admin-list',     handler: 'article.adminList',    config: { policies: [] } },
    { method: 'GET',    path: '/articles/by-slug/:slug',  handler: 'article.bySlug',       config: { auth: false } },
    { method: 'GET',    path: '/articles/:id',            handler: 'article.findOne',      config: { policies: [] } },
    { method: 'POST',   path: '/articles',                handler: 'article.create',       config: { policies: [] } },
    { method: 'PUT',    path: '/articles/:id',            handler: 'article.update',       config: { policies: [] } },
    { method: 'DELETE', path: '/articles/:id',            handler: 'article.delete',       config: { policies: [] } },
    { method: 'POST',   path: '/articles/:id/submit',     handler: 'article.submit',       config: { policies: [] } },
    { method: 'POST',   path: '/articles/:id/publish',    handler: 'article.publish',      config: { policies: [] } },
    { method: 'POST',   path: '/articles/:id/reject',     handler: 'article.reject',       config: { policies: [] } },
    { method: 'POST',   path: '/articles/:id/like',       handler: 'article.like',         config: { auth: false } },
  ],
};
