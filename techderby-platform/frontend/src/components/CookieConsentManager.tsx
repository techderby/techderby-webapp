import { useEffect, useState } from 'react';
import { useConsent } from '../contexts/ConsentContext';

export function CookieConsentManager() {
  const {
    preferences,
    preferencesOpen,
    acceptAnalytics,
    rejectAnalytics,
    savePreferences,
    closePreferences,
    openPreferences,
  } = useConsent();
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (preferencesOpen) setAnalytics(preferences?.analytics ?? false);
  }, [preferences?.analytics, preferencesOpen]);

  useEffect(() => {
    if (!preferencesOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePreferences();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [closePreferences, preferencesOpen]);

  return (
    <>
      {!preferences && !preferencesOpen ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          className="fixed inset-x-4 bottom-4 z-[250] mx-auto max-w-4xl rounded-2xl border border-white/15 bg-slate-950/95 p-5 text-white shadow-2xl backdrop-blur-xl md:p-6"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">Your privacy choices</p>
              <h2 id="cookie-consent-title" className="mt-1 text-xl font-black">Help us improve Tech Derby</h2>
              <p id="cookie-consent-description" className="mt-2 text-sm leading-relaxed text-white/65">
                We use necessary storage to remember your privacy choice. With your permission, Google Analytics helps us understand aggregate website usage. Analytics remains off unless you accept it.
              </p>
              <a href="/cookie-policy" className="mt-2 inline-block text-sm font-semibold text-sky-300 underline decoration-sky-300/40 underline-offset-2 hover:text-sky-200">
                Read our Cookie Policy
              </a>
            </div>
            <div className="grid shrink-0 gap-2 sm:grid-cols-3 md:grid-cols-1">
              <button type="button" onClick={acceptAnalytics} className="min-h-11 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
                Accept analytics
              </button>
              <button type="button" onClick={rejectAnalytics} className="min-h-11 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700">
                Reject analytics
              </button>
              <button type="button" onClick={openPreferences} className="min-h-11 rounded-xl px-5 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/5 hover:text-white">
                Manage preferences
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {preferencesOpen ? (
        <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closePreferences();
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" className="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-950 p-6 text-white shadow-2xl md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">Privacy controls</p>
                <h2 id="cookie-settings-title" className="mt-1 text-2xl font-black">Cookie settings</h2>
              </div>
              <button type="button" onClick={closePreferences} aria-label="Close cookie settings" className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Choose whether Tech Derby may use analytics. Necessary storage only remembers this selection and cannot be disabled.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-bold">Necessary</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">Stores your privacy preference for six months.</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">Always active</span>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <span>
                  <span className="block font-bold">Analytics</span>
                  <span className="mt-1 block text-xs leading-relaxed text-white/50">Allows Google Analytics to measure aggregate page usage and successful website actions. We do not enable advertising features.</span>
                </span>
                <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="h-5 w-5 shrink-0 accent-sky-500" aria-label="Allow analytics" />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={closePreferences} className="min-h-11 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white">
                Cancel
              </button>
              <button type="button" onClick={() => savePreferences(analytics)} className="min-h-11 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
                Save preferences
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
