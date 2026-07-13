import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useInsights } from '../hooks/use-content-query';
import { useAuth } from '../contexts/AuthContext';
import { ARTICLE_CATEGORIES } from '../constants/article-categories';

const INSIGHT_FILTERS = ['All', ...ARTICLE_CATEGORIES] as const;

function formatInsightDate(value?: string) {
  if (!value) return 'Date unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function textPreview(value: string) {
  const plainText = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plainText.length <= 120) return plainText;
  return `${plainText.slice(0, 120)}...`;
}

function toAssetUrl(path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default function InsightsPage() {
  const { user } = useAuth();
  const { data = [], isLoading, isError, error } = useInsights();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const availableFilters = useMemo(
    () => [...new Set([...INSIGHT_FILTERS, ...data.map((insight) => insight.category).filter(Boolean)])],
    [data],
  );

  const filteredInsights = useMemo(() => {
    if (activeFilter === 'All') return data;
    return data.filter((insight) => insight.category === activeFilter);
  }, [activeFilter, data]);

  const filterButtonClass = (filter: string) =>
    `rounded-full border px-4 py-1.5 text-xs font-bold transition ${
      activeFilter === filter
        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
    }`;

  return (
    <>
      <PageSeo
        title="The Wire | Technical articles from Tech Derby"
        description="Technical tutorials, practical career insight, and community perspectives written by Tech Derby contributors."
      />

      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              The Wire
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Ideas, code and insight
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                from Derby's tech community.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Practical technical writing, tutorials, career insight, and informed perspectives from local builders,
              engineers, founders, students, and community voices.
            </p>
            <Link
              to={user ? '/dashboard/writer-application' : '/register'}
              className="mt-7 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Apply to write for The Wire
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Browse Articles</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900">Latest Articles</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableFilters.map((filter) => (
                  <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={filterButtonClass(filter)}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? <p className="mt-8 text-sm text-slate-600">Loading articles...</p> : null}
            {isError ? (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="text-sm text-red-700">Could not load articles: {error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            ) : null}

            {!isLoading && !isError ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredInsights.map((insight) => (
                  <Link key={insight.id} to={`/wire/${insight.slug}`} className="group block">
                    <article className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100" />
                      <img
                        src={toAssetUrl(insight.featuredImageUrl || insight.featuredImage)}
                        alt={insight.title}
                        className="h-48 w-full border-b border-slate-200 object-cover"
                        loading="lazy"
                      />
                      <div className="p-5">
                        <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                          {insight.category}
                        </span>
                        <h3 className="mt-3 text-xl font-black leading-tight text-slate-900">{insight.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{insight.excerpt || textPreview(insight.content)}</p>
                        <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-semibold">{insight.author || 'Tech Derby'}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatInsightDate(insight.publishedAt ?? insight.createdAt)}</span>
                        </div>
                        <div className="mt-3 flex gap-4 text-xs text-slate-400">
                          <span>{insight.readCount ?? 0} reads</span>
                          <span>{insight.likeCount ?? 0} likes</span>
                          <span>{insight.commentCount ?? 0} comments</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : null}

            {!isLoading && !isError && filteredInsights.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
                No articles in this category yet.
              </div>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}
