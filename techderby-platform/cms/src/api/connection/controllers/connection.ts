import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::connection.connection', ({ strapi }) => ({
  // GET /api/connections/mine — all connections involving the current user
  async mine(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const connections = await strapi.db.query('api::connection.connection').findMany({
      where: {
        $or: [{ requesterId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with user data
    const enriched = await Promise.all(
      connections.map(async (c: any) => {
        const otherId = c.requesterId === userId ? c.recipientId : c.requesterId;
        const other = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { id: otherId },
        });
        return {
          ...c,
          otherUser: other
            ? {
                id: other.id,
                username: other.username,
                firstName: other.firstName,
                lastName: other.lastName,
                occupation: other.occupation,
                location: other.location,
                avatar: other.avatar,
                bio: other.bio,
              }
            : null,
          direction: c.requesterId === userId ? 'sent' : 'received',
        };
      }),
    );

    ctx.body = enriched;
  },

  // POST /api/connections — send a connection request
  async create(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const { recipientId } = ctx.request.body ?? {};
    if (!recipientId) return ctx.badRequest('recipientId is required');
    if (recipientId === userId) return ctx.badRequest('Cannot connect with yourself');

    // Check recipient exists and is not blocked
    const recipient = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: recipientId },
    });
    if (!recipient || recipient.blocked) return ctx.notFound('User not found');

    // Check if connection already exists
    const existing = await strapi.db.query('api::connection.connection').findOne({
      where: {
        $or: [
          { requesterId: userId, recipientId },
          { requesterId: recipientId, recipientId: userId },
        ],
      },
    });
    if (existing) return ctx.conflict('Connection already exists');

    const connection = await strapi.db.query('api::connection.connection').create({
      data: { requesterId: userId, recipientId, status: 'pending' },
    });

    ctx.status = 201;
    ctx.body = connection;
  },

  // PUT /api/connections/:id/accept
  async accept(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const connectionId = parseInt(ctx.params.id, 10);
    const connection = await strapi.db.query('api::connection.connection').findOne({
      where: { id: connectionId },
    });

    if (!connection) return ctx.notFound();
    if (connection.recipientId !== userId) return ctx.forbidden();
    if (connection.status !== 'pending') return ctx.badRequest('Connection is not pending');

    const updated = await strapi.db.query('api::connection.connection').update({
      where: { id: connectionId },
      data: { status: 'accepted' },
    });

    ctx.body = updated;
  },

  // PUT /api/connections/:id/reject
  async reject(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const connectionId = parseInt(ctx.params.id, 10);
    const connection = await strapi.db.query('api::connection.connection').findOne({
      where: { id: connectionId },
    });

    if (!connection) return ctx.notFound();
    if (connection.recipientId !== userId) return ctx.forbidden();

    const updated = await strapi.db.query('api::connection.connection').update({
      where: { id: connectionId },
      data: { status: 'rejected' },
    });

    ctx.body = updated;
  },

  // DELETE /api/connections/:id — remove a connection
  async delete(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const connectionId = parseInt(ctx.params.id, 10);
    const connection = await strapi.db.query('api::connection.connection').findOne({
      where: { id: connectionId },
    });

    if (!connection) return ctx.notFound();
    if (connection.requesterId !== userId && connection.recipientId !== userId) return ctx.forbidden();

    await strapi.db.query('api::connection.connection').delete({ where: { id: connectionId } });
    ctx.body = { message: 'Connection removed' };
  },
}));
