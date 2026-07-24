export default {
  kind: 'collectionType',
  collectionName: 'writer_applications',
  info: {
    singularName: 'writer-application',
    pluralName: 'writer-applications',
    displayName: 'Writer Application',
  },
  options: { draftAndPublish: false },
  attributes: {
    userId: { type: 'integer', required: true, unique: true },
    name: { type: 'string', required: true },
    email: { type: 'email', required: true },
    motivation: { type: 'text', required: true },
    experience: { type: 'text' },
    portfolioUrl: { type: 'string' },
    topics: { type: 'json' },
    status: {
      type: 'enumeration',
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    reviewNotes: { type: 'text' },
    reviewedAt: { type: 'datetime' },
    reviewedByUserId: { type: 'integer' },
    decisionHistory: { type: 'json' },
  },
};
