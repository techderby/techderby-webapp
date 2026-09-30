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
    subscriptionStatus: {
      type: 'enumeration',
      enum: ['subscribed', 'unsubscribed'],
      default: 'subscribed',
      required: true,
    },
    unsubscribedAt: { type: 'datetime' },
    unsubscribeReason: {
      type: 'enumeration',
      enum: [
        'too-many-emails',
        'content-not-relevant',
        'no-longer-interested',
        'did-not-sign-up',
        'privacy-concerns',
        'other',
        'not-provided',
      ],
    },
    unsubscribeReasonDetails: { type: 'text' },
    unsubscribeSource: {
      type: 'enumeration',
      enum: ['confirmation-page', 'email-one-click'],
    },
    resubscribedAt: { type: 'datetime' },
  },
};
