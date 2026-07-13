import nodemailer from 'nodemailer';

type EventRecord = {
  id: number;
  title?: string;
  date?: string;
  venue?: string;
  shortLine?: string | null;
  description?: string;
  eventRegistrationLink?: string | null;
  registrationLink?: string | null;
  featuredImage?: string | null;
  slug?: string | null;
  publishedAt?: string | null;
  mailingListNotifiedAt?: string | null;
};

function parseDate(date?: string) {
  if (!date) return null;

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatEventDate(date?: string) {
  const parsed = parseDate(date);
  if (!parsed) return 'Date to be confirmed';

  return parsed.toLocaleDateString('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatEventTime(date?: string) {
  const parsed = parseDate(date);
  if (!parsed) return 'Time to be confirmed';

  return parsed.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function absoluteSiteUrl(value: string, baseUrl: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
}

function getEventLink(event: EventRecord) {
  const publicFrontendUrl = process.env.PUBLIC_FRONTEND_URL ?? 'http://localhost:3000';
  const registrationLink = event.eventRegistrationLink ?? event.registrationLink;
  if (registrationLink) return absoluteSiteUrl(registrationLink, publicFrontendUrl);

  const eventPath = event.slug ? `/events/${event.slug}` : '/events';
  return absoluteSiteUrl(eventPath, publicFrontendUrl);
}

function emailImages(event: EventRecord) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  const attachments: Array<Record<string, unknown>> = [];

  const logoPath = path.join(strapi.dirs.static.public, 'techderbywhitelogo.webp');
  const logoSource = fs.existsSync(logoPath) ? 'cid:techderby-logo' : '';
  if (logoSource) {
    attachments.push({
      filename: 'techderby-logo.webp',
      path: logoPath,
      cid: 'techderby-logo',
      contentType: 'image/webp',
    });
  }

  let eventImageSource = '';
  const imagePath = event.featuredImage ?? '';
  if (imagePath.startsWith('/uploads/events/')) {
    const filename = path.basename(imagePath);
    const localImagePath = path.join(strapi.dirs.static.public, 'uploads', 'events', filename);
    if (fs.existsSync(localImagePath)) {
      const extension = path.extname(filename).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
      };
      attachments.push({
        filename,
        path: localImagePath,
        cid: 'techderby-event-image',
        contentType: contentTypes[extension] ?? 'application/octet-stream',
      });
      eventImageSource = 'cid:techderby-event-image';
    }
  } else if (/^https?:\/\//i.test(imagePath)) {
    eventImageSource = imagePath;
  }

  return { attachments, logoSource, eventImageSource };
}

type EventNotificationKind = 'new' | 'updated';

async function sendPublishNotification(
  event: EventRecord,
  recipients: string[],
  kind: EventNotificationKind = 'new',
) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? '587');
  const secure = String(process.env.SMTP_SECURE ?? 'false').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? 'Tech Derby <hello@techderby.org>';

  if (!host || !user || !pass) {
    strapi.log.warn('Event publish notification skipped: SMTP settings are incomplete.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const eventTitle = event.title ?? 'New Tech Derby event';
  const eventDate = formatEventDate(event.date);
  const eventTime = formatEventTime(event.date);
  const eventVenue = event.venue ?? 'TBC';
  const eventSummary = event.shortLine ?? event.description ?? 'A new Tech Derby event has been published.';
  const eventLink = getEventLink(event);
  const publicFrontendUrl = (process.env.PUBLIC_FRONTEND_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const { attachments, logoSource, eventImageSource } = emailImages(event);
  const isUpdate = kind === 'updated';
  const announcementLabel = isUpdate ? 'Event update' : 'New Tech Derby event';

  const text = [
    isUpdate
      ? `A Tech Derby event has been updated: ${eventTitle}`
      : `A new Tech Derby event is now live: ${eventTitle}`,
    '',
    `Date: ${eventDate}`,
    `Time: ${eventTime}`,
    `Venue: ${eventVenue}`,
    `Summary: ${eventSummary}`,
    `Tickets: ${eventLink}`,
    '',
    'See you there!',
    'Tech Derby',
  ].join('\n');

  const safeTitle = escapeHtml(eventTitle);
  const safeDate = escapeHtml(eventDate);
  const safeTime = escapeHtml(eventTime);
  const safeVenue = escapeHtml(eventVenue);
  const safeSummary = escapeHtml(eventSummary).replace(/\r?\n/g, '<br>');
  const safeEventLink = escapeHtml(eventLink);
  const safeSiteUrl = escapeHtml(publicFrontendUrl);
  const safeImageSource = escapeHtml(eventImageSource);

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${safeTitle}</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-shell { width: 100% !important; }
      .email-padding { padding-left: 22px !important; padding-right: 22px !important; }
      .detail-cell { display: block !important; width: 100% !important; padding: 0 0 16px !important; }
      .headline { font-size: 28px !important; line-height: 34px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,'Helvetica Neue',sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${safeTitle} — ${safeDate} at ${safeTime}.
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#eef2f7;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" class="email-shell" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 36px rgba(15,23,42,.12);">
          <tr>
            <td style="height:5px;background:#0ea5e9;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td class="email-padding" style="padding:28px 38px;background:#0f172a;">
              ${logoSource
                ? `<a href="${safeSiteUrl}" style="text-decoration:none;"><img src="${logoSource}" width="150" alt="Tech Derby" style="display:block;width:150px;max-width:100%;height:auto;border:0;"></a>`
                : `<a href="${safeSiteUrl}" style="color:#ffffff;text-decoration:none;font-size:24px;font-weight:800;">Tech Derby</a>`}
            </td>
          </tr>
          ${eventImageSource ? `<tr>
            <td style="background:#111827;">
              <img src="${safeImageSource}" width="600" alt="${safeTitle}" style="display:block;width:100%;height:auto;max-height:330px;object-fit:cover;border:0;">
            </td>
          </tr>` : ''}
          <tr>
            <td class="email-padding" style="padding:38px 38px 18px;">
              <p style="margin:0 0 12px;color:#0284c7;font-size:12px;line-height:18px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase;">${announcementLabel}</p>
              <h1 class="headline" style="margin:0;color:#0f172a;font-size:36px;line-height:43px;font-weight:800;letter-spacing:-.7px;">${safeTitle}</h1>
              <p style="margin:18px 0 0;color:#475569;font-size:16px;line-height:26px;">${safeSummary}</p>
            </td>
          </tr>
          <tr>
            <td class="email-padding" style="padding:14px 38px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
                <tr>
                  <td class="detail-cell" width="50%" valign="top" style="padding:22px 12px 22px 22px;">
                    <p style="margin:0 0 6px;color:#0284c7;font-size:11px;line-height:16px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">Date &amp; time</p>
                    <p style="margin:0;color:#0f172a;font-size:15px;line-height:23px;font-weight:700;">${safeDate}</p>
                    <p style="margin:2px 0 0;color:#475569;font-size:14px;line-height:21px;">${safeTime}</p>
                  </td>
                  <td class="detail-cell" width="50%" valign="top" style="padding:22px 22px 22px 12px;">
                    <p style="margin:0 0 6px;color:#f97316;font-size:11px;line-height:16px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">Venue</p>
                    <p style="margin:0;color:#0f172a;font-size:15px;line-height:23px;font-weight:700;">${safeVenue}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-padding" style="padding:24px 38px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td bgcolor="#f97316" style="border-radius:10px;">
                    <a href="${safeEventLink}" style="display:inline-block;padding:14px 25px;color:#ffffff;text-decoration:none;font-size:15px;line-height:20px;font-weight:800;">View event &amp; register&nbsp;&nbsp;&rarr;</a>
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0;color:#94a3b8;font-size:12px;line-height:19px;">If the button does not work, copy this link:<br><a href="${safeEventLink}" style="color:#0284c7;word-break:break-all;">${safeEventLink}</a></p>
            </td>
          </tr>
          <tr>
            <td class="email-padding" style="padding:26px 38px;background:#0f172a;">
              <p style="margin:0 0 8px;color:#ffffff;font-size:14px;line-height:21px;font-weight:700;">Learn. Connect. Build Derby's tech future.</p>
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:19px;">You received this email because you joined the Tech Derby mailing list.</p>
              <p style="margin:10px 0 0;color:#64748b;font-size:12px;line-height:18px;">&copy; ${new Date().getFullYear()} Tech Derby &middot; <a href="${safeSiteUrl}" style="color:#38bdf8;text-decoration:none;">Visit our website</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Use BCC to avoid exposing subscribers' email addresses.
  await transporter.sendMail({
    from,
    to: from,
    bcc: recipients,
    subject: isUpdate ? `Event updated: ${eventTitle}` : `You're invited: ${eventTitle}`,
    text,
    html,
    attachments,
  });

  return true;
}

export async function notifyEventSubscribers(
  eventResult: EventRecord,
  options: { shouldNotify: boolean; force?: boolean; kind?: EventNotificationKind },
) {
  const { shouldNotify, force = false, kind = 'new' } = options;
  if (!shouldNotify) return;
  if (!eventResult?.id) return;
  if (!eventResult.publishedAt) return;
  if (!force && eventResult.mailingListNotifiedAt) return;

  const subscribers = await strapi.db
    .query('api::mailing-list-subscription.mailing-list-subscription')
    .findMany({ select: ['email'] });

  const recipients = subscribers
    .map((subscriber: { email?: string }) => subscriber.email?.trim())
    .filter((email: string | undefined): email is string => Boolean(email));

  if (recipients.length === 0) {
    strapi.log.info('Event publish notification skipped: no mailing list subscribers found.');
    return;
  }

  try {
    const sent = await sendPublishNotification(eventResult, recipients, kind);
    if (!sent) return;

    await strapi.db.query('api::event.event').update({
      where: { id: eventResult.id },
      data: { mailingListNotifiedAt: new Date().toISOString() },
    });

    strapi.log.info(`Event publish notification sent for event ${eventResult.id} to ${recipients.length} subscribers.`);
  } catch (error) {
    strapi.log.error(`Failed to send event publish notification for event ${eventResult.id}: ${String(error)}`);
  }
}

export default {
  async afterCreate(event: { result?: EventRecord }) {
    await notifyEventSubscribers(event.result as EventRecord, { shouldNotify: true });
  },

  async beforeUpdate(event: { params?: { where?: { id?: number } }; state?: { wasPublished?: boolean } }) {
    const eventId = event.params?.where?.id;
    if (!eventId) return;

    const existing = (await strapi.db.query('api::event.event').findOne({
      where: { id: eventId },
      select: ['publishedAt'],
    })) as { publishedAt?: string | null } | null;

    if (!event.state) event.state = {};
    event.state.wasPublished = Boolean(existing?.publishedAt);
  },

  async afterUpdate(event: { result?: EventRecord; state?: { wasPublished?: boolean } }) {
    const isNowPublished = Boolean(event.result?.publishedAt);
    const wasPublished = Boolean(event.state?.wasPublished);

    await notifyEventSubscribers(event.result as EventRecord, {
      shouldNotify: isNowPublished && !wasPublished,
    });
  },
};
