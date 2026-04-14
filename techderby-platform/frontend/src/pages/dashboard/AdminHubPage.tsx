import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { cn } from '../../lib/utils';
import type { AdminStats, MemberRole } from '../../types/content';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
  to,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent: string;
  to?: string;
}) {
  const inner = (
    <div className={cn('group relative overflow-hidden rounded-2xl border p-5 transition', 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]')}>
      <div className={cn('absolute inset-x-0 top-0 h-[2px]', accent)} />
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-white/35">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/30">{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : <div>{inner}</div>;
}

// ── Role badge ────────────────────────────────────────────────────────────────
const ROLE_BADGE: Record<string, string> = {
  'super-admin': 'text-purple-300 border-purple-500/30 bg-purple-500/10',
  admin:         'text-sky-300 border-sky-500/30 bg-sky-500/10',
  editor:        'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  member:        'text-white/40 border-white/10 bg-white/5',
};

function RoleBadge({ role }: { role?: MemberRole | string }) {
  const r = role ?? 'member';
  const label = r === 'super-admin' ? 'Super Admin' : r.charAt(0).toUpperCase() + r.slice(1);
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', ROLE_BADGE[r] ?? ROLE_BADGE.member)}>
      {label}
    </span>
  );
}

// ── Quick action ──────────────────────────────────────────────────────────────
function ActionCard({ to, icon, label, desc, accent }: { to: string; icon: React.ReactNode; label: string; desc: string; accent: string }) {
  return (
    <Link
      to={to}
      className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-white/[0.14] hover:bg-white/[0.05]"
    >
      <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', accent)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-white/40">{desc}</p>
      </div>
      <svg viewBox="0 0 24 24" className="ml-auto mt-1 h-4 w-4 shrink-0 text-white/20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </Link>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function AdminHubPage() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: () => apiClient.getAdminStats().then((r) => r.data),
    refetchInterval: 60_000,
  });

  const roleColors: Record<string, string> = {
    'super-admin': 'bg-purple-500',
    admin:         'bg-sky-500',
    editor:        'bg-emerald-500',
    member:        'bg-slate-500',
  };

  const totalUsers = stats?.users.total ?? 0;

  return (
    <div className="p-6 md:p-10">

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-sky-400">Admin</p>
        <h1 className="text-2xl font-black text-white md:text-3xl">Admin Hub</h1>
        <p className="mt-1 text-sm text-white/45">Platform overview and quick actions.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
        </div>
      ) : (
        <>
          {/* ── Stats grid ── */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Pending Reviews"
              value={stats?.articles.pending ?? 0}
              sub="Articles awaiting review"
              accent="bg-gradient-to-r from-amber-500 to-orange-500"
              to="/dashboard/admin/articles"
            />
            <StatCard
              label="Author Applications"
              value={stats?.authorApplications.pending ?? 0}
              sub="Awaiting approval"
              accent="bg-gradient-to-r from-sky-500 to-blue-500"
              to="/dashboard/admin/authors"
            />
            <StatCard
              label="Published Articles"
              value={stats?.articles.published ?? 0}
              sub={`${stats?.articles.total ?? 0} total`}
              accent="bg-gradient-to-r from-emerald-500 to-teal-500"
            />
            <StatCard
              label="Total Members"
              value={stats?.users.total ?? 0}
              sub="Registered accounts"
              accent="bg-gradient-to-r from-violet-500 to-indigo-500"
              to="/dashboard/admin/users"
            />
          </div>

          {/* ── Two-column: quick actions + role breakdown ── */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">

            {/* Quick actions */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/35">Quick Actions</p>
              <div className="space-y-2">
                <ActionCard
                  to="/dashboard/admin/articles"
                  icon={<svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                  label="Review Articles"
                  desc={`${stats?.articles.pending ?? 0} pending · ${stats?.articles.inReview ?? 0} in review`}
                  accent="bg-amber-500/15"
                />
                <ActionCard
                  to="/dashboard/admin/authors"
                  icon={<svg viewBox="0 0 24 24" className="h-4 w-4 text-sky-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>}
                  label="Author Applications"
                  desc={`${stats?.authorApplications.pending ?? 0} pending applications`}
                  accent="bg-sky-500/15"
                />
                <ActionCard
                  to="/dashboard/admin/users"
                  icon={<svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                  label="Manage Users"
                  desc={`${stats?.users.total ?? 0} registered members`}
                  accent="bg-violet-500/15"
                />
                <ActionCard
                  to="/dashboard/author/articles/new"
                  icon={<svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                  label="Write an Article"
                  desc="Create and publish content as admin"
                  accent="bg-emerald-500/15"
                />
              </div>
            </div>

            {/* Role breakdown */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/35">Members by Role</p>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                {totalUsers === 0 ? (
                  <p className="text-sm text-white/30">No user data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(['member', 'editor', 'admin', 'super-admin'] as const).map((r) => {
                      const count = stats?.users.byRole[r] ?? 0;
                      const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
                      return (
                        <div key={r}>
                          <div className="mb-1 flex items-center justify-between">
                            <RoleBadge role={r} />
                            <span className="text-xs font-bold text-white/50">{count}</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                            <div
                              className={cn('h-full rounded-full transition-all duration-700', roleColors[r])}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Article pipeline */}
              <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.12em] text-white/35">Article Pipeline</p>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <div className="space-y-2">
                  {([
                    { key: 'pending',   label: 'Awaiting Review', color: 'bg-amber-500',   val: stats?.articles.pending ?? 0 },
                    { key: 'inReview',  label: 'In Review',       color: 'bg-blue-500',    val: stats?.articles.inReview ?? 0 },
                    { key: 'published', label: 'Published',       color: 'bg-emerald-500', val: stats?.articles.published ?? 0 },
                    { key: 'rejected',  label: 'Rejected',        color: 'bg-red-500',     val: stats?.articles.rejected ?? 0 },
                  ]).map(({ key, label, color, val }) => {
                    const total = stats?.articles.total ?? 1;
                    const pct = total > 0 ? (val / total) * 100 : 0;
                    return (
                      <div key={key}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-white/45">{label}</span>
                          <span className="font-bold text-white/60">{val}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Recent submissions ── */}
          {(stats?.recentSubmissions.length ?? 0) > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">Recent Submissions</p>
                <Link to="/dashboard/admin/articles" className="text-xs font-semibold text-sky-400 hover:text-sky-300">
                  View all →
                </Link>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
                {stats?.recentSubmissions.map((sub, i) => (
                  <div
                    key={sub.id}
                    className={cn(
                      'flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/[0.03]',
                      i !== 0 && 'border-t border-white/[0.06]',
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{sub.title}</p>
                      <p className="text-[11px] text-white/35">
                        {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {sub.tags?.length ? ` · ${sub.tags.slice(0, 2).join(', ')}` : ''}
                      </p>
                    </div>
                    <Link
                      to="/dashboard/admin/articles"
                      className="ml-2 shrink-0 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-[11px] font-bold text-amber-300 transition hover:border-amber-500/35 hover:bg-amber-500/15"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
