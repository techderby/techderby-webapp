import { describe, expect, it } from 'vitest';
import { sanitizeHtml, sanitizeMediaUrl } from '../lib/html-sanitizer';

describe('html sanitizer', () => {
  it('removes executable HTML while preserving ordinary markup', () => {
    const sanitized = sanitizeHtml(
      '<p>Hello <strong>Derby</strong></p><img src="javascript:alert(1)" onerror="alert(2)"><script>alert(3)</script>',
    );

    expect(sanitized).toContain('<strong>Derby</strong>');
    expect(sanitized).not.toContain('<script');
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('javascript:');
  });

  it('only permits safe media URL schemes', () => {
    expect(sanitizeMediaUrl('https://dev.techderby.org/uploads/avatar.jpg')).toBe('https://dev.techderby.org/uploads/avatar.jpg');
    expect(sanitizeMediaUrl('blob:https://dev.techderby.org/avatar')).toBe('blob:https://dev.techderby.org/avatar');
    expect(sanitizeMediaUrl('/uploads/avatar.jpg')).toBe('/uploads/avatar.jpg');
    expect(sanitizeMediaUrl('data:image/svg+xml,<svg onload=alert(1)>')).toBe('');
    expect(sanitizeMediaUrl('javascript:alert(1)')).toBe('');
  });
});
