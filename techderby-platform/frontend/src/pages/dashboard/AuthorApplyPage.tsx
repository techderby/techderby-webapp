import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import { cn } from '../../lib/utils';
import type { AuthorApplication } from '../../types/content';

const EXPERTISE_OPTIONS = [
  'Software Engineering', 'Web Development', 'Mobile Development', 'Cloud & DevOps',
  'AI & Machine Learning', 'Cybersecurity', 'Data Science', 'Product Management',
  'UI/UX Design', 'Startups & Entrepreneurship', 'Career Development', 'Leadership',
  'Open Source', 'Blockchain', 'Embedded Systems', 'Technical Writing',
];

function StatusBadge({ status }: { status: AuthorApplication['applicationStatus'] }) {
  const styles = {
    pending:  'bg-amber-500/10 text-amber-300 border-amber-500/25',
    approved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    rejected: 'bg-red-500/10 text-red-300 border-red-500/25',
  };
  const labels = { pending: 'Under Review', approved: 'Approved', rejected: 'Not Approved' };
  return (
    <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider', styles[status])}>
      {labels[status]}
    </span>
  );
}

export default function AuthorApplyPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState('');
  const [sampleWork, setSampleWork] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isAlreadyAuthor = ['editor', 'admin', 'super-admin'].includes(user?.member_role ?? '');

  const { data: application, isLoading } = useQuery<AuthorApplication | null>({
    queryKey: ['myAuthorApplication'],
    queryFn: () => apiClient.getMyAuthorApplication().then((r) => r.data),
    enabled: !isAlreadyAuthor,
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiClient.submitAuthorApplication({ bio, expertise, portfolio, sampleWork }),
    onSuccess: () => {
      setSubmitted(true);
      qc.invalidateQueries({ queryKey: ['myAuthorApplication'] });
    },
  });

  const toggleExpertise = (item: string) => {
    setExpertise((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const canSubmit = bio.trim().length >= 100 && expertise.length >= 1;

  // ── Already an author ─────────────────────────────────────────────────────
  if (isAlreadyAuthor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-lg shadow-sky-500/25">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-black text-white">You're already an author!</h2>
          <p className="mb-6 text-sm text-white/50">You have author access on Tech Derby. Start creating your articles.</p>
          <Link
            to="/dashboard/author/articles"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Go to My Articles
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
      </div>
    );
  }

  // ── Existing application ──────────────────────────────────────────────────
  if (application || submitted) {
    const app = application;
    return (
      <div className="mx-auto max-w-2xl p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-sky-400">Author Programme</p>
          <h1 className="text-2xl font-black text-white md:text-3xl">Application Status</h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {/* Status */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/70">Submitted</p>
              <p className="text-xs text-white/35">
                {app?.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Just now'}
              </p>
            </div>
            {app && <StatusBadge status={app.applicationStatus} />}
          </div>

          {/* Status explanation */}
          {(!app || app.applicationStatus === 'pending') && (
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
              <div className="flex gap-3">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-300">Under Review</p>
                  <p className="mt-0.5 text-xs text-amber-300/70">
                    Our team is reviewing your application. We typically respond within 3–5 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {app?.applicationStatus === 'approved' && (
            <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
              <div className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-300">Congratulations! You're approved.</p>
                  <p className="mt-0.5 text-xs text-emerald-300/70">
                    Welcome to the Tech Derby author community. You can now write and publish articles.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/dashboard/author/articles"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/35"
                >
                  Start Writing
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>
          )}

          {app?.applicationStatus === 'rejected' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
                <div className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-300">Application not approved</p>
                    {app.reviewNotes && (
                      <p className="mt-1 text-xs text-red-300/70">{app.reviewNotes}</p>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/40">You may re-apply after improving your profile and trying again in 30 days.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Application form ──────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-sky-400">Author Programme</p>
        <h1 className="text-2xl font-black text-white md:text-3xl">Become an Author</h1>
        <p className="mt-2 text-sm text-white/50 leading-relaxed max-w-xl">
          Share your expertise with the East Midlands tech community. As a Tech Derby author, your articles reach thousands of professionals, founders, and technologists across the region.
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: '✍️', title: 'Rich Editor', desc: 'Write beautifully with code, images, tables, and multi-column layouts' },
          { icon: '📊', title: 'Analytics', desc: 'See your views, reads, and engagement across all articles' },
          { icon: '🌍', title: 'Reach', desc: 'Connect with East Midlands\' top tech professionals and employers' },
        ].map((b) => (
          <div key={b.title} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
            <div className="mb-2 text-2xl">{b.icon}</div>
            <p className="text-sm font-bold text-white">{b.title}</p>
            <p className="mt-0.5 text-xs text-white/45 leading-snug">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (canSubmit) mutation.mutate(); }}
        className="space-y-6"
        aria-label="Author application form"
      >
        {/* Bio */}
        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm font-semibold text-white/80">
            Professional Bio <span className="text-red-400">*</span>
          </label>
          <p className="mb-2 text-xs text-white/40">Tell us about your background, experience, and what makes your perspective unique. Minimum 100 characters.</p>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            placeholder="I'm a software engineer with 8 years of experience building scalable systems at..."
            required
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-sky-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-sky-500/25"
            aria-describedby="bio-count"
          />
          <p id="bio-count" className={cn('mt-1 text-right text-[11px]', bio.length >= 100 ? 'text-emerald-400' : 'text-white/30')}>
            {bio.length} / 100 min
          </p>
        </div>

        {/* Expertise */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-white/80">Areas of Expertise <span className="text-red-400">*</span></label>
          <p className="mb-3 text-xs text-white/40">Select at least one area you'll write about.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Expertise selection">
            {EXPERTISE_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleExpertise(item)}
                aria-pressed={expertise.includes(item)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold transition-all',
                  expertise.includes(item)
                    ? 'border-sky-500/50 bg-sky-500/15 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/75',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          {expertise.length > 0 && (
            <p className="mt-2 text-[11px] text-sky-400">{expertise.length} selected</p>
          )}
        </div>

        {/* Portfolio */}
        <div>
          <label htmlFor="portfolio" className="mb-1.5 block text-sm font-semibold text-white/80">Portfolio / Website</label>
          <p className="mb-2 text-xs text-white/40">Link to your blog, GitHub, LinkedIn, or personal site.</p>
          <input
            id="portfolio"
            type="url"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-sky-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-sky-500/25"
          />
        </div>

        {/* Sample Work */}
        <div>
          <label htmlFor="sampleWork" className="mb-1.5 block text-sm font-semibold text-white/80">Sample Writing</label>
          <p className="mb-2 text-xs text-white/40">Share a short article excerpt, blog post, or LinkedIn article that showcases your writing style.</p>
          <textarea
            id="sampleWork"
            value={sampleWork}
            onChange={(e) => setSampleWork(e.target.value)}
            rows={4}
            placeholder="Paste a short excerpt of your previous writing here..."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-sky-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-sky-500/25"
          />
        </div>

        {/* Error */}
        {mutation.isError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            {(mutation.error as any)?.response?.data?.error?.message ?? 'Something went wrong. Please try again.'}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!canSubmit || mutation.isPending}
            className={cn(
              'flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all',
              canSubmit && !mutation.isPending
                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 shadow-sky-500/25 hover:shadow-sky-500/40 hover:translate-y-[-1px]'
                : 'bg-white/10 cursor-not-allowed opacity-50 shadow-none',
            )}
          >
            {mutation.isPending ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </>
            )}
          </button>
          <p className="text-xs text-white/35">We'll review your application within 3–5 business days</p>
        </div>
      </form>
    </div>
  );
}
