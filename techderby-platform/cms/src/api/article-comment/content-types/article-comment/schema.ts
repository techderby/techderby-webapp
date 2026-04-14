export default {
  kind: 'collectionType',
  collectionName: 'article_comments',
  info: { singularName: 'article-comment', pluralName: 'article-comments', displayName: 'Article Comment' },
  options: { draftAndPublish: false },
  attributes: {
    articleId: { type: 'integer', required: true },
    authorId: { type: 'integer', required: true },
    authorName: { type: 'string' },
    authorAvatar: { type: 'string' },
    body: { type: 'text', required: true },
  },
};
