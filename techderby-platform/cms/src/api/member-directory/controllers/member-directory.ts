const PUBLIC_FIELDS = [
  'id',
  'username',
  'firstName',
  'lastName',
  'bio',
  'location',
  'occupation',
  'skills',
  'avatar',
  'memberRole',
  'linkedinUrl',
  'createdAt',
];

function pickPublicFields(user: any) {
  const result: Record<string, unknown> = {};
  for (const key of PUBLIC_FIELDS) {
    // knex returns snake_case from DB, Strapi ORM returns camelCase — support both
    const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    result[key] = user[key] ?? user[snakeKey] ?? null;
  }
  // Parse JSON fields
  for (const f of ['skills']) {
    if (typeof result[f] === 'string') {
      try { result[f] = JSON.parse(result[f] as string); } catch { result[f] = []; }
    }
  }
  return result;
}

export default {
  async list(ctx: any) {
    const requestUser = ctx.state.user;
    const isAdmin =
      requestUser?.memberRole === 'admin' || requestUser?.memberRole === 'super-admin';

    const knex = strapi.db.connection;
    let query = knex('up_users').select('*').orderBy('created_at', 'desc');

    if (!isAdmin) {
      query = query
        .where({ blocked: false })
        .andWhere((builder: any) => builder.where({ is_visible: true }).orWhereNull('is_visible'));
    }

    const users = await query;
    ctx.body = users.map(pickPublicFields);
  },

  async findOne(ctx: any) {
    const requestUser = ctx.state.user;
    const isAdmin =
      requestUser?.memberRole === 'admin' || requestUser?.memberRole === 'super-admin';

    const id = parseInt(ctx.params.id, 10);
    const knex = strapi.db.connection;
    const user = await knex('up_users').where({ id }).first();

    if (!user) return ctx.notFound();
    const isVisible = user.is_visible ?? user.isVisible ?? true;
    if (!isAdmin && !isVisible) return ctx.notFound();

    ctx.body = pickPublicFields(user);
  },
};
