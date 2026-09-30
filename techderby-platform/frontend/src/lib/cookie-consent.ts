export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export type ConsentPreferences = {
  version: typeof CONSENT_VERSION;
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

const PRODUCTION_HOSTS = new Set(['techderby.org', 'www.techderby.org', 'lms.techderby.org']);
const ANALYTICS_COOKIE_PREFIXES = ['_ga', '_gid', '_gat'];

function currentHostname() {
  return typeof window === 'undefined' ? 'localhost' : window.location.hostname.toLowerCase();
}

function isHttps() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

export function consentCookieName(hostname = currentHostname()) {
  if (PRODUCTION_HOSTS.has(hostname)) return `td_consent_v${CONSENT_VERSION}`;
  const environment = hostname
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || 'local';
  return `td_consent_${environment}_v${CONSENT_VERSION}`;
}

function consentCookieDomain(hostname = currentHostname()) {
  return PRODUCTION_HOSTS.has(hostname) ? '.techderby.org' : null;
}

function cookieValue(name: string) {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const entry = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : null;
}

function isConsentPreferences(value: unknown): value is ConsentPreferences {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ConsentPreferences>;
  return candidate.version === CONSENT_VERSION
    && candidate.necessary === true
    && typeof candidate.analytics === 'boolean'
    && typeof candidate.updatedAt === 'string'
    && !Number.isNaN(Date.parse(candidate.updatedAt));
}

export function readConsentPreferences(): ConsentPreferences | null {
  const stored = cookieValue(consentCookieName());
  if (!stored) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(stored));
    return isConsentPreferences(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function createConsentPreferences(analytics: boolean): ConsentPreferences {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };
}

export function writeConsentPreferences(preferences: ConsentPreferences) {
  if (typeof document === 'undefined') return;
  const attributes = [
    'Path=/',
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ];
  const domain = consentCookieDomain();
  if (domain) attributes.push(`Domain=${domain}`);
  if (isHttps()) attributes.push('Secure');

  document.cookie = `${consentCookieName()}=${encodeURIComponent(JSON.stringify(preferences))}; ${attributes.join('; ')}`;
}

function expireCookie(name: string, domain?: string) {
  const attributes = ['Path=/', 'Max-Age=0', 'SameSite=Lax'];
  if (domain) attributes.push(`Domain=${domain}`);
  if (isHttps()) attributes.push('Secure');
  document.cookie = `${name}=; ${attributes.join('; ')}`;
}

export function removeAnalyticsCookies() {
  if (typeof document === 'undefined') return;
  const names = document.cookie
    .split(';')
    .map((part) => part.trim().split('=')[0])
    .filter((name) => ANALYTICS_COOKIE_PREFIXES.some((prefix) => name === prefix || name.startsWith(`${prefix}_`)));

  for (const name of names) {
    expireCookie(name);
    expireCookie(name, '.techderby.org');
  }
}
