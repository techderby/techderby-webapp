export default {
  kind: 'collectionType',
  collectionName: 'articles',
  info: { singularName: 'article', pluralName: 'articles', displayName: 'Article' },
  options: { draftAndPublish: false },
  attributes: {
    title:           { type: 'string', required: true },
    slug:            { type: 'uid', targetField: 'title', required: true },
    excerpt:         { type: 'text' },
    content:         { type: 'json' },
    cover_image_url: { type: 'string' },
    tags:            { type: 'json' },
    status:          { type: 'enumeration', enum: ['draft', 'submitted', 'in_review', 'published', 'rejected'], default: 'draft', required: true },
    author_id:       { type: 'integer' },
    read_time:       { type: 'integer', default: 1 },
    views:           { type: 'integer', default: 0 },
    likes:           { type: 'integer', default: 0 },
  },
};
