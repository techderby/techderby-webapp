import { beforeEach } from 'vitest';
import {
  consentCookieName,
  createConsentPreferences,
  readConsentPreferences,
  removeAnalyticsCookies,
  writeConsentPreferences,
} from '../lib/cookie-consent';

function clearCookies() {
  for (const entry of document.cookie.split(';')) {
    const name = entry.trim().split('=')[0];
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
  }
}

describe('cookie consent storage', () => {
  beforeEach(clearCookies);

  it('stores and validates a versioned analytics preference', () => {
    const preferences = createConsentPreferences(true);
    writeConsentPreferences(preferences);

    expect(document.cookie).toContain(`${consentCookieName()}=`);
    expect(readConsentPreferences()).toEqual(preferences);
  });

  it('ignores malformed preference values', () => {
    document.cookie = `${consentCookieName()}=${encodeURIComponent('{"analytics":"yes"}')}; Path=/`;

    expect(readConsentPreferences()).toBeNull();
  });

  it('removes accessible Google Analytics cookies without removing consent', () => {
    writeConsentPreferences(createConsentPreferences(false));
    document.cookie = '_ga=test-client; Path=/';
    document.cookie = '_ga_TEST=test-session; Path=/';
    document.cookie = 'unrelated=value; Path=/';

    removeAnalyticsCookies();

    expect(document.cookie).not.toContain('_ga=');
    expect(document.cookie).not.toContain('_ga_TEST=');
    expect(document.cookie).toContain(`${consentCookieName()}=`);
    expect(document.cookie).toContain('unrelated=value');
  });
});
