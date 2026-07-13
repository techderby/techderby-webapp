import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useEvents } from '../hooks/use-content-query';
import { assetUrl } from '../lib/asset-url';

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
              <p><span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Date and time</span>{new Date(event.date).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
              <p><span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Venue</span>{event.venue}</p>
            </div>

            <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{event.description}</div>

            {event.agenda ? (
              <section className="mt-9 border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-black text-slate-900">Agenda</h2>
                <div className="mt-4 whitespace-pre-line leading-7 text-slate-700">{event.agenda}</div>
              </section>
            ) : null}

            {event.eventRegistrationLink || event.registrationLink ? (
              <a
                href={event.eventRegistrationLink ?? event.registrationLink ?? '#'}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-9 inline-flex rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
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
