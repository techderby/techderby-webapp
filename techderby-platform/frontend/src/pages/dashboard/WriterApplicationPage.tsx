import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { WriterApplication } from '../../types/content';

export default function WriterApplicationPage() {
  const { user, refreshUser } = useAuth();
  const [motivation, setMotivation] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [topics, setTopics] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activationError, setActivationError] = useState('');
  const activationAttemptedFor = useRef<number | null>(null);
  const populatedFromApplication = useRef<number | null>(null);

  const applicationQuery = useQuery<WriterApplication | null>({
    queryKey: ['writer-application'],
    queryFn: () => apiClient.getWriterApplication().then((response) => response.data?.data ?? null),
  });

  const role = user?.memberRole ?? 'member';
  const isWriter = role === 'editor' || role === 'admin' || role === 'super-admin';
  const current = applicationQuery.data;

  const activateWriterAccess = useCallback(async () => {
    setActivating(true);
    setActivationError('');
    try {
      await refreshUser();
    } catch {
      setActivationError('Your application is approved, but we could not refresh your access. Please try again.');
    } finally {
      setActivating(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    if (current?.status !== 'approved' || isWriter || activationAttemptedFor.current === current.id) return;
    activationAttemptedFor.current = current.id;
    void activateWriterAccess();
  }, [activateWriterAccess, current?.id, current?.status, isWriter]);

  useEffect(() => {
    if (current?.status !== 'rejected' || populatedFromApplication.current === current.id) return;
    populatedFromApplication.current = current.id;
    setMotivation(current.motivation ?? '');
    setExperience(current.experience ?? '');
    setPortfolioUrl(current.portfolioUrl ?? '');
    setTopics((current.topics ?? []).join(', '));
  }, [current]);

  if (isWriter) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-7">
          <h1 className="text-2xl font-black text-white">Writer access active</h1>
          <p className="mt-2 text-sm text-emerald-100/70">You can create and manage articles from the Articles link in your dashboard.</p>
        </div>
      </div>
    );
  }

  if (applicationQuery.isLoading) {
    return <div className="p-6 text-sm text-white/45 md:p-10">Loading your writer application…</div>;
  }

  if (applicationQuery.isError) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/25 bg-red-500/10 p-7">
          <h1 className="text-2xl font-black text-white">We could not load your application</h1>
          <p className="mt-2 text-sm text-red-100/70">Please retry before submitting so an existing application is not duplicated.</p>
          <button type="button" onClick={() => void applicationQuery.refetch()} className="mt-5 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/15">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (current?.status === 'pending' || current?.status === 'approved') {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-sky-500/25 bg-sky-500/10 p-7">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-300">Writer application</p>
          <h1 className="mt-2 text-2xl font-black text-white">{current.status === 'pending' ? 'Application under review' : 'Application approved'}</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {current.status === 'pending'
              ? 'An administrator will review your experience, interests, and sample work. You will receive access after approval.'
              : activating
                ? 'Your application is approved. We are activating the Articles workspace now.'
                : 'Your application is approved. Activate your writer access to open the Articles workspace.'}
          </p>
          {activationError ? <p role="alert" className="mt-4 text-sm text-red-300">{activationError}</p> : null}
          {current.status === 'approved' && !activating ? (
            <button type="button" onClick={() => void activateWriterAccess()} className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-400">
              Activate writer access
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await apiClient.applyAsWriter({
        motivation,
        experience,
        portfolioUrl,
        topics: topics.split(',').map((topic) => topic.trim()).filter(Boolean),
      });
      setMessage('Your writer application has been submitted for review.');
      await applicationQuery.refetch();
    } catch (submissionError) {
      setError(axios.isAxiosError(submissionError) ? submissionError.response?.data?.error?.message ?? 'Could not submit application.' : 'Could not submit application.');
    } finally {
      setSubmitting(false);
    }
  }

  const input = 'mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-500/60';

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">The Wire</p>
        <h1 className="mt-1 text-3xl font-black text-white">Apply to become a technical writer</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">
          Share practical technical knowledge, career insight, community stories, and informed perspectives with Derby’s technology community.
        </p>

        {current?.status === 'rejected' ? (
          <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Application feedback</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
              {current.reviewNotes || 'Your previous application was not approved. Update the information below and submit it for another review.'}
            </p>
            <p className="mt-3 text-xs text-white/45">Your previous answers have been restored below so you can revise and resubmit them.</p>
          </div>
        ) : null}

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <label className="block text-sm font-semibold text-white/70">
            Why do you want to write for The Wire? *
            <textarea required minLength={50} maxLength={5000} value={motivation} onChange={(e) => setMotivation(e.target.value)} className={`${input} min-h-36`} />
            <span className="mt-1 block text-xs font-normal text-white/35">At least 50 characters; maximum 5,000.</span>
          </label>
          <label className="block text-sm font-semibold text-white/70">
            Writing or technical experience
            <textarea maxLength={5000} value={experience} onChange={(e) => setExperience(e.target.value)} className={`${input} min-h-28`} />
          </label>
          <label className="block text-sm font-semibold text-white/70">
            Portfolio or sample URL
            <input type="url" maxLength={2048} value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className={input} placeholder="https://..." />
          </label>
          <label className="block text-sm font-semibold text-white/70">
            Topics you would like to cover
            <input maxLength={971} value={topics} onChange={(e) => setTopics(e.target.value)} className={input} placeholder="AI, web development, cloud, careers" />
            <span className="mt-1 block text-xs font-normal text-white/35">Separate up to 12 topics with commas; maximum 80 characters per topic.</span>
          </label>
          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button disabled={submitting} className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50">
            {submitting ? 'Submitting…' : 'Submit application'}
          </button>
        </form>
      </div>
    </div>
  );
}
