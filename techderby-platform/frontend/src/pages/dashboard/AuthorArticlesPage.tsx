import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { cn } from '../../lib/utils';
import type { Article, ArticleStatus } from '../../types/content';

const STATUS_META: Record<ArticleStatus, { label: string; dot: string; badge: string }> = {
  draft:     { label: 'Draft',      dot: 'bg-slate-400',   badge: 'text-slate-300 border-slate-400/25 bg-slate-400/10' },
  submitted: { label: 'Submitted',  dot: 'bg-amber-400',   badge: 'text-amber-300 border-amber-400/25 bg-amber-400/10' },
  in_review: { label: 'In Review',  dot: 'bg-blue-400',    badge: 'text-blue-300 border-blue-400/25 bg-blue-400/10' },
  published: { label: 'Published',  dot: 'bg-emerald-400', badge: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10' },
  rejected:  { label: 'Rejected',   dot: 'bg-red-400',     badge: 'text-red-300 border-red-400/25 bg-red-400/10' },
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

function StatCard({ value, label, icon }: { value: number | string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
        {icon}
      </div>
      <div>
        <p className="text-lg font-black text-white">{value}</p>
        <p className="text-[11px] text-white/40">{label}</p>
      </div>
    </div>
  );
}

type FilterStatus = ArticleStatus | 'all';

export default function AuthorArticlesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['myArticles'],
    queryFn: () => apiClient.getMyArticles().then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myArticles'] });
      setConfirmDelete(null);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (id: number) => apiClient.submitArticle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myArticles'] }),
  });

  const filtered = filter === 'all' ? articles : articles.filter((a) => a.status === filter);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalViews   = articles.reduce((s, a) => s + (a.views ?? 0), 0);
  const totalLikes   = articles.reduce((s, a) => s + (a.likes ?? 0), 0);
  const published    = articles.filter((a) => a.status === 'published').length;
  const readingTime  = articles.reduce((s, a) => s + (a.readTime ?? 0), 0);

  return (
    <div className="p-6 md:p-10">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-sky-400">Author Dashboard</p>
          <h1 className="text-2xl font-black text-white md:text-3xl">My Articles</h1>
        </div>
        <Link
          to="/dashboard/author/articles/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/35 hover:translate-y-[-1px]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          value={published}
          label="Published Articles"
          icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
        />
        <StatCard
          value={totalViews.toLocaleString()}
          label="Total Views"
          icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
        />
        <StatCard
          value={totalLikes.toLocaleString()}
          label="Total Likes"
          icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
        />
        <StatCard
          value={`${readingTime} min`}
          label="Total Reading Time"
          icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'draft', 'submitted', 'in_review', 'published', 'rejected'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
              filter === s
                ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30'
                : 'text-white/40 hover:bg-white/6 hover:text-white/70',
            )}
          >
            {s === 'all' ? 'All' : STATUS_META[s].label}
            <span className="ml-1.5 text-[10px] text-white/25">
              {s === 'all' ? articles.length : articles.filter((a) => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Article list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <svg viewBox="0 0 24 24" className="mb-3 h-10 w-10 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <p className="text-sm font-semibold text-white/30">
            {filter === 'all' ? 'No articles yet' : `No ${STATUS_META[filter as ArticleStatus]?.label.toLowerCase()} articles`}
          </p>
          {filter === 'all' && (
            <Link
              to="/dashboard/author/articles/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Write your first article
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <ArticleRow
              key={article.id}
              article={article}
              onDelete={() => setConfirmDelete(article.id)}
              onSubmit={() => submitMutation.mutate(article.id)}
              isSubmitting={submitMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl">
            <h3 className="mb-2 text-base font-bold text-white">Delete article?</h3>
            <p className="mb-5 text-sm text-white/50">This cannot be undone. The article will be permanently removed.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => deleteMutation.mutate(confirmDelete)}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-xl bg-red-500/15 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500/25"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
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

function ArticleRow({
  article,
  onDelete,
  onSubmit,
  isSubmitting,
}: {
  article: Article;
  onDelete: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const canEdit   = ['draft', 'rejected'].includes(article.status);
  const canSubmit = ['draft', 'rejected'].includes(article.status);

  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.04]">
      {/* Cover thumb */}
      <div className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
        {article.coverImageUrl ? (
          <img src={article.coverImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500/10 to-indigo-500/10">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2 flex-wrap">
          <StatusBadge status={article.status} />
          {article.tags && article.tags.length > 0 && (
            <span className="text-[10px] text-white/30">{article.tags.slice(0, 2).join(' · ')}</span>
          )}
        </div>

        <h3 className="text-sm font-bold text-white line-clamp-1">{article.title}</h3>

        {article.excerpt && (
          <p className="mt-0.5 text-xs text-white/40 line-clamp-1">{article.excerpt}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-white/30">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {article.readTime ?? 1} min read
          </span>
          {article.status === 'published' && (
            <>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {(article.views ?? 0).toLocaleString()} views
              </span>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {(article.likes ?? 0).toLocaleString()} likes
              </span>
            </>
          )}
          <span>
            {article.createdAt
              ? new Date(article.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : ''}
          </span>
        </div>

        {/* Rejection note */}
        {article.status === 'rejected' && article.reviewNotes && (
          <div className="mt-2 rounded-lg border border-red-500/15 bg-red-500/5 px-3 py-2 text-xs text-red-300/80">
            <span className="font-semibold">Feedback: </span>{article.reviewNotes}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {article.status === 'published' && (
          <a
            href={`/articles/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View published"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        )}
        {canEdit && (
          <Link
            to={`/dashboard/author/articles/${article.id}/edit`}
            title="Edit"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-sky-500/10 hover:text-sky-400"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </Link>
        )}
        {canSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            title="Submit for review"
            className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold text-white/40 transition hover:bg-amber-500/10 hover:text-amber-400"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            Submit
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          title="Delete article"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>
  );
}
