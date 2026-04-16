export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'api::profile.profile.login',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/auth/register',
      handler: 'api::profile.profile.register',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/auth/forgot-password',
      handler: 'api::profile.profile.forgotPassword',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/auth/reset-password',
      handler: 'api::profile.profile.resetPassword',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/profile',
      handler: 'api::profile.profile.getProfile',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/profile',
      handler: 'api::profile.profile.updateProfile',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/profile/avatar',
      handler: 'api::profile.profile.uploadAvatar',
      config: { policies: [], middlewares: [] },
    },
  ],
};
