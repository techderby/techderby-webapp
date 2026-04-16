export default {
  async bootstrap({ strapi }: { strapi: any }) {
    const username = process.env.SEED_ADMIN_USERNAME;
    const email    = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!username || !email || !password) return;

    try {
      const knex = strapi.db.connection;

      // Check if user already exists
      const existing = await knex('up_users').where({ username }).first();
      if (existing) return;

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash(password, 10);

      // Find the authenticated role id
      const role = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' } });

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto');
      const docId = crypto.randomBytes(8).toString('hex');

      const inserted = await knex('up_users').insert({
        username,
        email: email.toLowerCase(),
        password: hashed,
        confirmed: true,
        blocked: false,
        provider: 'local',
        document_id: docId,
        member_role: 'super-admin',
        is_visible: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning(['id']);

      const newUserId: number = inserted[0]?.id ?? inserted[0];
      if (role?.id && newUserId) {
        await knex('up_users_role_lnk')
          .insert({ user_id: newUserId, role_id: role.id })
          .onConflict()
          .ignore();
      }

      strapi.log.info(`[seed] Admin user "${username}" created.`);
    } catch (err) {
      strapi.log.error('[seed] Failed to create admin user:', err);
    }
  },
};
