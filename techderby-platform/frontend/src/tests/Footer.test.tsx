import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { createMailingListSubscription } from '../services/content-service';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, logout: vi.fn() }),
}));

vi.mock('../contexts/ConsentContext', () => ({
  useConsent: () => ({ openPreferences: vi.fn() }),
}));

vi.mock('../lib/analytics', () => ({
  trackAnalyticsEvent: vi.fn(),
}));

vi.mock('../services/content-service', () => ({
  createMailingListSubscription: vi.fn(),
}));

describe('Footer mailing-list signup', () => {
  beforeEach(() => {
    vi.mocked(createMailingListSubscription).mockReset().mockResolvedValue();
  });

  it('requires a category before continuing and saves the selected category', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Footer /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: 'Email address for mailing list' }), 'member@example.com');
    await user.click(screen.getByRole('button', { name: 'Join mailing list' }));

    expect(screen.getByRole('dialog', { name: 'Which best describes you?' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Select a category before continuing.');
    expect(createMailingListSubscription).not.toHaveBeenCalled();

    await user.click(screen.getByRole('radio', { name: 'Students' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(createMailingListSubscription).toHaveBeenCalledWith('member@example.com', 'Students');
    expect(await screen.findByRole('status')).toHaveTextContent('You are on the list.');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('records None when the visitor closes without choosing a category', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Footer /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: 'Email address for mailing list' }), 'later@example.com');
    await user.click(screen.getByRole('button', { name: 'Join mailing list' }));
    await user.click(screen.getByRole('button', { name: 'Close without selecting' }));

    expect(createMailingListSubscription).toHaveBeenCalledWith('later@example.com', 'None');
    expect(await screen.findByRole('status')).toHaveTextContent('You are on the list.');
  });
});
