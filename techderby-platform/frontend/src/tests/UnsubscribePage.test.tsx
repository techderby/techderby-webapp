import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import UnsubscribePage from '../pages/UnsubscribePage';
import { apiClient } from '../lib/api';

vi.mock('../lib/api', () => ({
  apiClient: {
    getMailingListUnsubscribeDetails: vi.fn(),
    unsubscribeFromMailingList: vi.fn(),
  },
}));

const mockedApi = vi.mocked(apiClient);

describe('UnsubscribePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prepopulates the recipient email and records their reason', async () => {
    mockedApi.getMailingListUnsubscribeDetails.mockResolvedValue({
      data: { email: 'member@example.com', status: 'subscribed', unsubscribedAt: null },
    } as never);
    mockedApi.unsubscribeFromMailingList.mockResolvedValue({
      data: { unsubscribed: true },
    } as never);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/unsubscribe?token=123.signed-token-value']}>
        <UnsubscribePage />
      </MemoryRouter>,
    );

    expect(await screen.findByDisplayValue('member@example.com')).toHaveAttribute('readonly');
    await user.selectOptions(screen.getByLabelText('Why are you unsubscribing?'), 'content-not-relevant');
    await user.type(screen.getByLabelText(/Additional feedback/), 'I only want local engineering events.');
    await user.click(screen.getByRole('button', { name: 'Confirm unsubscribe' }));

    expect(mockedApi.unsubscribeFromMailingList).toHaveBeenCalledWith(
      '123.signed-token-value',
      'content-not-relevant',
      'I only want local engineering events.',
    );
    expect(await screen.findByRole('heading', { name: 'You have been unsubscribed' })).toBeInTheDocument();
  });

  it('shows a safe error when the token is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/unsubscribe']}>
        <UnsubscribePage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'We could not open this link' })).toBeInTheDocument();
    expect(mockedApi.getMailingListUnsubscribeDetails).not.toHaveBeenCalled();
  });
});
