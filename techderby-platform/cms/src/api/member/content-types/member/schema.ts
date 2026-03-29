export default {
  kind: 'collectionType',
  collectionName: 'members',
  info: { singularName: 'member', pluralName: 'members', displayName: 'Member' },
  options: { draftAndPublish: true },
  attributes: {
    name: { type: 'string', required: true },
    role: { type: 'string' },
    bio: { type: 'text' },
    skills: { type: 'json' },
    interests: { type: 'json' },
    linkedin: { type: 'string' },
  },
};
