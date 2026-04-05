import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import type { Connection } from '../../types/auth';
import { cn } from '../../lib/utils';

type Tab = 'all' | 'pending' | 'sent';

function getInitials(firstName?: string, lastName?: string, username?: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return (username ?? 'U').slice(0, 2).toUpperCase();
}

const GRADIENTS = [
  'from-sky-500 to-cyan-400',
  'from-orange-500 to-amber-400',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-pink-400',
];
function grad(id: number) { return GRADIENTS[id % GRADIENTS.length]; }

function ConnectionCard({
  connection,
  onAccept,
  onReject,
  onRemove,
}: {
  connection: Connection;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onRemove?: (id: number) => void;
}) {
  const other = connection.otherUser;
  const displayName = other?.firstName && other?.lastName
    ? `${other.firstName} ${other.lastName}`
    : other?.username ?? 'Unknown';

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/18 hover:bg-white/8">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white', grad(other?.id ?? 0))}>
        {other?.avatar ? (
          <img src={other.avatar} alt="" className="h-11 w-11 rounded-xl object-cover" />
        ) : (
          getInitials(other?.firstName, other?.lastName, other?.username)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white">{displayName}</p>
        {other?.occupation ? <p className="text-xs text-sky-400">{other.occupation}</p> : null}
        {other?.location ? (
          <p className="flex items-center gap-1 text-xs text-white/30">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {other.location}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {connection.status === 'accepted' ? (
          <>
            <Link
              to={`/dashboard/messages/${other?.id}`}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Message
            </Link>
            <button
              type="button"
              onClick={() => onRemove?.(connection.id)}
              className="flex h-9 items-center rounded-xl border border-white/10 bg-white/4 px-3 text-xs text-white/30 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              aria-label="Remove connection"
            >
              Remove
            </button>
          </>
        ) : null}

        {connection.status === 'pending' && connection.direction === 'received' ? (
          <>
            <button
              type="button"
              onClick={() => onAccept?.(connection.id)}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onReject?.(connection.id)}
              className="flex h-9 items-center rounded-xl border border-white/10 bg-white/4 px-3 text-xs text-white/30 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              Decline
            </button>
          </>
        ) : null}

        {connection.status === 'pending' && connection.direction === 'sent' ? (
          <span className="flex h-9 items-center rounded-xl border border-white/10 bg-white/4 px-3 text-xs text-white/30">
            Pending
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('all');

  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: ['connections'],
    queryFn: () => apiClient.getMyConnections().then((r) => r.data),
  });

  const acceptMut = useMutation({
    mutationFn: (id: number) => apiClient.acceptConnection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['connections'] }),
  });

  const rejectMut = useMutation({
    mutationFn: (id: number) => apiClient.rejectConnection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['connections'] }),
  });

  const removeMut = useMutation({
    mutationFn: (id: number) => apiClient.removeConnection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['connections'] }),
  });

  const accepted = connections.filter((c) => c.status === 'accepted');
  const pendingIn = connections.filter((c) => c.status === 'pending' && c.direction === 'received');
  const pendingSent = connections.filter((c) => c.status === 'pending' && c.direction === 'sent');

  const displayed =
    tab === 'all' ? accepted :
    tab === 'pending' ? pendingIn :
    pendingSent;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Connections</h1>
          <p className="mt-1 text-sm text-white/40">Manage your community connections and pending requests.</p>
        </div>
        <Link
          to="/dashboard/directory"
          className="hidden shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-400 sm:flex"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Find members
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/8 bg-white/4 p-1 w-fit">
        {([
          { id: 'all', label: `Connections`, count: accepted.length },
          { id: 'pending', label: 'Requests', count: pendingIn.length },
          { id: 'sent', label: 'Sent', count: pendingSent.length },
        ] as { id: Tab; label: string; count: number }[]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
              tab === t.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60',
            )}
          >
            {t.label}
            {t.count > 0 ? (
              <span className={cn('flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black', tab === t.id ? 'bg-sky-500 text-white' : 'bg-white/10 text-white/40')}>
                {t.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <svg className="h-7 w-7 animate-spin text-sky-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-white/8 bg-white/4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-white/30">
            {tab === 'all' ? 'No connections yet.' : tab === 'pending' ? 'No pending requests.' : 'No sent requests.'}
          </p>
          {tab === 'all' ? (
            <Link to="/dashboard/directory" className="mt-3 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              Browse the directory →
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((c) => (
            <ConnectionCard
              key={c.id}
              connection={c}
              onAccept={(id) => acceptMut.mutate(id)}
              onReject={(id) => rejectMut.mutate(id)}
              onRemove={(id) => removeMut.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
