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
  publishedAt?: string | null;
  mailingListNotifiedAt?: string | null;
};

function formatDateTime(date?: string) {
  if (!date) return 'TBC';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'TBC';

  return parsed.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getEventLink(event: EventRecord) {
  const registrationLink = event.eventRegistrationLink ?? event.registrationLink;
  if (registrationLink) return registrationLink;

  const publicFrontendUrl = process.env.PUBLIC_FRONTEND_URL ?? 'http://localhost:3000';
  return `${publicFrontendUrl.replace(/\/$/, '')}/events`;
}

async function sendPublishNotification(event: EventRecord, recipients: string[]) {
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
  const eventDateTime = formatDateTime(event.date);
  const eventVenue = event.venue ?? 'TBC';
  const eventSummary = event.shortLine ?? event.description ?? 'A new Tech Derby event has been published.';
  const eventLink = getEventLink(event);

  const text = [
    `A new Tech Derby event is now live: ${eventTitle}`,
    '',
    `Date and time: ${eventDateTime}`,
    `Venue: ${eventVenue}`,
    `Summary: ${eventSummary}`,
    `Tickets: ${eventLink}`,
    '',
    'See you there!',
    'Tech Derby',
  ].join('\n');

  // Use BCC to avoid exposing subscribers' email addresses.
  await transporter.sendMail({
    from,
    to: from,
    bcc: recipients,
    subject: `New Event Published: ${eventTitle}`,
    text,
  });

  return true;
}

async function notifySubscribersIfNeeded(eventResult: EventRecord, shouldNotify: boolean) {
  if (!shouldNotify) return;
  if (!eventResult?.id) return;
  if (!eventResult.publishedAt) return;
  if (eventResult.mailingListNotifiedAt) return;

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
    const sent = await sendPublishNotification(eventResult, recipients);
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
    await notifySubscribersIfNeeded(event.result as EventRecord, true);
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

    await notifySubscribersIfNeeded(event.result as EventRecord, isNowPublished && !wasPublished);
  },
};
