import { useMemo, useState } from 'react';
import type { Event } from '../types/content';
import { assetUrl } from '../lib/asset-url';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineMarkdown(value: string) {
  const escaped = escapeHtml(value);
  return escaped
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-sky-700 hover:underline" target="_blank" rel="noreferrer noopener">$1</a>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-800">$1</code>');
}

function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      output.push(`<h${level} class="mt-3 text-slate-900 font-bold">${inlineMarkdown(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      output.push('<ul class="list-disc space-y-1 pl-5 text-sm text-slate-700 marker:text-slate-500">');
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        output.push(`<li>${inlineMarkdown(lines[i].trim().replace(/^[-*+]\s+/, ''))}</li>`);
        i++;
      }
      output.push('</ul>');
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      output.push('<ol class="list-decimal space-y-1 pl-5 text-sm text-slate-700 marker:text-slate-500">');
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        output.push(`<li>${inlineMarkdown(lines[i].trim().replace(/^\d+\.\s+/, ''))}</li>`);
        i++;
      }
      output.push('</ol>');
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^#{1,6}\s+/.test(lines[i].trim()) && !/^[-*+]\s+/.test(lines[i].trim()) && !/^\d+\.\s+/.test(lines[i].trim())) {
      paragraph.push(inlineMarkdown(lines[i].trim()));
      i++;
    }
    output.push(`<p class="text-sm leading-relaxed text-slate-700">${paragraph.join(' ')}</p>`);
  }

  return output.join('\n');
}

function renderAgendaContent(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  // Treat richtext HTML from CMS as already-formatted content.
  if (/<(p|h[1-6]|ul|ol|li|div|blockquote|br)(\s[^>]*)?>/i.test(trimmed)) {
    return trimmed;
  }

  return markdownToHtml(trimmed);
}

export function EventCard({ event }: { event: Event }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const eventDate = new Date(event.date);
  const dateTimeLabel = `${eventDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}, ${eventDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  const ticketsLink = event.eventRegistrationLink ?? event.registrationLink;
  const shortSummary = event.shortLine ?? event.description;
  const agendaItems = useMemo(() => {
    if (event.agendaItems && event.agendaItems.length > 0) {
      return event.agendaItems;
    }

    if (event.agenda && event.agenda.trim().length > 0) {
      const plainAgenda = stripHtml(event.agenda);
      return plainAgenda
        .split(/\n|\r|\.|;/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    return [];
  }, [event.agenda, event.agendaItems]);
  const renderedAgenda = useMemo(() => renderAgendaContent(event.agenda ?? ''), [event.agenda]);

  const speakerCards = event.speakerCards ?? [];

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
      <p className="mt-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Short summary:</span> {shortSummary}
      </p>

      <div className="mt-4 space-y-2">
        {ticketsLink ? (
          <a href={ticketsLink} target="_blank" rel="noreferrer noopener" className="block">
            <Button variant="secondary" className="w-full" aria-label={`Get tickets for ${event.title}`}>
              Tickets
            </Button>
          </a>
        ) : (
          <p className="text-sm text-slate-500">Tickets unavailable</p>
        )}

        <Button
          variant="ghost"
          className="w-full border border-slate-300 bg-white"
          aria-label={`View details for ${event.title}`}
          onClick={() => setIsModalOpen(true)}
        >
          View Details
        </Button>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby={`event-modal-title-${event.id}`}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-7">
            {event.featuredImage ? (
              <img
                src={assetUrl(event.featuredImage)}
                alt=""
                className="mb-6 aspect-[16/7] w-full rounded-xl object-cover"
              />
            ) : null}
            <div className="mb-5 flex items-start justify-between gap-4">
              <h3 id={`event-modal-title-${event.id}`} className="text-2xl font-bold text-slate-900">
                {event.title} details
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Title:</span> {event.title}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Date and time:</span> {dateTimeLabel}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Venue:</span> {event.venue}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Short summary:</span> {shortSummary}
              </p>
              <div className="pt-1">
                <span className="font-semibold text-slate-900">Tickets:</span>{' '}
                {ticketsLink ? (
                  <a href={ticketsLink} target="_blank" rel="noreferrer noopener" className="text-primary underline">
                    Book tickets
                  </a>
                ) : (
                  <span>Unavailable</span>
                )}
              </div>
            </div>

            <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-lg font-bold text-slate-900">Agenda</h4>
              {renderedAgenda ? (
                <div
                  className="mt-3 space-y-2 [&_a]:text-sky-700 [&_a:hover]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: renderedAgenda }}
                />
              ) : agendaItems.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 marker:text-slate-500">
                  {agendaItems.map((agendaItem) => (
                    <li key={agendaItem}>{agendaItem}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Agenda will be published soon.</p>
              )}
            </section>

            <section className="mt-6">
              <h4 className="text-lg font-bold text-slate-900">Speakers</h4>

              {speakerCards.length > 0 ? (
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {speakerCards.map((speakerCard, index) => (
                    <article key={`${speakerCard.name}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
                      <h5 className="text-base font-bold text-slate-900">{speakerCard.name}</h5>
                      <p className="mt-1 text-sm text-slate-600">
                        {speakerCard.role}, {speakerCard.organisation}
                      </p>
                      <p className="mt-2 text-sm text-slate-700">{speakerCard.credibilityLine}</p>
                      <p className="mt-2 text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">Talk title:</span> {speakerCard.talkTitle}
                      </p>
                      {speakerCard.outcomes.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 marker:text-slate-500">
                          {speakerCard.outcomes.map((outcome) => (
                            <li key={outcome}>{outcome}</li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Speaker details will be published soon.</p>
              )}
            </section>

            <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-lg font-bold text-slate-900">Accessibility and inclusion</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                We want everyone to feel welcome and safe. If you have access needs (mobility, hearing, sensory,
                prayer, dietary), tell us when you book or email hello@techderby.org and we will do our best to support
                you.
              </p>
            </section>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
