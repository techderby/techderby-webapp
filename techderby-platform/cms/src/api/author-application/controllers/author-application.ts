import { factories } from '@strapi/strapi';

async function getUser(strapi: any, userId: number) {
  return strapi.db.connection('up_users').where({ id: userId }).first();
}

export default factories.createCoreController('api::author-application.author-application', ({ strapi }) => ({

  // ── GET /api/author-applications/mine ────────────────────────────────────
  async mine(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const application = await strapi.db.query('api::author-application.author-application').findOne({
      where: { applicantId: userId },
      orderBy: { createdAt: 'desc' },
    });

    ctx.body = application ?? null;
  },

  // ── POST /api/author-applications ────────────────────────────────────────
  async create(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    // Check user isn't already an author / has pending application
    const user = await getUser(strapi, userId);

    if (['editor', 'admin', 'super-admin'].includes(user?.memberRole)) {
      return ctx.badRequest('You are already an author');
    }

    const existing = await strapi.db.query('api::author-application.author-application').findOne({
      where: { applicantId: userId, applicationStatus: 'pending' },
    });
    if (existing) return ctx.conflict('You already have a pending application');

    const { bio, expertise, portfolio, sampleWork } = ctx.request.body ?? {};
    if (!bio) return ctx.badRequest('Bio is required');

    const application = await strapi.db.query('api::author-application.author-application').create({
      data: {
        applicantId: userId,
        bio,
        expertise: expertise ?? [],
        portfolio: portfolio ?? '',
        sampleWork: sampleWork ?? '',
        applicationStatus: 'pending',
      },
    });

    ctx.status = 201;
    ctx.body = application;
  },

  // ── GET /api/author-applications (admin) ─────────────────────────────────
  async find(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const user = await getUser(strapi, userId);
    const role = user?.memberRole;
    if (!['admin', 'super-admin'].includes(role)) return ctx.forbidden();

    const { status } = ctx.query as Record<string, string>;
    const where: any = {};
    if (status) where.applicationStatus = status;

    const applications = await strapi.db.query('api::author-application.author-application').findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with user data
    const enriched = await Promise.all(
      applications.map(async (app: any) => {
        const applicant = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { id: app.applicantId },
        });
        return {
          ...app,
          applicant: applicant
            ? {
                id: (applicant as any).id,
                username: (applicant as any).username,
                firstName: (applicant as any).firstName,
                lastName: (applicant as any).lastName,
                email: (applicant as any).email,
                occupation: (applicant as any).occupation,
                avatar: (applicant as any).avatar,
              }
            : null,
        };
      }),
    );

    ctx.body = enriched;
  },

  // ── POST /api/author-applications/:id/approve ─────────────────────────────
  async approve(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const adminUser = await getUser(strapi, userId);
    const role = adminUser?.memberRole;
    if (!['admin', 'super-admin'].includes(role)) return ctx.forbidden();

    const appId = parseInt(ctx.params.id, 10);
    const application = await strapi.db.query('api::author-application.author-application').findOne({
      where: { id: appId },
    });
    if (!application) return ctx.notFound();

    // Promote the user to editor role (raw knex — ORM doesn't know about custom columns)
    const knex = strapi.db.connection;
    await knex('up_users')
      .where({ id: (application as any).applicant_id })
      .update({ memberRole: 'editor', updated_at: new Date().toISOString() });

    const updated = await strapi.db.query('api::author-application.author-application').update({
      where: { id: appId },
      data: { applicationStatus: 'approved', reviewedBy: userId, reviewedAt: new Date() },
    });

    ctx.body = updated;
  },

  // ── POST /api/author-applications/:id/reject ──────────────────────────────
  async reject(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const adminUser = await getUser(strapi, userId);
    const role = adminUser?.memberRole;
    if (!['admin', 'super-admin'].includes(role)) return ctx.forbidden();

    const { reviewNotes } = ctx.request.body ?? {};
    const appId = parseInt(ctx.params.id, 10);

    const updated = await strapi.db.query('api::author-application.author-application').update({
      where: { id: appId },
      data: {
        applicationStatus: 'rejected',
        reviewNotes: reviewNotes ?? '',
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });

    ctx.body = updated;
  },
}));
