import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const aims = [
  'Highlight outstanding contributions in tech and digital innovation',
  'Recognise emerging and established talent',
  'Inspire the next generation of builders and creators',
  'Strengthen the East Midlands tech ecosystem',
];

export function AwardsAnnouncementModal() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Show on every page load — this is an active announcement
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Focus close button when modal opens
  useEffect(() => {
    if (visible) {
      closeButtonRef.current?.focus();
    }
  }, [visible]);

  // Trap focus inside modal and close on Escape
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerClose();
        return;
      }
      if (e.key === 'Tab') {
        const overlay = overlayRef.current;
        if (!overlay) return;
        const focusable = overlay.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [visible]);

  function triggerClose(then?: () => void) {
    setClosing(true);
    setTimeout(() => {
      then?.();
      setClosing(false);
      setVisible(false);
    }, 220);
  }

  if (!visible) return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="awards-modal-title"
      aria-describedby="awards-modal-desc"
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center p-4',
        closing ? 'animate-fade-out' : 'animate-fade-in',
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => triggerClose()}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl',
          closing ? 'animate-zoom-out' : 'animate-zoom-in',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-8 pt-10 pb-8">
          {/* Glow accents */}
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-sky-500/10 blur-2xl" aria-hidden="true" />

          {/* Close */}
          <button
            ref={closeButtonRef}
            onClick={() => triggerClose()}
            aria-label="Close announcement"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Label badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-400">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Website Announcement
          </div>

          {/* Trophy + title */}
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-500/30">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <div>
              <h2
                id="awards-modal-title"
                className="text-xl font-extrabold leading-tight text-white sm:text-2xl"
              >
                TechDerby Digital Excellence Awards 2026
              </h2>
              <p className="mt-1.5 text-sm font-medium tracking-wide text-sky-400">
                Celebrating Innovation Across the East Midlands
              </p>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div id="awards-modal-desc" className="max-h-[55vh] overflow-y-auto bg-white px-8 py-7">
          <div className="space-y-5">
            <p className="leading-relaxed text-slate-800">
              TechDerby is proud to introduce the{' '}
              <span className="font-semibold text-orange-500">TechDerby Awards 2026</span> — a platform
              dedicated to recognising and celebrating excellence across our growing tech ecosystem.
            </p>

            <p className="text-sm leading-relaxed text-slate-600">
              From founders and startups to professionals, students, and organisations, these awards
              spotlight the individuals and teams driving innovation, creating impact, and shaping the
              future of technology in our region. Whether you're building groundbreaking solutions,
              leading change within organisations, or contributing to the community —{' '}
              <span className="font-medium text-slate-800">this is your moment to be recognised.</span>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <hr className="flex-1 border-slate-200" />
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-500">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-orange-500" aria-hidden="true">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                Why the TechDerby Awards?
              </span>
              <hr className="flex-1 border-slate-200" />
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              At TechDerby, we believe innovation thrives when it is{' '}
              <span className="italic text-slate-800">seen, supported, and celebrated.</span>{' '}
              The awards aim to:
            </p>

            <ul className="space-y-3">
              {aims.map((aim) => (
                <li key={aim} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed text-slate-700">{aim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => triggerClose()}
            className="text-sm text-slate-500 underline-offset-4 transition-colors hover:text-slate-800 hover:underline"
          >
            Maybe later
          </button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => triggerClose(() => navigate('/awards'))}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-orange-400 hover:text-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Learn More
            </button>
            <button
              onClick={() => triggerClose(() => navigate('/awards/nominate'))}
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Nominate Now
              <svg viewBox="0 0 24 24" className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
