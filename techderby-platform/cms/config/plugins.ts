export default ({ env }) => ({
  // ── Email (Brevo SMTP) ────────────────────────────────────────────────────
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp-relay.brevo.com'),
        port: env.int('SMTP_PORT', 587),
        secure: env.bool('SMTP_SECURE', false),
        auth: {
          user: env('SMTP_USER'),
          pass: env('SMTP_PASS'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_FROM', 'Tech Derby <hello@techderby.org>'),
        defaultReplyTo: env('SMTP_FROM', 'Tech Derby <hello@techderby.org>'),
      },
    },
  },

  // ── Users & Permissions ───────────────────────────────────────────────────
  'users-permissions': {
    enabled: true,
    config: {
      jwtSecret: env('JWT_SECRET'),
      resetPasswordUrl: `${env('PUBLIC_FRONTEND_URL', 'http://localhost:3000')}/reset-password`,
    },
  },
});
