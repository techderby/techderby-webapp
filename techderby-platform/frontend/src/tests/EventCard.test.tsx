import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCard } from '../components/EventCard';

describe('EventCard', () => {
  it('renders event details and opens the details modal', async () => {
    const user = userEvent.setup();

    render(
      <EventCard
        event={{
          id: 1,
          title: 'Demo Day',
          slug: 'demo-day',
          description: 'Pitch and showcase',
          shortLine: 'Quick demos from local founders',
          date: '2026-04-20T18:00:00.000Z',
          venue: 'Derby Hub',
          registrationLink: 'https://example.com/tickets',
          agendaItems: ['17:00 - Doors open', '17:30 - Keynote'],
          speakerCards: [
            {
              name: 'Alex Smith',
              role: 'Engineering Lead',
              organisation: 'Tech Derby',
              credibilityLine: '10 years building startup engineering teams.',
              talkTitle: 'Building products with small teams',
              outcomes: ['How to scope features', 'How to run faster feedback loops'],
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Demo Day')).toBeInTheDocument();
    expect(screen.getByText(/date and time:/i)).toBeInTheDocument();
    expect(screen.getByText(/venue:/i)).toBeInTheDocument();
    expect(screen.getByText(/short summary:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get tickets for demo day/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /view details for demo day/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/agenda/i)).toBeInTheDocument();
    expect(screen.getByText(/17:00 - Doors open/i)).toBeInTheDocument();
    expect(screen.getByText(/speakers/i)).toBeInTheDocument();
    expect(screen.getByText(/alex smith/i)).toBeInTheDocument();
    expect(screen.getByText(/accessibility and inclusion/i)).toBeInTheDocument();
    expect(screen.getByText(/we want everyone to feel welcome and safe/i)).toBeInTheDocument();
    expect(screen.queryByText(/after-event recap template/i)).not.toBeInTheDocument();
  });
});
