import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { apiClient } from '../lib/api';
import type { DirectoryMember } from '../types/auth';

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

function displayName(member: DirectoryMember) {
  if (member.firstName && member.lastName) return `${member.firstName} ${member.lastName}`;
  return member.username;
}

export default function MemberDirectoryPage() {
  const [search, setSearch] = useState('');
  const [bioMember, setBioMember] = useState<DirectoryMember | null>(null);
  const { data: members = [], isLoading } = useQuery<DirectoryMember[]>({
    queryKey: ['public-members-directory'],
    queryFn: () => apiClient.getMembersDirectory().then((response) => response.data),
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => {
      const name = `${member.firstName ?? ''} ${member.lastName ?? ''} ${member.username}`.toLowerCase();
      const occupation = (member.occupation ?? '').toLowerCase();
      const location = (member.location ?? '').toLowerCase();
      return name.includes(query) || occupation.includes(query) || location.includes(query);
    });
  }, [members, search]);

  return (
    <>
      <PageSeo title="Tech Derby | Directory" description="Browse members in the Tech Derby community directory." />

      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Community Network
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Member
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                directory.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Browse members in the Tech Derby community. Connect with developers, designers, founders, and tech
              professionals across the East Midlands.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Our People</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">Community members</h2>
            </div>

            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  placeholder="Search by name, role, or location..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="mt-5 text-center text-xs text-slate-500">
              {isLoading ? 'Loading members...' : `${filtered.length} member${filtered.length === 1 ? '' : 's'} shown`}
            </div>

            {isLoading ? (
              <div className="mt-10 flex justify-center">
                <svg className="h-7 w-7 animate-spin text-sky-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              </div>
            ) : filtered.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
                No members match your search.
              </div>
            ) : (
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((member) => (
                  <article key={member.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white ${avatarGradient(member.id)}`}>
                        {member.avatar ? (
                          <img src={member.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
                        ) : (
                          getInitials(member.firstName, member.lastName, member.username)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-slate-900">{displayName(member)}</p>
                        {member.occupation ? <p className="truncate text-xs text-sky-700">{member.occupation}</p> : null}
                        {member.location ? <p className="truncate text-xs text-slate-500">{member.location}</p> : null}
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Occupation / Role</p>
                        <p className="text-sm text-slate-700">{member.occupation?.trim() || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Skills</p>
                        {member.skills && member.skills.length > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {member.skills.slice(0, 6).map((skill) => (
                              <span key={skill} className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-600">No skills added yet.</p>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{member.bio?.trim() || 'This member has not added a bio yet.'}</p>

                    <button
                      type="button"
                      onClick={() => setBioMember(member)}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20"
                    >
                      View bio
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {bioMember ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setBioMember(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">{displayName(bioMember)}</h2>
                {bioMember.occupation ? <p className="text-sm text-sky-300">{bioMember.occupation}</p> : null}
                {bioMember.location ? <p className="mt-0.5 text-xs text-white/45">{bioMember.location}</p> : null}
              </div>
              <button type="button" onClick={() => setBioMember(null)} className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white" aria-label="Close bio">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">{bioMember.bio?.trim() || 'This member has not added a bio yet.'}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
