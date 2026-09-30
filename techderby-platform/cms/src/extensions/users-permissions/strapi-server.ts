export default (plugin: any) => {
  Object.assign(plugin.contentTypes.user.schema.attributes, {
    firstName: { type: 'string', maxLength: 100 },
    lastName: { type: 'string', maxLength: 100 },
    bio: { type: 'text', maxLength: 2000 },
    location: { type: 'string', maxLength: 200 },
    occupation: { type: 'string', maxLength: 200 },
    skills: { type: 'json' },
    certifications: { type: 'json' },
    isVisible: { type: 'boolean', default: true },
    avatar: { type: 'string' },
    socialLinks: { type: 'json' },
    memberRole: {
      type: 'enumeration',
      enum: ['member', 'editor', 'admin', 'super-admin'],
      default: 'member',
      required: true,
    },
    resetPasswordExpiresAt: { type: 'datetime', private: true },
  });

  return plugin;
};
