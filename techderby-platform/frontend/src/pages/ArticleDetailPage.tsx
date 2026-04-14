import { useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { ArticleRenderer } from '../components/ArticleRenderer';
import { Container } from '../components/ui/Container';
import { useAuth } from '../contexts/AuthContext';
import type { Article, ArticleComment } from '../types/content';

function formatDate(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [commentBody, setCommentBody] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const { data: article, isLoading, isError } = useQuery<Article>({
    queryKey: ['article', slug],
    queryFn: () => apiClient.getArticleBySlug(slug!).then((r) => r.data),
    enabled: !!slug,
  });

  // Sync like count from fetched article
  const currentLikes = likeCount ?? article?.likes ?? 0;

  const likeMutation = useMutation({
    mutationFn: () => apiClient.likeArticle(article!.id),
    onSuccess: () => {
      setLiked(true);
      setLikeCount((prev) => (prev ?? article?.likes ?? 0) + 1);
    },
  });

  const { data: comments = [] } = useQuery<ArticleComment[]>({
    queryKey: ['articleComments', article?.id],
    queryFn: () => apiClient.getArticleComments(article!.id).then((r) => r.data),
    enabled: !!article?.id,
  });

  const addCommentMutation = useMutation({
    mutationFn: (body: string) => apiClient.createArticleComment(article!.id, body),
    onSuccess: () => {
      setCommentBody('');
      qc.invalidateQueries({ queryKey: ['articleComments', article?.id] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteArticleComment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['articleComments', article?.id] });
    },
  });

  function handleShare(platform: 'copy' | 'twitter' | 'linkedin') {
    const url = window.location.href;
    const text = encodeURIComponent(`${article!.title} — Tech Derby`);
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      });
    } else if (platform === 'twitter') {
      window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, '_blank', 'noopener');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener');
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090f]">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#07090f] text-white/50">
        <svg viewBox="0 0 24 24" className="h-12 w-12 text-white/10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
        <p className="text-sm font-semibold">Article not found</p>
        <Link to="/articles" className="text-xs text-sky-400 hover:underline">Browse all articles</Link>
      </div>
    );
  }

  const coverImage = article.coverImageUrl ?? article.featuredImage;

  return (
    <div className="min-h-screen bg-[#07090f] text-white">

      {/* Hero */}
      {coverImage ? (
        <div className="relative h-[45vh] max-h-[520px] min-h-[300px] overflow-hidden">
          <img src={coverImage} alt={article.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/40 to-transparent" />
        </div>
      ) : (
        <div className="relative h-[18vh] min-h-[120px] bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.07),transparent_70%)]" />
        </div>
      )}

      <Container className="max-w-3xl">
        <article className="pb-24">

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 pt-8">
              {article.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full border border-sky-500/20 bg-sky-500/8 px-3 py-0.5 text-xs font-semibold text-sky-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className={`font-black leading-tight tracking-tight text-white ${coverImage ? '' : 'pt-8'} mb-4`}
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mb-8 text-lg leading-relaxed text-white/55">{article.excerpt}</p>
          )}

          {/* Author + Meta bar */}
          <div className="mb-10 flex items-center justify-between gap-4 border-b border-white/[0.07] pb-8">
            <div className="flex items-center gap-3">
              {article.authorAvatar ? (
                <img src={article.authorAvatar} alt={article.authorName} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-black text-white">
                  {(article.authorName ?? 'A')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-white">{article.authorName ?? 'Tech Derby Author'}</p>
                {article.authorOccupation && (
                  <p className="text-xs text-white/40">{article.authorOccupation}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/35">
              {article.publishedAt && (
                <span>{formatDate(article.publishedAt)}</span>
              )}
              {article.readTime && (
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {article.readTime} min read
                </span>
              )}
              {article.views !== undefined && (
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  {article.views.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Article body */}
          {article.content ? (
            <ArticleRenderer content={article.content} />
          ) : (
            <p className="text-white/40 italic">No content available.</p>
          )}

          {/* Footer: like + share + back */}
          <div className="mt-16 border-t border-white/[0.07] pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Like */}
              <button
                type="button"
                disabled={liked || likeMutation.isPending}
                onClick={() => likeMutation.mutate()}
                className={`group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  liked
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 cursor-default'
                    : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-rose-500/30 hover:bg-rose-500/8 hover:text-rose-300'
                }`}
              >
                <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-colors ${liked ? 'fill-rose-400 stroke-rose-400' : 'fill-none stroke-current'}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {currentLikes > 0 ? `${currentLikes} like${currentLikes !== 1 ? 's' : ''}` : 'Like this article'}
              </button>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/25 mr-1">Share</span>
                {/* Copy link */}
                <button
                  type="button"
                  onClick={() => handleShare('copy')}
                  title="Copy link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 transition hover:border-white/20 hover:text-white/80"
                >
                  {shareCopied ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  )}
                </button>
                {/* X / Twitter */}
                <button
                  type="button"
                  onClick={() => handleShare('twitter')}
                  title="Share on X"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 transition hover:border-white/20 hover:text-white/80"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                {/* LinkedIn */}
                <button
                  type="button"
                  onClick={() => handleShare('linkedin')}
                  title="Share on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/40 transition hover:border-white/20 hover:text-white/80"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-5">
              <Link
                to="/articles"
                className="flex items-center gap-1.5 text-sm text-white/35 transition hover:text-white/70 w-fit"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                All Articles
              </Link>
            </div>
          </div>

          {/* Author card */}
          <div className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 flex items-start gap-4">
            {article.authorAvatar ? (
              <img src={article.authorAvatar} alt={article.authorName} className="h-14 w-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-lg font-black text-white">
                {(article.authorName ?? 'A')[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 mb-0.5">Written by</p>
              <p className="font-bold text-white">{article.authorName ?? 'Tech Derby Author'}</p>
              {article.authorOccupation && (
                <p className="text-sm text-white/45">{article.authorOccupation}</p>
              )}
            </div>
          </div>

          {/* ── Comments ────────────────────────────────────────────────────── */}
          <section className="mt-14" aria-label="Comments">
            <h2 className="mb-6 text-lg font-black text-white">
              {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comments'}
            </h2>

            {/* Comment input */}
            {user ? (
              <div className="mb-8 flex gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="h-9 w-9 rounded-full object-cover shrink-0 mt-0.5" />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 mt-0.5 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-xs font-black text-white">
                    {([user.firstName, user.lastName].filter(Boolean).join(' ') || user.username)[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    ref={commentInputRef}
                    rows={3}
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Share your thoughts…"
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-sky-500/40 focus:bg-white/[0.05]"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={!commentBody.trim() || addCommentMutation.isPending}
                      onClick={() => commentBody.trim() && addCommentMutation.mutate(commentBody)}
                      className="rounded-full bg-sky-500 px-5 py-2 text-xs font-bold text-white transition hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {addCommentMutation.isPending ? 'Posting…' : 'Post comment'}
                    </button>
                  </div>
                  {addCommentMutation.isError && (
                    <p className="mt-1 text-xs text-red-400">Failed to post comment. Please try again.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 text-sm text-white/45">
                <Link to="/login" className="text-sky-400 hover:underline">Sign in</Link> to leave a comment.
              </div>
            )}

            {/* Comment list */}
            {comments.length === 0 ? (
              <p className="text-sm text-white/30 italic">No comments yet. Be the first to share your thoughts.</p>
            ) : (
              <ul className="space-y-5">
                {comments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    {c.authorAvatar ? (
                      <img src={c.authorAvatar} alt={c.authorName} className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5" />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 mt-0.5 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/60 to-indigo-500/60 text-xs font-black text-white">
                        {(c.authorName ?? '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-white/80">{c.authorName ?? 'Member'}</span>
                        <span className="text-[11px] text-white/25">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{c.body}</p>
                    </div>
                    {/* Delete — own comment or admin */}
                    {user && (user.id === c.authorId || ['admin', 'super-admin'].includes(user.memberRole)) && (
                      <button
                        type="button"
                        onClick={() => deleteCommentMutation.mutate(c.id)}
                        disabled={deleteCommentMutation.isPending}
                        className="self-start mt-1 shrink-0 text-white/20 transition hover:text-red-400 disabled:opacity-50"
                        title="Delete comment"
                        aria-label="Delete comment"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </article>
      </Container>
    </div>
  );
}
