import DOMPurify from 'dompurify';

const SAFE_URI_PATTERN = /^(?:(?:https?|mailto|blob):|\/(?!\/)|#)/i;

export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_URI_REGEXP: SAFE_URI_PATTERN,
    FORBID_TAGS: ['script', 'style'],
  });
}

export function sanitizeMediaUrl(url?: string | null) {
  const value = String(url ?? '').trim();
  if (!value) return '';
  if (/^(https?:|blob:)/i.test(value)) return value;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return '';
}
