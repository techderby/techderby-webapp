export default {
  routes: [
    {
      method: 'GET',
      path: '/events/admin',
      handler: 'api::event.event.listForAdmin',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/events/admin',
      handler: 'api::event.event.createForAdmin',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/events/admin/:documentId',
      handler: 'api::event.event.updateForAdmin',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
