import type { Event } from '../types/content';
import { assetUrl } from '../lib/asset-url';
import { formatEventDateTime } from '../lib/event-date';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export function EventCard({ event }: { event: Event }) {
  const dateTimeLabel = formatEventDateTime(event.date);
  const ticketsLink = event.eventRegistrationLink ?? event.registrationLink;
  const detailsLink = event.detailsPageLink ?? `/events/${event.slug}`;
  const shortSummary = event.shortLine ?? event.description;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {event.featuredImage ? (
        <div className="-mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={assetUrl(event.featuredImage)}
            alt=""
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : null}
      <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>

      <p className="mt-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Date and time:</span> {dateTimeLabel}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Venue:</span> {event.venue}
      </p>
      <p className="mt-2 flex-1 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Short summary:</span> {shortSummary}
      </p>

      <div className="mt-4 space-y-2">
        <a
          href={detailsLink}
          target={/^https?:\/\//i.test(detailsLink) ? '_blank' : undefined}
          rel="noreferrer noopener"
          aria-label={`View details for ${event.title}`}
          className="inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100"
        >
          View Details
        </a>

        {ticketsLink ? (
          <a href={ticketsLink} target="_blank" rel="noreferrer noopener" className="block">
            <Button variant="secondary" className="w-full" aria-label={`Get tickets for ${event.title}`}>
              Register
            </Button>
          </a>
        ) : null}
      </div>
    </Card>
  );
}
