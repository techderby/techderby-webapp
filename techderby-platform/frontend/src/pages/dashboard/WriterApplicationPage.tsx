import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { WriterApplication } from '../../types/content';

export default function WriterApplicationPage() {
  const { user } = useAuth();
  const [motivation, setMotivation] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [topics, setTopics] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const applicationQuery = useQuery<WriterApplication | null>({
    queryKey: ['writer-application'],
    queryFn: () => apiClient.getWriterApplication().then((response) => response.data?.data ?? null),
  });

  const role = user?.memberRole ?? 'member';
  if (role === 'editor' || role === 'admin' || role === 'super-admin') {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-7">
          <h1 className="text-2xl font-black text-white">Writer access active</h1>
          <p className="mt-2 text-sm text-emerald-100/70">You can create and manage articles from the Articles link in your dashboard.</p>
        </div>
      </div>
    );
  }

  const current = applicationQuery.data;
  if (current?.status === 'pending' || current?.status === 'approved') {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-sky-500/25 bg-sky-500/10 p-7">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-300">Writer application</p>
          <h1 className="mt-2 text-2xl font-black text-white">{current.status === 'pending' ? 'Application under review' : 'Application approved'}</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {current.status === 'pending'
              ? 'An administrator will review your experience, interests, and sample work. You will receive access after approval.'
              : 'Refresh your session to access the Articles workspace.'}
          </p>
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

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <label className="block text-sm font-semibold text-white/70">
            Why do you want to write for The Wire? *
            <textarea required minLength={50} value={motivation} onChange={(e) => setMotivation(e.target.value)} className={`${input} min-h-36`} />
          </label>
          <label className="block text-sm font-semibold text-white/70">
            Writing or technical experience
            <textarea value={experience} onChange={(e) => setExperience(e.target.value)} className={`${input} min-h-28`} />
          </label>
          <label className="block text-sm font-semibold text-white/70">
            Portfolio or sample URL
            <input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className={input} placeholder="https://..." />
          </label>
          <label className="block text-sm font-semibold text-white/70">
            Topics you would like to cover
            <input value={topics} onChange={(e) => setTopics(e.target.value)} className={input} placeholder="AI, web development, cloud, careers" />
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
