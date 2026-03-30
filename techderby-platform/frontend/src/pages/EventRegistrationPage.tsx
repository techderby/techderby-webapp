import { useMemo, useState } from 'react';
import axios from 'axios';
import { EventCard } from '../components/EventCard';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Input } from '../components/ui/Input';
import { Section } from '../components/ui/Section';
import { useEvents } from '../hooks/use-content-query';
import { createMailingListSubscription } from '../services/content-service';

const THEME_OPTIONS = ['All', 'AI', 'Data', 'Software', 'Product', 'Careers', 'Networking', 'Community'] as const;
const AUDIENCE_OPTIONS = ['All', 'Students', 'Founders', 'Hiring', 'Professionals'] as const;
const FORMAT_OPTIONS = ['All', 'Talks', 'Panel', 'Workshop'] as const;
const SOURCE_OPTIONS = ['tech-derby', 'other'] as const;
const TIME_OPTIONS = ['upcoming', 'past'] as const;

const audienceKeywords: Record<(typeof AUDIENCE_OPTIONS)[number], string[]> = {
  All: [],
  Students: ['student', 'graduate', 'academy', 'bootcamp'],
  Founders: ['founder', 'startup', 'entrepreneur'],
  Hiring: ['hiring', 'employer', 'recruit', 'talent'],
  Professionals: ['professional', 'engineer', 'developer', 'manager', 'career'],
};

const formatKeywords: Record<(typeof FORMAT_OPTIONS)[number], string[]> = {
  All: [],
  Talks: ['talk', 'talks', 'keynote', 'lightning'],
  Panel: ['panel'],
  Workshop: ['workshop', 'hands-on', 'lab'],
};

function isTechDerbyEvent(eventSource?: string | null) {
  const normalizedSource = (eventSource ?? 'tech-derby').toLowerCase().trim();
  return normalizedSource === 'tech-derby' || normalizedSource === 'tech derby' || normalizedSource === 'techderby';
}

function eventSearchText(event: {
  title: string;
  description: string;
  eventSource?: string | null;
  theme?: string | null;
  shortLine?: string | null;
  agenda?: string | null;
  venue: string;
  speakers?: string[];
}) {
  return [
    event.title,
    event.description,
    event.eventSource,
    event.theme,
    event.shortLine,
    event.agenda,
    event.venue,
    event.speakers?.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export default function EventRegistrationPage() {
  const { data, isLoading, isError, error } = useEvents();
  const [source, setSource] = useState<(typeof SOURCE_OPTIONS)[number]>('tech-derby');
  const [timeScope, setTimeScope] = useState<(typeof TIME_OPTIONS)[number]>('upcoming');
  const [theme, setTheme] = useState<(typeof THEME_OPTIONS)[number]>('All');
  const [audience, setAudience] = useState<(typeof AUDIENCE_OPTIONS)[number]>('All');
  const [format, setFormat] = useState<(typeof FORMAT_OPTIONS)[number]>('All');
  const [search, setSearch] = useState('');
  const [mailingEmail, setMailingEmail] = useState('');
  const [isSubmittingMailingList, setIsSubmittingMailingList] = useState(false);
  const [mailingListMessage, setMailingListMessage] = useState<string | null>(null);
  const [mailingListError, setMailingListError] = useState<string | null>(null);

  const allEvents = useMemo(() => data ?? [], [data]);
  const sourceAndTimeEvents = useMemo(() => {
    const now = new Date();

    const sourceFiltered = allEvents.filter((event) => {
      return source === 'tech-derby' ? isTechDerbyEvent(event.eventSource) : !isTechDerbyEvent(event.eventSource);
    });

    return sourceFiltered.filter((event) => {
      const eventDate = new Date(event.date);
      if (Number.isNaN(eventDate.getTime())) return false;
      return timeScope === 'upcoming' ? eventDate >= now : eventDate < now;
    });
  }, [allEvents, source, timeScope]);

  const filteredEvents = useMemo(() => {
    if (source === 'tech-derby') {
      return sourceAndTimeEvents;
    }

    const query = search.trim().toLowerCase();

    return sourceAndTimeEvents.filter((event) => {
      const searchable = eventSearchText(event);

      const matchesTheme =
        theme === 'All' ||
        (event.theme?.toLowerCase().includes(theme.toLowerCase()) ?? false) ||
        searchable.includes(theme.toLowerCase());

      const audienceTerms = audienceKeywords[audience];
      const matchesAudience = audience === 'All' || audienceTerms.some((term) => searchable.includes(term));

      const formatTerms = formatKeywords[format];
      const matchesFormat = format === 'All' || formatTerms.some((term) => searchable.includes(term));

      const matchesSearch = query.length === 0 || searchable.includes(query);

      return matchesTheme && matchesAudience && matchesFormat && matchesSearch;
    });
  }, [source, sourceAndTimeEvents, theme, audience, format, search]);

  const hasActiveFilters = source === 'other' && (theme !== 'All' || audience !== 'All' || format !== 'All' || search.trim().length > 0);

  const sourceCounts = useMemo(() => {
    const techDerbyCount = allEvents.filter((event) => isTechDerbyEvent(event.eventSource)).length;
    return {
      'tech-derby': techDerbyCount,
      other: allEvents.length - techDerbyCount,
    };
  }, [allEvents]);

  const sourceButtonClass = (option: (typeof SOURCE_OPTIONS)[number]) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition ${
      source === option
        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
    }`;

  const timeButtonClass = (option: (typeof TIME_OPTIONS)[number]) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition ${
      timeScope === option
        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
    }`;

  async function handleMailingListSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = mailingEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setMailingListError('Please enter your email address.');
      setMailingListMessage(null);
      return;
    }

    setIsSubmittingMailingList(true);
    setMailingListError(null);
    setMailingListMessage(null);

    try {
      await createMailingListSubscription(normalizedEmail);
      setMailingListMessage('You are on the list. We will send updates and early ticket alerts.');
      setMailingEmail('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const apiMessage = String((err.response?.data as { error?: { message?: string } } | undefined)?.error?.message ?? '').toLowerCase();

        if (status === 403) {
          setMailingListError('Mailing list sign-up is temporarily unavailable. Please contact the team while we finish setup.');
        } else if (status === 400 && (apiMessage.includes('unique') || apiMessage.includes('already') || apiMessage.includes('email'))) {
          setMailingListError('This email is already on the mailing list.');
        } else {
          setMailingListError('Could not join the mailing list right now. Please try again.');
        }
      } else {
        setMailingListError('Could not join the mailing list right now. Please try again.');
      }
    } finally {
      setIsSubmittingMailingList(false);
    }
  }

  return (
    <>
      <PageSeo
        title="Browse & Register for Tech Events | Tech Derby"
        description="Browse upcoming and past Tech Derby events. Register for meetups, workshops, and community gatherings in Derby."
      />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Browse & Register
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Find your next
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                event.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Browse upcoming and past Tech Derby events. Register for meetups, workshops, and founder sessions — all
              designed to help you learn, connect, and grow in Derby's tech community.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── FILTERS & EVENTS ── */}
      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Event Source</p>
                  <div className="mt-2 inline-flex flex-wrap gap-2 rounded-full border border-slate-200 bg-white p-1">
                    {SOURCE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSource(option);
                          setTheme('All');
                          setAudience('All');
                          setFormat('All');
                          setSearch('');
                        }}
                        className={sourceButtonClass(option)}
                      >
                        {option === 'tech-derby' ? 'Tech Derby' : 'Others'} ({sourceCounts[option]})
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Timeline</p>
                  <div className="mt-2 inline-flex flex-wrap gap-2 rounded-full border border-slate-200 bg-white p-1">
                    {TIME_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTimeScope(option)}
                        className={timeButtonClass(option)}
                      >
                        {option === 'upcoming' ? 'Upcoming' : 'Past'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                {source === 'tech-derby'
                  ? 'Tech Derby view keeps it simple: only Upcoming/Past selection is applied.'
                  : 'Other events can be refined with additional filters below.'}
              </p>

              {source === 'other' ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <label className="text-sm text-slate-700">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Theme</span>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as (typeof THEME_OPTIONS)[number])}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
                    >
                      {THEME_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm text-slate-700">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Audience</span>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value as (typeof AUDIENCE_OPTIONS)[number])}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
                    >
                      {AUDIENCE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm text-slate-700">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Format</span>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as (typeof FORMAT_OPTIONS)[number])}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
                    >
                      {FORMAT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm text-slate-700">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Search</span>
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="enter search keyword"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                    />
                  </label>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                <p>
                  Showing <span className="font-bold text-slate-900">{filteredEvents.length}</span> of{' '}
                  <span className="font-bold text-slate-900">{sourceAndTimeEvents.length}</span> events
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('All');
                      setAudience('All');
                      setFormat('All');
                      setSearch('');
                    }}
                    className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    Reset filters
                  </button>
                ) : null}
              </div>
            </div>

            {isLoading ? (
              <div className="mt-10 text-center">
                <p className="text-sm text-slate-600">Loading events...</p>
              </div>
            ) : null}
            {isError ? (
              <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="text-sm text-red-700">
                  Could not load events: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            ) : null}
            {!isLoading && !isError && allEvents.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-600">No published events yet.</p>
              </div>
            ) : null}
            {!isLoading && !isError && allEvents.length > 0 && filteredEvents.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-600">No events match your current filters.</p>
              </div>
            ) : null}

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── MAILING LIST ── */}
      <Section className="border-t border-slate-200 bg-slate-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-10">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Stay In The Loop</p>
              <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">Can&apos;t make the next one?</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Join the mailing list to get updates and early tickets for future events.
              </p>
            </div>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center" onSubmit={handleMailingListSubmit}>
              <Input
                type="email"
                required
                value={mailingEmail}
                onChange={(e) => setMailingEmail(e.target.value)}
                placeholder="name@example.com"
                className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 sm:min-w-72"
                aria-label="Email address"
              />
              <Button variant="secondary" type="submit" disabled={isSubmittingMailingList} className="rounded-xl sm:min-w-40">
                {isSubmittingMailingList ? 'Joining...' : 'Join mailing list'}
              </Button>
            </form>

            {mailingListMessage ? <p className="mt-4 text-center text-sm text-sky-400">{mailingListMessage}</p> : null}
            {mailingListError ? <p className="mt-4 text-center text-sm text-red-400">{mailingListError}</p> : null}
          </div>
        </Container>
      </Section>
    </>
  );
}
