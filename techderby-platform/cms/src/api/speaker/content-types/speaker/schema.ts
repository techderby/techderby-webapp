export default {
  kind: 'collectionType',
  collectionName: 'speakers',
  info: { singularName: 'speaker', pluralName: 'speakers', displayName: 'Speaker' },
  options: { draftAndPublish: true },
  attributes: {
    name: { type: 'string', required: true },
    role: { type: 'string' },
    organisation: { type: 'string' },
    bio: { type: 'text' },
    photo: { type: 'media', multiple: false, allowedTypes: ['images'] },
    talkTitle: { type: 'string' },
  },
};
