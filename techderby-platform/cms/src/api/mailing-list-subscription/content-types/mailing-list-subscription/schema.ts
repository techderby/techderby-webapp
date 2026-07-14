import { MAILING_LIST_CATEGORIES } from '../../../../constants/mailing-list';

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
    category: {
      type: 'enumeration',
      enum: [...MAILING_LIST_CATEGORIES],
      default: 'None',
      required: true,
    },
  },
};
