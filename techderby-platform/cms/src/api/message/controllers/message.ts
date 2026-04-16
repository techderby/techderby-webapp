import { factories } from '@strapi/strapi';

function formatMessage(m: any) {
  return {
    id: m.id,
    from_user_id: m.fromUserId ?? m.from_user_id,
    to_user_id: m.toUserId ?? m.to_user_id,
    content: m.content,
    read_at: m.readAt ?? m.read_at ?? null,
    created_at: m.createdAt ?? m.created_at,
  };
}

export default factories.createCoreController('api::message.message', ({ strapi }) => ({
  // GET /api/messages/conversation/:userId — thread between current user and :userId
  async conversation(ctx: any) {
    const me = ctx.state.user?.id;
    if (!me) return ctx.unauthorized();

    const otherId = parseInt(ctx.params.userId, 10);
    if (!otherId) return ctx.badRequest('userId param is required');

    // Verify the two users are connected
    const connected = await strapi.db.query('api::connection.connection').findOne({
      where: {
        $or: [
          { requesterId: me, recipientId: otherId, status: 'accepted' },
          { requesterId: otherId, recipientId: me, status: 'accepted' },
        ],
      },
    });
    if (!connected) return ctx.forbidden('You are not connected with this user');

    const messages = await strapi.db.query('api::message.message').findMany({
      where: {
        $or: [
          { fromUserId: me, toUserId: otherId },
          { fromUserId: otherId, toUserId: me },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark incoming as read
    await strapi.db.query('api::message.message').updateMany({
      where: { fromUserId: otherId, toUserId: me, readAt: null },
      data: { readAt: new Date().toISOString() },
    });

    ctx.body = messages.map(formatMessage);
  },

  // GET /api/messages/inbox — conversation list (latest message per partner)
  async inbox(ctx: any) {
    const me = ctx.state.user?.id;
    if (!me) return ctx.unauthorized();

    // Get all accepted connections
    const connections = await strapi.db.query('api::connection.connection').findMany({
      where: {
        $or: [
          { requesterId: me, status: 'accepted' },
          { recipientId: me, status: 'accepted' },
        ],
      },
    });

    const partnerIds = connections.map((c: any) =>
      (c.requesterId ?? c.requester_id) === me
        ? (c.recipientId ?? c.recipient_id)
        : (c.requesterId ?? c.requester_id),
    );

    const knex = strapi.db.connection;

    const threads = await Promise.all(
      partnerIds.map(async (partnerId: number) => {
        const latest = await strapi.db.query('api::message.message').findMany({
          where: {
            $or: [
              { fromUserId: me, toUserId: partnerId },
              { fromUserId: partnerId, toUserId: me },
            ],
          },
          orderBy: { createdAt: 'desc' },
          limit: 1,
        });

        const unreadCount = await strapi.db.query('api::message.message').count({
          where: { fromUserId: partnerId, toUserId: me, readAt: null },
        });

        // Use raw knex to get custom columns (first_name, last_name, avatar)
        const partner = await knex('up_users').where({ id: partnerId }).first();

        return {
          partner: partner
            ? {
                id: partner.id,
                username: partner.username,
                first_name: partner.first_name ?? null,
                last_name: partner.last_name ?? null,
                occupation: partner.occupation ?? null,
                avatar: partner.avatar ?? null,
              }
            : null,
          latest_message: latest[0] ? formatMessage(latest[0]) : null,
          unread_count: unreadCount,
        };
      }),
    );

    // Sort by most recent message
    threads.sort((a, b) => {
      const ta = a.latest_message?.created_at ?? 0;
      const tb = b.latest_message?.created_at ?? 0;
      return ta > tb ? -1 : 1;
    });

    ctx.body = threads;
  },

  // POST /api/messages — send a message
  async create(ctx: any) {
    const me = ctx.state.user?.id;
    if (!me) return ctx.unauthorized();

    const { toUserId, content } = ctx.request.body ?? {};
    if (!toUserId || !content?.trim()) return ctx.badRequest('toUserId and content are required');

    // Verify connection
    const connected = await strapi.db.query('api::connection.connection').findOne({
      where: {
        $or: [
          { requesterId: me, recipientId: toUserId, status: 'accepted' },
          { requesterId: toUserId, recipientId: me, status: 'accepted' },
        ],
      },
    });
    if (!connected) return ctx.forbidden('You are not connected with this user');

    const message = await strapi.db.query('api::message.message').create({
      data: { fromUserId: me, toUserId, content: content.trim() },
    });

    ctx.status = 201;
    ctx.body = formatMessage(message);
  },
}));
