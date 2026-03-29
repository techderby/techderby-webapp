import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { PartnerCard } from '../components/PartnerCard';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { usePartners } from '../hooks/use-content-query';

const FILTER_CATEGORIES = ['all', 'universities', 'employers', 'startups', 'community', 'ecosystem'] as const;
type FilterCategory = (typeof FILTER_CATEGORIES)[number];

function normalizePartnerCategory(partner: { name: string; partnerType?: string; category?: string }): Exclude<FilterCategory, 'all'> {
  const rawCategory = (partner.partnerType ?? partner.category ?? '').toLowerCase().trim();
  const nameLooksUniversity = /\buniversity\b|\bcollege\b/i.test(partner.name);

  if (nameLooksUniversity) return 'universities';

  const normalized = rawCategory;
  if (normalized === 'education' || normalized === 'universities') return 'universities';
  if (normalized === 'sponsor' || normalized === 'employers') return 'employers';
  if (normalized === 'core' || normalized === 'startups') return 'startups';
  if (normalized === 'ecosystem') return 'ecosystem';
  return 'community';
}

const categoryLabel: Record<string, string> = {
  all: 'All partners',
  universities: 'Universities and colleges',
  employers: 'Employers and recruiters',
  startups: 'Startups and founders',
  community: 'Community and third sector organisations',
  ecosystem: 'Ecosystem partners',
};

export default function PartnersPage() {
  const { data, isLoading, isError, error } = usePartners();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const filteredPartners = useMemo(() => {
    if (!data) return [];
    if (activeCategory === 'all') return data;
    return data.filter((partner) => normalizePartnerCategory(partner) === activeCategory);
  }, [activeCategory, data]);

  const categoryCount = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      all: data?.length ?? 0,
      universities: 0,
      employers: 0,
      startups: 0,
      community: 0,
      ecosystem: 0,
    };
    (data ?? []).forEach((partner) => {
      const mappedCategory = normalizePartnerCategory(partner);
      counts[mappedCategory] += 1;
    });
    return counts;
  }, [data]);

  const filterButtonClass = (category: string) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition ${
      activeCategory === category
        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
    }`;

  return (
    <>
      <PageSeo title="Tech Derby | Partners" description="Partners supporting Tech Derby through events, speakers, and pathways into tech." />

      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Our Network
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Partners supporting
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                Tech Derby.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Tech Derby is stronger when organisations invest locally. Our partners support events, speakers,
              opportunities, and pathways into tech for students and professionals.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-900 md:text-2xl">Filter partners</h2>
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredPartners.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{categoryCount.all}</span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {FILTER_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={filterButtonClass(category)}
                >
                  {categoryLabel[category] ?? category}{' '}
                  <span className="ml-1 opacity-80">({categoryCount[category] ?? 0})</span>
                </button>
              ))}
            </div>
          </div>

          {isLoading ? <p className="mt-8 text-sm text-slate-700">Loading partners...</p> : null}
          {isError ? (
            <p className="mt-8 text-sm text-red-700">
              Could not load partners: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          ) : null}

          {!isLoading && !isError ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPartners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)}
            </div>
          ) : null}

          {!isLoading && !isError && (!data || data.length === 0) ? (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
              No partners are published yet. Add partner entries in the backend to display them here.
            </div>
          ) : null}

          {!isLoading && !isError && (data?.length ?? 0) > 0 && filteredPartners.length === 0 ? (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
              No partners match this filter yet.
            </div>
          ) : null}

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-10">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">Become A Partner</p>
              <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">Want to partner with us?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                Sponsor a meetup, offer a speaker, or open opportunities for the community.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link to="/contact">
                  <Button className="h-12 rounded-full px-8 text-sm shadow-lg shadow-orange-900/30">Contact Us</Button>
                </Link>
                <a
                  href="mailto:hello@techderby.org"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15"
                >
                  hello@techderby.org
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
