import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:1337',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  getEvents: () => api.get('/api/events'),
  getPartners: () => api.get('/api/partners?populate=logo'),
  getInsights: () => api.get('/api/posts?populate=featuredImage'),
  getInsightBySlug: (slug: string) =>
    api.get(`/api/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=featuredImage`),
  getProgrammes: () => api.get('/api/programmes'),
  createMailingListSubscription: (email: string) => api.post('/api/mailing-list-subscriptions', { data: { email } }),
};

export default api;
