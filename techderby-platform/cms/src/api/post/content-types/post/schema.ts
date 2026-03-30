export default {
  kind: 'collectionType',
  collectionName: 'insights',
  info: { singularName: 'post', pluralName: 'posts', displayName: 'Post (Articles)' },
  options: { draftAndPublish: true },
  attributes: {
    title: { type: 'string', required: true },
    slug: { type: 'uid', targetField: 'title', required: true },
    featuredImage: { type: 'media', multiple: false, required: true, allowedTypes: ['images'] },
    content: { type: 'richtext' },
    author: { type: 'string' },
    tags: { type: 'json' },
    category: { type: 'string' },
  },
};
