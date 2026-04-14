import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { cn } from '../../lib/utils';
import type { AdminUser, MemberRole } from '../../types/content';
// ── Constants ─────────────────────────────────────────────────────────────────
const ROLES: MemberRole[] = ['member', 'editor', 'admin', 'super-admin'];

const ROLE_META: Record<MemberRole, { label: string; badge: string; dot: string }> = {
  'super-admin': { label: 'Super Admin', badge: 'text-purple-300 border-purple-500/30 bg-purple-500/10', dot: 'bg-purple-400' },
  admin:         { label: 'Admin',       badge: 'text-sky-300 border-sky-500/30 bg-sky-500/10',         dot: 'bg-sky-400' },
  editor:        { label: 'Editor',      badge: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10', dot: 'bg-emerald-400' },
  member:        { label: 'Member',      badge: 'text-white/40 border-white/10 bg-white/5',             dot: 'bg-slate-400' },
};

// ── RoleBadge ─────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role?: MemberRole | string }) {
  const r = (role ?? 'member') as MemberRole;
  const m = ROLE_META[r] ?? ROLE_META.member;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', m.badge)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', m.dot)} />
      {m.label}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function UserAvatar({ user }: { user: AdminUser }) {
  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : (user.username ?? 'U').slice(0, 2).toUpperCase();
  const role = (user.memberRole ?? 'member') as MemberRole;
  const m = ROLE_META[role] ?? ROLE_META.member;

  const gradients: Record<MemberRole, string> = {
    'super-admin': 'from-purple-500 to-indigo-500',
    admin:         'from-sky-500 to-blue-600',
    editor:        'from-emerald-500 to-teal-600',
    member:        'from-sky-600 to-orange-600',
  };

  return (
    <div className="relative flex-shrink-0">
      {user.avatar ? (
        <img src={user.avatar} alt="" className="h-9 w-9 rounded-xl object-cover" />
      ) : (
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-black text-white', gradients[role])}>
          {initials}
        </div>
      )}
      <span className={cn('absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-[2px] border-[#07090f]', m.dot)} />
    </div>
  );
}

// ── RoleSelector ──────────────────────────────────────────────────────────────
function RoleSelector({
  userId,
  currentRole,
  onUpdate,
  disabled,
}: {
  userId: number;
  currentRole?: MemberRole | string;
  onUpdate: (id: number, role: MemberRole) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const role = (currentRole ?? 'member') as MemberRole;
  const m = ROLE_META[role] ?? ROLE_META.member;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition',
          m.badge,
          'hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', m.dot)} />
        {m.label}
        <svg viewBox="0 0 24 24" className="ml-0.5 h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-1.5 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl">
            {ROLES.map((r) => {
              const rm = ROLE_META[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => { onUpdate(userId, r); setOpen(false); }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs transition',
                    r === role
                      ? 'bg-white/[0.06] font-bold text-white'
                      : 'text-white/60 hover:bg-white/[0.04] hover:text-white',
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', rm.dot)} />
                  {rm.label}
                  {r === role && <svg viewBox="0 0 24 24" className="ml-auto h-3 w-3 text-white/50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── CreateUserModal ───────────────────────────────────────────────────────────
const BLANK_FORM = { firstName: '', lastName: '', username: '', email: '', password: '', memberRole: 'member' as MemberRole };

function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState(BLANK_FORM);
  const [errors, setErrors] = useState<Partial<typeof BLANK_FORM>>({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: () => apiClient.createAdminUser(form),
    onSuccess: () => { onCreated(); onClose(); },
    onError: (err: any) => {
      const msg = err?.response?.data?.error?.message ?? err?.response?.data?.message ?? 'Failed to create user';
      setServerError(msg);
    },
  });

  function set(field: keyof typeof BLANK_FORM, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
    setServerError('');
  }

  function validate() {
    const e: Partial<typeof BLANK_FORM> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.username.trim() || form.username.length < 3) e.username = 'Min 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Letters, numbers, underscores only';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    mutation.mutate();
  }

  const labelClass = 'block mb-1 text-xs font-bold text-white/45';
  const inputClass = (err?: string) =>
    cn('w-full rounded-xl border bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition focus:ring-1',
      err ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20' : 'border-white/10 focus:border-sky-500/40 focus:ring-sky-500/20');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-white">Create User</h3>
            <p className="text-xs text-white/40">Create an account with a pre-assigned role</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/8 hover:text-white/60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">

          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {serverError}
            </div>
          )}

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>First name</label>
              <input
                className={inputClass(errors.firstName)}
                placeholder="Jane"
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                autoComplete="off"
              />
              {errors.firstName && <p className="mt-1 text-[11px] text-red-400">{errors.firstName}</p>}
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input
                className={inputClass(errors.lastName)}
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                autoComplete="off"
              />
              {errors.lastName && <p className="mt-1 text-[11px] text-red-400">{errors.lastName}</p>}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className={labelClass}>Username</label>
            <input
              className={inputClass(errors.username)}
              placeholder="janedoe"
              value={form.username}
              onChange={(e) => set('username', e.target.value.toLowerCase())}
              autoComplete="off"
            />
            {errors.username && <p className="mt-1 text-[11px] text-red-400">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass(errors.email)}
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              autoComplete="off"
            />
            {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>Temporary password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={cn(inputClass(errors.password), 'pr-10')}
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/60"
                tabIndex={-1}
              >
                {showPassword
                  ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {errors.password && <p className="mt-1 text-[11px] text-red-400">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className={labelClass}>Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => {
                const m = ROLE_META[r];
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => set('memberRole', r)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition',
                      form.memberRole === r
                        ? cn('border-current', m.badge)
                        : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60',
                    )}
                  >
                    <span className={cn('h-2 w-2 rounded-full', m.dot)} />
                    {m.label}
                    {form.memberRole === r && (
                      <svg viewBox="0 0 24 24" className="ml-auto h-3 w-3 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                );
              })}
            </div>
            {form.memberRole === 'admin' && (
              <p className="mt-2 text-[11px] text-amber-400/80">This user will have full admin access to the platform.</p>
            )}
            {form.memberRole === 'super-admin' && (
              <p className="mt-2 text-[11px] text-purple-400/80">Super admins can manage other admins and super admins.</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:shadow-sky-500/35 disabled:opacity-50"
            >
              {mutation.isPending ? 'Creating…' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, username or email…"
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20"
      />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg viewBox="0 0 24 24" className="mb-3 h-8 w-8 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <p className="text-sm font-semibold text-white/30">{filtered ? 'No users match your filters' : 'No users found'}</p>
    </div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmRoleModal({
  user,
  newRole,
  onConfirm,
  onCancel,
  isLoading,
}: {
  user: AdminUser;
  newRole: MemberRole;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const name = user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user.username;
  const m = ROLE_META[newRole];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl">
        <h3 className="mb-1 text-base font-bold text-white">Change Role</h3>
        <p className="mb-4 text-sm text-white/50">
          Set <span className="font-semibold text-white">{name}</span> as
          {' '}
          <span className={cn('font-bold', m.badge.split(' ')[0])}>{m.label}</span>?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-sky-500/20 py-2.5 text-sm font-bold text-sky-300 transition hover:bg-sky-500/30 disabled:opacity-50"
          >
            {isLoading ? 'Updating…' : 'Confirm'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch]     = useState('');
  const [roleFilter, setRole]   = useState<MemberRole | ''>('');
  const [page, setPage]         = useState(1);
  const [pending, setPending]   = useState<{ user: AdminUser; role: MemberRole } | null>(null);
  const [showCreate, setCreate] = useState(false);

  const PAGE_SIZE = 20;

  const { data, isLoading } = useQuery<{ data: AdminUser[]; meta: { total: number; page: number; pageSize: number } }>({
    queryKey: ['adminUsers', search, roleFilter, page],
    queryFn: () =>
      apiClient.getAdminUsers({ search: search || undefined, role: roleFilter || undefined, page, pageSize: PAGE_SIZE })
        .then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: MemberRole }) =>
      apiClient.updateUserRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminUsers'] });
      qc.invalidateQueries({ queryKey: ['adminStats'] });
      setPending(null);
    },
  });

  const handleRoleSelect = useCallback((user: AdminUser, role: MemberRole) => {
    if (role === user.memberRole) return;
    setPending({ user, role });
  }, []);

  const users  = data?.data ?? [];
  const total  = data?.meta.total ?? 0;
  const pages  = Math.ceil(total / PAGE_SIZE);
  const isFiltered = !!(search || roleFilter);

  return (
    <>
      <div className="p-6 md:p-10">

        {/* ── Header ── */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-sky-400">Admin</p>
            <h1 className="text-2xl font-black text-white md:text-3xl">User Management</h1>
            <p className="mt-1 text-sm text-white/45">Manage member roles and access levels.</p>
          </div>
          <button
            type="button"
            onClick={() => setCreate(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:shadow-sky-500/35"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create User
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
          </div>

          {/* Role filter */}
          <div className="flex gap-2">
            {(['', ...ROLES] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r as MemberRole | ''); setPage(1); }}
                className={cn(
                  'rounded-lg px-3 py-2 text-xs font-semibold transition',
                  roleFilter === r
                    ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30'
                    : 'text-white/40 hover:bg-white/6 hover:text-white/70',
                )}
              >
                {r === '' ? 'All' : ROLE_META[r as MemberRole].label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Total ── */}
        {!isLoading && (
          <p className="mb-4 text-xs text-white/30">
            {total} {total === 1 ? 'user' : 'users'}{isFiltered ? ' matching filters' : ''}
          </p>
        )}

        {/* ── Table ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
          </div>
        ) : users.length === 0 ? (
          <EmptyState filtered={isFiltered} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            {/* Header row */}
            <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-white/[0.07] bg-white/[0.02] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/30 hidden sm:grid">
              <span className="w-9" />
              <span>User</span>
              <span className="w-[180px] text-center">Email</span>
              <span className="w-28 text-right">Role</span>
            </div>

            {/* Rows */}
            {users.map((u, i) => (
              <div
                key={u.id}
                className={cn(
                  'grid grid-cols-1 items-center gap-3 px-5 py-4 transition hover:bg-white/[0.025] sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4',
                  i !== 0 && 'border-t border-white/[0.06]',
                )}
              >
                {/* Avatar */}
                <UserAvatar user={u} />

                {/* Name + username */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {u.firstName ? `${u.firstName} ${u.lastName ?? ''}`.trim() : u.username}
                  </p>
                  <p className="truncate text-[11px] text-white/35">
                    @{u.username}
                    {u.occupation ? <span className="ml-2 text-white/25">· {u.occupation}</span> : null}
                  </p>
                </div>

                {/* Email */}
                <p className="hidden w-[180px] truncate text-center text-xs text-white/35 sm:block">{u.email}</p>

                {/* Role selector */}
                <div className="w-28 flex justify-end">
                  <RoleSelector
                    userId={u.id}
                    currentRole={u.memberRole}
                    onUpdate={(id, role) => handleRoleSelect(u, role)}
                    disabled={roleMutation.isPending}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:bg-white/8 hover:text-white disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-xs text-white/30">
              {page} / {pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:bg-white/8 hover:text-white disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Confirm modal ── */}
      {pending && (
        <ConfirmRoleModal
          user={pending.user}
          newRole={pending.role}
          onConfirm={() => roleMutation.mutate({ id: pending.user.id, role: pending.role })}
          onCancel={() => setPending(null)}
          isLoading={roleMutation.isPending}
        />
      )}

      {/* ── Create user modal ── */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setCreate(false)}
          onCreated={() => {
            qc.invalidateQueries({ queryKey: ['adminUsers'] });
            qc.invalidateQueries({ queryKey: ['adminStats'] });
          }}
        />
      )}
    </>
  );
}
