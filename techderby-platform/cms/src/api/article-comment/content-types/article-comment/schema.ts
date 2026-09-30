export default {
  kind: 'collectionType',
  collectionName: 'article_comments',
  info: {
    singularName: 'article-comment',
    pluralName: 'article-comments',
    displayName: 'Article Comment',
  },
  options: { draftAndPublish: false },
  attributes: {
    postDocumentId: { type: 'string', required: true },
    userId: { type: 'integer' },
    name: { type: 'string', required: true },
    email: { type: 'email' },
    content: { type: 'text', required: true },
    approved: { type: 'boolean', default: true },
  },
};
