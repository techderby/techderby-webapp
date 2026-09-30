import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach } from 'vitest';
import { CookieConsentManager } from '../components/CookieConsentManager';
import { ConsentProvider } from '../contexts/ConsentContext';
import { consentCookieName, readConsentPreferences } from '../lib/cookie-consent';

function clearConsentCookie() {
  document.cookie = `${consentCookieName()}=; Path=/; Max-Age=0`;
}

describe('CookieConsentManager', () => {
  beforeEach(clearConsentCookie);

  it('keeps analytics off until the visitor makes a choice', async () => {
    const user = userEvent.setup();
    render(
      <ConsentProvider>
        <CookieConsentManager />
      </ConsentProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Help us improve Tech Derby' })).toBeInTheDocument();
    expect(document.querySelector('#tech-derby-google-analytics')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reject analytics' }));

    expect(screen.queryByRole('heading', { name: 'Help us improve Tech Derby' })).not.toBeInTheDocument();
    expect(readConsentPreferences()?.analytics).toBe(false);
    expect(document.querySelector('#tech-derby-google-analytics')).not.toBeInTheDocument();
  });

  it('lets the visitor choose analytics through the preferences panel', async () => {
    const user = userEvent.setup();
    render(
      <ConsentProvider>
        <CookieConsentManager />
      </ConsentProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Manage preferences' }));
    await user.click(screen.getByRole('checkbox', { name: 'Allow analytics' }));
    await user.click(screen.getByRole('button', { name: 'Save preferences' }));

    expect(readConsentPreferences()?.analytics).toBe(true);
    expect(screen.queryByRole('heading', { name: 'Cookie settings' })).not.toBeInTheDocument();
  });
});
