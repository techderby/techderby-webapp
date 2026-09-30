import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:1337',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request — check sessionStorage first (no remember-me), then localStorage
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('td_jwt') || localStorage.getItem('td_jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth expiry globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const requestUrl = String(err.config?.url ?? '');
    const shouldClearAuth = status === 401 && /\/api\/(users\/me|profile|auth\/local|auth\/register|auth\/reset-password|auth\/forgot-password)(\b|\/|\?)/.test(requestUrl);

    // Only clear saved auth when session-validation/auth endpoints reject the token.
    // Public-content endpoints may return 401/403 from permission settings and should not sign users out.
    if (shouldClearAuth) {
      localStorage.removeItem('td_jwt');
      localStorage.removeItem('td_user');
      sessionStorage.removeItem('td_jwt');
      sessionStorage.removeItem('td_user');
      window.dispatchEvent(new Event('td:auth:expired'));
    }
    return Promise.reject(err);
  },
);

export const apiClient = {
  // ── Content ──────────────────────────────────────────────────────────────
  getEvents: () => api.get('/api/events?sort=date:asc'),
  createEventForAdmin: (form: FormData) =>
    api.post('/api/events/admin', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000,
    }),
  getEventsForAdmin: () => api.get('/api/events/admin'),
  updateEventForAdmin: (documentId: string, form: FormData) =>
    api.put(`/api/events/admin/${encodeURIComponent(documentId)}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000,
    }),
  getPartners: () => api.get('/api/partners?populate=logo'),
  getInsights: () => api.get('/api/wire/articles'),
  getInsightBySlug: (slug: string) => api.get(`/api/wire/articles/${encodeURIComponent(slug)}`),
  getProgrammes: () => api.get('/api/programmes'),
  createMailingListSubscription: (email: string) =>
    api.post('/api/mailing-list-subscriptions', { data: { email, category: 'None' } }),
  getMailingListUnsubscribeDetails: (token: string) =>
    api.get(`/api/mailing-list-subscriptions/unsubscribe/${encodeURIComponent(token)}`),
  unsubscribeFromMailingList: (token: string, reason: string, details: string) =>
    api.post(`/api/mailing-list-subscriptions/unsubscribe/${encodeURIComponent(token)}`, { reason, details }),
  getMailingListSubscriptionsAdmin: () =>
    api.get('/api/mailing-list-subscriptions/admin/list'),
  deleteMailingListSubscriptionForAdmin: (id: number) =>
    api.delete(`/api/mailing-list-subscriptions/admin/subscribers/${id}`),
  updateMailingListSubscriptionCategoryForAdmin: (id: number, category: string) =>
    api.put(`/api/mailing-list-subscriptions/admin/subscribers/${id}/category`, { category }),
  exportMailingListCsvForAdmin: () =>
    api.get('/api/mailing-list-subscriptions/admin/export.csv', {
      responseType: 'blob',
    }),
  importMailingListForAdmin: (emails: string[]) =>
    api.post('/api/mailing-list-subscriptions/admin/import', { emails }),
  getMailingListSegmentsForAdmin: () =>
    api.get('/api/mailing-list-subscriptions/admin/segments'),
  createMailingListSegmentForAdmin: (data: { name: string; description?: string; categories: string[] }) =>
    api.post('/api/mailing-list-subscriptions/admin/segments', data),
  updateMailingListSegmentForAdmin: (id: number, data: { name: string; description?: string; categories: string[] }) =>
    api.put(`/api/mailing-list-subscriptions/admin/segments/${id}`, data),
  deleteMailingListSegmentForAdmin: (id: number) =>
    api.delete(`/api/mailing-list-subscriptions/admin/segments/${id}`),
  updateMailingListSegmentMembersForAdmin: (id: number, subscriptionIds: number[], action: 'add' | 'remove') =>
    api.post(`/api/mailing-list-subscriptions/admin/segments/${id}/members`, { subscriptionIds, action }),
  sendNewsletterForAdmin: (subject: string, html: string, segmentIds: number[] = []) =>
    api.post(
      '/api/mailing-list-subscriptions/admin/send-newsletter',
      { subject, html, segmentIds },
      { timeout: 5 * 60 * 1000 },
    ),
  exportMailingListCsv: (exportToken: string) =>
    api.get('/api/mailing-list-subscriptions/export', {
      responseType: 'blob',
      headers: { 'x-export-token': exportToken },
    }),

  // ── Auth ─────────────────────────────────────────────────────────────────
  register: (data: { username: string; email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/api/auth/register', data),
  login: (identifier: string, password: string) =>
    api.post('/api/auth/local', { identifier, password }),
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),
  resetPassword: (code: string, password: string, passwordConfirmation: string) =>
    api.post('/api/auth/reset-password', { code, password, passwordConfirmation }),
  getMe: () => api.get('/api/users/me?populate=role'),
  updateMe: (_id: number, data: object) => api.put('/api/profile', data),
  getMyProfile: () => api.get('/api/profile'),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.post('/api/profile/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ── Members directory ─────────────────────────────────────────────────────
  getMembersDirectory: () => api.get('/api/members-directory'),
  getMemberById: (id: number) => api.get(`/api/members-directory/${id}`),

  // ── Connections ───────────────────────────────────────────────────────────
  getMyConnections: () => api.get('/api/connections/mine'),
  sendConnectionRequest: (recipientId: number) => api.post('/api/connections', { recipientId }),
  acceptConnection: (id: number) => api.put(`/api/connections/${id}/accept`),
  rejectConnection: (id: number) => api.put(`/api/connections/${id}/reject`),
  removeConnection: (id: number) => api.delete(`/api/connections/${id}`),

  // ── Messages ──────────────────────────────────────────────────────────────
  getInbox: () => api.get('/api/messages/inbox'),
  getConversation: (userId: number) => api.get(`/api/messages/conversation/${userId}`),
  sendMessage: (toUserId: number, content: string) =>
    api.post('/api/messages', { toUserId, content }),

  // ── Form notifications ────────────────────────────────────────────────────
  notify: (subject: string, text: string, formType: string) =>
    api.post('/api/notify', { subject, text, formType }),

  // ── Editorial / The Wire ──────────────────────────────────────────────────
  getWriterApplication: () => api.get('/api/editorial/application'),
  applyAsWriter: (data: { motivation: string; experience: string; portfolioUrl: string; topics: string[] }) =>
    api.post('/api/editorial/application', data),
  getMyArticles: () => api.get('/api/editorial/me/articles'),
  createArticle: (form: FormData) =>
    api.post('/api/editorial/articles', form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60_000 }),
  uploadArticleAssets: (files: File[]) => {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    return api.post('/api/editorial/article-assets', form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60_000 });
  },
  updateArticle: (documentId: string, form: FormData) =>
    api.put(`/api/editorial/articles/${encodeURIComponent(documentId)}`, form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60_000 }),
  submitArticle: (documentId: string) =>
    api.post(`/api/editorial/articles/${encodeURIComponent(documentId)}/submit`),
  getEditorialAdminOverview: () => api.get('/api/editorial/admin/overview'),
  getEditorialAdminWriters: () => api.get('/api/editorial/admin/writers'),
  reviewWriterApplication: (id: number, status: 'approved' | 'rejected', reviewNotes: string) =>
    api.put(`/api/editorial/admin/applications/${id}`, { status, reviewNotes }),
  reviewArticle: (documentId: string, status: 'published' | 'rejected' | 'update-requested', reviewNotes: string) =>
    api.put(`/api/editorial/admin/articles/${encodeURIComponent(documentId)}`, { status, reviewNotes }, { timeout: 5 * 60 * 1000 }),
  unpublishArticleForAdmin: (documentId: string) =>
    api.post(`/api/editorial/admin/articles/${encodeURIComponent(documentId)}/unpublish`),
  deleteArticleForAdmin: (documentId: string) =>
    api.delete(`/api/editorial/admin/articles/${encodeURIComponent(documentId)}`),
  recordArticleRead: (documentId: string) =>
    api.post(`/api/wire/articles/${encodeURIComponent(documentId)}/read`),
  getArticleComments: (documentId: string) =>
    api.get(`/api/wire/articles/${encodeURIComponent(documentId)}/comments`),
  addArticleComment: (documentId: string, data: { name: string; email: string; content: string }) =>
    api.post(`/api/wire/articles/${encodeURIComponent(documentId)}/comments`, data),
  toggleArticleLike: (documentId: string, voterToken: string) =>
    api.post(`/api/wire/articles/${encodeURIComponent(documentId)}/like`, { voterToken }),
};

export default api;
