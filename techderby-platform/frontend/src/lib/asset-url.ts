export function assetUrl(path?: string | null) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const apiBase = String(import.meta.env.VITE_API_URL ?? 'http://localhost:1337').replace(/\/$/, '');
  return `${apiBase}${path.startsWith('/') ? path : `/${path}`}`;
}
