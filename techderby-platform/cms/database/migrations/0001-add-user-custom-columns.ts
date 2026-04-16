import type { Knex } from 'knex';

/**
 * Adds custom profile columns to up_users that Strapi's built-in
 * users-permissions schema does not include.
 *
 * All columns use snake_case to match PostgreSQL conventions and the
 * rawFindUser / sanitize helpers in profile.ts.
 */
export async function up(knex: Knex): Promise<void> {
  const hasFirst     = await knex.schema.hasColumn('up_users', 'first_name');
  const hasLast      = await knex.schema.hasColumn('up_users', 'last_name');
  const hasRole      = await knex.schema.hasColumn('up_users', 'member_role');
  const hasVisible   = await knex.schema.hasColumn('up_users', 'is_visible');
  const hasBio       = await knex.schema.hasColumn('up_users', 'bio');
  const hasLocation  = await knex.schema.hasColumn('up_users', 'location');
  const hasOccupation= await knex.schema.hasColumn('up_users', 'occupation');
  const hasSkills    = await knex.schema.hasColumn('up_users', 'skills');
  const hasCerts     = await knex.schema.hasColumn('up_users', 'certifications');
  const hasSocial    = await knex.schema.hasColumn('up_users', 'social_links');
  const hasAvatar    = await knex.schema.hasColumn('up_users', 'avatar');

  await knex.schema.alterTable('up_users', (table) => {
    if (!hasFirst)      table.string('first_name', 255).nullable();
    if (!hasLast)       table.string('last_name', 255).nullable();
    if (!hasRole)       table.string('member_role', 50).notNullable().defaultTo('member');
    if (!hasVisible)    table.boolean('is_visible').notNullable().defaultTo(true);
    if (!hasBio)        table.text('bio').nullable();
    if (!hasLocation)   table.string('location', 255).nullable();
    if (!hasOccupation) table.string('occupation', 255).nullable();
    if (!hasSkills)     table.text('skills').nullable();
    if (!hasCerts)      table.text('certifications').nullable();
    if (!hasSocial)     table.text('social_links').nullable();
    if (!hasAvatar)     table.string('avatar', 512).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('up_users', (table) => {
    table.dropColumn('first_name');
    table.dropColumn('last_name');
    table.dropColumn('member_role');
    table.dropColumn('is_visible');
    table.dropColumn('bio');
    table.dropColumn('location');
    table.dropColumn('occupation');
    table.dropColumn('skills');
    table.dropColumn('certifications');
    table.dropColumn('social_links');
    table.dropColumn('avatar');
  });
}
