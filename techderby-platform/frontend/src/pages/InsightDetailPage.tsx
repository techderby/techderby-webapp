import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useInsightBySlug } from '../hooks/use-content-query';
import { apiClient } from '../lib/api';
import { renderArticleContent } from '../lib/article-content';
import { useAuth } from '../contexts/AuthContext';
import type { ArticleComment } from '../types/content';

function toAssetUrl(path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

function formatInsightDate(value?: string) {
  if (!value) return 'Date unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function InsightDetailPage() {
  const { slug = '' } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: insight, isLoading, isError, error } = useInsightBySlug(slug);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentName, setCommentName] = useState(user?.firstName || user?.username || '');
  const [commentEmail, setCommentEmail] = useState(user?.email || '');
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');

  const commentsQuery = useQuery<ArticleComment[]>({
    queryKey: ['article-comments', insight?.documentId],
    queryFn: () => apiClient.getArticleComments(insight?.documentId as string).then((response) => response.data?.data ?? []),
    enabled: Boolean(insight?.documentId),
  });

  useEffect(() => {
    setLikeCount(insight?.likeCount ?? 0);
    if (!insight?.documentId) return;
    const readKey = `td_article_read_${insight.documentId}`;
    if (sessionStorage.getItem(readKey)) return;
    sessionStorage.setItem(readKey, '1');
    apiClient.recordArticleRead(insight.documentId).catch(() => undefined);
  }, [insight?.documentId, insight?.likeCount]);

  async function toggleLike() {
    if (!insight?.documentId) return;
    let voterToken = localStorage.getItem('td_wire_voter_token');
    if (!voterToken) {
      voterToken = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      localStorage.setItem('td_wire_voter_token', voterToken);
    }
    const response = await apiClient.toggleArticleLike(insight.documentId, voterToken);
    setLiked(Boolean(response.data?.liked));
    setLikeCount(Number(response.data?.likeCount ?? 0));
  }

  async function submitComment(event: FormEvent) {
    event.preventDefault();
    if (!insight?.documentId) return;
    setCommentError('');
    try {
      await apiClient.addArticleComment(insight.documentId, { name: commentName, email: commentEmail, content: commentContent });
      setCommentContent('');
      await queryClient.invalidateQueries({ queryKey: ['article-comments', insight.documentId] });
    } catch {
      setCommentError('Your comment could not be added. Please try again.');
    }
  }

  const title = insight?.title ?? 'Insight';

  return (
    <>
      <PageSeo
        title={`Tech Derby | ${title}`}
        description={insight?.content ? insight.content.replace(/<[^>]*>/g, ' ').slice(0, 155) : 'An insight article from Tech Derby.'}
      />

      {/* ── HERO ── */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-16 md:py-24">
          <Link
            to="/wire"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to The Wire
          </Link>

          {!isLoading && !isError && insight ? (
            <div className="mt-8 max-w-3xl">
              <span className="inline-flex rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                {insight.category}
              </span>
              <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
                {insight.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="font-semibold text-white/90">{insight.author || 'Tech Derby'}</span>
                <span aria-hidden="true" className="text-white/30">|</span>
                <span>{formatInsightDate(insight.publishedAt ?? insight.createdAt)}</span>
              </div>
            </div>
          ) : (
            <div className="mt-8 max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                {isLoading ? 'Loading article...' : 'Insight'}
              </h1>
            </div>
          )}
        </Container>
      </Section>

      {/* ── CONTENT ── */}
      <Section className="bg-white py-12 md:py-16">
        <Container>
          {isLoading ? (
            <div className="mx-auto max-w-3xl py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600" />
              <p className="mt-4 text-sm text-slate-500">Loading article...</p>
            </div>
          ) : null}

          {isError ? (
            <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-700">
                Could not load article: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          ) : null}

          {!isLoading && !isError && !insight ? (
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <h2 className="text-2xl font-black text-slate-900">Article not found</h2>
              <p className="mt-2 text-sm text-slate-600">The requested article could not be found or may not be published yet.</p>
              <Link to="/wire" className="mt-4 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
                Browse all articles &rarr;
              </Link>
            </div>
          ) : null}

          {!isLoading && !isError && insight ? (
            <div className="mx-auto max-w-3xl">
              {/* Featured image */}
              <div className="-mt-20 relative z-10">
                <img
                  src={toAssetUrl(insight.featuredImageUrl || insight.featuredImage)}
                  alt={insight.title}
                  className="h-64 w-full rounded-2xl border border-slate-200 object-cover shadow-xl md:h-96"
                  loading="lazy"
                />
              </div>

              {/* Tags */}
              {insight.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {insight.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Article body */}
              <div className="mt-8 border-t border-slate-200 pt-8">
                <div
                  className="article-rich-content max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderArticleContent(insight.content, insight.contentFormat) }}
                />
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <button onClick={toggleLike} className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${liked ? 'bg-orange-500 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:border-orange-300'}`}>
                  {liked ? 'Liked' : 'Like'} · {likeCount}
                </button>
                <span className="text-sm text-slate-500">{insight.readCount ?? 0} reads</span>
                <span className="text-sm text-slate-500">{commentsQuery.data?.length ?? insight.commentCount ?? 0} comments</span>
              </div>

              <section className="mt-12 border-t border-slate-200 pt-9">
                <h2 className="text-2xl font-black text-slate-900">Discussion</h2>
                <div className="mt-6 space-y-4">
                  {(commentsQuery.data ?? []).map((comment) => (
                    <article key={comment.id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex justify-between gap-3"><p className="font-bold text-slate-900">{comment.name}</p><time className="text-xs text-slate-400">{formatInsightDate(comment.createdAt)}</time></div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{comment.content}</p>
                    </article>
                  ))}
                  {!commentsQuery.isLoading && !(commentsQuery.data?.length) ? <p className="text-sm text-slate-500">Be the first to comment.</p> : null}
                </div>
                <form onSubmit={submitComment} className="mt-7 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
                  <input required value={commentName} onChange={(e) => setCommentName(e.target.value)} placeholder="Your name" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500" />
                  <input type="email" value={commentEmail} onChange={(e) => setCommentEmail(e.target.value)} placeholder="Email (not published)" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500" />
                  <textarea required value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Join the discussion…" className="min-h-28 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 sm:col-span-2" />
                  {commentError ? <p className="text-sm text-red-600 sm:col-span-2">{commentError}</p> : null}
                  <button className="w-fit rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Post comment</button>
                </form>
              </section>

              {/* Footer */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {(insight.author || 'T')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{insight.author || 'Tech Derby'}</p>
                    <p className="text-xs text-slate-500">{formatInsightDate(insight.publishedAt ?? insight.createdAt)}</p>
                  </div>
                </div>
                <Link to="/wire">
                  <Button className="h-10 rounded-full px-6 text-sm shadow-lg shadow-orange-900/30">
                    More from The Wire
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
