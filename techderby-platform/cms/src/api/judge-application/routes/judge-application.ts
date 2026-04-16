export default {
  routes: [
    {
      method: 'POST',
      path: '/judge-applications',
      handler: 'api::judge-application.judge-application.create',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/judge-applications',
      handler: 'api::judge-application.judge-application.findAll',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};
