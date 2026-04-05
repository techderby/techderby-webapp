export default {
  routes: [
    {
      method: 'POST',
      path: '/notify',
      handler: 'api::notify.notify.send',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};
