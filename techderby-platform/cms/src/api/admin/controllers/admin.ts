const MEMBER_ROLES = ['member', 'editor', 'admin', 'super-admin'] as const;
type MemberRole = (typeof MEMBER_ROLES)[number];

async function getUser(strapi: any, userId: number) {
  return strapi.db.connection('up_users').where({ id: userId }).first();
}

function isAdminRole(role: string | undefined): boolean {
  return role === 'admin' || role === 'super-admin';
}

const SAFE_FIELDS = ['id', 'username', 'email', 'firstName', 'lastName', 'memberRole', 'occupation', 'avatar', 'confirmed', 'blocked', 'created_at'];

export default {

  // ── POST /api/admin/users ────────────────────────────────────────────────
  async createUser(ctx: any) {
    const callerId = ctx.state.user?.id;
    if (!callerId) return ctx.unauthorized();

    const caller = await getUser(strapi, callerId);
    if (!isAdminRole(caller?.memberRole)) return ctx.forbidden();

    const { username, email, password, firstName = '', lastName = '', memberRole = 'member' } = ctx.request.body ?? {};

    if (!username || !email || !password) {
      return ctx.badRequest('username, email and password are required');
    }

    if (password.length < 8) {
      return ctx.badRequest('Password must be at least 8 characters');
    }

    if (!MEMBER_ROLES.includes(memberRole as MemberRole)) {
      return ctx.badRequest(`memberRole must be one of: ${MEMBER_ROLES.join(', ')}`);
    }

    // Only a super-admin can create a super-admin account
    if (memberRole === 'super-admin' && caller.memberRole !== 'super-admin') {
      return ctx.forbidden('Only a super-admin can create a super-admin account');
    }

    const knex = strapi.db.connection;

    const existing = await knex('up_users')
      .where(function (this: any) {
        this.whereILike('email', email.toLowerCase()).orWhere({ username });
      })
      .first();

    if (existing) {
      const conflict = existing.email.toLowerCase() === email.toLowerCase() ? 'Email' : 'Username';
      return ctx.conflict(`${conflict} is already taken`);
    }

    const authRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date().toISOString();
    const docId = Math.random().toString(36).slice(2, 18);

    const inserted = await knex('up_users').insert({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      memberRole,
      isVisible: true,
      confirmed: true,
      blocked: false,
      provider: 'local',
      document_id: docId,
      created_at: now,
      updated_at: now,
    }).returning('*');

    const user = inserted[0];

    if (authRole?.id) {
      await knex('up_users_role_lnk')
        .insert({ user_id: user.id, role_id: authRole.id })
        .onConflict()
        .ignore();
    }

    ctx.status = 201;
    ctx.body = Object.fromEntries(SAFE_FIELDS.filter((k) => k in user).map((k) => [k, user[k]]));
  },

  // ── GET /api/admin/stats ─────────────────────────────────────────────────
  async stats(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const caller = await getUser(strapi, userId);
    if (!isAdminRole(caller?.memberRole) && caller?.memberRole !== 'editor') return ctx.forbidden();

    const knex = strapi.db.connection;

    const [pendingArticles, inReviewArticles, publishedArticles, rejectedArticles, totalArticles] = await Promise.all([
      knex('articles').where({ status: 'submitted' }).count('id as count').first(),
      knex('articles').where({ status: 'in_review' }).count('id as count').first(),
      knex('articles').where({ status: 'published' }).count('id as count').first(),
      knex('articles').where({ status: 'rejected' }).count('id as count').first(),
      knex('articles').count('id as count').first(),
    ]);

    const [pendingAuthorApps, totalAuthorApps] = await Promise.all([
      knex('author_applications').where({ application_status: 'pending' }).count('id as count').first(),
      knex('author_applications').count('id as count').first(),
    ]);

    const totalUsers = await knex('up_users').count('id as count').first();

    const roleBreakdown = await knex('up_users')
      .select('memberRole')
      .count('id as count')
      .groupBy('memberRole');

    // Most recent 5 submitted articles for activity feed
    const recentSubmissions = await knex('articles')
      .where({ status: 'submitted' })
      .orderBy('created_at', 'desc')
      .limit(5)
      .select('id', 'title', 'author_id as authorId', 'created_at as createdAt', 'tags');

    ctx.body = {
      articles: {
        pending:   Number(pendingArticles?.count ?? 0),
        inReview:  Number(inReviewArticles?.count ?? 0),
        published: Number(publishedArticles?.count ?? 0),
        rejected:  Number(rejectedArticles?.count ?? 0),
        total:     Number(totalArticles?.count ?? 0),
      },
      authorApplications: {
        pending: Number(pendingAuthorApps?.count ?? 0),
        total:   Number(totalAuthorApps?.count ?? 0),
      },
      users: {
        total: Number(totalUsers?.count ?? 0),
        byRole: Object.fromEntries(
          (roleBreakdown as any[]).map((r) => [r.memberRole ?? 'member', Number(r.count)]),
        ),
      },
      recentSubmissions,
    };
  },

  // ── GET /api/admin/users ─────────────────────────────────────────────────
  async listUsers(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const caller = await getUser(strapi, userId);
    if (!isAdminRole(caller?.memberRole)) return ctx.forbidden();

    const { search = '', role = '', page = '1', pageSize = '20' } = ctx.query as Record<string, string>;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    let query = strapi.db.connection('up_users')
      .select(
        'id', 'username', 'email',
        'firstName', 'lastName', 'memberRole',
        'occupation', 'avatar', 'created_at as createdAt',
        'confirmed', 'blocked',
      )
      .orderBy('created_at', 'desc')
      .limit(parseInt(pageSize, 10))
      .offset(offset);

    if (search) {
      query = query.where(function (this: any) {
        this.whereILike('username', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('firstName', `%${search}%`)
          .orWhereILike('lastName', `%${search}%`);
      });
    }

    if (role) {
      query = query.where({ memberRole: role });
    }

    let countQuery = strapi.db.connection('up_users').count('id as count').first();
    if (search) {
      countQuery = countQuery.where(function (this: any) {
        this.whereILike('username', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('firstName', `%${search}%`)
          .orWhereILike('lastName', `%${search}%`);
      });
    }
    if (role) countQuery = countQuery.where({ memberRole: role });

    const [users, totalRow] = await Promise.all([query, countQuery]);

    ctx.body = {
      data: users,
      meta: {
        total: Number(totalRow?.count ?? 0),
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
      },
    };
  },

  // ── PATCH /api/admin/users/:id/role ──────────────────────────────────────
  async updateRole(ctx: any) {
    const callerId = ctx.state.user?.id;
    if (!callerId) return ctx.unauthorized();

    const caller = await getUser(strapi, callerId);
    if (!isAdminRole(caller?.memberRole)) return ctx.forbidden();

    const targetId = parseInt(ctx.params.id, 10);
    if (isNaN(targetId)) return ctx.badRequest('Invalid user id');

    const { memberRole } = ctx.request.body ?? {};
    if (!memberRole || !MEMBER_ROLES.includes(memberRole as MemberRole)) {
      return ctx.badRequest(`memberRole must be one of: ${MEMBER_ROLES.join(', ')}`);
    }

    // Prevent non-super-admin from setting super-admin role
    if (memberRole === 'super-admin' && caller.memberRole !== 'super-admin') {
      return ctx.forbidden('Only a super-admin can assign the super-admin role');
    }

    // Prevent demoting another super-admin
    const target = await getUser(strapi, targetId);
    if (!target) return ctx.notFound('User not found');
    if (target.memberRole === 'super-admin' && caller.memberRole !== 'super-admin') {
      return ctx.forbidden('Only a super-admin can modify another super-admin');
    }

    await strapi.db.connection('up_users').where({ id: targetId }).update({ memberRole });

    ctx.body = { id: targetId, memberRole };
  },
};
