import crypto from 'crypto';

export type MailingListRecipient = {
  id: number;
  email: string;
};

const TOKEN_PATTERN = /^(\d+)\.([A-Za-z0-9_-]{32,})$/;

function normaliseEmail(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function tokenSecret() {
  const appKey = String(process.env.APP_KEYS ?? '').split(',').map((value) => value.trim()).find(Boolean);
  const secret = process.env.UNSUBSCRIBE_TOKEN_SECRET ?? appKey ?? process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Set UNSUBSCRIBE_TOKEN_SECRET (or APP_KEYS) before sending mailing-list emails.');
  }
  return secret;
}

function signatureFor(recipient: MailingListRecipient) {
  return crypto
    .createHmac('sha256', tokenSecret())
    .update(`${recipient.id}:${normaliseEmail(recipient.email)}`)
    .digest('base64url');
}

export function createUnsubscribeToken(recipient: MailingListRecipient) {
  return `${recipient.id}.${signatureFor(recipient)}`;
}

export function subscriptionIdFromToken(token: unknown) {
  const match = String(token ?? '').trim().match(TOKEN_PATTERN);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function isValidUnsubscribeToken(token: unknown, recipient: MailingListRecipient) {
  const supplied = String(token ?? '').trim();
  const expected = createUnsubscribeToken(recipient);
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export function unsubscribeLinks(recipient: MailingListRecipient) {
  const frontendUrl = (process.env.PUBLIC_FRONTEND_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const backendUrl = (process.env.PUBLIC_BACKEND_URL ?? 'http://localhost:1337').replace(/\/$/, '');
  const token = encodeURIComponent(createUnsubscribeToken(recipient));

  return {
    confirmation: `${frontendUrl}/unsubscribe?token=${token}`,
    oneClick: `${backendUrl}/api/mailing-list-subscriptions/unsubscribe/${token}/one-click`,
  };
}

export function unsubscribeHeaders(recipient: MailingListRecipient) {
  const { oneClick } = unsubscribeLinks(recipient);
  return {
    'List-Unsubscribe': `<${oneClick}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}
