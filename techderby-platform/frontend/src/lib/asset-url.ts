export function assetUrl(path?: string | null) {
  if (!path) return '';
  if (/^(https?:|blob:)/i.test(path)) return path;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return '';

  const apiBase = String(import.meta.env.VITE_API_URL ?? 'http://localhost:1337').replace(/\/$/, '');
  return `${apiBase}${path.startsWith('/') ? path : `/${path}`}`;
}
