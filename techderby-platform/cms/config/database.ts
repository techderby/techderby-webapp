export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'postgres'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'techderby'),
      user: env('DATABASE_USERNAME', 'techderby'),
      password: env('DATABASE_PASSWORD', 'techderby'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    debug: false,
  },
});
