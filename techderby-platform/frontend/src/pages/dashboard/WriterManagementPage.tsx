import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Pagination } from '../../components/Pagination';
import { paginateItems } from '../../lib/pagination';

type WriterRow = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  memberRole: 'editor' | 'admin' | 'super-admin';
  createdAt?: string;
  updatedAt?: string;
  stats: {
    articles: number;
    published: number;
    pending: number;
    totalReads: number;
    totalLikes: number;
    totalComments: number;
    commentsWritten: number;
  };
};

function TipIcon({ label, value, children }: { label: string; value: number; children: React.ReactNode }) {
  return (
    <div className="group relative">
      <div className="flex h-9 min-w-[56px] items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 text-white/70 transition group-hover:border-sky-500/40 group-hover:text-sky-300">
        {children}
        <span className="text-xs font-semibold">{value}</span>
      </div>
      <div className="pointer-events-none absolute bottom-[110%] left-1/2 z-20 -translate-x-1/2 rounded-md border border-white/10 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
        {label}
      </div>
    </div>
  );
}

export default function WriterManagementPage() {
  const query = useQuery<{ data: WriterRow[] }>({
    queryKey: ['editorial-writers-admin'],
    queryFn: () => apiClient.getEditorialAdminWriters().then((response) => response.data),
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const writers = useMemo(() => query.data?.data ?? [], [query.data]);

  const filteredWriters = useMemo(() => {
    const queryText = searchTerm.trim().toLowerCase();
    if (!queryText) return writers;

    return writers.filter((writer) => {
      const roleLabel = writer.memberRole.replace('-', ' ');
      return (
        writer.fullName.toLowerCase().includes(queryText) ||
        writer.username.toLowerCase().includes(queryText) ||
        writer.email.toLowerCase().includes(queryText) ||
        roleLabel.toLowerCase().includes(queryText)
      );
    });
  }, [searchTerm, writers]);

  const writerPagination = useMemo(
    () => paginateItems(filteredWriters, currentPage),
    [currentPage, filteredWriters],
  );

  const showFilteredEmpty = !query.isLoading && writers.length > 0 && filteredWriters.length === 0;
  const showUnfilteredEmpty = !query.isLoading && writers.length === 0;

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">Editorial administration</p>
          <h1 className="mt-1 text-3xl font-black text-white">Writer management</h1>
          <p className="mt-2 text-sm text-white/45">View every writer and hover over stats to inspect article performance and engagement.</p>
        </div>

        {query.isLoading ? <p className="mt-8 text-sm text-white/40">Loading writers…</p> : null}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">Search writers</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, username, email, or role"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-sky-400/50"
              />
            </label>

            <p className="text-xs text-white/50 md:text-right">
              Showing {writerPagination.start}
              {' '}-{' '}
              {writerPagination.end} of {filteredWriters.length} roles
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {writerPagination.items.map((writer) => (
            <article key={writer.id} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-lg font-black text-white">{writer.fullName}</h2>
                <p className="text-xs text-white/45">@{writer.username} · {writer.email}</p>
                <p className="mt-1 text-xs text-white/35">Role: {writer.memberRole.replace('-', ' ')}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <TipIcon label="Total articles" value={writer.stats.articles}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></svg>
                </TipIcon>
                <TipIcon label="Published articles" value={writer.stats.published}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 13 4 4L19 7" /></svg>
                </TipIcon>
                <TipIcon label="Pending review" value={writer.stats.pending}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v6l3 2" /></svg>
                </TipIcon>
                <TipIcon label="Total reads" value={writer.stats.totalReads}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="3" /></svg>
                </TipIcon>
                <TipIcon label="Total comments" value={writer.stats.totalComments}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </TipIcon>
                <TipIcon label="Total likes" value={writer.stats.totalLikes}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.35-9.33-8.08A5.4 5.4 0 0 1 3.88 5.5a5.2 5.2 0 0 1 7.36 0L12 6.26l.76-.76a5.2 5.2 0 0 1 7.36 0 5.4 5.4 0 0 1 1.21 7.42C19 16.65 12 21 12 21Z" /></svg>
                </TipIcon>
              </div>
            </article>
          ))}

          {showFilteredEmpty ? (
            <p className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/35">
              No matching roles found. Try a different search term.
            </p>
          ) : null}

          {showUnfilteredEmpty ? (
            <p className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/35">No writers found yet.</p>
          ) : null}

          {!query.isLoading && filteredWriters.length > 0 ? (
            <Pagination
              currentPage={writerPagination.page}
              totalItems={filteredWriters.length}
              onPageChange={setCurrentPage}
              itemLabel="roles"
              className="mt-6"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
