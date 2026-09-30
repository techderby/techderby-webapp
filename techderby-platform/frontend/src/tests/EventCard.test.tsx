import { render, screen } from '@testing-library/react';
import { EventCard } from '../components/EventCard';

describe('EventCard', () => {
  it('renders event details and links to the dynamically generated details page', () => {
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

    expect(screen.getByRole('link', { name: /view details for demo day/i })).toHaveAttribute('href', '/events/demo-day');
  });

  it('links a bespoke event to its custom details page instead of using the standard modal button', () => {
    render(
      <EventCard
        event={{
          id: 2,
          title: 'Pre-Seed Accelerator',
          slug: 'pre-seed-accelerator',
          description: 'An accelerator for early-stage founders.',
          date: '2026-06-20T09:00:00.000Z',
          venue: 'University of Derby',
          detailsPageLink: '/tech-derby-accelerator',
        }}
      />,
    );

    const detailsLink = screen.getByRole('link', { name: /view details for pre-seed accelerator/i });
    expect(detailsLink).toHaveAttribute('href', '/tech-derby-accelerator');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
