import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import type { Connection, InboxThread } from '../../types/auth';
import type { ArticleStats, Insight, WriterApplication } from '../../types/content';
import { cn } from '../../lib/utils';

function StatCard({
  value,
  label,
  icon,
  to,
}: {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/8"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs font-medium text-white/45">{label}</p>
      </div>
    </Link>
  );
}

function getInitials(firstName?: string, lastName?: string, username?: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return (username ?? 'U').slice(0, 2).toUpperCase();
}

function formatRelative(dateStr?: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardHomePage() {
  const { user } = useAuth();

  const { data: connections = [] } = useQuery<Connection[]>({
    queryKey: ['connections'],
    queryFn: () => apiClient.getMyConnections().then((r) => r.data),
  });

  const { data: inbox = [] } = useQuery<InboxThread[]>({
    queryKey: ['inbox'],
    queryFn: () => apiClient.getInbox().then((r) => r.data),
  });

  const { data: members = [] } = useQuery<{ id: number }[]>({
    queryKey: ['membersDirectory'],
    queryFn: () => apiClient.getMembersDirectory().then((r) => r.data),
  });
  const role = user?.memberRole ?? 'member';
  const isAdmin = role === 'admin' || role === 'super-admin';
  const isWriter = role === 'editor' || isAdmin;
  const { data: editorial } = useQuery<{
    stats: ArticleStats;
    pendingArticles?: Insight[];
    pendingApplications?: WriterApplication[];
  }>({
    queryKey: ['dashboard-editorial-overview', role],
    queryFn: async () => {
      if (isAdmin) return apiClient.getEditorialAdminOverview().then((response) => response.data);
      return apiClient.getMyArticles().then((response) => ({ stats: response.data.stats }));
    },
    enabled: isWriter,
  });

  const accepted = connections.filter((c) => c.status === 'accepted');
  const pending = connections.filter((c) => c.status === 'pending' && c.direction === 'received');
  const unread = inbox.reduce((sum, t) => sum + t.unreadCount, 0);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.firstName ?? user?.username ?? 'Member';
  const profileComplete =
    !!(user?.bio && user?.occupation && user?.location && (user?.skills?.length ?? 0) > 0);

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-400">{greet()}</p>
          <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">{displayName} 👋</h1>
          <p className="mt-1 text-sm text-white/45">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link
          to="/dashboard/profile"
          className="hidden shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/8 hover:text-white sm:flex"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit profile
        </Link>
      </div>

      {/* Profile completeness banner */}
      {!profileComplete ? (
        <Link
          to="/dashboard/profile"
          className="mb-8 flex items-center gap-4 rounded-2xl border border-sky-500/30 bg-sky-500/8 p-4 transition hover:border-sky-500/50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-sky-300">Complete your profile</p>
            <p className="text-xs text-sky-400/60">Add your bio, occupation, location, and skills to be discoverable in the member directory.</p>
          </div>
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : null}

      {isWriter && editorial?.stats ? (
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.13em] text-white/50">{isAdmin ? 'Editorial overview' : 'Your writing overview'}</h2>
            <Link to={isAdmin ? '/dashboard/article-review' : '/dashboard/articles'} className="text-xs font-semibold text-sky-400 hover:text-sky-300">Open workspace →</Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ['Drafts', editorial.stats.draft],
              ['In review', editorial.stats.pendingReview],
              ['Published', editorial.stats.published],
              ['Rejected', editorial.stats.rejected],
              ['Total reads', editorial.stats.totalReads],
              ['Comments', editorial.stats.totalComments],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs text-white/40">{label}</p>
              </div>
            ))}
          </div>
          {isAdmin && ((editorial.pendingArticles?.length ?? 0) > 0 || (editorial.pendingApplications?.length ?? 0) > 0) ? (
            <Link to="/dashboard/article-review" className="mt-4 flex items-center justify-between rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-200">
              <span><strong>{editorial.pendingArticles?.length ?? 0}</strong> article reviews and <strong>{editorial.pendingApplications?.length ?? 0}</strong> writer approvals are waiting.</span>
              <span>Review now →</span>
            </Link>
          ) : null}
        </section>
      ) : null}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          value={accepted.length}
          label="Connections"
          to="/dashboard/connections"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          }
        />
        <StatCard
          value={unread || '—'}
          label="Unread messages"
          to="/dashboard/messages"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        <StatCard
          value={pending.length || '—'}
          label="Pending requests"
          to="/dashboard/connections"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          }
        />
        <StatCard
          value={members.length}
          label="Community members"
          to="/dashboard/directory"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent messages */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.13em] text-white/50">Recent messages</h2>
            <Link to="/dashboard/messages" className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/8 bg-white/4">
            {inbox.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/20">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-medium text-white/30">No messages yet</p>
                <Link to="/dashboard/directory" className="mt-2 text-xs text-sky-400 hover:text-sky-300 transition-colors">
                  Connect with members →
                </Link>
              </div>
            ) : (
              inbox.slice(0, 4).map((thread, idx) => (
                <Link
                  key={thread.partner?.id ?? idx}
                  to={`/dashboard/messages/${thread.partner?.id}`}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3.5 transition hover:bg-white/5',
                    idx !== 0 && 'border-t border-white/8',
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-orange-500 text-xs font-black text-white">
                    {getInitials(thread.partner?.firstName, thread.partner?.lastName, thread.partner?.username)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {thread.partner?.firstName && thread.partner?.lastName
                          ? `${thread.partner.firstName} ${thread.partner.lastName}`
                          : thread.partner?.username}
                      </p>
                      <p className="shrink-0 text-[11px] text-white/30">
                        {formatRelative(thread.latestMessage?.createdAt)}
                      </p>
                    </div>
                    <p className="truncate text-xs text-white/40">{thread.latestMessage?.content}</p>
                  </div>
                  {thread.unreadCount > 0 ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[10px] font-black text-white">
                      {thread.unreadCount}
                    </span>
                  ) : null}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-[0.13em] text-white/50">Quick actions</h2>
          <div className="mt-3 space-y-2">
            {[
              { to: '/dashboard/directory', label: 'Browse the directory', desc: 'Find and connect with members', color: 'sky' },
              { to: '/dashboard/profile', label: 'Update your profile', desc: 'Bio, skills, visibility', color: 'orange' },
              { to: '/events', label: 'Explore events', desc: 'See what\'s coming up', color: 'purple' },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3.5 transition hover:border-white/20 hover:bg-white/8"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{a.label}</p>
                  <p className="text-xs text-white/35">{a.desc}</p>
                </div>
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/50" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
