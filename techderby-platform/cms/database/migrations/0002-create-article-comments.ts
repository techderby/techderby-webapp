import type { Knex } from 'knex';

/**
 * Creates the article_comments table used by the article controller for
 * per-article member comments.
 *
 * Note: The `articles` table is auto-created by Strapi from the article
 * content-type schema. This migration only creates the companion table.
 */
export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('article_comments');
  if (!exists) {
    await knex.schema.createTable('article_comments', (table) => {
      table.increments('id').primary();
      table.integer('article_id').notNullable().references('id').inTable('articles').onDelete('CASCADE');
      table.integer('author_id').notNullable();
      table.text('body').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.index(['article_id'], 'article_comments_article_id_idx');
      table.index(['author_id'], 'article_comments_author_id_idx');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('article_comments');
}
