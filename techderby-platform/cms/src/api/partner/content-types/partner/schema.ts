export default {
  kind: 'collectionType',
  collectionName: 'partners',
  info: { singularName: 'partner', pluralName: 'partners', displayName: 'Partner' },
  options: { draftAndPublish: true },
  attributes: {
    name: { type: 'string', required: true },
    logo: { type: 'media', multiple: false, allowedTypes: ['images'] },
    description: { type: 'text' },
    website: { type: 'string' },
    partnerType: {
      type: 'enumeration',
      enum: ['universities', 'employers', 'startups', 'community', 'ecosystem'],
      default: 'community',
    },
    category: {
      type: 'enumeration',
      enum: [
        'universities',
        'employers',
        'startups',
        'community',
        'ecosystem',
        'core',
        'sponsor',
        'education',
      ],
    },
  },
};
