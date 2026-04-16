import { useEffect, useState } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { apiClient } from '../lib/api';

// ─────────────────────── types ──────────────────────────────────────────────

type Nomination = {
  id: number;
  nominatorName: string;
  nominatorEmail: string;
  nominatorOrganisation: string;
  nominatorRole: string;
  nominationType: string;
  nomineeName: string;
  nomineeEmail: string;
  nomineeOrganisation: string;
  nomineeRole: string;
  nomineeLinkedIn: string;
  awardCategory: string;
  whyNominating: string;
  techEcosystemImpact: string;
  measurableAchievements: string;
  techDerbyAlignment: string;
  mediaLinks: string;
  additionalComments: string;
  consentAccurate: boolean;
  consentContact: boolean;
  consentPromotional: boolean;
  createdAt: string;
};

// ─────────────────────── helpers ────────────────────────────────────────────

const CSV_HEADERS: Array<{ key: keyof Nomination; label: string }> = [
  { key: 'id', label: 'ID' },
  { key: 'createdAt', label: 'Submitted At' },
  { key: 'nominatorName', label: 'Nominator Name' },
  { key: 'nominatorEmail', label: 'Nominator Email' },
  { key: 'nominatorOrganisation', label: 'Nominator Organisation' },
  { key: 'nominatorRole', label: 'Nominator Role' },
  { key: 'nominationType', label: 'Nomination Type' },
  { key: 'nomineeName', label: 'Nominee Name' },
  { key: 'nomineeEmail', label: 'Nominee Email' },
  { key: 'nomineeOrganisation', label: 'Nominee Organisation' },
  { key: 'nomineeRole', label: 'Nominee Role' },
  { key: 'nomineeLinkedIn', label: 'Nominee LinkedIn/Website' },
  { key: 'awardCategory', label: 'Award Category' },
  { key: 'whyNominating', label: 'Why Nominating' },
  { key: 'techEcosystemImpact', label: 'Tech Ecosystem Impact' },
  { key: 'measurableAchievements', label: 'Measurable Achievements' },
  { key: 'techDerbyAlignment', label: 'TechDerby Alignment' },
  { key: 'mediaLinks', label: 'Media / Project Links' },
  { key: 'additionalComments', label: 'Additional Comments' },
  { key: 'consentAccurate', label: 'Consent: Info Accurate' },
  { key: 'consentContact', label: 'Consent: Contact Nominee' },
  { key: 'consentPromotional', label: 'Consent: Promotional Use' },
];

function escapeCsvCell(value: unknown): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(nominations: Nomination[]) {
  const header = CSV_HEADERS.map((h) => h.label).join(',');
  const rows = nominations.map((n) =>
    CSV_HEADERS.map((h) => escapeCsvCell(n[h.key])).join(','),
  );
  const csv = [header, ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `techderby-awards-nominations-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─────────────────────── stat card ──────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${accent ?? 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

// ─────────────────────── detail drawer ──────────────────────────────────────

function NominationDrawer({ nomination, onClose }: { nomination: Nomination; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h3 className="border-b border-slate-100 pb-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string | boolean | undefined | null }) => (
    <div>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm text-slate-800 whitespace-pre-wrap break-words">
        {value == null || value === '' ? <span className="italic text-slate-400">—</span> : String(value)}
      </p>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Nomination details"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Nomination #{nomination.id}</p>
            <h2 className="mt-0.5 text-lg font-extrabold text-slate-900 leading-snug">{nomination.nomineeName}</h2>
            <p className="text-sm text-slate-500">{nomination.awardCategory}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="mt-0.5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          <Section title="Nominator">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={nomination.nominatorName} />
              <Field label="Email" value={nomination.nominatorEmail} />
              <Field label="Organisation" value={nomination.nominatorOrganisation} />
              <Field label="Role" value={nomination.nominatorRole} />
              <Field label="Nomination type" value={nomination.nominationType === 'self' ? 'Self-nomination' : 'Nominating someone else'} />
              <Field label="Submitted" value={formatDate(nomination.createdAt)} />
            </div>
          </Section>

          <Section title="Nominee">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={nomination.nomineeName} />
              <Field label="Email" value={nomination.nomineeEmail} />
              <Field label="Organisation" value={nomination.nomineeOrganisation} />
              <Field label="Role" value={nomination.nomineeRole} />
            </div>
            <Field label="LinkedIn / Website" value={nomination.nomineeLinkedIn} />
          </Section>

          <Section title="Nomination Statement">
            <Field label="Why nominating" value={nomination.whyNominating} />
            <Field label="Tech ecosystem impact" value={nomination.techEcosystemImpact} />
            <Field label="Measurable achievements" value={nomination.measurableAchievements} />
            <Field label="TechDerby alignment" value={nomination.techDerbyAlignment} />
          </Section>

          <Section title="Supporting Information">
            <Field label="Media / project links" value={nomination.mediaLinks} />
            <Field label="Additional comments" value={nomination.additionalComments} />
          </Section>

          <Section title="Consent">
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Information accurate', value: nomination.consentAccurate },
                { label: 'Contact nominee', value: nomination.consentContact },
                { label: 'Promotional use', value: nomination.consentPromotional },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {value ? <path d="m2 6 3 3 5-5" /> : <path d="M3 3l6 6M9 3l-6 6" />}
                    </svg>
                  </span>
                  <span className="text-sm text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────── main page ──────────────────────────────────────────

const CATEGORIES = [
  'All Categories',
  'Tech Founder of the Year',
  'Rising Star in Tech',
  'AI Innovation Award',
  'Cybersecurity Excellence Award',
  'Community Impact Award',
  'Women in Tech Leadership Award',
  'Startup of the Year',
  'Digital Transformation Leader',
  'Tech for Good Award',
  'Lifetime Achievement Award',
];

export default function AwardsNominationsAdminPage() {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [selected, setSelected] = useState<Nomination | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiClient.getNominations();
        // Strapi v5: data is an array of { id, ...attributes } or { id, attributes: {...} }
        const raw: unknown[] = res.data?.data ?? res.data ?? [];
        const mapped: Nomination[] = raw.map((item: unknown) => {
          const r = item as Record<string, unknown>;
          // Strapi v5: fields are directly on the object (no .attributes wrapper)
          // documentId is the v5 string ID; id is the legacy numeric ID
          const attrs = (r.attributes as Record<string, unknown>) ?? r;
          return {
            id: (r.documentId ?? r.id) as number,
            nominatorName: (attrs.nominatorName as string) ?? '',
            nominatorEmail: (attrs.nominatorEmail as string) ?? '',
            nominatorOrganisation: (attrs.nominatorOrganisation as string) ?? '',
            nominatorRole: (attrs.nominatorRole as string) ?? '',
            nominationType: (attrs.nominationType as string) ?? '',
            nomineeName: (attrs.nomineeName as string) ?? '',
            nomineeEmail: (attrs.nomineeEmail as string) ?? '',
            nomineeOrganisation: (attrs.nomineeOrganisation as string) ?? '',
            nomineeRole: (attrs.nomineeRole as string) ?? '',
            nomineeLinkedIn: (attrs.nomineeLinkedIn as string) ?? '',
            awardCategory: (attrs.awardCategory as string) ?? '',
            whyNominating: (attrs.whyNominating as string) ?? '',
            techEcosystemImpact: (attrs.techEcosystemImpact as string) ?? '',
            measurableAchievements: (attrs.measurableAchievements as string) ?? '',
            techDerbyAlignment: (attrs.techDerbyAlignment as string) ?? '',
            mediaLinks: (attrs.mediaLinks as string) ?? '',
            additionalComments: (attrs.additionalComments as string) ?? '',
            consentAccurate: Boolean(attrs.consentAccurate),
            consentContact: Boolean(attrs.consentContact),
            consentPromotional: Boolean(attrs.consentPromotional),
            createdAt: (attrs.createdAt as string) ?? '',
          };
        });
        setNominations(mapped);
      } catch {
        setError('Failed to load nominations. Ensure the CMS is running and you are authorised.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = nominations.filter((n) => {
    const matchesSearch =
      !search ||
      [n.nomineeName, n.nomineeEmail, n.nominatorName, n.nominatorEmail, n.awardCategory]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All Categories' || n.awardCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Per-category breakdown for stats
  const categoryCounts = nominations.reduce<Record<string, number>>((acc, n) => {
    acc[n.awardCategory] = (acc[n.awardCategory] ?? 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return (
    <>
      <PageSeo
        title="Awards Nominations | TechDerby Admin"
        description="Admin dashboard for TechDerby Digital Excellence Awards 2026 nominations."
      />

      <div className="min-h-screen bg-slate-50 pb-24">
        {/* ── Header ── */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Admin Dashboard</p>
                <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
                  Awards Nominations 2026
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  TechDerby Digital Excellence Awards — all submissions
                </p>
              </div>
              <button
                onClick={() => downloadCsv(filtered)}
                disabled={filtered.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Export CSV ({filtered.length})
              </button>
            </div>
          </div>
        </div>

        <Container className="max-w-7xl pt-8">
          {/* ── Stats ── */}
          {!loading && !error && (
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Total nominations" value={nominations.length} accent="text-orange-500" />
              <StatCard label="Unique categories" value={Object.keys(categoryCounts).length} />
              <StatCard label="Showing" value={filtered.length} />
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Top category</p>
                <p className="mt-1 truncate text-sm font-bold text-slate-800">{topCategory}</p>
                {topCategory !== '—' && (
                  <p className="text-xs text-slate-400">{categoryCounts[topCategory]} nominations</p>
                )}
              </div>
            </div>
          )}

          {/* ── Filters ── */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or category…"
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* ── Table ── */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <svg className="h-8 w-8 animate-spin text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="Loading">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
              <p className="text-3xl mb-3">🏆</p>
              <p className="font-semibold text-slate-700">No nominations found</p>
              <p className="mt-1 text-sm text-slate-400">
                {nominations.length === 0
                  ? 'No nominations have been submitted yet.'
                  : 'Try adjusting your search or category filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">#</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Nominee</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Category</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Nominator</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Type</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Submitted</th>
                      <th className="px-5 py-3.5" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((n) => (
                      <tr
                        key={n.id}
                        className="cursor-pointer transition-colors hover:bg-orange-50/40"
                        onClick={() => setSelected(n)}
                      >
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">#{n.id}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">{n.nomineeName}</p>
                          <p className="text-xs text-slate-400">{n.nomineeEmail}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600 ring-1 ring-orange-200">
                            {n.awardCategory}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700">{n.nominatorName}</p>
                          <p className="text-xs text-slate-400">{n.nominatorEmail}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                            n.nominationType === 'self'
                              ? 'bg-sky-50 text-sky-600 ring-sky-200'
                              : 'bg-slate-100 text-slate-600 ring-slate-200'
                          }`}>
                            {n.nominationType === 'self' ? 'Self' : 'Other'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">{formatDate(n.createdAt)}</td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelected(n); }}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-orange-500 transition-colors hover:bg-orange-50"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 px-5 py-3.5 text-xs text-slate-400">
                Showing {filtered.length} of {nominations.length} nominations
              </div>
            </div>
          )}
        </Container>
      </div>

      {selected && (
        <NominationDrawer nomination={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
