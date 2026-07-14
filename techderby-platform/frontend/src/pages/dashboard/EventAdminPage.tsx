import { useEffect, useMemo, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { assetUrl } from '../../lib/asset-url';
import type { Event } from '../../types/content';

type EventForm = {
  title: string;
  description: string;
  date: string;
  venue: string;
  eventSource: 'tech-derby' | 'other';
  theme: string;
  shortLine: string;
  registrationLink: string;
  agenda: string;
};

const EMPTY_FORM: EventForm = {
  title: '',
  description: '',
  date: '',
  venue: '',
  eventSource: 'tech-derby',
  theme: '',
  shortLine: '',
  registrationLink: '',
  agenda: '',
};

const inputClass =
  'mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-sky-500/60 focus:bg-white/[0.07]';

function apiErrorMessage(error: unknown, action = 'saved') {
  if (!axios.isAxiosError(error)) return `The event could not be ${action}. Please try again.`;
  const response = error.response?.data as { error?: { message?: string }; message?: string } | undefined;
  return response?.error?.message ?? response?.message ?? `The event could not be ${action}. Please try again.`;
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function formFromEvent(event: Event): EventForm {
  return {
    title: event.title,
    description: event.description,
    date: toDateTimeLocal(event.date),
    venue: event.venue,
    eventSource: event.eventSource === 'other' ? 'other' : 'tech-derby',
    theme: event.theme ?? '',
    shortLine: event.shortLine ?? '',
    registrationLink: event.eventRegistrationLink ?? event.registrationLink ?? '',
    agenda: event.agenda ?? '',
  };
}

function EventRow({ event }: { event: Event }) {
  const eventDate = new Date(event.date);

  return (
    <article className="grid gap-4 border-t border-white/8 px-4 py-4 first:border-t-0 sm:grid-cols-[112px_1fr_auto] sm:items-center">
      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-white/5">
        {event.featuredImage ? (
          <img src={assetUrl(event.featuredImage)} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/20">No image</div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-bold text-white">{event.title}</h3>
          {event.theme ? <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">{event.theme}</span> : null}
        </div>
        <p className="mt-1 text-sm text-white/45">
          {eventDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          {' · '}
          {eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="mt-0.5 truncate text-xs text-white/30">{event.venue}</p>
      </div>
      {event.documentId ? (
        <Link
          to={`/dashboard/events/${event.documentId}/edit`}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/70 transition hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-200"
        >
          Edit
        </Link>
      ) : null}
    </article>
  );
}

export default function EventAdminPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { documentId } = useParams();
  const isCreateRoute = location.pathname.endsWith('/new');
  const isEditorRoute = isCreateRoute || Boolean(documentId);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [editing, setEditing] = useState<Event | null>(null);
  const [timeline, setTimeline] = useState<'upcoming' | 'past'>('upcoming');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ title: string; slug: string; action: 'created' | 'updated' } | null>(null);

  const eventsQuery = useQuery<Event[]>({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const response = await apiClient.getEventsForAdmin();
      return Array.isArray(response.data?.data) ? response.data.data : [];
    },
  });

  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : ''), [image]);
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const groupedEvents = useMemo(() => {
    const now = Date.now();
    const events = eventsQuery.data ?? [];
    return {
      upcoming: events
        .filter((event) => new Date(event.date).getTime() >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      past: events
        .filter((event) => new Date(event.date).getTime() < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  }, [eventsQuery.data]);

  const visibleEvents = groupedEvents[timeline];
  const displayedImage = previewUrl || assetUrl(editing?.featuredImage);

  useEffect(() => {
    if (!documentId) {
      if (isCreateRoute) {
        setEditing(null);
        setForm(EMPTY_FORM);
        setImage(null);
      }
      return;
    }

    const selected = (eventsQuery.data ?? []).find((event) => event.documentId === documentId);
    if (selected && editing?.documentId !== selected.documentId) {
      setEditing(selected);
      setForm(formFromEvent(selected));
      setImage(null);
    }
  }, [documentId, editing?.documentId, eventsQuery.data, isCreateRoute]);

  function setField<K extends keyof EventForm>(name: K, value: EventForm[K]) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startCreate() {
    navigate('/dashboard/events/new');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess(null);

    if (!editing && !image) {
      setError('Select a featured image before publishing.');
      return;
    }
    if (editing && !editing.documentId) {
      setError('This event cannot be edited because its document ID is missing.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'date') payload.append(key, value);
      });
      payload.append('date', new Date(form.date).toISOString());
      if (image) payload.append('featuredImage', image);

      const response = editing
        ? await apiClient.updateEventForAdmin(editing.documentId as string, payload)
        : await apiClient.createEventForAdmin(payload);
      const eventData = response.data?.data as Event | undefined;

      const action = editing ? 'updated' : 'created';
      const title = eventData?.title ?? form.title;
      setEditing(null);
      setForm(EMPTY_FORM);
      setImage(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
        queryClient.invalidateQueries({ queryKey: ['events'] }),
      ]);
      navigate('/dashboard/events', {
        state: { eventNotice: `${title} was ${action} and published successfully.` },
      });
    } catch (submissionError) {
      setError(apiErrorMessage(submissionError, editing ? 'updated' : 'created'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!isEditorRoute) {
    const notice = (location.state as { eventNotice?: string } | null)?.eventNotice;

    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">Admin tools</p>
              <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">Manage events</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
                View upcoming and past events. Select an event to open its dedicated edit page.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/events" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white">
                Public events
              </Link>
              <button type="button" onClick={startCreate} className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
                Create event
              </button>
            </div>
          </div>

          {notice ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              {notice}
            </div>
          ) : null}

          <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 p-4 md:px-5">
              <div className="flex rounded-xl border border-white/10 bg-slate-950/50 p-1">
                {(['upcoming', 'past'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTimeline(option)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                      timeline === option ? 'bg-sky-500 text-white' : 'text-white/45 hover:text-white/75'
                    }`}
                  >
                    {option} ({groupedEvents[option].length})
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/30">Upcoming events are ordered nearest date first.</p>
            </div>

            {eventsQuery.isLoading ? <p className="p-8 text-center text-sm text-white/40">Loading events…</p> : null}
            {eventsQuery.isError ? <p className="p-8 text-center text-sm text-red-300">{apiErrorMessage(eventsQuery.error, 'loaded')}</p> : null}
            {!eventsQuery.isLoading && !eventsQuery.isError && visibleEvents.length === 0 ? (
              <p className="p-8 text-center text-sm text-white/35">No {timeline} events found.</p>
            ) : null}
            {visibleEvents.map((event) => <EventRow key={event.documentId ?? event.id} event={event} />)}
          </section>
        </div>
      </div>
    );
  }

  if (documentId && eventsQuery.isLoading) {
    return <div className="p-10 text-sm text-white/45">Loading event…</div>;
  }

  if (documentId && !eventsQuery.isLoading && !editing) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-500/25 bg-red-500/10 p-6">
          <h1 className="text-xl font-black text-white">Event not found</h1>
          <p className="mt-2 text-sm text-red-200/75">This event may have been removed or is no longer available.</p>
          <Link to="/dashboard/events" className="mt-5 inline-flex text-sm font-semibold text-sky-300 hover:text-sky-200">Back to Manage Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">Admin tools</p>
            <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">{editing ? 'Edit event' : 'Create event'}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
              {editing ? 'Update the event details below. Saving will publish the changes and notify the mailing list.' : 'Publish a new event to the Tech Derby website.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/dashboard/events"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Back to events
            </Link>
          </div>
        </div>

        {success ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <span><strong>{success.title}</strong> was {success.action} and is published on the public events pages.</span>
            {success.slug ? <Link className="font-semibold underline" to={`/events/${success.slug}`}>View event</Link> : null}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">
            {error}
          </div>
        ) : null}

        <form id="event-editor" onSubmit={handleSubmit} className="mt-8 scroll-mt-6 space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-sky-400">{editing ? 'Editing published event' : 'New event'}</p>
                <h2 className="mt-1 text-xl font-black text-white">{editing ? editing.title : 'Create an event'}</h2>
              </div>
              {editing ? (
                <Link to="/dashboard/events" className="text-sm font-semibold text-white/45 hover:text-white">Cancel editing</Link>
              ) : null}
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-white/70 md:col-span-2">
                Event title <span className="text-orange-400">*</span>
                <input className={inputClass} required maxLength={200} value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. Tech Derby AI Meetup" />
              </label>
              <label className="text-sm font-medium text-white/70">
                Date and time <span className="text-orange-400">*</span>
                <input className={inputClass} required type="datetime-local" value={form.date} onChange={(e) => setField('date', e.target.value)} />
              </label>
              <label className="text-sm font-medium text-white/70">
                Venue <span className="text-orange-400">*</span>
                <input className={inputClass} required value={form.venue} onChange={(e) => setField('venue', e.target.value)} placeholder="Venue name and address" />
              </label>
              <label className="text-sm font-medium text-white/70">
                Source
                <select className={inputClass} value={form.eventSource} onChange={(e) => setField('eventSource', e.target.value as EventForm['eventSource'])}>
                  <option className="bg-slate-900" value="tech-derby">Tech Derby</option>
                  <option className="bg-slate-900" value="other">External event</option>
                </select>
              </label>
              <label className="text-sm font-medium text-white/70">
                Theme
                <input className={inputClass} value={form.theme} onChange={(e) => setField('theme', e.target.value)} placeholder="e.g. AI, Careers, Networking" />
              </label>
              <label className="text-sm font-medium text-white/70 md:col-span-2">
                Short summary
                <input className={inputClass} maxLength={500} value={form.shortLine} onChange={(e) => setField('shortLine', e.target.value)} placeholder="A concise line used on event cards" />
              </label>
              <label className="text-sm font-medium text-white/70 md:col-span-2">
                Full description <span className="text-orange-400">*</span>
                <textarea className={`${inputClass} min-h-36 resize-y`} required maxLength={10000} value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Explain what the event is about and who should attend." />
              </label>
              <label className="text-sm font-medium text-white/70 md:col-span-2">
                Registration link
                <input className={inputClass} type="text" inputMode="url" value={form.registrationLink} onChange={(e) => setField('registrationLink', e.target.value)} placeholder="https://... or /site-page" />
              </label>
              <label className="text-sm font-medium text-white/70 md:col-span-2">
                Agenda
                <textarea className={`${inputClass} min-h-32 resize-y`} value={form.agenda} onChange={(e) => setField('agenda', e.target.value)} placeholder={'Add one agenda item per line, or use simple Markdown:\n- Doors open\n- Welcome and introductions\n- Main session'} />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.13em] text-white/60">Featured image</h2>
            <div className="mt-5 grid items-center gap-5 md:grid-cols-[1fr_1.2fr]">
              <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center transition hover:border-sky-500/50 hover:bg-sky-500/[0.05]">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-sky-400" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                </svg>
                <span className="mt-3 text-sm font-semibold text-white">{editing ? 'Replace featured image' : 'Choose featured image'}</span>
                <span className="mt-1 text-xs text-white/35">{editing ? 'Optional when editing. ' : ''}JPEG, PNG or WebP, up to 8 MB</span>
                <input
                  className="sr-only"
                  type="file"
                  required={!editing}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
              </label>
              <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                {displayedImage ? (
                  <img src={displayedImage} alt="Featured image preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/25">Image preview</div>
                )}
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-5">
            <p className="max-w-2xl text-sm leading-relaxed text-white/50">
              {editing ? 'Saving republishes the event and sends a branded update email to the mailing list.' : 'Publishing makes this event immediately visible on public pages and sends the new-event notification.'}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Saving…' : editing ? 'Save changes' : 'Publish event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
