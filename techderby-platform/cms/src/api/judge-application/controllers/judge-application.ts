import { factories } from '@strapi/strapi';

function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  return false;
}

export default factories.createCoreController('api::judge-application.judge-application', ({ strapi }) => ({
  async create(ctx: any) {
    const raw: Record<string, unknown> = ctx.request.body?.data ?? ctx.request.body ?? {};

    const data: Record<string, unknown> = {
      ...raw,
      availableForJudging: toBool(raw.availableForJudging),
      willingToCommit:     toBool(raw.willingToCommit),
      declareFairness:     toBool(raw.declareFairness),
      agreeContact:        toBool(raw.agreeContact),
    };

    const required = [
      'fullName', 'email', 'currentRole', 'organisation',
      'professionalBackground', 'expertiseAreas', 'judgingCategories',
      'motivation', 'previousJudgeExperience',
    ];
    for (const field of required) {
      if (!data[field]) return ctx.badRequest(`Missing required field: ${field}`);
    }

    if (!data.declareFairness) return ctx.badRequest('You must agree to the declaration.');
    if (!data.agreeContact)    return ctx.badRequest('You must agree to be contacted.');

    const doc    = strapi.documents('api::judge-application.judge-application');
    const entity = await doc.create({ data: data as any });

    // Email notification (best-effort)
    try {
      const subject = `New Judge Application – ${data.fullName}`;
      const text = [
        `[Judge Application]`,
        `Name:         ${data.fullName}`,
        `Email:        ${data.email}`,
        `Phone:        ${data.phone ?? '—'}`,
        `LinkedIn:     ${data.linkedIn ?? '—'}`,
        ``,
        `Role:         ${data.currentRole}`,
        `Organisation: ${data.organisation}`,
        ``,
        `Background:   ${data.professionalBackground}`,
        ``,
        `Expertise:    ${data.expertiseAreas}`,
        `Other:        ${data.expertiseOther ?? '—'}`,
        `Categories:   ${data.judgingCategories}`,
        ``,
        `Motivation:   ${data.motivation}`,
        ``,
        `Prior judge:  ${data.previousJudgeExperience}`,
        `Details:      ${data.previousJudgeDetails ?? '—'}`,
        ``,
        `Available:    ${data.availableForJudging}`,
        `Will commit:  ${data.willingToCommit}`,
      ].join('\n');

      await strapi.plugin('email').service('email').send({
        to: process.env.NOTIFY_EMAIL ?? 'technical@techderby.org',
        subject,
        text,
      });
    } catch (e) {
      strapi.log.warn('Judge application email notification failed:', e);
    }

    return { data: { id: entity.documentId ?? entity.id } };
  },

  async findAll(ctx: any) {
    const doc     = strapi.documents('api::judge-application.judge-application');
    const results = await doc.findMany({ sort: [{ createdAt: 'desc' }] });
    return { data: results };
  },
}));
