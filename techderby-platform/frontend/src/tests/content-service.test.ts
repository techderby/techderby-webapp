import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getEvents } = vi.hoisted(() => ({ getEvents: vi.fn() }));

vi.mock('../lib/api', () => ({
  apiClient: { getEvents },
}));

import { fetchEvents } from '../services/content-service';

describe('fetchEvents', () => {
  beforeEach(() => {
    getEvents.mockReset();
  });

  it('normalizes a null featured image without rejecting the events response', async () => {
    getEvents.mockResolvedValue({
      data: {
        data: [{
          id: 1,
          documentId: 'event-1',
          title: 'Restored event',
          slug: 'restored-event',
          featuredImage: null,
          description: 'An event restored from a database backup.',
          date: '2026-08-01T09:00:00.000Z',
          venue: 'Derby',
        }],
      },
    });

    const events = await fetchEvents();

    expect(events.find((event) => event.id === 1)?.featuredImage).toBe('');
  });
});
