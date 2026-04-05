export default {
  routes: [
    {
      method: 'GET',
      path: '/connections/mine',
      handler: 'connection.mine',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/connections',
      handler: 'connection.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/connections/:id/accept',
      handler: 'connection.accept',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/connections/:id/reject',
      handler: 'connection.reject',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/connections/:id',
      handler: 'connection.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
};
