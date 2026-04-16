export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      // Allow requests from the public frontend URL and common local dev origins.
      // The PUBLIC_FRONTEND_URL env var must be set in production (e.g. https://techderby.org).
      origin: [
        env('PUBLIC_FRONTEND_URL', 'http://localhost:3000'),
        'http://localhost:3000',
        'http://localhost:5173',
      ],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: false,
      keepHeaderOnError: true,
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
