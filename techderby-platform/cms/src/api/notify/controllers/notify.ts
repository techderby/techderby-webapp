const NOTIFY_TO = 'technical@techderby.org';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, recent);
    return true;
  }
  requestLog.set(ip, [...recent, now]);
  return false;
}

export default {
  async send(ctx: any) {
    const { subject, text, formType } = ctx.request.body ?? {};

    if (typeof subject !== 'string' || typeof text !== 'string' || !subject.trim() || !text.trim()) {
      return ctx.badRequest('subject and text are required.');
    }
    if (subject.length > 160 || text.length > 20_000 || String(formType ?? '').length > 100) {
      return ctx.badRequest('Form submission is too large.');
    }
    if (isRateLimited(ctx.ip ?? 'unknown')) {
      ctx.set('Retry-After', String(RATE_LIMIT_WINDOW_MS / 1000));
      return ctx.tooManyRequests('Too many submissions. Please try again later.');
    }

    const safeSubject = subject.replace(/[\r\n]+/g, ' ').trim();
    const safeFormType = escapeHtml(formType ?? 'Form submission');

    // Format plain text into a simple HTML email
    const rows = text
      .split('\n')
      .map((line: string) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        // Bold the label part (before the first colon)
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx > 0 && colonIdx < 40) {
          const label = escapeHtml(trimmed.slice(0, colonIdx));
          const value = escapeHtml(trimmed.slice(colonIdx + 1).trim());
          return `<tr>
            <td style="padding:6px 12px 6px 0;font-size:13px;font-weight:700;color:rgba(255,255,255,0.5);white-space:nowrap;vertical-align:top;">${label}</td>
            <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.85);">${value || '—'}</td>
          </tr>`;
        }
        return `<tr><td colspan="2" style="padding:8px 0 4px;font-size:13px;color:rgba(255,255,255,0.7);">${escapeHtml(trimmed)}</td></tr>`;
      })
      .join('');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    const logoPath = path.join(strapi.dirs.static.public, 'techderbywhitelogo.webp');
    const logoDataUri = fs.existsSync(logoPath)
      ? `data:image/webp;base64,${fs.readFileSync(logoPath).toString('base64')}`
      : null;

    const frontendUrl = process.env.PUBLIC_FRONTEND_URL ?? 'http://localhost:3000';
    const year = new Date().getFullYear();

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <tr><td style="height:4px;background:linear-gradient(90deg,#0ea5e9,#f97316);"></td></tr>
        <tr><td style="padding:32px 36px 20px;">
          ${logoDataUri ? `<img src="${logoDataUri}" alt="Tech Derby" width="130" style="display:block;height:auto;margin-bottom:14px;" />` : `<p style="margin:0 0 14px;font-size:20px;font-weight:900;color:#ffffff;">Tech Derby</p>`}
          <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.35);">${safeFormType}</p>
          <p style="margin:6px 0 0;font-size:18px;font-weight:900;color:#ffffff;">${escapeHtml(safeSubject)}</p>
        </td></tr>
        <tr><td style="padding:0 36px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;">
            ${rows}
          </table>
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">&copy; ${year} Tech Derby &middot; <a href="${frontendUrl}" style="color:rgba(255,255,255,0.2);">techderby.org</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await strapi.plugin('email').service('email').send({
        to: NOTIFY_TO,
        subject: safeSubject,
        html,
        text: String(text),
      });
      return ctx.send({ ok: true });
    } catch (err) {
      strapi.log.error('[notify] Failed to send notification email:', err);
      return ctx.internalServerError('Failed to send notification email.');
    }
  },
};
