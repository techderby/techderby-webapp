export default {
  kind: 'collectionType',
  collectionName: 'mailing_list_subscriptions',
  info: {
    singularName: 'mailing-list-subscription',
    pluralName: 'mailing-list-subscriptions',
    displayName: 'Mailing List Subscription',
  },
  options: { draftAndPublish: false },
  attributes: {
    email: { type: 'email', required: true, unique: true },
  },
};
