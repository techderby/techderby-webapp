import { ARTICLE_CATEGORIES } from './constants/article-categories';
import { MAILING_LIST_CATEGORIES } from './constants/mailing-list';

const PUBLIC_ACTIONS = [
  'api::event.event.find',
  'api::event.event.findOne',
  'api::partner.partner.find',
  'api::partner.partner.findOne',
  'api::post.post.find',
  'api::post.post.findOne',
  'api::programme.programme.find',
  'api::programme.programme.findOne',
  'api::mailing-list-subscription.mailing-list-subscription.create',
];

const AUTHENTICATED_ACTIONS = [
  ...PUBLIC_ACTIONS,
  'api::profile.profile.getProfile',
  'api::profile.profile.updateProfile',
  'api::profile.profile.uploadAvatar',
  'api::connection.connection.mine',
  'api::connection.connection.create',
  'api::connection.connection.accept',
  'api::connection.connection.reject',
  'api::connection.connection.delete',
  'api::message.message.inbox',
  'api::message.message.conversation',
  'api::message.message.create',
  'api::event.event.listForAdmin',
  'api::event.event.createForAdmin',
  'api::event.event.updateForAdmin',
  'api::editorial.editorial.applicationStatus',
  'api::editorial.editorial.applyWriter',
  'api::editorial.editorial.myArticles',
  'api::editorial.editorial.createArticle',
  'api::editorial.editorial.uploadArticleAssets',
  'api::editorial.editorial.updateArticle',
  'api::editorial.editorial.submitArticle',
  'api::editorial.editorial.adminOverview',
  'api::editorial.editorial.adminWriters',
  'api::editorial.editorial.reviewApplication',
  'api::editorial.editorial.reviewArticle',
  'api::editorial.editorial.unpublishArticle',
  'api::editorial.editorial.deleteArticle',
  'api::mailing-list-subscription.mailing-list-subscription.listForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.deleteForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.exportCsvForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.importForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.sendNewsletterForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.uploadNewsletterAssetForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.listSegmentsForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.createSegmentForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.updateSegmentForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.deleteSegmentForAdmin',
  'api::mailing-list-subscription.mailing-list-subscription.updateSegmentMembersForAdmin',
];

const DEFAULT_SEGMENT_NAME = 'All Users';

async function ensurePublicPermissions() {
  const roleQuery = strapi.db.query('plugin::users-permissions.role');
  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');

  const publicRole = await roleQuery.findOne({ where: { type: 'public' } });
  if (!publicRole?.id) {
    strapi.log.warn('[bootstrap] Public role not found; skipping permission sync.');
    return;
  }

  for (const action of PUBLIC_ACTIONS) {
    const existing = await permissionQuery.findOne({
      where: {
        action,
        role: publicRole.id,
      },
    });

    if (!existing) {
      await permissionQuery.create({
        data: {
          action,
          role: publicRole.id,
          enabled: true,
        },
      });
      continue;
    }

    if (!existing.enabled) {
      await permissionQuery.update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
  }

  strapi.log.info('[bootstrap] Public role permissions ensured for content + mailing list endpoints.');
}

async function backfillAuthenticatedRoleLinks() {
  const roleQuery = strapi.db.query('plugin::users-permissions.role');
  const authenticatedRole = await roleQuery.findOne({ where: { type: 'authenticated' } });
  if (!authenticatedRole?.id) return;

  const knex = strapi.db.connection;
  const relationTables = ['up_users_role_lnk', 'up_users_role_links'];

  for (const tableName of relationTables) {
    try {
      const missingResult = await knex.raw(
        `
        SELECT count(*)::int AS count
        FROM up_users u
        WHERE NOT EXISTS (
          SELECT 1 FROM ${tableName} rel WHERE rel.user_id = u.id
        )
        `,
      );

      const missingCount = Number(missingResult?.rows?.[0]?.count ?? 0);
      if (missingCount <= 0) {
        strapi.log.info(`[bootstrap] Authenticated role links already complete in ${tableName}; no backfill required.`);
        return;
      }

      await knex.raw(
        `
        INSERT INTO ${tableName} (user_id, role_id)
        SELECT u.id, ?
        FROM up_users u
        WHERE NOT EXISTS (
          SELECT 1 FROM ${tableName} rel WHERE rel.user_id = u.id
        )
        `,
        [authenticatedRole.id],
      );
      strapi.log.info(`[bootstrap] Backfilled ${missingCount} missing authenticated role links via ${tableName}.`);
      return;
    } catch {
      // Try the next potential relation table name.
    }
  }

  strapi.log.warn('[bootstrap] Could not backfill missing user-role links; relation table not detected.');
}

async function ensureAuthenticatedPermissions() {
  const roleQuery = strapi.db.query('plugin::users-permissions.role');
  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');
  const authenticatedRole = await roleQuery.findOne({ where: { type: 'authenticated' } });

  if (!authenticatedRole?.id) {
    strapi.log.warn('[bootstrap] Authenticated role not found; skipping permission sync.');
    return;
  }

  for (const action of AUTHENTICATED_ACTIONS) {
    const existing = await permissionQuery.findOne({
      where: {
        action,
        role: authenticatedRole.id,
      },
    });

    if (!existing) {
      await permissionQuery.create({
        data: {
          action,
          role: authenticatedRole.id,
          enabled: true,
        },
      });
      continue;
    }

    if (!existing.enabled) {
      await permissionQuery.update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
  }

  strapi.log.info('[bootstrap] Authenticated admin-action permissions ensured.');
}

async function backfillMemberProfileDefaults() {
  const knex = strapi.db.connection;
  const hasMemberRole = await knex.schema.hasColumn('up_users', 'member_role');
  const hasVisibility = await knex.schema.hasColumn('up_users', 'is_visible');

  if (hasMemberRole) {
    const updated = await knex('up_users').whereNull('member_role').update({ member_role: 'member' });
    if (updated > 0) {
      strapi.log.info(`[bootstrap] Backfilled member role for ${updated} existing users.`);
    }
  }

  if (hasVisibility) {
    const updated = await knex('up_users').whereNull('is_visible').update({ is_visible: true });
    if (updated > 0) {
      strapi.log.info(`[bootstrap] Enabled directory visibility for ${updated} existing users.`);
    }
  }
}

async function backfillArticleWorkflowDefaults() {
  const knex = strapi.db.connection;
  const tableExists = await knex.schema.hasTable('insights');
  if (!tableExists) return;
  const hasWorkflowStatus = await knex.schema.hasColumn('insights', 'workflow_status');
  if (!hasWorkflowStatus) return;

  await knex('insights')
    .whereNotNull('published_at')
    .where((builder: any) => builder.whereNull('workflow_status').orWhere('workflow_status', 'draft'))
    .update({ workflow_status: 'published' });
  await knex('insights').whereNull('workflow_status').update({ workflow_status: 'draft' });
}

async function normalizeArticleCategories() {
  const knex = strapi.db.connection;
  const tableExists = await knex.schema.hasTable('insights');
  if (!tableExists) return;

  const hasCategory = await knex.schema.hasColumn('insights', 'category');
  if (!hasCategory) return;

  const validCategories = [...ARTICLE_CATEGORIES];

  const updatedBlank = await knex('insights')
    .where((builder: any) => builder.whereNull('category').orWhere('category', '').orWhere('category', 'General'))
    .update({ category: 'Others' });

  const updatedInvalid = await knex('insights')
    .whereNotNull('category')
    .whereNotIn('category', validCategories)
    .update({ category: 'Others' });

  const totalUpdated = Number(updatedBlank ?? 0) + Number(updatedInvalid ?? 0);
  if (totalUpdated > 0) {
    strapi.log.info(`[bootstrap] Normalized ${totalUpdated} article categories to "Others".`);
  }
}

async function normalizeMailingListCategories() {
  const knex = strapi.db.connection;
  const tableExists = await knex.schema.hasTable('mailing_list_subscriptions');
  if (!tableExists) return;

  const hasCategory = await knex.schema.hasColumn('mailing_list_subscriptions', 'category');
  if (!hasCategory) {
    await knex.schema.alterTable('mailing_list_subscriptions', (table: any) => {
      table.string('category').notNullable().defaultTo('None');
    });
  }

  const validCategories = [...MAILING_LIST_CATEGORIES];
  const updatedBlank = await knex('mailing_list_subscriptions')
    .where((builder: any) => builder.whereNull('category').orWhere('category', '').orWhere('category', 'General'))
    .update({ category: 'None' });

  const updatedInvalid = await knex('mailing_list_subscriptions')
    .whereNotNull('category')
    .whereNotIn('category', validCategories)
    .update({ category: 'None' });

  const totalUpdated = Number(updatedBlank ?? 0) + Number(updatedInvalid ?? 0);
  if (totalUpdated > 0) {
    strapi.log.info(`[bootstrap] Normalized ${totalUpdated} mailing list categories to "None".`);
  }
}

async function ensureMailingListSegments() {
  const knex = strapi.db.connection;
  const tableName = 'mailing_list_segments';
  const tableExists = await knex.schema.hasTable(tableName);

  if (!tableExists) {
    await knex.schema.createTable(tableName, (table: any) => {
      table.increments('id').primary();
      table.string('name', 120).notNullable().unique();
      table.text('description').nullable();
      table.jsonb('categories').notNullable().defaultTo('[]');
      table.boolean('include_all').notNullable().defaultTo(false);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
  }

  const defaultSegment = await knex(tableName).where({ name: DEFAULT_SEGMENT_NAME }).first();
  if (!defaultSegment) {
    await knex(tableName).insert({
      name: DEFAULT_SEGMENT_NAME,
      description: 'All subscribers in the mailing list.',
      categories: JSON.stringify([]),
      include_all: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const membershipTable = 'mailing_list_segment_memberships';
  if (!(await knex.schema.hasTable(membershipTable))) {
    await knex.schema.createTable(membershipTable, (table: any) => {
      table.integer('segment_id').notNullable().references('id').inTable(tableName).onDelete('CASCADE');
      table.integer('subscription_id').notNullable().references('id').inTable('mailing_list_subscriptions').onDelete('CASCADE');
      table.boolean('included').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.primary(['segment_id', 'subscription_id']);
    });
  }
}

async function syncCmsAdministratorsToMembers() {
  const knex = strapi.db.connection;
  const hasMemberRole = await knex.schema.hasColumn('up_users', 'member_role');
  if (!hasMemberRole) return;

  const cmsAdministrators = await knex('admin_users as admin')
    .join('admin_users_roles_lnk as link', 'link.user_id', 'admin.id')
    .join('admin_roles as role', 'role.id', 'link.role_id')
    .where('admin.is_active', true)
    .select('admin.email', 'role.code', 'role.name');

  const rolesByEmail = new Map<string, string>();
  for (const administrator of cmsAdministrators) {
    const email = String(administrator.email ?? '').trim().toLowerCase();
    if (!email) continue;

    const isSuperAdmin =
      String(administrator.code ?? '').toLowerCase().includes('super-admin') ||
      String(administrator.name ?? '').toLowerCase() === 'super admin';
    const desiredRole = isSuperAdmin ? 'super-admin' : 'admin';
    const currentRole = rolesByEmail.get(email);

    if (currentRole !== 'super-admin') {
      rolesByEmail.set(email, desiredRole);
    }
  }

  let promoted = 0;
  for (const [email, desiredRole] of rolesByEmail) {
    const updated = await knex('up_users')
      .whereRaw('LOWER(email) = ?', [email])
      .whereNot({ member_role: desiredRole })
      .update({ member_role: desiredRole, updated_at: new Date().toISOString() });
    promoted += updated;
  }

  if (promoted > 0) {
    strapi.log.info(`[bootstrap] Synchronized CMS administrator roles to ${promoted} webapp members.`);
  }
}

export default {
  async bootstrap() {
    try {
      await ensurePublicPermissions();
      await ensureAuthenticatedPermissions();
      await backfillAuthenticatedRoleLinks();
      await backfillMemberProfileDefaults();
      await backfillArticleWorkflowDefaults();
      await normalizeArticleCategories();
      await normalizeMailingListCategories();
      await ensureMailingListSegments();
      await syncCmsAdministratorsToMembers();
    } catch (error) {
      strapi.log.error('[bootstrap] Failed to synchronize permissions or user defaults', error);
    }
  },
};
