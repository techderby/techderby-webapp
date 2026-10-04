import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import EventRegistrationPage from '../pages/EventRegistrationPage';
import { createMailingListSubscription } from '../services/content-service';

vi.mock('../hooks/use-content-query', () => ({
  useEvents: () => ({ data: [], isLoading: false, isError: false, error: null }),
}));

vi.mock('../lib/analytics', () => ({
  trackAnalyticsEvent: vi.fn(),
}));

vi.mock('../services/content-service', () => ({
  createMailingListSubscription: vi.fn(),
}));

describe('Event registration mailing-list signup', () => {
  beforeEach(() => {
    vi.mocked(createMailingListSubscription).mockReset().mockResolvedValue();
  });

  it('requires and saves a subscriber category', async () => {
    const user = userEvent.setup();
    render(
      <HelmetProvider>
        <MemoryRouter>
          <EventRegistrationPage />
        </MemoryRouter>
      </HelmetProvider>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'founder@example.com');
    await user.click(screen.getByRole('button', { name: 'Join mailing list' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Select a category before continuing.');
    expect(createMailingListSubscription).not.toHaveBeenCalled();

    await user.click(screen.getByRole('radio', { name: 'Startup Founder' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(createMailingListSubscription).toHaveBeenCalledWith('founder@example.com', 'Startup Founder');
    expect(await screen.findByText('You are on the list. We will send updates and early ticket alerts.')).toBeVisible();
  });

  it('records None when category selection is closed', async () => {
    const user = userEvent.setup();
    render(
      <HelmetProvider>
        <MemoryRouter>
          <EventRegistrationPage />
        </MemoryRouter>
      </HelmetProvider>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'visitor@example.com');
    await user.click(screen.getByRole('button', { name: 'Join mailing list' }));
    await user.click(screen.getByRole('button', { name: 'Close without selecting' }));

    expect(createMailingListSubscription).toHaveBeenCalledWith('visitor@example.com', 'None');
  });
});
