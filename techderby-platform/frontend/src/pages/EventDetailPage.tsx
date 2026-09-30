import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useEvents } from '../hooks/use-content-query';
import { assetUrl } from '../lib/asset-url';
import { formatEventDateTime } from '../lib/event-date';

export default function EventDetailPage() {
  const { slug } = useParams();
  const { data, isLoading } = useEvents();
  const event = useMemo(() => data?.find((item) => item.slug === slug), [data, slug]);

  if (isLoading) {
    return <Section><Container><p className="text-slate-600">Loading event…</p></Container></Section>;
  }

  if (!event) {
    return (
      <Section>
        <Container>
          <p>Event not found.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-slate-50 py-14 md:py-20">
      <PageSeo title={`Tech Derby | ${event.title}`} description={event.description} />
      <Container className="max-w-5xl">
        <Link to="/events" className="text-sm font-semibold text-sky-700 hover:text-sky-800">← Back to events</Link>
        <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {event.featuredImage ? (
            <img src={assetUrl(event.featuredImage)} alt="" className="aspect-[16/7] w-full object-cover" />
          ) : null}
          <div className="p-7 md:p-10">
            {event.theme ? (
              <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
                {event.theme}
              </span>
            ) : null}
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">{event.title}</h1>
            {event.shortLine ? <p className="mt-4 text-lg text-slate-600">{event.shortLine}</p> : null}

            <div className="mt-7 grid gap-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2">
              <p><span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Date and time</span>{formatEventDateTime(event.date)}</p>
              <p><span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Venue</span>{event.venue}</p>
            </div>

            <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{event.description}</div>

            {event.agenda || (event.agendaItems?.length ?? 0) > 0 ? (
              <section className="mt-9 border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-black text-slate-900">Agenda</h2>
                {event.agenda ? (
                  <div className="mt-4 whitespace-pre-line leading-7 text-slate-700">{event.agenda}</div>
                ) : (
                  <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-slate-700">
                    {event.agendaItems?.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </section>
            ) : null}

            {(event.speakerCards?.length ?? 0) > 0 || (event.speakers?.length ?? 0) > 0 ? (
              <section className="mt-9 border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-black text-slate-900">Speakers</h2>
                {(event.speakerCards?.length ?? 0) > 0 ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {event.speakerCards?.map((speaker, index) => (
                      <article key={`${speaker.name}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h3 className="font-bold text-slate-900">{speaker.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{speaker.role}, {speaker.organisation}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-700">{speaker.credibilityLine}</p>
                        <p className="mt-3 text-sm text-slate-700"><strong>Talk:</strong> {speaker.talkTitle}</p>
                        {speaker.outcomes.length > 0 ? (
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {speaker.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                          </ul>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
                    {event.speakers?.map((speaker) => <li key={speaker}>{speaker}</li>)}
                  </ul>
                )}
              </section>
            ) : null}

            <section className="mt-9 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-black text-slate-900">Accessibility and inclusion</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                We want everyone to feel welcome and safe. If you have access needs, tell us when you register or email
                hello@techderby.org and we will do our best to support you.
              </p>
            </section>

            {event.detailsPageLink ? (
              <a
                href={event.detailsPageLink}
                target={/^https?:\/\//i.test(event.detailsPageLink) ? '_blank' : undefined}
                rel="noreferrer noopener"
                className="mt-9 inline-flex rounded-xl bg-sky-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-800"
              >
                View the full event page
              </a>
            ) : null}

            {event.eventRegistrationLink || event.registrationLink ? (
              <a
                href={event.eventRegistrationLink ?? event.registrationLink ?? '#'}
                target="_blank"
                rel="noreferrer noopener"
                className={`mt-9 inline-flex rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 ${event.detailsPageLink ? 'sm:ml-3' : ''}`}
              >
                Register for this event
              </a>
            ) : null}
          </div>
        </article>
      </Container>
    </Section>
  );
}
