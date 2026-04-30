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
};

export default api;
