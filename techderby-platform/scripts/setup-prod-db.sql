-- =============================================================================
-- Tech Derby – Production Database Setup Script
-- Run with: docker exec techderby-prod-postgres psql -U techderby -d techderby -f /tmp/setup-prod-db.sql
-- Safe to run multiple times (fully idempotent)
-- =============================================================================

-- =============================================================================
-- PART 1: Custom columns on up_users
-- =============================================================================

ALTER TABLE up_users
  ADD COLUMN IF NOT EXISTS "firstName"       varchar(255),
  ADD COLUMN IF NOT EXISTS "lastName"        varchar(255),
  ADD COLUMN IF NOT EXISTS "memberRole"      varchar(50) DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS bio               text,
  ADD COLUMN IF NOT EXISTS location          varchar(255),
  ADD COLUMN IF NOT EXISTS occupation        varchar(255),
  ADD COLUMN IF NOT EXISTS skills            text,
  ADD COLUMN IF NOT EXISTS certifications    text,
  ADD COLUMN IF NOT EXISTS "isVisible"       boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS avatar            varchar(512),
  ADD COLUMN IF NOT EXISTS "socialLinks"     text;

-- Set default memberRole for any existing users that have NULL
UPDATE up_users SET "memberRole" = 'member' WHERE "memberRole" IS NULL;

-- =============================================================================
-- PART 2: Permissions for authenticated role
-- =============================================================================

DO $$
DECLARE
  auth_role_id   int;
  perm_id        int;

  actions text[] := ARRAY[
    -- Profile
    'api::profile.profile.getProfile',
    'api::profile.profile.updateProfile',
    'api::profile.profile.uploadAvatar',
    'api::profile.profile.register',
    -- Articles
    'api::article.article.my',
    'api::article.article.adminList',
    'api::article.article.findOne',
    'api::article.article.create',
    'api::article.article.update',
    'api::article.article.delete',
    'api::article.article.submit',
    'api::article.article.publish',
    'api::article.article.reject',
    -- Article Comments
    'api::article-comment.article-comment.create',
    'api::article-comment.article-comment.remove',
    -- Author Applications
    'api::author-application.author-application.mine',
    'api::author-application.author-application.find',
    'api::author-application.author-application.create',
    'api::author-application.author-application.approve',
    'api::author-application.author-application.reject',
    -- Connections
    'api::connection.connection.mine',
    'api::connection.connection.create',
    'api::connection.connection.accept',
    'api::connection.connection.reject',
    'api::connection.connection.delete',
    -- Messages
    'api::message.message.inbox',
    'api::message.message.conversation',
    'api::message.message.create',
    -- Member Directory
    'api::member-directory.member-directory.list',
    'api::member-directory.member-directory.findOne',
    -- Notify
    'api::notify.notify.send',
    -- Admin
    'api::admin.admin.stats',
    'api::admin.admin.listUsers',
    'api::admin.admin.createUser',
    'api::admin.admin.updateRole'
  ];
  action text;

BEGIN
  -- Get the authenticated role id
  SELECT id INTO auth_role_id FROM up_roles WHERE type = 'authenticated' LIMIT 1;

  IF auth_role_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated role found in up_roles. Strapi may not have been started yet.';
  END IF;

  FOREACH action IN ARRAY actions
  LOOP
    -- Insert permission if it doesn't exist
    SELECT id INTO perm_id FROM up_permissions WHERE action = action LIMIT 1;

    IF perm_id IS NULL THEN
      INSERT INTO up_permissions (action, created_at, updated_at, document_id, published_at)
        VALUES (
          action,
          NOW(), NOW(),
          substr(md5(random()::text), 1, 16),
          NOW()
        )
        RETURNING id INTO perm_id;

      RAISE NOTICE 'Created permission: %  (id=%)', action, perm_id;
    ELSE
      RAISE NOTICE 'Already exists: %  (id=%)', action, perm_id;
    END IF;

    -- Link to authenticated role if not already linked
    INSERT INTO up_permissions_role_lnk (permission_id, role_id)
      VALUES (perm_id, auth_role_id)
      ON CONFLICT DO NOTHING;
  END LOOP;

  RAISE NOTICE 'Done. % permissions processed.', array_length(actions, 1);
END $$;

-- =============================================================================
-- PART 3: Verify
-- =============================================================================

SELECT
  p.action,
  CASE WHEN lnk.role_id IS NOT NULL THEN 'linked' ELSE 'NOT LINKED' END AS status
FROM up_permissions p
LEFT JOIN up_permissions_role_lnk lnk ON lnk.permission_id = p.id
WHERE p.action LIKE 'api::%'
ORDER BY p.action;
