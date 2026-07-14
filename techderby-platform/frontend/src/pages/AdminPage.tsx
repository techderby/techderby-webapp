import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { apiClient } from '../lib/api';
import { MAILING_LIST_CATEGORIES, type MailingListCategory, type MailingListSegment } from '../constants/mailing-list';

type MailingListRow = {
  id: number;
  email: string;
  category: MailingListCategory;
  createdAt: string;
};

type ImportResult = {
  received: number;
  valid: number;
  imported: number;
  skippedExisting: number;
  invalid: number;
};

type AdminTab = 'mailing-list' | 'segments';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_IMPORT_FILE_SIZE = 10 * 1024 * 1024;

function getFilenameFromDisposition(disposition?: string) {
  if (!disposition) return `mailing-list-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] ?? `mailing-list-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Unknown';
  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('mailing-list');
  const [rows, setRows] = useState<MailingListRow[]>([]);
  const [segments, setSegments] = useState<MailingListSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | 'all-users'>('all-users');

  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [segmentCategories, setSegmentCategories] = useState<MailingListCategory[]>([]);

  const [editingSegmentId, setEditingSegmentId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingCategories, setEditingCategories] = useState<MailingListCategory[]>([]);

  const totalSubscribers = rows.length;

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const segment = segments.find((entry) => entry.id === selectedSegmentId);
    const inSegment = rows.filter((row) => {
      if (!segment || segment.includeAll) return true;
      return segment.categories.includes(row.category);
    });
    const inCategory = selectedCategory === 'All'
      ? inSegment
      : inSegment.filter((row) => row.category === selectedCategory);
    if (!query) return inCategory;
    return inCategory.filter((row) => row.email.toLowerCase().includes(query));
  }, [rows, search, selectedCategory, segments, selectedSegmentId]);

  async function loadMailingList(showSpinner = true) {
    if (showSpinner) setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getMailingListSubscriptionsAdmin();
      setRows((response.data as MailingListRow[]) ?? []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('You do not have permission to view the mailing list.');
      } else {
        setError('Could not load mailing list entries right now.');
      }
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  }

  async function loadSegments() {
    const response = await apiClient.getMailingListSegmentsForAdmin();
    const data = Array.isArray(response.data) ? response.data : [];
    setSegments(data);
  }

  useEffect(() => {
    loadMailingList();
    loadSegments().catch(() => {
      setError('Could not load mailing list segments.');
    });
  }, []);

  async function createSegment() {
    setError(null);
    setMessage(null);

    if (!segmentName.trim()) {
      setError('Enter a segment name.');
      return;
    }
    if (segmentCategories.length === 0) {
      setError('Select at least one category for this segment.');
      return;
    }

    try {
      await apiClient.createMailingListSegmentForAdmin({
        name: segmentName.trim(),
        description: segmentDescription.trim(),
        categories: segmentCategories,
      });
      setSegmentName('');
      setSegmentDescription('');
      setSegmentCategories([]);
      await loadSegments();
      setMessage('Segment created successfully.');
    } catch {
      setError('Could not create segment right now.');
    }
  }

  function beginEditSegment(segment: MailingListSegment) {
    if (segment.includeAll) return;
    setEditingSegmentId(segment.id);
    setEditingName(segment.name);
    setEditingDescription(segment.description ?? '');
    setEditingCategories(segment.categories);
  }

  function cancelEditSegment() {
    setEditingSegmentId(null);
    setEditingName('');
    setEditingDescription('');
    setEditingCategories([]);
  }

  async function saveEditedSegment(id: number) {
    setError(null);
    setMessage(null);

    if (!editingName.trim()) {
      setError('Enter a segment name.');
      return;
    }
    if (editingCategories.length === 0) {
      setError('Select at least one category for this segment.');
      return;
    }

    try {
      await apiClient.updateMailingListSegmentForAdmin(id, {
        name: editingName.trim(),
        description: editingDescription.trim(),
        categories: editingCategories,
      });
      await loadSegments();
      cancelEditSegment();
      setMessage('Segment updated.');
    } catch {
      setError('Could not update segment right now.');
    }
  }

  async function deleteSegment(id: number) {
    setError(null);
    setMessage(null);

    try {
      await apiClient.deleteMailingListSegmentForAdmin(id);
      if (selectedSegmentId === id) setSelectedSegmentId('all-users');
      if (editingSegmentId === id) cancelEditSegment();
      await loadSegments();
      setMessage('Segment deleted.');
    } catch {
      setError('Could not delete segment right now.');
    }
  }

  async function parseEmailsFromFile(file: File): Promise<string[]> {
    const rowsData = parseCsv(await file.text());
    const emails = new Set<string>();

    for (const row of rowsData) {
      for (const cell of row) {
        const value = String(cell ?? '').trim().toLowerCase();
        if (EMAIL_PATTERN.test(value)) emails.add(value);
      }
    }

    return Array.from(emails);
  }

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    if (file.size > MAX_IMPORT_FILE_SIZE) {
      setError('The selected file is too large. The maximum size is 10 MB.');
      return;
    }

    setError(null);
    setMessage(null);
    setImportResult(null);
    setIsImporting(true);

    try {
      const emails = await parseEmailsFromFile(file);
      if (emails.length === 0) {
        setError('No valid emails were found in the selected file.');
        return;
      }

      const response = await apiClient.importMailingListForAdmin(emails);
      const result = response.data as ImportResult;
      setImportResult(result);
      setMessage(`Import complete. Added ${result.imported} new subscriber${result.imported === 1 ? '' : 's'}.`);

      setIsRefreshing(true);
      await loadMailingList(false);
      await loadSegments();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('You do not have permission to import mailing list entries.');
      } else {
        setError('Could not import mailing list file right now. Please try again.');
      }
    } finally {
      setIsImporting(false);
      setIsRefreshing(false);
    }
  }

  async function handleExportCsv() {
    setError(null);
    setMessage(null);
    setIsExporting(true);

    try {
      const response = await apiClient.exportMailingListCsvForAdmin();
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getFilenameFromDisposition(response.headers['content-disposition']);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setMessage('CSV export started. Your download should appear shortly.');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('You do not have permission to export the mailing list.');
      } else {
        setError('Could not export mailing list CSV right now. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Mailing List</h1>
          <p className="mt-1 text-sm text-white/40">Manage subscribers and category segments.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs text-white/40">
            Total subscribers: <span className="font-semibold text-white/75">{totalSubscribers}</span>
            {isRefreshing ? <span className="text-sky-400">Refreshing…</span> : null}
          </div>
          <Link
            to="/dashboard/mailing-list/compose"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 4h16v16H4z" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            Create newsletter
          </Link>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
        <button
          type="button"
          onClick={() => setActiveTab('mailing-list')}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === 'mailing-list' ? 'bg-sky-500 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
        >
          Mailing List
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('segments')}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === 'segments' ? 'bg-sky-500 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
        >
          Segments
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
        {activeTab === 'mailing-list' ? (
          <>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full max-w-md">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search subscribers by email…"
                  aria-label="Search subscribers"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-10 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedSegmentId}
                  onChange={(event) => {
                    const raw = event.target.value;
                    setSelectedSegmentId(raw === 'all-users' ? 'all-users' : Number(raw));
                  }}
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                >
                  <option value="all-users" className="bg-white text-slate-900">All Users</option>
                  {segments.filter((segment) => !segment.includeAll).map((segment) => (
                    <option key={segment.id} value={segment.id} className="bg-white text-slate-900">{segment.name}</option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                >
                  <option value="All" className="bg-white text-slate-900">All categories</option>
                  {MAILING_LIST_CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-white text-slate-900">{category}</option>
                  ))}
                </select>
                <Button onClick={handleExportCsv} disabled={isExporting}>
                  {isExporting ? 'Exporting…' : 'Export CSV'}
                </Button>
                <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-sky-500/30 bg-sky-500/10 px-4 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
                  {isImporting ? 'Importing…' : 'Import CSV'}
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={handleImportFile}
                    disabled={isImporting}
                  />
                </label>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/35">
              <span>CSV files may contain email addresses in any column.</span>
              {search ? <span>{filteredRows.length} of {rows.length} subscribers match</span> : null}
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-white/80">Email</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-white/80">Category</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-white/80">Subscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8 bg-transparent">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-white/45">Loading subscribers...</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-white/45">No mailing list subscribers yet.</td>
                    </tr>
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center text-white/45">No subscribers match “{search}”.</td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="transition hover:bg-white/[0.03]">
                        <td className="px-4 py-2.5 text-white/90">{row.email}</td>
                        <td className="px-4 py-2.5 text-white/70">{row.category}</td>
                        <td className="px-4 py-2.5 text-white/60">{formatDate(row.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Create segment</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <input
                  value={segmentName}
                  onChange={(event) => setSegmentName(event.target.value)}
                  placeholder="Segment name"
                  className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                />
                <input
                  value={segmentDescription}
                  onChange={(event) => setSegmentDescription(event.target.value)}
                  placeholder="Description (optional)"
                  className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {MAILING_LIST_CATEGORIES.filter((category) => category !== 'None').map((category) => {
                  const selected = segmentCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSegmentCategories((current) => selected ? current.filter((item) => item !== category) : [...current, category])}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${selected ? 'border-sky-500/50 bg-sky-500/20 text-sky-200' : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'}`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3">
                <Button onClick={createSegment}>Save segment</Button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {segments.length === 0 ? <p className="text-sm text-white/45">No segments found.</p> : null}
              {segments.map((segment) => {
                const isEditing = editingSegmentId === segment.id;
                const isDefault = segment.includeAll;
                return (
                  <article key={segment.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                    {isEditing ? (
                      <>
                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            value={editingName}
                            onChange={(event) => setEditingName(event.target.value)}
                            placeholder="Segment name"
                            className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                          />
                          <input
                            value={editingDescription}
                            onChange={(event) => setEditingDescription(event.target.value)}
                            placeholder="Description"
                            className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {MAILING_LIST_CATEGORIES.filter((category) => category !== 'None').map((category) => {
                            const selected = editingCategories.includes(category);
                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => setEditingCategories((current) => selected ? current.filter((item) => item !== category) : [...current, category])}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${selected ? 'border-sky-500/50 bg-sky-500/20 text-sky-200' : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'}`}
                              >
                                {category}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button onClick={() => saveEditedSegment(segment.id)}>Save changes</Button>
                          <button type="button" onClick={cancelEditSegment} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/65 hover:bg-white/10">Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h2 className="text-sm font-bold text-white">{segment.name}</h2>
                            <p className="mt-1 text-xs text-white/45">{segment.description || (segment.includeAll ? 'All subscribers in the mailing list.' : 'No description')}</p>
                            <p className="mt-1 text-xs text-white/40">Subscribers: {segment.subscriberCount}</p>
                            {!segment.includeAll ? (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {segment.categories.map((category) => (
                                  <span key={category} className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">{category}</span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          {!isDefault ? (
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => beginEditSegment(segment)} className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20">Edit</button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete segment "${segment.name}"?`)) deleteSegment(segment.id);
                                }}
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/50">Default segment</span>
                          )}
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}

        {importResult ? (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
            Received: {importResult.received} · Valid: {importResult.valid} · Imported: {importResult.imported} · Existing: {importResult.skippedExisting} · Invalid: {importResult.invalid}
          </div>
        ) : null}

        {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      </div>
    </div>
  );
}

function parseCsv(contents: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < contents.length; index += 1) {
    const character = contents[index];
    const next = contents[index + 1];

    if (character === '"') {
      if (quoted && next === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  row.push(field);
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}
