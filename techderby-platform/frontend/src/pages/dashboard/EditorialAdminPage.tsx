import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '../../lib/api';
import { assetUrl } from '../../lib/asset-url';
import { Pagination } from '../../components/Pagination';
import { paginateItems } from '../../lib/pagination';
import type { ArticleStats, Insight, WriterApplication } from '../../types/content';

type Overview = {
  stats: ArticleStats;
  pendingApplications: WriterApplication[];
  pendingArticles: Insight[];
  articles: Insight[];
};

function safeHttpUrl(value?: string | null) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function requestErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  return error.response?.data?.error?.message
    ?? error.response?.data?.message
    ?? fallback;
}

function formatDecisionDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
}

export default function EditorialAdminPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'reviews' | 'writers' | 'all'>('reviews');
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [writerReviewError, setWriterReviewError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Insight | null>(null);
  const query = useQuery<Overview>({
    queryKey: ['editorial-admin'],
    queryFn: () => apiClient.getEditorialAdminOverview().then((response) => response.data),
  });
  const refresh = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ['editorial-admin'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard-editorial-overview'] }),
    queryClient.invalidateQueries({ queryKey: ['sidebar-article-stats'] }),
  ]);
  const articleMutation = useMutation({
    mutationFn: ({ documentId, status }: { documentId: string; status: 'published' | 'rejected' | 'update-requested' }) =>
      apiClient.reviewArticle(documentId, status, notes[documentId] ?? ''),
    onSuccess: refresh,
  });
  const writerMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'approved' | 'rejected' }) =>
      apiClient.reviewWriterApplication(id, status, notes[`writer-${id}`] ?? ''),
    onMutate: () => setWriterReviewError(''),
    onSuccess: async (_, variables) => {
      setNotes((currentNotes) => {
        const next = { ...currentNotes };
        delete next[`writer-${variables.id}`];
        return next;
      });
      await refresh();
    },
    onError: (error) => {
      setWriterReviewError(requestErrorMessage(error, 'The writer application could not be reviewed. Please try again.'));
    },
  });
  const unpublishMutation = useMutation({
    mutationFn: (documentId: string) => apiClient.unpublishArticleForAdmin(documentId),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => apiClient.deleteArticleForAdmin(documentId),
    onSuccess: refresh,
  });

  const articles = useMemo(() => tab === 'reviews' ? query.data?.pendingArticles ?? [] : query.data?.articles ?? [], [query.data, tab]);
  const applications = useMemo(() => query.data?.pendingApplications ?? [], [query.data?.pendingApplications]);
  const articlePagination = useMemo(
    () => paginateItems(articles, currentPage),
    [articles, currentPage],
  );
  const applicationPagination = useMemo(
    () => paginateItems(applications, currentPage),
    [applications, currentPage],
  );
  const button = 'rounded-lg px-3 py-2 text-xs font-bold transition disabled:opacity-50';

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">Editorial administration</p>
          <h1 className="mt-1 text-3xl font-black text-white">Article review</h1>
          <p className="mt-2 text-sm text-white/45">Approve writers, review submissions, request changes, and publish to The Wire.</p>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {[
            ['reviews', `Pending reviews (${query.data?.pendingArticles.length ?? 0})`],
            ['writers', `Writer applications (${query.data?.pendingApplications.length ?? 0})`],
            ['all', 'All articles'],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => {
                setTab(value as typeof tab);
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold ${tab === value ? 'bg-sky-500 text-white' : 'border border-white/10 bg-white/5 text-white/50'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {query.isLoading ? <p className="mt-8 text-sm text-white/40">Loading editorial workspace…</p> : null}

        {tab === 'writers' ? (
          <div className="mt-6 space-y-4">
            {writerReviewError ? <p role="alert" className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">{writerReviewError}</p> : null}
            {applicationPagination.items.map((application) => {
              const portfolioUrl = safeHttpUrl(application.portfolioUrl);
              const reviewNotes = notes[`writer-${application.id}`] ?? '';
              return (
                <article key={application.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div><h2 className="font-bold text-white">{application.name}</h2><p className="text-xs text-white/35">{application.email}</p></div>
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">Pending</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{application.motivation}</p>
                  {application.experience ? <p className="mt-3 whitespace-pre-wrap text-sm text-white/45"><strong>Experience:</strong> {application.experience}</p> : null}
                  {application.topics?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2" aria-label="Proposed writing topics">
                      {application.topics.map((topic, index) => <span key={`${topic}-${index}`} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs text-sky-200">{topic}</span>)}
                    </div>
                  ) : null}
                  {portfolioUrl ? <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-sky-400">View portfolio ↗</a> : null}
                  {application.portfolioUrl && !portfolioUrl ? <p className="mt-3 text-xs text-amber-300">The saved portfolio address is not a safe HTTP(S) link.</p> : null}
                  {application.decisionHistory?.length ? (
                    <details className="mt-4 rounded-xl border border-white/10 bg-black/10 p-3">
                      <summary className="cursor-pointer text-xs font-bold text-white/55">Previous decisions ({application.decisionHistory.length})</summary>
                      <ol className="mt-3 space-y-3">
                        {[...application.decisionHistory].reverse().map((decision, index) => (
                          <li key={`${decision.reviewedAt}-${index}`} className="border-l-2 border-white/10 pl-3 text-xs text-white/45">
                            <p><strong className={decision.status === 'approved' ? 'text-emerald-300' : 'text-amber-300'}>{decision.status === 'approved' ? 'Approved' : 'Rejected'}</strong> · {formatDecisionDate(decision.reviewedAt)}</p>
                            {decision.reviewNotes ? <p className="mt-1 whitespace-pre-wrap">{decision.reviewNotes}</p> : null}
                          </li>
                        ))}
                      </ol>
                    </details>
                  ) : null}
                  <label className="mt-4 block text-xs font-semibold text-white/55">
                    Review notes
                    <textarea maxLength={3000} value={reviewNotes} onChange={(e) => setNotes({ ...notes, [`writer-${application.id}`]: e.target.value })} placeholder="Add feedback for the applicant" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none" />
                    <span className="mt-1 block font-normal text-white/35">Rejections require at least 10 characters of feedback. These notes are emailed to the applicant.</span>
                  </label>
                  <div className="mt-3 flex gap-2">
                    <button disabled={writerMutation.isPending} onClick={() => writerMutation.mutate({ id: application.id, status: 'approved' })} className={`${button} bg-emerald-500 text-white`}>Approve writer</button>
                    <button title={reviewNotes.trim().length < 10 ? 'Add at least 10 characters of feedback first' : undefined} disabled={writerMutation.isPending || reviewNotes.trim().length < 10} onClick={() => writerMutation.mutate({ id: application.id, status: 'rejected' })} className={`${button} bg-red-500/15 text-red-300`}>Reject</button>
                  </div>
                </article>
              );
            })}
            {!query.isLoading && !(query.data?.pendingApplications.length) ? <p className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/35">No pending writer applications.</p> : null}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {articlePagination.items.map((article) => (
              <article key={article.documentId ?? article.id} className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[150px_1fr]">
                <div className="aspect-[16/11] overflow-hidden rounded-xl bg-white/5">
                  {article.featuredImageUrl || article.featuredImage ? <img src={assetUrl(article.featuredImageUrl || article.featuredImage)} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <div>
                  <div className="flex flex-wrap justify-between gap-3">
                    <div><h2 className="text-lg font-black text-white">{article.title}</h2><p className="mt-1 text-xs text-white/35">By {article.author} · {article.workflowStatus?.replace('-', ' ')}</p></div>
                    <span className="text-xs text-white/35">{article.readCount ?? 0} reads · {article.commentCount ?? 0} comments</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{article.excerpt}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
                  >
                    Read details
                  </button>
                  {article.documentId ? (
                    <>
                      <textarea value={notes[article.documentId] ?? article.reviewNotes ?? ''} onChange={(e) => setNotes({ ...notes, [article.documentId as string]: e.target.value })} placeholder="Review notes or requested changes" className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none" />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {article.workflowStatus !== 'published' ? <button disabled={articleMutation.isPending} onClick={() => articleMutation.mutate({ documentId: article.documentId as string, status: 'published' })} className={`${button} bg-emerald-500 text-white`}>Publish</button> : null}
                        {article.workflowStatus === 'published' ? <button disabled={unpublishMutation.isPending} onClick={() => unpublishMutation.mutate(article.documentId as string)} className={`${button} bg-amber-500/15 text-amber-300`}>Unpublish</button> : null}
                        <button disabled={articleMutation.isPending} onClick={() => articleMutation.mutate({ documentId: article.documentId as string, status: 'update-requested' })} className={`${button} bg-purple-500/15 text-purple-300`}>Request update</button>
                        <button disabled={articleMutation.isPending} onClick={() => articleMutation.mutate({ documentId: article.documentId as string, status: 'rejected' })} className={`${button} bg-red-500/15 text-red-300`}>Reject</button>
                        <button
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (window.confirm('Delete this article permanently? This cannot be undone.')) {
                              deleteMutation.mutate(article.documentId as string);
                            }
                          }}
                          className={`${button} border border-red-400/40 bg-transparent text-red-300`}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </article>
            ))}
            {!query.isLoading && articles.length === 0 ? <p className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/35">No articles in this view.</p> : null}
          </div>
        )}

        <Pagination
          currentPage={tab === 'writers' ? applicationPagination.page : articlePagination.page}
          totalItems={tab === 'writers' ? applications.length : articles.length}
          onPageChange={setCurrentPage}
          itemLabel={tab === 'writers' ? 'applications' : 'articles'}
          className="mt-4"
        />

        {selectedArticle ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}>
            <article className="max-h-[86vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedArticle.title}</h2>
                  <p className="mt-1 text-xs text-white/45">By {selectedArticle.author} · {selectedArticle.workflowStatus?.replace('-', ' ')}</p>
                </div>
                <button type="button" onClick={() => setSelectedArticle(null)} className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white" aria-label="Close article details">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
                </button>
              </div>
              <p className="mt-4 text-sm text-white/60">{selectedArticle.excerpt}</p>
              <div className="mt-5 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/80">
                {selectedArticle.content || 'No article body found.'}
              </div>
            </article>
          </div>
        ) : null}
      </div>
    </div>
  );
}
