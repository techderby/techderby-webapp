export default {
  kind: 'collectionType',
  collectionName: 'article_likes',
  info: {
    singularName: 'article-like',
    pluralName: 'article-likes',
    displayName: 'Article Like',
  },
  options: { draftAndPublish: false },
  attributes: {
    postDocumentId: { type: 'string', required: true },
    voterToken: { type: 'string', required: true },
    userId: { type: 'integer' },
  },
};
