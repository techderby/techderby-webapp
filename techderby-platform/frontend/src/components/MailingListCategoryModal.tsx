import { MAILING_LIST_CATEGORIES, type MailingListCategory } from '../constants/mailing-list';

type MailingListCategoryModalProps = {
  isOpen: boolean;
  selectedCategory: MailingListCategory | '';
  error: string | null;
  isSubmitting: boolean;
  onSelect: (category: MailingListCategory) => void;
  onContinue: () => void;
  onClose: () => void;
};

export function MailingListCategoryModal({
  isOpen,
  selectedCategory,
  error,
  isSubmitting,
  onSelect,
  onContinue,
  onClose,
}: MailingListCategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mailing-list-category-title"
        aria-describedby="mailing-list-category-description"
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-slate-900 p-6 shadow-2xl shadow-black/60"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">One last step</p>
            <h2 id="mailing-list-category-title" className="mt-2 text-2xl font-black text-white">Which best describes you?</h2>
            <p id="mailing-list-category-description" className="mt-2 text-sm leading-relaxed text-white/60">
              Select a category so we can send you the most relevant Tech Derby updates.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close category selection"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-xl text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <fieldset className="mt-6 space-y-2">
          <legend className="sr-only">Mailing list category</legend>
          {MAILING_LIST_CATEGORIES.filter((category) => category !== 'None').map((category) => (
            <label
              key={category}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                selectedCategory === category
                  ? 'border-sky-400 bg-sky-500/15 text-white'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <input
                type="radio"
                name="mailing-list-category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => onSelect(category)}
                className="h-4 w-4 accent-sky-500"
              />
              <span>{category}</span>
            </label>
          ))}
        </fieldset>

        {error ? <p role="alert" className="mt-3 text-sm text-red-300">{error}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 px-5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            Close without selecting
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
