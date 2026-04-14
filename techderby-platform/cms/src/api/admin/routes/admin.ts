export default {
  routes: [
    { method: 'GET',   path: '/admin/stats',           handler: 'api::admin.admin.stats',      config: { policies: [] } },
    { method: 'GET',   path: '/admin/users',           handler: 'api::admin.admin.listUsers',  config: { policies: [] } },
    { method: 'POST',  path: '/admin/users',           handler: 'api::admin.admin.createUser', config: { policies: [] } },
    { method: 'PATCH', path: '/admin/users/:id/role',  handler: 'api::admin.admin.updateRole', config: { policies: [] } },
  ],
};
