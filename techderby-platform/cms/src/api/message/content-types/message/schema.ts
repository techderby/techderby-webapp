export default {
  kind: 'collectionType',
  collectionName: 'messages',
  info: { singularName: 'message', pluralName: 'messages', displayName: 'Message' },
  options: { draftAndPublish: false },
  attributes: {
    fromUserId: { type: 'integer', required: true },
    toUserId: { type: 'integer', required: true },
    content: { type: 'text', required: true },
    readAt: { type: 'datetime' },
  },
};
