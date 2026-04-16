import { useEffect, useState } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { apiClient } from '../lib/api';

// ─────────────────────── types ──────────────────────────────────────────────

type JudgeApplication = {
  id: number | string;
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;
  currentRole: string;
  organisation: string;
  professionalBackground: string;
  expertiseAreas: string;
  expertiseOther: string;
  judgingCategories: string;
  motivation: string;
  previousJudgeExperience: string;
  previousJudgeDetails: string;
  availableForJudging: boolean;
  willingToCommit: boolean;
  declareFairness: boolean;
  agreeContact: boolean;
  createdAt: string;
};

// ─────────────────────── helpers ────────────────────────────────────────────

const CSV_HEADERS: Array<{ key: keyof JudgeApplication; label: string }> = [
  { key: 'id', label: 'ID' },
  { key: 'createdAt', label: 'Submitted At' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'linkedIn', label: 'LinkedIn / Website' },
  { key: 'currentRole', label: 'Current Role' },
  { key: 'organisation', label: 'Organisation' },
  { key: 'professionalBackground', label: 'Professional Background' },
  { key: 'expertiseAreas', label: 'Expertise Areas' },
  { key: 'expertiseOther', label: 'Expertise (Other)' },
  { key: 'judgingCategories', label: 'Judging Category Preferences' },
  { key: 'motivation', label: 'Motivation' },
  { key: 'previousJudgeExperience', label: 'Previous Judge Experience' },
  { key: 'previousJudgeDetails', label: 'Previous Experience Details' },
  { key: 'availableForJudging', label: 'Available for Judging' },
  { key: 'willingToCommit', label: 'Willing to Commit (3–5h)' },
  { key: 'declareFairness', label: 'Declaration: Fairness' },
  { key: 'agreeContact', label: 'Agree to Contact' },
];

function escapeCsvCell(value: unknown): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(applications: JudgeApplication[]) {
  const header = CSV_HEADERS.map((h) => h.label).join(',');
  const rows = applications.map((a) =>
    CSV_HEADERS.map((h) => escapeCsvCell(a[h.key])).join(','),
  );
  const csv = [header, ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `techderby-judge-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─────────────────────── detail drawer ──────────────────────────────────────

function ApplicationDrawer({ app, onClose }: { app: JudgeApplication; onClose: () => void }) {
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

  const BoolField = ({ label, value }: { label: string; value: boolean }) => (
    <div className="flex items-center gap-3">
      <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {value ? <path d="m2 6 3 3 5-5" /> : <path d="M3 3l6 6M9 3l-6 6" />}
        </svg>
      </span>
      <span className="text-sm text-slate-700">{label}</span>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Judge application details"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Judge Application</p>
            <h2 className="mt-0.5 text-lg font-extrabold text-slate-900 leading-snug">{app.fullName}</h2>
            <p className="text-sm text-slate-500">{app.currentRole} · {app.organisation}</p>
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

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          <Section title="Personal Information">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" value={app.fullName} />
              <Field label="Email" value={app.email} />
              <Field label="Phone" value={app.phone} />
              <Field label="Submitted" value={formatDate(app.createdAt)} />
            </div>
            <Field label="LinkedIn / Website" value={app.linkedIn} />
          </Section>

          <Section title="Professional Background">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Current Role" value={app.currentRole} />
              <Field label="Organisation" value={app.organisation} />
            </div>
            <Field label="Background" value={app.professionalBackground} />
          </Section>

          <Section title="Expertise & Preferences">
            <Field label="Expertise Areas" value={app.expertiseAreas} />
            {app.expertiseOther && <Field label="Other Expertise" value={app.expertiseOther} />}
            <Field label="Preferred Judging Categories" value={app.judgingCategories} />
          </Section>

          <Section title="Motivation & Experience">
            <Field label="Motivation" value={app.motivation} />
            <Field label="Previous Judge / Mentor / Advisor?" value={app.previousJudgeExperience === 'yes' ? 'Yes' : 'No'} />
            {app.previousJudgeExperience === 'yes' && (
              <Field label="Experience Details" value={app.previousJudgeDetails} />
            )}
          </Section>

          <Section title="Availability & Declaration">
            <div className="space-y-3">
              <BoolField label="Available for judging period" value={app.availableForJudging} />
              <BoolField label="Willing to commit 3–5 hours" value={app.willingToCommit} />
              <BoolField label="Declaration of fairness & confidentiality" value={app.declareFairness} />
              <BoolField label="Agrees to contact" value={app.agreeContact} />
            </div>
          </Section>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────── main page ──────────────────────────────────────────

export default function JudgeApplicationsAdminPage() {
  const [applications, setApplications] = useState<JudgeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<JudgeApplication | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiClient.getJudgeApplications();
        const raw: unknown[] = res.data?.data ?? res.data ?? [];
        const mapped: JudgeApplication[] = raw.map((item: unknown) => {
          const r = item as Record<string, unknown>;
          const attrs = (r.attributes as Record<string, unknown>) ?? r;
          return {
            id: (r.documentId ?? r.id) as number,
            fullName:               (attrs.fullName as string) ?? '',
            email:                  (attrs.email as string) ?? '',
            phone:                  (attrs.phone as string) ?? '',
            linkedIn:               (attrs.linkedIn as string) ?? '',
            currentRole:            (attrs.currentRole as string) ?? '',
            organisation:           (attrs.organisation as string) ?? '',
            professionalBackground: (attrs.professionalBackground as string) ?? '',
            expertiseAreas:         (attrs.expertiseAreas as string) ?? '',
            expertiseOther:         (attrs.expertiseOther as string) ?? '',
            judgingCategories:      (attrs.judgingCategories as string) ?? '',
            motivation:             (attrs.motivation as string) ?? '',
            previousJudgeExperience:(attrs.previousJudgeExperience as string) ?? '',
            previousJudgeDetails:   (attrs.previousJudgeDetails as string) ?? '',
            availableForJudging: Boolean(attrs.availableForJudging),
            willingToCommit:     Boolean(attrs.willingToCommit),
            declareFairness:     Boolean(attrs.declareFairness),
            agreeContact:        Boolean(attrs.agreeContact),
            createdAt:           (attrs.createdAt as string) ?? '',
          };
        });
        setApplications(mapped);
      } catch {
        setError('Failed to load applications. Ensure the CMS is running and you are authorised.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = applications.filter((a) => {
    if (!search) return true;
    return [a.fullName, a.email, a.currentRole, a.organisation, a.expertiseAreas, a.judgingCategories]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const availableCount = applications.filter((a) => a.availableForJudging).length;

  return (
    <>
      <PageSeo
        title="Judge Applications | TechDerby Admin"
        description="Admin dashboard for TechDerby Awards 2026 judge applications."
      />

      <div className="min-h-screen bg-slate-50 pb-24">
        {/* ── Header ── */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Admin Dashboard</p>
                <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
                  Judge Applications 2026
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  TechDerby Digital Excellence Awards — all judge applications
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
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Applications</p>
                <p className="mt-1 text-3xl font-extrabold text-orange-500">{applications.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Available to Judge</p>
                <p className="mt-1 text-3xl font-extrabold text-emerald-500">{availableCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Showing</p>
                <p className="mt-1 text-3xl font-extrabold text-slate-800">{filtered.length}</p>
              </div>
            </div>
          )}

          {/* ── Search ── */}
          <div className="mb-5">
            <div className="relative max-w-sm">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, role, or expertise…"
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
              />
            </div>
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
              <p className="text-3xl mb-3">⚖️</p>
              <p className="font-semibold text-slate-700">No applications found</p>
              <p className="mt-1 text-sm text-slate-400">
                {applications.length === 0
                  ? 'No judge applications have been submitted yet.'
                  : 'Try adjusting your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">#</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Applicant</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Role & Org</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Expertise</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Available</th>
                      <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Submitted</th>
                      <th className="px-5 py-3.5" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((a) => (
                      <tr
                        key={a.id}
                        className="cursor-pointer transition-colors hover:bg-orange-50/40"
                        onClick={() => setSelected(a)}
                      >
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">#{a.id}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">{a.fullName}</p>
                          <p className="text-xs text-slate-400">{a.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700">{a.currentRole}</p>
                          <p className="text-xs text-slate-400">{a.organisation}</p>
                        </td>
                        <td className="px-5 py-4 max-w-[200px]">
                          <p className="truncate text-xs text-slate-500">{a.expertiseAreas}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                            a.availableForJudging
                              ? 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                              : 'bg-slate-100 text-slate-500 ring-slate-200'
                          }`}>
                            {a.availableForJudging ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">{formatDate(a.createdAt)}</td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelected(a); }}
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
                Showing {filtered.length} of {applications.length} applications
              </div>
            </div>
          )}
        </Container>
      </div>

      {selected && (
        <ApplicationDrawer app={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
