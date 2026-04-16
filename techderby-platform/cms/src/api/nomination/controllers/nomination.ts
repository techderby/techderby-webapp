import { factories } from '@strapi/strapi';

// Coerce "true"/"false" strings (sent by FormData) to actual booleans
function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  return false;
}

export default factories.createCoreController('api::nomination.nomination', ({ strapi }) => ({
  async create(ctx: any) {
    // Handle multipart (file uploads) or JSON
    const isMultipart = ctx.is('multipart');

    let raw: Record<string, unknown>;

    if (isMultipart) {
      raw = ctx.request.body ?? {};
    } else {
      raw = ctx.request.body?.data ?? ctx.request.body ?? {};
    }

    // Coerce booleans — FormData always sends strings
    const data: Record<string, unknown> = {
      ...raw,
      consentAccurate: toBool(raw.consentAccurate),
      consentContact: toBool(raw.consentContact),
      consentPromotional: toBool(raw.consentPromotional),
    };

    // Validate required fields
    const requiredStrings = [
      'nominatorName', 'nominatorEmail', 'nominationType',
      'nomineeName', 'nomineeEmail',
      'awardCategory',
      'whyNominating', 'techEcosystemImpact', 'techDerbyAlignment',
    ];

    for (const field of requiredStrings) {
      if (!data[field]) {
        return ctx.badRequest(`Missing required field: ${field}`);
      }
    }

    if (!data.consentAccurate) {
      return ctx.badRequest('You must confirm the information is accurate.');
    }

    // Strapi v5: use the Documents API
    const doc = strapi.documents('api::nomination.nomination');

    const entity = await doc.create({ data: data as any });

    // Attach uploaded files if present (optional)
    if (isMultipart && ctx.request.files?.['files.supportingDocuments']) {
      try {
        const uploadService = strapi.plugin('upload').service('upload');
        const rawFiles = ctx.request.files['files.supportingDocuments'];
        const fileArray = Array.isArray(rawFiles) ? rawFiles : [rawFiles];
        await uploadService.uploadToEntity(
          { id: entity.documentId ?? entity.id, model: 'api::nomination.nomination', field: 'supportingDocuments' },
          fileArray,
        );
      } catch (fileErr) {
        strapi.log.warn('File attachment failed (non-fatal):', fileErr);
      }
    }

    // Send email notification (best-effort)
    try {
      const subject = `New Award Nomination – ${data.awardCategory ?? 'Unknown Category'}`;
      const text = [
        `[Award Nomination - ${data.awardCategory}]`,
        `Nominator: ${data.nominatorName} <${data.nominatorEmail}>`,
        `Nominating: ${data.nominationType === 'self' ? 'Themselves' : 'Someone Else'}`,
        ``,
        `Nominee: ${data.nomineeName} <${data.nomineeEmail}>`,
        `Organisation: ${data.nomineeOrganisation ?? '—'}`,
        `Role: ${data.nomineeRole ?? '—'}`,
        `LinkedIn/Website: ${data.nomineeLinkedIn ?? '—'}`,
        ``,
        `Why Nominating: ${data.whyNominating}`,
        `Ecosystem Impact: ${data.techEcosystemImpact}`,
        `Measurable Achievements: ${data.measurableAchievements ?? '—'}`,
        `TechDerby Alignment: ${data.techDerbyAlignment}`,
        `Media Links: ${data.mediaLinks ?? '—'}`,
        `Additional Comments: ${data.additionalComments ?? '—'}`,
      ].join('\n');

      await strapi.plugin('email').service('email').send({
        to: process.env.NOTIFY_EMAIL ?? 'technical@techderby.org',
        subject,
        text,
      });
    } catch (emailErr) {
      strapi.log.warn('Award nomination email notification failed:', emailErr);
    }

    return { data: { id: entity.documentId ?? entity.id } };
  },

  // ── Admin list ──────────────────────────────────────────────────────────
  async findAll(ctx: any) {
    const doc = strapi.documents('api::nomination.nomination');

    const results = await doc.findMany({
      sort: [{ createdAt: 'desc' }],
      populate: ['supportingDocuments'],
    });

    return { data: results };
  },
}));
