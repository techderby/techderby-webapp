import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import brandLogo from '../assets/images/techderbywhitelogo.webp';
import { cn } from '../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { ArticleStats } from '../types/content';

// ── Types & data ──────────────────────────────────────────────────────────────
type NavItem = { to: string; end?: boolean; label: string; icon: React.ReactNode };

const NAV_MAIN: NavItem[] = [
  {
    to: '/dashboard', end: true, label: 'Home',
    icon: <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
  {
    to: '/dashboard/profile', label: 'My Profile',
    icon: <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
  {
    to: '/dashboard/directory', label: 'Member Directory',
    icon: <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    to: '/dashboard/connections', label: 'Connections',
    icon: <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
  },
  {
    to: '/dashboard/messages', label: 'Messages',
    icon: <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  },
];

const NAV_MAILING_LIST: NavItem = {
  to: '/dashboard/mailing-list',
  label: 'Mailing List',
  icon: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
};

const NAV_ADMIN_EVENTS: NavItem = {
  to: '/dashboard/events',
  label: 'Manage Events',
  icon: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
    </svg>
  ),
};

const NAV_ARTICLES: NavItem = {
  to: '/dashboard/articles',
  label: 'Articles',
  icon: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 7h8M8 11h8" />
    </svg>
  ),
};

const NAV_ARTICLE_REVIEW: NavItem = {
  to: '/dashboard/article-review',
  label: 'Article Review',
  icon: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
};

const NAV_WRITERS: NavItem = {
  to: '/dashboard/writers',
  label: 'Manage Writers',
  icon: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const NAV_COMMUNITY = [
  {
    href: '/events', label: 'Events',
    icon: <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  },
  {
    href: '/wire', label: 'The Wire',
    icon: <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16l-2 2z" /></svg>,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(firstName?: string, lastName?: string, username?: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  return (username ?? 'U').slice(0, 2).toUpperCase();
}

const ROLE_META: Record<string, { label: string; dot: string; badge: string; from: string; to: string }> = {
  'super-admin': { label: 'Super Admin', dot: 'bg-purple-400',  badge: 'text-purple-300 border-purple-500/30 bg-purple-500/10', from: 'from-purple-500', to: 'to-indigo-500' },
  admin:         { label: 'Admin',       dot: 'bg-sky-400',     badge: 'text-sky-300 border-sky-500/30 bg-sky-500/10',          from: 'from-sky-500',    to: 'to-blue-500' },
  editor:        { label: 'Editor',      dot: 'bg-emerald-400', badge: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10', from: 'from-emerald-500', to: 'to-teal-500' },
  member:        { label: 'Member',      dot: 'bg-slate-400',   badge: 'text-white/45 border-white/10 bg-white/5',              from: 'from-sky-500',    to: 'to-orange-500' },
};

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group/tip relative">
      {children}
      <div className="pointer-events-none absolute left-full top-1/2 z-[200] ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-slate-800/95 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-150 group-hover/tip:opacity-100 group-hover/tip:translate-x-0 translate-x-[-4px]">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-800/95" />
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggle, onClose }: { collapsed: boolean; onToggle?: () => void; onClose?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.memberRole ?? 'member';
  const isAdmin = role === 'admin' || role === 'super-admin';
  const isWriter = role === 'editor' || isAdmin;
  const navItems = isAdmin
    ? [...NAV_MAIN, NAV_ARTICLES, NAV_ARTICLE_REVIEW, NAV_WRITERS, NAV_ADMIN_EVENTS, NAV_MAILING_LIST]
    : isWriter
      ? [...NAV_MAIN, NAV_ARTICLES]
      : NAV_MAIN;
  const articleStatsQuery = useQuery<{ stats: ArticleStats }>({
    queryKey: ['sidebar-article-stats'],
    queryFn: () => apiClient.getMyArticles().then((response) => response.data),
    enabled: isWriter,
    staleTime: 60_000,
  });
  const writerBadges = articleStatsQuery.data?.stats?.badges ?? [];
  const roleMeta = ROLE_META[role] ?? ROLE_META.member;
  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username ?? '';

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex h-full flex-col bg-[#07090f]">

      {/* ── Gradient crown ── */}
      <div className="h-[2px] shrink-0 bg-gradient-to-r from-sky-500 via-indigo-500 to-orange-500" />

      {/* ── Header ── */}
      <div className={cn(
        'flex h-16 shrink-0 items-center border-b border-white/[0.06]',
        collapsed ? 'justify-center px-0' : 'justify-between px-4',
      )}>
        {!collapsed && (
          <Link to="/" onClick={onClose} aria-label="Tech Derby home">
            <img src={brandLogo} alt="Tech Derby" className="h-10 w-auto" />
          </Link>
        )}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'hidden lg:flex items-center justify-center rounded-lg text-white/25 transition hover:bg-white/6 hover:text-white/60',
              collapsed ? 'h-10 w-10' : 'h-7 w-7',
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className={cn('h-4 w-4 transition-transform duration-300', collapsed ? 'rotate-180' : '')}
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>

      {/* ── User card ── */}
      {collapsed ? (
        /* Collapsed avatar */
        <div className="flex flex-col items-center py-5">
          <Tip label={displayName || user?.username || 'Profile'}>
            <Link to="/dashboard/profile" onClick={onClose} className="group relative block">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-black text-white ring-2 ring-[#07090f] transition group-hover:ring-white/20',
                roleMeta.from, roleMeta.to,
              )}>
                {user?.avatar
                  ? <img src={user.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
                  : getInitials(user?.firstName, user?.lastName, user?.username)}
              </div>
              <span className={cn('absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-[#07090f]', roleMeta.dot)} />
            </Link>
          </Tip>
        </div>
      ) : (
        /* Expanded user card */
        <div className="mx-3 mt-4 mb-1 overflow-hidden rounded-2xl border border-white/[0.07]">
          {/* Banner */}
          <div className="relative h-14 overflow-hidden">
            <div className={cn('absolute inset-0 bg-gradient-to-r opacity-60', roleMeta.from, roleMeta.to)} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.07),transparent_60%)]" />
            {/* Grid texture */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 14px,rgba(255,255,255,0.4) 14px,rgba(255,255,255,0.4) 15px),repeating-linear-gradient(90deg,transparent,transparent 14px,rgba(255,255,255,0.4) 14px,rgba(255,255,255,0.4) 15px)' }} />
          </div>
          {/* Body */}
          <div className="-mt-6 flex flex-col items-center px-4 pb-4 bg-gradient-to-b from-[#07090f]/0 to-[#07090f]/80">
            <div className="relative mb-2">
              <div className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white ring-[3px] ring-[#07090f] shadow-xl',
                roleMeta.from, roleMeta.to,
              )}>
                {user?.avatar
                  ? <img src={user.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  : getInitials(user?.firstName, user?.lastName, user?.username)}
              </div>
              <span className={cn('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#07090f]', roleMeta.dot)} />
            </div>
            <p className="max-w-full truncate text-center text-sm font-bold text-white tracking-tight">{displayName}</p>
            <p className="mb-2.5 text-[11px] text-white/30">@{user?.username}</p>
            <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest', roleMeta.badge)}>
              {roleMeta.label}
            </span>
            {writerBadges.length > 0 ? (
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {writerBadges.slice(0, 3).map((badge) => (
                  <span key={badge} className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className={cn('flex-1 overflow-y-auto pb-2 scrollbar-none', collapsed ? 'mt-1 px-[11px]' : 'mt-3 px-3')}>

        {/* Dashboard section */}
        {!collapsed && (
          <p className="mb-1.5 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/[0.18]">Dashboard</p>
        )}

        {navItems.map((item) =>
          collapsed ? (
            <Tip key={item.to} label={item.label}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => cn(
                  'mb-0.5 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150',
                  isActive
                    ? 'bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/25 shadow-[0_0_16px_rgba(14,165,233,0.12)]'
                    : 'text-white/30 hover:bg-white/6 hover:text-white/75',
                )}
              >
                {item.icon}
              </NavLink>
            </Tip>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => cn(
                'group relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 select-none',
                isActive
                  ? 'bg-gradient-to-r from-sky-500/[0.14] to-transparent text-sky-300'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white/85',
              )}
            >
              {({ isActive }) => (
                <>
                  {/* Animated left bar */}
                  <span className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-gradient-to-b from-sky-400 to-indigo-400 transition-all duration-200',
                    isActive ? 'h-5 opacity-100' : 'h-0 opacity-0',
                  )} />
                  <span className={cn('shrink-0 transition-colors duration-150', isActive ? 'text-sky-400' : 'text-white/25 group-hover:text-white/55')}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        )}

        {/* Divider */}
        <div className={cn('my-3 border-t border-white/[0.06]', collapsed ? 'mx-0' : 'mx-2')} />

        {/* Community section */}
        {!collapsed && (
          <p className="mb-1.5 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/[0.18]">Community</p>
        )}

        {NAV_COMMUNITY.map((item) =>
          collapsed ? (
            <Tip key={item.href} label={item.label}>
              <a
                href={item.href}
                className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-xl text-white/25 transition hover:bg-white/6 hover:text-white/70"
              >
                {item.icon}
              </a>
            </Tip>
          ) : (
            <a
              key={item.href}
              href={item.href}
              className="group mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/35 transition-all duration-150 hover:bg-white/[0.04] hover:text-white/80"
            >
              <span className="shrink-0 text-white/20 transition-colors group-hover:text-white/50">{item.icon}</span>
              {item.label}
              {/* External arrow */}
              <svg viewBox="0 0 24 24" className="ml-auto h-3 w-3 shrink-0 text-white/15 transition group-hover:text-white/35" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )
        )}
      </nav>

      {/* ── Footer ── */}
      <div className={cn('shrink-0 pb-4', collapsed ? 'flex flex-col items-center px-[11px]' : 'px-3')}>
        {!collapsed && (
          <div className="mb-2 overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.03] to-transparent px-3 py-2.5">
            <p className="text-[10px] font-semibold text-white/[0.22]">Tech Derby Community</p>
            <p className="mt-0.5 text-[10px] text-white/[0.14]">Building Derby&apos;s tech future</p>
          </div>
        )}
        {collapsed ? (
          <Tip label="Sign out">
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/25 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </Tip>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-white/30 transition-all duration-150 hover:border-red-500/15 hover:bg-red-500/[0.07] hover:text-red-400"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 transition-colors group-hover:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export function DashboardLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'relative hidden shrink-0 border-r border-white/[0.05] transition-[width] duration-300 ease-in-out lg:block',
          collapsed ? 'w-[72px]' : 'w-[264px]',
        )}
      >
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[280px] border-r border-white/[0.06] shadow-2xl">
            <Sidebar collapsed={false} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#07090f] px-5 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/8 hover:text-white/80"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link to="/">
            <img src={brandLogo} alt="Tech Derby" className="h-10 w-auto" />
          </Link>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-orange-500 text-xs font-black text-white shadow-lg">
            {user?.firstName && user?.lastName
              ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
              : (user?.username ?? 'U').slice(0, 2).toUpperCase()}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
