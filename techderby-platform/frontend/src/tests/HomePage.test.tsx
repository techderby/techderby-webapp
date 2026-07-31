import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { useEvents } from '../hooks/use-content-query';
import HomePage from '../pages/HomePage';

vi.mock('../hooks/use-content-query', () => ({
  useEvents: vi.fn(),
}));

describe('HomePage', () => {
  it('uses the next event date from the CMS in the hero badge', () => {
    vi.mocked(useEvents).mockReturnValue({
      data: [
        {
          id: 17,
          title: 'August Tech Meet-Up',
          slug: 'august-tech-meet-up',
          description: 'Tech Derby August meetup',
          date: '2026-08-21T00:00:00.000Z',
          venue: 'Game Changer Lab',
          eventSource: 'tech-derby',
          registrationLink: 'https://example.com/register',
        },
      ],
    } as ReturnType<typeof useEvents>);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>,
    );

    expect(screen.getByText('Next event — 21 August')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next event — 21 August/ })).toBeInTheDocument();
    expect(screen.queryByText(/June 15/)).not.toBeInTheDocument();
  });
});
