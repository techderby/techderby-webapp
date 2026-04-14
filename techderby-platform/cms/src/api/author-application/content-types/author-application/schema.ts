export default {
  kind: 'collectionType',
  collectionName: 'author_applications',
  info: {
    singularName: 'author-application',
    pluralName: 'author-applications',
    displayName: 'Author Application',
  },
  options: { draftAndPublish: false },
  attributes: {
    applicantId: { type: 'integer', required: true },
    bio: { type: 'text', required: true },
    expertise: { type: 'json' },
    portfolio: { type: 'string' },
    sampleWork: { type: 'text' },
    applicationStatus: {
      type: 'enumeration',
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    reviewNotes: { type: 'text' },
    reviewedBy: { type: 'integer' },
    reviewedAt: { type: 'datetime' },
  },
};
