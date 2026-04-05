/**
 * Custom route that exposes a safe, filtered list of community members.
 * - Authenticated admins/super-admins see all members.
 * - Authenticated members see only users with isVisible=true.
 * - Unauthenticated requests see only users with isVisible=true.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/members-directory',
      handler: 'api::member-directory.member-directory.list',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/members-directory/:id',
      handler: 'api::member-directory.member-directory.findOne',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};
