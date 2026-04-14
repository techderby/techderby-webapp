export default {
  routes: [
    { method: 'GET',    path: '/article-comments',     handler: 'article-comment.list',   config: { auth: false } },
    { method: 'POST',   path: '/article-comments',     handler: 'article-comment.create', config: { policies: [] } },
    { method: 'DELETE', path: '/article-comments/:id', handler: 'article-comment.remove', config: { policies: [] } },
  ],
};
