import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { DirectoryMember, Connection } from '../../types/auth';
import { cn } from '../../lib/utils';
import { Pagination } from '../../components/Pagination';
import { paginateItems } from '../../lib/pagination';

function getInitials(firstName?: string, lastName?: string, username?: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return (username ?? 'U').slice(0, 2).toUpperCase();
}

const AVATARS_GRADIENT = [
  'from-sky-500 to-cyan-400',
  'from-orange-500 to-amber-400',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-pink-400',
];
function avatarGradient(id: number) {
  return AVATARS_GRADIENT[id % AVATARS_GRADIENT.length];
}

function MemberCard({
  member,
  connection,
  onConnect,
  onMessage,
  onViewBio,
  isMe,
}: {
  member: DirectoryMember;
  connection?: Connection;
  onConnect: (id: number) => void;
  onMessage: (id: number) => void;
  onViewBio: (member: DirectoryMember) => void;
  isMe: boolean;
}) {
  const skills = member.skills?.slice(0, 3) ?? [];
  const displayName = member.firstName && member.lastName
    ? `${member.firstName} ${member.lastName}`
    : member.username;

  return (
    <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/8">
      <div className="flex items-start gap-3">
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white shadow-md', avatarGradient(member.id))}>
          {member.avatar ? (
            <img src={member.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
          ) : (
            getInitials(member.firstName, member.lastName, member.username)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-white">{displayName}</p>
          {member.occupation ? (
            <p className="truncate text-xs text-sky-400">{member.occupation}</p>
          ) : null}
          {member.location ? (
            <p className="flex items-center gap-1 text-xs text-white/35">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {member.location}
            </p>
          ) : null}
        </div>
      </div>

      {member.bio ? (
        <p className="mt-3 text-xs leading-relaxed text-white/50 line-clamp-2">{member.bio}</p>
      ) : null}

      <button
        type="button"
        onClick={() => onViewBio(member)}
        className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
      >
        View bio
      </button>

      {member.linkedinUrl ? (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${displayName}'s LinkedIn profile (opens in a new tab)`}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
        >
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>
      ) : null}

      {skills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/55">
              {s}
            </span>
          ))}
          {(member.skills?.length ?? 0) > 3 ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/30">
              +{(member.skills?.length ?? 0) - 3}
            </span>
          ) : null}
        </div>
      ) : null}

      {!isMe ? (
        <div className="mt-4 flex gap-2">
          {!connection ? (
            <button
              type="button"
              onClick={() => onConnect(member.id)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 py-2 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Connect
            </button>
          ) : connection.status === 'pending' ? (
            <span className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white/30">
              {connection.direction === 'sent' ? 'Request sent' : 'Incoming request'}
            </span>
          ) : connection.status === 'accepted' ? (
            <button
              type="button"
              onClick={() => onMessage(member.id)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Message
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-4">
          <Link
            to="/dashboard/profile"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 py-2 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20"
          >
            Edit My Profile
          </Link>
        </div>
      )}
    </div>
  );
}

export default function DirectoryPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bioMember, setBioMember] = useState<DirectoryMember | null>(null);

  const { data: members = [], isLoading } = useQuery<DirectoryMember[]>({
    queryKey: ['membersDirectory'],
    queryFn: () => apiClient.getMembersDirectory().then((r) => r.data),
  });

  const { data: connections = [] } = useQuery<Connection[]>({
    queryKey: ['connections'],
    queryFn: () => apiClient.getMyConnections().then((r) => r.data),
  });

  const connectMutation = useMutation({
    mutationFn: (recipientId: number) => apiClient.sendConnectionRequest(recipientId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['connections'] }),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      if (!q) return true;
      const name = `${m.firstName ?? ''} ${m.lastName ?? ''} ${m.username}`.toLowerCase();
      return name.includes(q) || (m.occupation ?? '').toLowerCase().includes(q) || (m.location ?? '').toLowerCase().includes(q);
    });
  }, [members, search]);
  const memberPagination = useMemo(
    () => paginateItems(filtered, currentPage),
    [currentPage, filtered],
  );

  function getConnection(memberId: number) {
    return connections.find(
      (c) => c.requesterId === memberId || c.recipientId === memberId,
    );
  }

  function handleMessage(userId: number) {
    navigate(`/dashboard/messages/${userId}`);
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Member Directory</h1>
        <p className="mt-1 text-sm text-white/40">
          {user?.memberRole === 'admin' || user?.memberRole === 'super-admin'
            ? 'Showing all community members (admin view).'
            : 'Showing members who have enabled visibility.'}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Search by name, role, or location…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <svg className="h-7 w-7 animate-spin text-sky-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-sm text-white/30">{search ? 'No members match your search.' : 'No members found.'}</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-white/30">{filtered.length} member{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {memberPagination.items.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                connection={getConnection(member.id)}
                onConnect={(id) => connectMutation.mutate(id)}
                onMessage={handleMessage}
                onViewBio={setBioMember}
                isMe={member.id === user?.id}
              />
            ))}
          </div>
          <Pagination
            currentPage={memberPagination.page}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            itemLabel="members"
            className="mt-5"
          />
        </>
      )}

      {bioMember ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setBioMember(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">
                  {bioMember.firstName && bioMember.lastName ? `${bioMember.firstName} ${bioMember.lastName}` : bioMember.username}
                </h2>
                {bioMember.occupation ? <p className="text-sm text-sky-300">{bioMember.occupation}</p> : null}
              </div>
              <button type="button" onClick={() => setBioMember(null)} className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white" aria-label="Close bio">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
              {bioMember.bio?.trim() || 'This member has not added a bio yet.'}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

