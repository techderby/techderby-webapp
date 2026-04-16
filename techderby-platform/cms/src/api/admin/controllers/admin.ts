const MEMBER_ROLES = ['member', 'editor', 'admin', 'super-admin'] as const;
type MemberRole = (typeof MEMBER_ROLES)[number];

async function getUser(strapi: any, userId: number) {
  return strapi.db.connection('up_users').where({ id: userId }).first();
}

function isAdminRole(role: string | undefined): boolean {
  return role === 'admin' || role === 'super-admin';
}

function formatUser(u: Record<string, any>) {
  return {
    id:         u.id,
    username:   u.username,
    email:      u.email,
    first_name: u.first_name ?? null,
    last_name:  u.last_name ?? null,
    member_role: u.member_role ?? 'member',
    occupation: u.occupation ?? null,
    avatar:     u.avatar ?? null,
    confirmed:  u.confirmed,
    blocked:    u.blocked,
    created_at: u.created_at,
  };
}

export default {

  // ── POST /api/admin/users ────────────────────────────────────────────────
  async createUser(ctx: any) {
    const callerId = ctx.state.user?.id;
    if (!callerId) return ctx.unauthorized();

    const caller = await getUser(strapi, callerId);
    if (!isAdminRole(caller?.member_role)) return ctx.forbidden();

    const { username, email, password, first_name = '', last_name = '', member_role = 'member' } = ctx.request.body ?? {};

    if (!username || !email || !password) {
      return ctx.badRequest('username, email and password are required');
    }

    if (password.length < 8) {
      return ctx.badRequest('Password must be at least 8 characters');
    }

    if (!MEMBER_ROLES.includes(member_role as MemberRole)) {
      return ctx.badRequest(`member_role must be one of: ${MEMBER_ROLES.join(', ')}`);
    }

    // Only a super-admin can create a super-admin account
    if (member_role === 'super-admin' && caller.member_role !== 'super-admin') {
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
      first_name,
      last_name,
      member_role,
      is_visible: true,
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
    ctx.body = formatUser(user);
  },

  // ── GET /api/admin/stats ─────────────────────────────────────────────────
  async stats(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const caller = await getUser(strapi, userId);
    if (!isAdminRole(caller?.member_role) && caller?.member_role !== 'editor') return ctx.forbidden();

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
      .select('member_role')
      .count('id as count')
      .groupBy('member_role');

    // Most recent 5 submitted articles for activity feed
    const recentSubmissions = await knex('articles')
      .where({ status: 'submitted' })
      .orderBy('created_at', 'desc')
      .limit(5)
      .select('id', 'title', 'author_id', 'created_at', 'tags');

    ctx.body = {
      articles: {
        pending:   Number(pendingArticles?.count ?? 0),
        in_review:  Number(inReviewArticles?.count ?? 0),
        published: Number(publishedArticles?.count ?? 0),
        rejected:  Number(rejectedArticles?.count ?? 0),
        total:     Number(totalArticles?.count ?? 0),
      },
      author_applications: {
        pending: Number(pendingAuthorApps?.count ?? 0),
        total:   Number(totalAuthorApps?.count ?? 0),
      },
      users: {
        total: Number(totalUsers?.count ?? 0),
        by_role: Object.fromEntries(
          (roleBreakdown as any[]).map((r) => [r.member_role ?? 'member', Number(r.count)]),
        ),
      },
      recent_submissions: recentSubmissions,
    };
  },

  // ── GET /api/admin/users ─────────────────────────────────────────────────
  async listUsers(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const caller = await getUser(strapi, userId);
    if (!isAdminRole(caller?.member_role)) return ctx.forbidden();

    const { search = '', role = '', page = '1', pageSize = '20' } = ctx.query as Record<string, string>;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    let query = strapi.db.connection('up_users')
      .select(
        'id', 'username', 'email',
        'first_name', 'last_name', 'member_role',
        'occupation', 'avatar', 'created_at',
        'confirmed', 'blocked',
      )
      .orderBy('created_at', 'desc')
      .limit(parseInt(pageSize, 10))
      .offset(offset);

    if (search) {
      query = query.where(function (this: any) {
        this.whereILike('username', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('first_name', `%${search}%`)
          .orWhereILike('last_name', `%${search}%`);
      });
    }

    if (role) {
      query = query.where({ member_role: role });
    }

    let countQuery = strapi.db.connection('up_users').count('id as count').first();
    if (search) {
      countQuery = countQuery.where(function (this: any) {
        this.whereILike('username', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('first_name', `%${search}%`)
          .orWhereILike('last_name', `%${search}%`);
      });
    }
    if (role) countQuery = countQuery.where({ member_role: role });

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
    if (!isAdminRole(caller?.member_role)) return ctx.forbidden();

    const targetId = parseInt(ctx.params.id, 10);
    if (isNaN(targetId)) return ctx.badRequest('Invalid user id');

    const { member_role } = ctx.request.body ?? {};
    if (!member_role || !MEMBER_ROLES.includes(member_role as MemberRole)) {
      return ctx.badRequest(`member_role must be one of: ${MEMBER_ROLES.join(', ')}`);
    }

    // Prevent non-super-admin from setting super-admin role
    if (member_role === 'super-admin' && caller.member_role !== 'super-admin') {
      return ctx.forbidden('Only a super-admin can assign the super-admin role');
    }

    // Prevent demoting another super-admin
    const target = await getUser(strapi, targetId);
    if (!target) return ctx.notFound('User not found');
    if (target.member_role === 'super-admin' && caller.member_role !== 'super-admin') {
      return ctx.forbidden('Only a super-admin can modify another super-admin');
    }

    await strapi.db.connection('up_users').where({ id: targetId }).update({ member_role });

    ctx.body = { id: targetId, member_role };
  },

  // ── GET /api/admin/articles ───────────────────────────────────────────────
  async listArticles(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const caller = await getUser(strapi, userId);
    if (!isAdminRole(caller?.member_role) && caller?.member_role !== 'editor') return ctx.forbidden();

    const { status, page = '1', pageSize = '20' } = ctx.query as Record<string, string>;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
    const knex = strapi.db.connection;

    let query = knex('articles')
      .orderBy('created_at', 'desc')
      .limit(parseInt(pageSize, 10))
      .offset(offset)
      .select('*');

    if (status) query = query.where({ status });

    const rows = await query;

    // Join author names
    const articles = await Promise.all(rows.map(async (r: Record<string, any>) => {
      const author = r.author_id
        ? await knex('up_users').where({ id: r.author_id }).select('first_name', 'last_name', 'username', 'occupation', 'avatar').first()
        : null;
      const authorName = author
        ? [author.first_name, author.last_name].filter(Boolean).join(' ') || author.username
        : 'Tech Derby Author';
      let tags: string[] | null = null;
      if (typeof r.tags === 'string') { try { tags = JSON.parse(r.tags); } catch { tags = null; } }
      else if (Array.isArray(r.tags)) { tags = r.tags; }
      let content: Record<string, unknown> | null = null;
      if (typeof r.content === 'string') { try { content = JSON.parse(r.content); } catch { content = null; } }
      else if (r.content && typeof r.content === 'object') { content = r.content as Record<string, unknown>; }
      return {
        id:               r.id,
        title:            r.title,
        slug:             r.slug ?? null,
        excerpt:          r.excerpt ?? null,
        content,
        coverImageUrl:    r.cover_image_url ?? null,
        tags,
        status:           r.status,
        authorName,
        authorAvatar:     author?.avatar ?? null,
        authorOccupation: author?.occupation ?? null,
        readTime:         r.read_time ?? 1,
        views:            r.views ?? 0,
        likes:            r.likes ?? 0,
        createdAt:        r.created_at ?? null,
        publishedAt:      r.published_at ?? null,
      };
    }));

    ctx.body = articles;
  },
};
