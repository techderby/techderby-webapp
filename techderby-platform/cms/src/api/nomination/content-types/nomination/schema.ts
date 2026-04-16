export default {
  kind: 'collectionType',
  collectionName: 'nominations',
  info: { singularName: 'nomination', pluralName: 'nominations', displayName: 'Award Nomination' },
  options: { draftAndPublish: false },
  attributes: {
    // ── Nominator ──────────────────────────────────────────────────────────
    nominatorName: { type: 'string', required: true },
    nominatorEmail: { type: 'string', required: true },
    nominatorOrganisation: { type: 'string' },
    nominatorRole: { type: 'string' },
    nominationType: {
      type: 'enumeration',
      enum: ['self', 'other'],
      required: true,
    },

    // ── Nominee ────────────────────────────────────────────────────────────
    nomineeName: { type: 'string', required: true },
    nomineeEmail: { type: 'string', required: true },
    nomineeOrganisation: { type: 'string' },
    nomineeRole: { type: 'string' },
    nomineeLinkedIn: { type: 'string' },

    // ── Category ───────────────────────────────────────────────────────────
    awardCategory: {
      type: 'enumeration',
      enum: [
        'Tech Founder of the Year',
        'Rising Star in Tech',
        'AI Innovation Award',
        'Cybersecurity Excellence Award',
        'Community Impact Award',
        'Women in Tech Leadership Award',
        'Startup of the Year',
        'Digital Transformation Leader',
        'Tech for Good Award',
        'Lifetime Achievement Award',
      ],
      required: true,
    },

    // ── Nomination Details ─────────────────────────────────────────────────
    whyNominating: { type: 'text', required: true },
    techEcosystemImpact: { type: 'text', required: true },
    measurableAchievements: { type: 'text' },
    techDerbyAlignment: { type: 'text', required: true },

    // ── Supporting Information ─────────────────────────────────────────────
    mediaLinks: { type: 'text' },
    additionalComments: { type: 'text' },

    // ── Consent ───────────────────────────────────────────────────────────
    consentAccurate: { type: 'boolean', required: true, default: false },
    consentContact: { type: 'boolean', required: true, default: false },
    consentPromotional: { type: 'boolean', required: true, default: false },

    // ── Supporting docs (Strapi media) ────────────────────────────────────
    supportingDocuments: { type: 'media', multiple: true, required: false, allowedTypes: ['files', 'images'] },

    // ── Status ─────────────────────────────────────────────────────────────
    status: {
      type: 'enumeration',
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
      default: 'pending',
    },
  },
};
