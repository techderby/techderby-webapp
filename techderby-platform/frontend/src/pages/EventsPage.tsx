import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useEvents } from '../hooks/use-content-query';
import { assetUrl } from '../lib/asset-url';

const eventCategories = [
  {
    title: 'Community Meetups',
    purpose: 'Informal but purposeful gatherings that connect local talent through discussion, networking, and shared insight.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Founder Sessions',
    purpose: 'Events focused on startup journeys, product thinking, validation, growth, funding, and founder resilience.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      </svg>
    ),
  },
  {
    title: 'Careers & Skills Events',
    purpose: 'Sessions that help students, graduates, and career switchers understand pathways into digital roles.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    title: 'Special Ecosystem Events',
    purpose: 'Larger showcases, panels, and collaborations with partners across business, education, and community.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const whyAttend = [
  {
    text: 'Meet the right people — founders, professionals, students, employers, and collaborators in one growing regional community.',
  },
  {
    text: 'Learn something useful — leave with fresh insight, practical ideas, and a clearer sense of what comes next.',
  },
  {
    text: 'Stay close to opportunity — be part of a local ecosystem where ideas, roles, partnerships, and programmes take shape.',
  },
];

function isTechDerbyEvent(eventSource?: string | null) {
  const normalizedSource = (eventSource ?? 'tech-derby').toLowerCase().trim();
  return normalizedSource === 'tech-derby' || normalizedSource === 'tech derby' || normalizedSource === 'techderby';
}

export default function EventsPage() {
  const { data } = useEvents();
  const allEvents = data ?? [];

  const now = new Date();

  const upcomingTechDerby = useMemo(
    () =>
      allEvents
        .filter((e) => isTechDerbyEvent(e.eventSource) && !Number.isNaN(new Date(e.date).getTime()) && new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allEvents],
  );

  const pastTechDerby = useMemo(
    () =>
      allEvents
        .filter((e) => isTechDerbyEvent(e.eventSource) && !Number.isNaN(new Date(e.date).getTime()) && new Date(e.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allEvents],
  );

  const featuredEvent = upcomingTechDerby[0] ?? null;
  const nextEvents = upcomingTechDerby.slice(1, 4);

  return (
    <>
      <PageSeo
        title="Tech Derby Events | Where Derby's tech community comes together"
        description="From meetups and founder conversations to workshops and ecosystem gatherings, Tech Derby events create space for learning, connection, and fresh opportunities."
      />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Tech Derby Events
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Where Derby's tech
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                community comes together.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              From meetups and founder conversations to workshops, talks and ecosystem gatherings, Tech Derby events
              create space for learning, connection and fresh opportunities across Derby and the East Midlands.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/events/browse">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  See Upcoming Events
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/30 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── INTRO ── */}
      <Section className="border-b border-slate-200 bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              More than events. Moments that move the ecosystem forward.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
              Tech Derby events are designed to bring people together in meaningful ways. Some are built to spark ideas.
              Some are built to build confidence. Some are built to connect founders, students, professionals, and
              partners across the region. Whether someone is exploring a career in tech, building a startup, growing a
              network, or looking to support local innovation — there is a place for them in the story.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── FEATURED EVENT ── */}
      {featuredEvent && (
        <Section className="border-b border-slate-200 bg-slate-50 py-16 md:py-20">
          <Container>
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Featured Event</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Featured Event</h2>
              </div>

              <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="grid md:grid-cols-[1fr_1.6fr]">
                  <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-slate-900 p-10 md:p-14">
                    {featuredEvent.featuredImage ? (
                      <>
                        <img src={assetUrl(featuredEvent.featuredImage)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/65" />
                      </>
                    ) : null}
                    <div className="relative text-center">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">Next Event</p>
                      <p className="mt-3 text-2xl font-black text-white md:text-3xl">
                        {new Date(featuredEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="mt-2 text-base text-white/70">{featuredEvent.venue}</p>
                    </div>
                  </div>
                  <div className="p-8 md:p-10">
                    <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                      A welcoming community gathering for founders, students, professionals, employers and the tech-curious.
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-slate-900 md:text-3xl">{featuredEvent.title}</h3>
                    {featuredEvent.shortLine && (
                      <p className="mt-3 text-base leading-relaxed text-slate-600">{featuredEvent.shortLine}</p>
                    )}
                    {!featuredEvent.shortLine && (
                      <p className="mt-3 text-base leading-relaxed text-slate-600">{featuredEvent.description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-sky-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {new Date(featuredEvent.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-sky-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        {featuredEvent.venue}
                      </span>
                    </div>
                    <div className="mt-6">
                      {featuredEvent.registrationLink || featuredEvent.eventRegistrationLink ? (
                        <a
                          href={featuredEvent.registrationLink ?? featuredEvent.eventRegistrationLink ?? '#'}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <Button className="rounded-full px-7 text-sm shadow-lg shadow-orange-900/30">
                            Register Now
                          </Button>
                        </a>
                      ) : (
                        <Link to={`/events/${featuredEvent.slug}`}>
                          <Button className="rounded-full px-7 text-sm shadow-lg shadow-orange-900/30">
                            View Event Details
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ── UPCOMING EVENTS ── */}
      {nextEvents.length > 0 && (
        <Section className="border-b border-slate-200 bg-white py-16 md:py-20">
          <Container>
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">What's Coming Up</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Upcoming Events</h2>
                </div>
                <Link to="/events/browse" className="text-sm font-semibold text-sky-700 transition hover:text-sky-800">
                  Browse all events &rarr;
                </Link>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {nextEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ── EVENT CATEGORIES ── */}
      <Section className="border-b border-slate-200 bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">What We Run</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Suggested Event Categories</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                Tech Derby runs different types of events to serve different parts of the community.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {eventCategories.map((cat) => (
                <article
                  key={cat.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400 transition group-hover:bg-sky-700 group-hover:text-white">
                    {cat.icon}
                  </div>
                  <h3 className="mt-4 text-base font-black text-slate-900">{cat.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{cat.purpose}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHY ATTEND ── */}
      <Section className="border-b border-slate-200 bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Reasons to Show Up</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                  Why people come to Tech Derby events
                </h2>
              </div>

              <div className="space-y-5">
                {whyAttend.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-base leading-relaxed text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── PAST EVENTS / GALLERY ── */}
      <Section className="border-b border-slate-200 bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Our History</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                A growing story of connection and momentum
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                This section will soon showcase event photos, short recap paragraphs, partner logos, speaker highlights,
                and brief testimonials — proof that Tech Derby is active and growing, not merely promising.
              </p>
            </div>

            {pastTechDerby.length > 0 ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {pastTechDerby.slice(0, 6).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">Past event recaps and gallery coming soon.</p>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* ── HOST / PARTNER ── */}
      <Section className="border-b border-slate-200 bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Collaborate With Us</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              Want to collaborate on an event?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Tech Derby welcomes partnerships with organisations, educators, community leaders, employers, and ecosystem
              builders who want to support talent, innovation, and local connection.
            </p>
            <div className="mt-8">
              <Link to="/contact">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FINAL CTA ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Join The Movement</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
              Come and be part of what is growing
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80">
              Tech Derby events are open to the curious, the committed, and the people still finding their place in
              tech. Join us and step into a stronger community story.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/events/browse">
                <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">
                  View Upcoming Events
                </Button>
              </Link>
              <Link to="/get-involved">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full border border-white/30 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15"
                >
                  Join the Community
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
