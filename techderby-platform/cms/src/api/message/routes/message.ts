export default {
  routes: [
    {
      method: 'GET',
      path: '/messages/inbox',
      handler: 'message.inbox',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/messages/conversation/:userId',
      handler: 'message.conversation',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/messages',
      handler: 'message.create',
      config: { policies: [], middlewares: [] },
    },
  ],
};
