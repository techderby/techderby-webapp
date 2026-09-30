import { DEFAULT_PAGE_SIZE, paginateItems } from '../lib/pagination';

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  itemLabel?: string;
  theme?: 'dark' | 'light';
  className?: string;
};

export function Pagination({
  currentPage,
  totalItems,
  onPageChange,
  pageSize = DEFAULT_PAGE_SIZE,
  itemLabel = 'items',
  theme = 'dark',
  className = '',
}: PaginationProps) {
  if (totalItems === 0) return null;

  const { page, totalPages, start, end } = paginateItems(new Array(totalItems), currentPage, pageSize);
  const dark = theme === 'dark';
  const shell = dark
    ? 'border-white/10 bg-white/[0.03]'
    : 'border-slate-200 bg-slate-50';
  const copy = dark ? 'text-white/55' : 'text-slate-600';
  const button = dark
    ? 'border-white/15 text-white/80 hover:border-sky-400/40 hover:text-sky-300'
    : 'border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-700';

  return (
    <nav
      aria-label={`${itemLabel} pagination`}
      className={`flex flex-col items-center justify-between gap-3 rounded-2xl border p-3 sm:flex-row ${shell} ${className}`}
    >
      <p className={`text-xs ${copy}`}>
        Showing {start}–{end} of {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${button}`}
        >
          Previous
        </button>
        <p className={`min-w-24 text-center text-xs font-semibold ${copy}`}>
          Page {page} of {totalPages}
        </p>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${button}`}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
