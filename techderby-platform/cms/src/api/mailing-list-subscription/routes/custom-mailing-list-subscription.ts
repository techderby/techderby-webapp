export default {
  routes: [
    {
      method: 'GET',
      path: '/mailing-list-subscriptions/export',
      handler: 'api::mailing-list-subscription.mailing-list-subscription.exportCsv',
      config: {
        auth: {
          scope: ['api::mailing-list-subscription.mailing-list-subscription.exportCsv'],
        },
      },
    },
  ],
};
