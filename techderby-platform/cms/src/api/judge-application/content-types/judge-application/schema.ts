export default {
  kind: 'collectionType',
  collectionName: 'judge_applications',
  info: { singularName: 'judge-application', pluralName: 'judge-applications', displayName: 'Judge Application' },
  options: { draftAndPublish: false },
  attributes: {
    // ── Personal Information ────────────────────────────────────────────────
    fullName:     { type: 'string',  required: true },
    email:        { type: 'string',  required: true },
    phone:        { type: 'string' },
    linkedIn:     { type: 'string' },

    // ── Professional Background ─────────────────────────────────────────────
    currentRole:             { type: 'string', required: true },
    organisation:            { type: 'string', required: true },
    professionalBackground:  { type: 'text',   required: true },

    // ── Expertise & Category Preferences ───────────────────────────────────
    // Stored as comma-separated strings (checkboxes → join on submit)
    expertiseAreas:      { type: 'text', required: true },
    expertiseOther:      { type: 'string' },
    judgingCategories:   { type: 'text', required: true },

    // ── Motivation & Experience ─────────────────────────────────────────────
    motivation:                { type: 'text', required: true },
    previousJudgeExperience:   { type: 'enumeration', enum: ['yes', 'no'], required: true },
    previousJudgeDetails:      { type: 'text' },

    // ── Availability & Commitment ───────────────────────────────────────────
    availableForJudging: { type: 'boolean', required: true, default: false },
    willingToCommit:     { type: 'boolean', required: true, default: false },

    // ── Declaration ─────────────────────────────────────────────────────────
    declareFairness: { type: 'boolean', required: true, default: false },
    agreeContact:    { type: 'boolean', required: true, default: false },
  },
};
