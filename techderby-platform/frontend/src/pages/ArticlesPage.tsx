import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Container } from '../components/ui/Container';
import { cn } from '../lib/utils';
import type { Article } from '../types/content';

function formatDate(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ArticlesPage() {
  const [activeTag, setActiveTag] = useState<string>('All');

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['publishedArticles'],
    queryFn: () => apiClient.getPublishedArticles().then((r) => r.data.data ?? []),
  });

  // Collect unique tags from all articles
  const allTags = Array.from(
    new Set(articles.flatMap((a) => a.tags ?? []))
  ).sort();

  const filtered = activeTag === 'All'
    ? articles
    : articles.filter((a) => a.tags?.includes(activeTag));

  return (
    <div className="min-h-screen bg-[#07090f] text-white">

      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-white/[0.05] bg-gradient-to-br from-sky-500/5 via-[#07090f] to-[#07090f] py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.08),transparent_60%)]" />
        <Container>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-sky-400">Tech Derby</p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
            Articles &amp; Insights
          </h1>
          <p className="max-w-xl text-lg text-white/45 leading-relaxed">
            Expert perspectives from Derby and the East Midlands tech community. Written by industry leaders, founders, and innovators.
          </p>
        </Container>
      </div>

      <Container className="py-12">

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center gap-2">
            {['All', ...allTags].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-semibold transition',
                  activeTag === tag
                    ? 'border-sky-500/40 bg-sky-500/15 text-sky-300'
                    : 'border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/70',
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/30">
            <svg viewBox="0 0 24 24" className="mb-3 h-10 w-10 text-white/10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <p className="font-semibold">No articles yet</p>
            <p className="mt-1 text-xs text-white/20">Check back soon for community insights</p>
          </div>
        ) : (
          <>
            {/* Featured article (first) */}
            {filtered.length > 0 && <FeaturedArticleCard article={filtered[0]} />}

            {/* Grid */}
            {filtered.length > 1 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.slice(1).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

/* ── Featured card (wide) ────────────────────────────────────────────────── */
function FeaturedArticleCard({ article }: { article: Article }) {
  const coverImage = article.coverImageUrl ?? article.featuredImage;

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group mb-6 flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition hover:border-white/[0.14] hover:bg-white/[0.04] md:flex-row"
    >
      {/* Cover */}
      <div className="relative h-56 shrink-0 overflow-hidden bg-gradient-to-br from-sky-500/10 to-indigo-500/5 md:h-auto md:w-[45%]">
        {coverImage ? (
          <img src={coverImage} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/10">
            <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
        )}
        {article.tags && article.tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 2).map((t) => (
              <span key={t} className="rounded-full border border-sky-500/30 bg-[#07090f]/85 px-2.5 py-0.5 text-[10px] font-bold text-sky-300 backdrop-blur-sm">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <span className="mb-3 inline-block text-[10px] font-black uppercase tracking-[0.2em] text-sky-400/70">Featured</span>
          <h2 className="mb-3 text-xl font-black leading-snug text-white transition group-hover:text-sky-200 md:text-2xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-sm text-white/45 leading-relaxed line-clamp-3">{article.excerpt}</p>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          {article.authorAvatar ? (
            <img src={article.authorAvatar} alt={article.authorName ?? undefined} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/50 to-indigo-500/50 text-xs font-black text-white">
              {(article.authorName ?? 'A')[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/70">{article.authorName ?? 'Tech Derby Author'}</p>
            <div className="flex items-center gap-2 text-[11px] text-white/30">
              {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
              {article.readTime && <span>· {article.readTime} min</span>}
              {article.views !== undefined && <span>· {article.views.toLocaleString()} views</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Regular article card ────────────────────────────────────────────────── */
function ArticleCard({ article }: { article: Article }) {
  const coverImage = article.coverImageUrl ?? article.featuredImage;

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition hover:border-white/[0.14] hover:bg-white/[0.04]"
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-sky-500/8 to-indigo-500/4">
        {coverImage ? (
          <img src={coverImage} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/10">
            <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
            </svg>
          </div>
        )}
        {article.tags && article.tags.length > 0 && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full border border-sky-500/30 bg-[#07090f]/85 px-2.5 py-0.5 text-[10px] font-bold text-sky-300 backdrop-blur-sm">
              {article.tags[0]}
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-white transition group-hover:text-sky-200">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mb-4 line-clamp-2 text-xs text-white/40 leading-relaxed">{article.excerpt}</p>
        )}

        <div className="mt-auto flex items-center gap-2">
          {article.authorAvatar ? (
            <img src={article.authorAvatar} alt={article.authorName ?? undefined} className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/40 to-indigo-500/40 text-[9px] font-black text-white">
              {(article.authorName ?? 'A')[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-white/55">{article.authorName ?? 'Tech Derby Author'}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[10px] text-white/25">
            {article.readTime && <span>{article.readTime}m</span>}
            {article.views !== undefined && (
              <span className="flex items-center gap-0.5">
                <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {article.views.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
