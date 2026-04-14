import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { ArticleRenderer } from '../../components/ArticleRenderer';
import { cn } from '../../lib/utils';
import type { Article, ArticleStatus } from '../../types/content';

const STATUS_META: Record<ArticleStatus, { label: string; dot: string; badge: string }> = {
  draft:     { label: 'Draft',     dot: 'bg-slate-400',   badge: 'text-slate-300 border-slate-400/25 bg-slate-400/10' },
  submitted: { label: 'Submitted', dot: 'bg-amber-400',   badge: 'text-amber-300 border-amber-400/25 bg-amber-400/10' },
  in_review: { label: 'In Review', dot: 'bg-blue-400',    badge: 'text-blue-300 border-blue-400/25 bg-blue-400/10' },
  published: { label: 'Published', dot: 'bg-emerald-400', badge: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10' },
  rejected:  { label: 'Rejected',  dot: 'bg-red-400',     badge: 'text-red-300 border-red-400/25 bg-red-400/10' },
};

function StatusBadge({ status }: { status: ArticleStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', m.badge)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', m.dot)} />
      {m.label}
    </span>
  );
}

function ReviewPanel({
  article,
  onPublish,
  onReject,
  onClose,
  isPublishing,
  isRejecting,
}: {
  article: Article;
  onPublish: () => void;
  onReject: (notes: string) => void;
  onClose: () => void;
  isPublishing: boolean;
  isRejecting: boolean;
}) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectNotes, setRejectNotes]       = useState('');

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-[#07090f]">
      {/* Article view */}
      <div className="flex-1 overflow-y-auto">
        {/* Review bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#07090f]/90 px-6 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/8 hover:text-white/70"
              aria-label="Close review"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div>
              <p className="text-xs font-bold text-white/70">{article.title}</p>
              <p className="text-[10px] text-white/35">by {article.authorName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={article.status} />
            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              disabled={isPublishing || isRejecting}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/8 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/15 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Reject
            </button>
            <button
              type="button"
              onClick={onPublish}
              disabled={isPublishing || isRejecting}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:shadow-emerald-500/35 disabled:opacity-50"
            >
              {isPublishing ? (
                <><span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" /> Publishing…</>
              ) : (
                <><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg> Publish</>
              )}
            </button>
          </div>
        </div>

        {/* Article content */}
        <div className="mx-auto max-w-3xl px-6 py-10">
          {/* Header */}
          {article.coverImageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <img src={article.coverImageUrl} alt={article.title} className="w-full object-cover" style={{ maxHeight: 420 }} />
            </div>
          )}
          <div className="mb-6 flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-sky-500/10 px-3 py-0.5 text-xs font-bold text-sky-400">{tag}</span>
            ))}
          </div>
          <h1 className="mb-4 text-3xl font-black text-white md:text-4xl" style={{ letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mb-6 text-lg text-white/50 italic leading-relaxed">{article.excerpt}</p>
          )}
          {/* Author */}
          <div className="mb-8 flex items-center gap-3 border-b border-white/[0.06] pb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-black text-white">
              {article.authorName?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{article.authorName}</p>
              <p className="text-xs text-white/40">{article.authorOccupation || 'Tech Derby Author'}</p>
            </div>
            <div className="ml-auto flex items-center gap-3 text-xs text-white/30">
              <span>{article.readTime ?? 1} min read</span>
              <span>·</span>
              <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
            </div>
          </div>

          {article.content && Object.keys(article.content).length > 0 ? (
            <ArticleRenderer content={article.content as Record<string, unknown>} />
          ) : (
            <p className="text-white/30 italic">No content yet.</p>
          )}
        </div>
      </div>

      {/* Reject form modal */}
      {showRejectForm && (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl">
            <h3 className="mb-2 text-base font-bold text-white">Reject Article</h3>
            <p className="mb-3 text-sm text-white/50">Provide feedback to help the author improve.</p>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows={4}
              placeholder="e.g. The article needs more depth in the technical sections. Please add code examples and expand on the key concepts."
              className="mb-4 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { onReject(rejectNotes); setShowRejectForm(false); }}
                disabled={isRejecting}
                className="flex-1 rounded-xl bg-red-500/15 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500/25 disabled:opacity-50"
              >
                {isRejecting ? 'Rejecting...' : 'Reject Article'}
              </button>
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type FilterStatus = ArticleStatus | 'all';

export default function AdminArticlesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterStatus>('submitted');
  const [reviewing, setReviewing] = useState<Article | null>(null);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['adminArticles', filter],
    queryFn: () => apiClient.getAdminArticles(filter === 'all' ? undefined : filter).then((r) => r.data),
  });

  const publishMutation = useMutation({
    mutationFn: (id: number) => apiClient.publishArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminArticles'] });
      setReviewing(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reviewNotes }: { id: number; reviewNotes: string }) =>
      apiClient.rejectArticle(id, reviewNotes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminArticles'] });
      setReviewing(null);
    },
  });

  const counts: Partial<Record<FilterStatus, number>> = {};
  for (const s of ['all', 'draft', 'submitted', 'in_review', 'published', 'rejected'] as FilterStatus[]) {
    counts[s] = s === 'all' ? articles.length : articles.filter((a) => a.status === s).length;
  }

  return (
    <>
      <div className="p-6 md:p-10">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-sky-400">Editorial</p>
          <h1 className="text-2xl font-black text-white md:text-3xl">Review Articles</h1>
          <p className="mt-1 text-sm text-white/45">Review, publish, or reject submitted community articles.</p>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            { key: 'submitted', label: 'Awaiting Review', color: 'text-amber-400' },
            { key: 'in_review', label: 'In Review',       color: 'text-blue-400' },
            { key: 'published', label: 'Published',        color: 'text-emerald-400' },
            { key: 'rejected',  label: 'Rejected',         color: 'text-red-400' },
          ] as const).map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              className={cn(
                'rounded-xl border p-4 text-left transition hover:border-white/15',
                filter === c.key ? 'border-white/15 bg-white/5' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]',
              )}
            >
              <p className={cn('text-2xl font-black', c.color)}>
                {articles.filter((a) => a.status === c.key).length}
              </p>
              <p className="text-xs text-white/40">{c.label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex items-center gap-2">
          {(['all', 'submitted', 'in_review', 'published', 'rejected', 'draft'] as FilterStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                filter === s ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30' : 'text-white/40 hover:bg-white/6 hover:text-white/70',
              )}
            >
              {s === 'all' ? 'All' : STATUS_META[s].label}
            </button>
          ))}
        </div>

        {/* Article list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <svg viewBox="0 0 24 24" className="mb-3 h-8 w-8 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <p className="text-sm font-semibold text-white/30">No articles in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                {/* Cover */}
                <div className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
                  {article.coverImageUrl ? (
                    <img src={article.coverImageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500/10 to-indigo-500/10">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <StatusBadge status={article.status} />
                    <span className="text-[10px] text-white/30">by {article.authorName}</span>
                    {article.tags?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] text-white/25">{t}</span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{article.title}</h3>
                  {article.excerpt && (
                    <p className="mt-0.5 text-xs text-white/40 line-clamp-1">{article.excerpt}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-white/25">
                    <span>{article.readTime ?? 1} min</span>
                    <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-GB') : ''}</span>
                    {article.status === 'published' && (
                      <><span className="flex items-center gap-0.5">{(article.views ?? 0).toLocaleString()} views</span><span>{(article.likes ?? 0)} likes</span></>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {(article.status === 'submitted' || article.status === 'in_review') && (
                    <button
                      type="button"
                      onClick={() => setReviewing(article)}
                      className="flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300 transition hover:bg-sky-500/20"
                    >
                      Review
                    </button>
                  )}
                  {article.status === 'published' && (
                    <a
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review panel overlay */}
      {reviewing && (
        <ReviewPanel
          article={reviewing}
          onPublish={() => publishMutation.mutate(reviewing.id)}
          onReject={(notes) => rejectMutation.mutate({ id: reviewing.id, reviewNotes: notes })}
          onClose={() => setReviewing(null)}
          isPublishing={publishMutation.isPending}
          isRejecting={rejectMutation.isPending}
        />
      )}
    </>
  );
}
