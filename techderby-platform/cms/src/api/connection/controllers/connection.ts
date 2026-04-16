import { factories } from '@strapi/strapi';

function formatConnection(c: any, userId: number, otherUser: any) {
  return {
    id: c.id,
    requester_id: c.requesterId ?? c.requester_id,
    recipient_id: c.recipientId ?? c.recipient_id,
    status: c.status,
    created_at: c.createdAt ?? c.created_at,
    direction: (c.requesterId ?? c.requester_id) === userId ? 'sent' : 'received',
    other_user: otherUser
      ? {
          id: otherUser.id,
          username: otherUser.username,
          first_name: otherUser.first_name ?? null,
          last_name: otherUser.last_name ?? null,
          occupation: otherUser.occupation ?? null,
          location: otherUser.location ?? null,
          avatar: otherUser.avatar ?? null,
          bio: otherUser.bio ?? null,
        }
      : null,
  };
}

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

    const knex = strapi.db.connection;

    // Enrich with user data via raw knex (custom columns not in Strapi schema)
    const enriched = await Promise.all(
      connections.map(async (c: any) => {
        const otherId = (c.requesterId ?? c.requester_id) === userId
          ? (c.recipientId ?? c.recipient_id)
          : (c.requesterId ?? c.requester_id);
        const other = await knex('up_users').where({ id: otherId }).first();
        return formatConnection(c, userId, other ?? null);
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
    ctx.body = formatConnection(connection, userId, null);
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

    ctx.body = formatConnection(updated, userId, null);
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

    ctx.body = formatConnection(updated, userId, null);
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
