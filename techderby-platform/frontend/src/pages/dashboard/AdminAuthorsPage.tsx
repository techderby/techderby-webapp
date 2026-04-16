import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { cn } from '../../lib/utils';
import type { AuthorApplication } from '../../types/content';

function initials(app: AuthorApplication) {
  const a = app.applicant;
  if (a?.first_name && a?.last_name) return `${a.first_name[0]}${a.last_name[0]}`.toUpperCase();
  return (a?.username ?? '?')[0].toUpperCase();
}

function fullName(app: AuthorApplication) {
  const a = app.applicant;
  if (a?.first_name && a?.last_name) return `${a.first_name} ${a.last_name}`;
  return a?.username ?? 'Unknown';
}

type FilterStatus = AuthorApplication['applicationStatus'] | 'all';

export default function AdminAuthorsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [selected, setSelected] = useState<AuthorApplication | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data: applications = [], isLoading } = useQuery<AuthorApplication[]>({
    queryKey: ['authorApplications', filter],
    queryFn: () =>
      apiClient.getAuthorApplications(filter === 'all' ? undefined : filter).then((r) => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => apiClient.approveAuthorApplication(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['authorApplications'] });
      setSelected(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      apiClient.rejectAuthorApplication(id, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['authorApplications'] });
      setSelected(null);
      setShowRejectForm(false);
    },
  });

  const pendingCount  = applications.filter((a) => a.applicationStatus === 'pending').length;
  const approvedCount = applications.filter((a) => a.applicationStatus === 'approved').length;

  return (
    <div className="p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-sky-400">Editorial</p>
        <h1 className="text-2xl font-black text-white md:text-3xl">Author Applications</h1>
        <p className="mt-1 text-sm text-white/45">Review community members applying to become Tech Derby authors.</p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { key: 'pending',  label: 'Pending Review', value: applications.filter((a) => a.applicationStatus === 'pending').length,  color: 'text-amber-400' },
          { key: 'approved', label: 'Approved',        value: applications.filter((a) => a.applicationStatus === 'approved').length, color: 'text-emerald-400' },
          { key: 'rejected', label: 'Rejected',        value: applications.filter((a) => a.applicationStatus === 'rejected').length, color: 'text-red-400' },
        ].map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key as FilterStatus)}
            className={cn(
              'rounded-xl border px-4 py-3 text-left transition',
              filter === c.key ? 'border-white/15 bg-white/5' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10',
            )}
          >
            <p className={cn('text-2xl font-black', c.color)}>{c.value}</p>
            <p className="text-xs text-white/40">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex items-center gap-2">
        {(['pending', 'approved', 'rejected', 'all'] as FilterStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              filter === s ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30' : 'text-white/40 hover:bg-white/6 hover:text-white/70',
            )}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Application list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16">
          <svg viewBox="0 0 24 24" className="mb-3 h-8 w-8 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <p className="text-sm font-semibold text-white/30">No {filter === 'all' ? '' : filter} applications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onSelect={() => setSelected(app)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-black text-white">
                  {initials(selected)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{fullName(selected)}</p>
                  <p className="text-[11px] text-white/40">@{selected.applicant?.username}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setSelected(null); setShowRejectForm(false); }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/8 hover:text-white/70"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {selected.applicant?.occupation && (
                <div>
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-white/30">Occupation</p>
                  <p className="text-sm text-white/80">{selected.applicant.occupation}</p>
                </div>
              )}

              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">Professional Bio</p>
                <p className="text-sm text-white/70 leading-relaxed">{selected.bio}</p>
              </div>

              {selected.expertise && selected.expertise.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/30">Areas of Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.expertise.map((e) => (
                      <span key={e} className="rounded-full border border-sky-500/25 bg-sky-500/8 px-2.5 py-0.5 text-xs font-semibold text-sky-300">{e}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.portfolio && (
                <div>
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-white/30">Portfolio</p>
                  <a href={selected.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:underline break-all">
                    {selected.portfolio}
                  </a>
                </div>
              )}

              {selected.sampleWork && (
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">Sample Writing</p>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-white/65 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {selected.sampleWork}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-white/30">Applied</p>
                <p className="text-sm text-white/50">
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>

            {/* Actions */}
            {selected.applicationStatus === 'pending' && (
              <div className="border-t border-white/[0.07] px-6 py-4">
                {showRejectForm ? (
                  <div className="space-y-3">
                    <label htmlFor="reject-notes" className="block text-xs font-semibold text-white/60">Feedback for applicant</label>
                    <textarea
                      id="reject-notes"
                      value={rejectNotes}
                      onChange={(e) => setRejectNotes(e.target.value)}
                      rows={3}
                      placeholder="Please provide feedback on why the application was not approved…"
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => rejectMutation.mutate({ id: selected.id, notes: rejectNotes })}
                        disabled={rejectMutation.isPending}
                        className="flex-1 rounded-xl bg-red-500/15 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500/25 disabled:opacity-50"
                      >
                        {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRejectForm(false)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => approveMutation.mutate(selected.id)}
                      disabled={approveMutation.isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/35 disabled:opacity-50"
                    >
                      {approveMutation.isPending ? (
                        <><span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" /> Approving…</>
                      ) : (
                        <><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg> Approve Author</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1 rounded-xl border border-red-500/20 bg-red-500/8 py-2.5 text-sm font-bold text-red-300 transition hover:border-red-500/35 hover:bg-red-500/15"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}

            {selected.applicationStatus === 'approved' && (
              <div className="border-t border-white/[0.07] px-6 py-4">
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-2.5">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                  <span className="text-sm font-semibold text-emerald-300">Application approved — user is now an author</span>
                </div>
              </div>
            )}

            {selected.applicationStatus === 'rejected' && (
              <div className="border-t border-white/[0.07] px-6 py-4">
                <div className="rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-2.5">
                  <p className="text-sm font-semibold text-red-300">Rejected</p>
                  {selected.reviewNotes && (
                    <p className="mt-1 text-xs text-red-300/60">{selected.reviewNotes}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationRow({ app, onSelect }: { app: AuthorApplication; onSelect: () => void }) {
  const statusStyles = {
    pending:  'text-amber-300 border-amber-400/25 bg-amber-400/10',
    approved: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10',
    rejected: 'text-red-300 border-red-400/25 bg-red-400/10',
  };

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.04]">
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/50 to-indigo-500/50 text-sm font-black text-white">
        {app.applicant?.avatar
          ? <img src={app.applicant.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          : initials(app)
        }
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-white">{fullName(app)}</span>
          <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', statusStyles[app.applicationStatus])}>
            {app.applicationStatus}
          </span>
        </div>
        {app.applicant?.occupation && (
          <p className="text-xs text-white/45">{app.applicant.occupation}</p>
        )}
        {app.expertise && app.expertise.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {app.expertise.slice(0, 3).map((e) => (
              <span key={e} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">{e}</span>
            ))}
            {app.expertise.length > 3 && (
              <span className="text-[10px] text-white/25">+{app.expertise.length - 3}</span>
            )}
          </div>
        )}
        <p className="mt-1 text-[11px] text-white/25">
          {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onSelect}
        className="shrink-0 rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300 transition hover:bg-sky-500/20"
      >
        View
      </button>
    </div>
  );
}
