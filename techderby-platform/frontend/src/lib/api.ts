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
    if (err.response?.status === 401) {
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
  getEvents: () => api.get('/api/events'),
  getPartners: () => api.get('/api/partners?populate=logo'),
  getInsights: () => api.get('/api/posts?populate=featuredImage'),
  getInsightBySlug: (slug: string) =>
    api.get(`/api/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=featuredImage`),
  getProgrammes: () => api.get('/api/programmes'),
  createMailingListSubscription: (email: string) =>
    api.post('/api/mailing-list-subscriptions', { data: { email } }),

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

  // ── Articles ──────────────────────────────────────────────────────────────
  getPublishedArticles: (params?: { page?: number; pageSize?: number; tag?: string }) =>
    api.get('/api/articles/published', { params }),
  getArticleBySlug: (slug: string) => api.get(`/api/articles/by-slug/${encodeURIComponent(slug)}`),
  getMyArticles: () => api.get('/api/articles/my'),
  getArticleById: (id: number) => api.get(`/api/articles/${id}`),
  createArticle: (data: { title: string; excerpt?: string; content?: object; tags?: string[]; coverImageUrl?: string }) =>
    api.post('/api/articles', data),
  updateArticle: (id: number, data: { title?: string; excerpt?: string; content?: object; tags?: string[]; coverImageUrl?: string }) =>
    api.put(`/api/articles/${id}`, data),
  deleteArticle: (id: number) => api.delete(`/api/articles/${id}`),
  submitArticle: (id: number) => api.post(`/api/articles/${id}/submit`),
  publishArticle: (id: number) => api.post(`/api/articles/${id}/publish`),
  rejectArticle: (id: number, reviewNotes?: string) =>
    api.post(`/api/articles/${id}/reject`, { reviewNotes }),
  likeArticle: (id: number) => api.post(`/api/articles/${id}/like`),
  getAdminArticles: (status?: string) =>
    api.get('/api/articles/admin-list', { params: status ? { status } : {} }),

  // ── Article Comments ──────────────────────────────────────────────────────
  getArticleComments: (articleId: number) =>
    api.get('/api/article-comments', { params: { articleId } }),
  createArticleComment: (articleId: number, body: string) =>
    api.post('/api/article-comments', { articleId, body }),
  deleteArticleComment: (id: number) => api.delete(`/api/article-comments/${id}`),

  // ── Admin ─────────────────────────────────────────────────────────────────
  getAdminStats: () => api.get('/api/admin/stats'),
  getAdminUsers: (params?: { search?: string; role?: string; page?: number; pageSize?: number }) =>
    api.get('/api/admin/users', { params }),
  createAdminUser: (data: { username: string; email: string; password: string; firstName?: string; lastName?: string; memberRole?: string }) =>
    api.post('/api/admin/users', data),
  updateUserRole: (id: number, memberRole: string) =>
    api.patch(`/api/admin/users/${id}/role`, { memberRole }),

  // ── Author applications ───────────────────────────────────────────────────
  getMyAuthorApplication: () => api.get('/api/author-applications/mine'),
  submitAuthorApplication: (data: { bio: string; expertise?: string[]; portfolio?: string; sampleWork?: string }) =>
    api.post('/api/author-applications', data),
  getAuthorApplications: (status?: string) =>
    api.get('/api/author-applications', { params: status ? { status } : {} }),
  approveAuthorApplication: (id: number) => api.post(`/api/author-applications/${id}/approve`),
  rejectAuthorApplication: (id: number, reviewNotes?: string) =>
    api.post(`/api/author-applications/${id}/reject`, { reviewNotes }),
};

export default api;
