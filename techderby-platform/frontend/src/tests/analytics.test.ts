import { afterEach, beforeEach, vi } from 'vitest';

function resetBrowserAnalytics() {
  document.querySelector('#tech-derby-google-analytics')?.remove();
  delete window.dataLayer;
  delete window.gtag;
  delete window.__techDerbyConsentModeInitialised;
}

function commands() {
  return (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
}

describe('Google Analytics', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TECHDERBY1');
    resetBrowserAnalytics();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetBrowserAnalytics();
  });

  it('defaults every analytics and advertising consent signal to denied', async () => {
    const { initialiseGoogleConsentMode } = await import('../lib/analytics');

    initialiseGoogleConsentMode();

    expect(commands()[0]).toEqual([
      'consent',
      'default',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ]);
    expect(document.querySelector('#tech-derby-google-analytics')).not.toBeInTheDocument();
  });

  it('loads the Google tag and records one sanitised page view only after consent', async () => {
    const analytics = await import('../lib/analytics');
    analytics.initialiseGoogleConsentMode();

    expect(analytics.trackPageView('/wire/article?token=secret', 'Article', 'navigation-1')).toBe(false);
    analytics.updateGoogleAnalyticsConsent(true);
    expect(document.querySelector<HTMLScriptElement>('#tech-derby-google-analytics')?.src).toContain('G-TECHDERBY1');

    expect(analytics.trackPageView('/wire/article?token=secret', 'Article', 'navigation-1')).toBe(true);
    expect(analytics.trackPageView('/wire/article?token=secret', 'Article', 'navigation-1')).toBe(false);

    const pageView = commands().find((command) => command[0] === 'event' && command[1] === 'page_view');
    expect(pageView?.[2]).toMatchObject({
      page_title: 'Article',
      page_location: 'http://localhost:3000/wire/article',
      site_area: 'website',
    });
    expect(JSON.stringify(pageView)).not.toContain('secret');
  });
});
