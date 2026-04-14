export default {
  routes: [
    { method: 'GET',  path: '/author-applications/mine',        handler: 'author-application.mine',    config: { policies: [] } },
    { method: 'GET',  path: '/author-applications',             handler: 'author-application.find',    config: { policies: [] } },
    { method: 'POST', path: '/author-applications',             handler: 'author-application.create',  config: { policies: [] } },
    { method: 'POST', path: '/author-applications/:id/approve', handler: 'author-application.approve', config: { policies: [] } },
    { method: 'POST', path: '/author-applications/:id/reject',  handler: 'author-application.reject',  config: { policies: [] } },
  ],
};
