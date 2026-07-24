const MEASUREMENT_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim().toUpperCase();
const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;
const GOOGLE_TAG_SCRIPT_ID = 'tech-derby-google-analytics';
const ANALYTICS_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

type AnalyticsParameter = string | number | boolean;
type AnalyticsParameters = Record<string, AnalyticsParameter>;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    __techDerbyConsentModeInitialised?: boolean;
  }
}

let analyticsConsentGranted = false;
let googleTagInitialised = false;
let lastPageViewNavigationKey: string | null = null;

function ensureGtag() {
  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // Google gtag.js expects each command to be queued as the function's
      // Arguments object, matching the official installation snippet.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
  return window.gtag;
}

export function analyticsIsConfigured() {
  return MEASUREMENT_ID_PATTERN.test(MEASUREMENT_ID);
}

export function initialiseGoogleConsentMode() {
  if (typeof window === 'undefined' || window.__techDerbyConsentModeInitialised) return;
  const gtag = ensureGtag();
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.__techDerbyConsentModeInitialised = true;
}

function loadGoogleTag() {
  if (!analyticsIsConfigured() || googleTagInitialised || typeof document === 'undefined') return;
  googleTagInitialised = true;

  const script = document.createElement('script');
  script.id = GOOGLE_TAG_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  const gtag = ensureGtag();
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    cookie_domain: 'auto',
    cookie_expires: ANALYTICS_COOKIE_MAX_AGE_SECONDS,
    cookie_flags: window.location.protocol === 'https:' ? 'SameSite=Lax;Secure' : 'SameSite=Lax',
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export function updateGoogleAnalyticsConsent(granted: boolean) {
  if (typeof window === 'undefined') return;
  initialiseGoogleConsentMode();
  analyticsConsentGranted = granted;
  ensureGtag()('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  if (granted) loadGoogleTag();
}

function safePageUrl(pathname: string) {
  const url = new URL(pathname, window.location.origin);
  url.search = '';
  url.hash = '';
  return url;
}

export function trackPageView(pathname: string, title: string, navigationKey: string) {
  if (!analyticsConsentGranted || !analyticsIsConfigured() || lastPageViewNavigationKey === navigationKey) return false;
  loadGoogleTag();
  lastPageViewNavigationKey = navigationKey;
  const pageUrl = safePageUrl(pathname);
  ensureGtag()('event', 'page_view', {
    page_title: title,
    page_location: pageUrl.toString(),
    page_path: pageUrl.pathname,
    site_area: 'website',
  });
  return true;
}

export function trackAnalyticsEvent(name: string, parameters: AnalyticsParameters = {}) {
  if (!analyticsConsentGranted || !analyticsIsConfigured() || !/^[a-z][a-z0-9_]{0,39}$/.test(name)) return false;
  loadGoogleTag();
  ensureGtag()('event', name, {
    ...parameters,
    site_area: 'website',
  });
  return true;
}
