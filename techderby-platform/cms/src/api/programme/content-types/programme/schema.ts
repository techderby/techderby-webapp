export default {
  kind: 'collectionType',
  collectionName: 'programmes',
  info: { singularName: 'programme', pluralName: 'programmes', displayName: 'Programme' },
  options: { draftAndPublish: true },
  attributes: {
    title: { type: 'string', required: true },
    slug: { type: 'uid', targetField: 'title', required: true },
    description: { type: 'text' },
  },
};
