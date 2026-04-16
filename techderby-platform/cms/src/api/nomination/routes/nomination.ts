export default {
  routes: [
    {
      method: 'POST',
      path: '/nominations',
      handler: 'api::nomination.nomination.create',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/nominations',
      handler: 'api::nomination.nomination.findAll',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
