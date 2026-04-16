const PUBLIC_FIELDS = [
  'id',
  'username',
  'first_name',
  'last_name',
  'bio',
  'location',
  'occupation',
  'skills',
  'avatar',
  'member_role',
  'linkedin_url',
  'created_at',
];

function pickPublicFields(user: any) {
  const result: Record<string, unknown> = {};
  for (const key of PUBLIC_FIELDS) {
    result[key] = user[key] ?? null;
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
      requestUser?.member_role === 'admin' || requestUser?.member_role === 'super-admin';

    const knex = strapi.db.connection;
    let query = knex('up_users').select('*').orderBy('created_at', 'desc');

    if (!isAdmin) {
      query = query.where({ is_visible: true, blocked: false });
    }

    const users = await query;
    ctx.body = users.map(pickPublicFields);
  },

  async findOne(ctx: any) {
    const requestUser = ctx.state.user;
    const isAdmin =
      requestUser?.member_role === 'admin' || requestUser?.member_role === 'super-admin';

    const id = parseInt(ctx.params.id, 10);
    const knex = strapi.db.connection;
    const user = await knex('up_users').where({ id }).first();

    if (!user) return ctx.notFound();
    if (!isAdmin && !user.is_visible) return ctx.notFound();

    ctx.body = pickPublicFields(user);
  },
};
