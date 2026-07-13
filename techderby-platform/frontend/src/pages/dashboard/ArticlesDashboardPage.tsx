import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { assetUrl } from '../../lib/asset-url';
import { useAuth } from '../../contexts/AuthContext';
import type { ArticleStats, ArticleStatus, Insight } from '../../types/content';

type ArticlesPayload = {
  data: Insight[];
  stats: ArticleStats;
};

type AdminOverviewPayload = {
  articles: Insight[];
  stats: ArticleStats;
};

const FILTERS: Array<{ value: 'all' | ArticleStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending-review', label: 'Pending review' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'update-requested', label: 'Update requested' },
];

const STATUS_STYLE: Record<ArticleStatus, string> = {
  draft: 'bg-slate-500/15 text-slate-300',
  'pending-review': 'bg-amber-500/15 text-amber-300',
  published: 'bg-emerald-500/15 text-emerald-300',
  rejected: 'bg-red-500/15 text-red-300',
  'update-requested': 'bg-purple-500/15 text-purple-300',
};

export default function ArticlesDashboardPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | ArticleStatus>('all');
  const role = user?.memberRole ?? 'member';
  const isAdmin = role === 'admin' || role === 'super-admin';
  const query = useQuery<ArticlesPayload>({
    queryKey: ['articles-dashboard', role],
    queryFn: async () => {
      if (isAdmin) {
        const response = await apiClient.getEditorialAdminOverview();
        const overview = response.data as AdminOverviewPayload;
        return { data: overview.articles ?? [], stats: overview.stats };
      }

      const response = await apiClient.getMyArticles();
      return response.data as ArticlesPayload;
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (documentId: string) => apiClient.unpublishArticleForAdmin(documentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles-dashboard'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => apiClient.deleteArticleForAdmin(documentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles-dashboard'] }),
  });

  const articles = query.data?.data ?? [];
  const filtered = useMemo(() => filter === 'all' ? articles : articles.filter((article) => article.workflowStatus === filter), [articles, filter]);

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">The Wire</p>
            <h1 className="mt-1 text-3xl font-black text-white">{isAdmin ? 'All articles' : 'Your articles'}</h1>
            <p className="mt-2 text-sm text-white/45">
              {isAdmin
                ? 'Review and manage every article across all lifecycle stages.'
                : 'Write, submit, revise, and track the performance of your work.'}
            </p>
          </div>
          {!isAdmin ? (
            <Link to="/dashboard/articles/new" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">Write an article</Link>
          ) : null}
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button key={item.value} onClick={() => setFilter(item.value)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${filter === item.value ? 'bg-sky-500 text-white' : 'border border-white/10 bg-white/5 text-white/50 hover:text-white'}`}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
          {query.isLoading ? <p className="p-8 text-center text-sm text-white/40">Loading articles…</p> : null}
          {!query.isLoading && filtered.length === 0 ? <p className="p-8 text-center text-sm text-white/35">No articles match this filter.</p> : null}
          {filtered.map((article) => {
            const status = article.workflowStatus ?? 'draft';
            return (
              <article key={article.documentId ?? article.id} className="grid gap-4 border-t border-white/8 p-4 first:border-0 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                <div className="aspect-[16/10] overflow-hidden rounded-xl bg-white/5">
                  {article.featuredImageUrl || article.featuredImage ? <img src={assetUrl(article.featuredImageUrl || article.featuredImage)} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-bold text-white">{article.title}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[status]}`}>{status.replace('-', ' ')}</span>
                    <span className="text-xs text-white/30">{article.readCount ?? 0} reads · {article.likeCount ?? 0} likes · {article.commentCount ?? 0} comments</span>
                  </div>
                  {article.reviewNotes ? <p className="mt-2 text-xs text-amber-300/80">Review note: {article.reviewNotes}</p> : null}
                </div>
                {isAdmin && article.documentId ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link to={`/dashboard/articles/${article.documentId}/edit`} className="rounded-xl border border-white/10 px-4 py-2 text-center text-sm font-semibold text-white/70 hover:bg-white/5">Edit</Link>
                    {status === 'published' ? (
                      <button
                        type="button"
                        onClick={() => unpublishMutation.mutate(article.documentId as string)}
                        className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm font-semibold text-amber-300 hover:bg-amber-500/20"
                      >
                        Unpublish
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${article.title}" permanently?`)) {
                          deleteMutation.mutate(article.documentId as string);
                        }
                      }}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm font-semibold text-red-300 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                ) : article.documentId ? (
                  <Link to={`/dashboard/articles/${article.documentId}/edit`} className="rounded-xl border border-white/10 px-4 py-2 text-center text-sm font-semibold text-white/70 hover:bg-white/5">Edit</Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
