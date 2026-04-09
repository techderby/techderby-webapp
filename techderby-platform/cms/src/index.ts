export default {
  register({ strapi }: { strapi: any }) {
    const userCT = strapi.contentType('plugin::users-permissions.user');

    // Extend the User content-type with custom fields
    userCT.attributes = {
      ...userCT.attributes,
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      bio: { type: 'text' },
      location: { type: 'string' },
      occupation: { type: 'string' },
      skills: { type: 'json' },
      certifications: { type: 'json' },
      isVisible: { type: 'boolean', default: true },
      avatar: { type: 'string' },
      socialLinks: { type: 'json' },
      memberRole: {
        type: 'enumeration',
        enum: ['member', 'editor', 'admin', 'super-admin'],
        default: 'member',
      },
    };
  },
  bootstrap() {},
};
