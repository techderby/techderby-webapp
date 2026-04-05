export default {
  kind: 'collectionType',
  collectionName: 'connections',
  info: { singularName: 'connection', pluralName: 'connections', displayName: 'Connection' },
  options: { draftAndPublish: false },
  attributes: {
    requesterId: { type: 'integer', required: true },
    recipientId: { type: 'integer', required: true },
    status: {
      type: 'enumeration',
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      required: true,
    },
  },
};
