import { useEffect, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Trophy, Star, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

const STORAGE_KEY = 'td-awards-2026-modal-dismissed';

function hasBeenDismissedToday(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const dismissedAt = new Date(raw);
    const now = new Date();
    return (
      dismissedAt.getFullYear() === now.getFullYear() &&
      dismissedAt.getMonth() === now.getMonth() &&
      dismissedAt.getDate() === now.getDate()
    );
  } catch {
    return false;
  }
}

function recordDismissal() {
  try {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch {
    // localStorage may be unavailable; fail silently
  }
}

const aims = [
  'Highlight outstanding contributions in tech and digital innovation',
  'Recognise emerging and established talent',
  'Inspire the next generation of builders and creators',
  'Strengthen the East Midlands tech ecosystem',
];

export function AwardsAnnouncementModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasBeenDismissedToday()) {
      // Small delay so the page renders first before the modal appears
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleClose() {
    recordDismissal();
    setOpen(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => { if (!next) handleClose(); }}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content */}
        <DialogPrimitive.Content
          aria-describedby="awards-modal-description"
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 px-4"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            {/* ── Header gradient band ── */}
            <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] px-8 pt-10 pb-8">
              {/* Subtle radial glow */}
              <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-[#FF6B00]/20 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl" aria-hidden="true" />

              {/* Close button */}
              <DialogPrimitive.Close
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
                aria-label="Close announcement"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>

              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/40 bg-[#FF6B00]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">
                <Sparkles className="h-3.5 w-3.5" />
                Website Announcement
              </div>

              {/* Trophy icon + titles */}
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#f59e0b] shadow-lg shadow-orange-500/30">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <DialogPrimitive.Title className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    TechDerby Digital Excellence Awards 2026
                  </DialogPrimitive.Title>
                  <p className="mt-1 text-sm font-medium text-cyan-400 tracking-wide">
                    Celebrating Innovation Across the East Midlands
                  </p>
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div id="awards-modal-description" className="bg-white px-8 py-7 space-y-6">
              {/* Intro */}
              <p className="text-[#1a1a1a] leading-relaxed">
                TechDerby is proud to introduce the{' '}
                <span className="font-semibold text-[#FF6B00]">TechDerby Awards 2026</span> — a platform
                dedicated to recognising and celebrating excellence across our growing tech ecosystem.
              </p>
              <p className="text-[#64748b] leading-relaxed text-sm">
                From founders and startups to professionals, students, and organisations, these awards
                spotlight the individuals and teams driving innovation, creating impact, and shaping the
                future of technology in our region. Whether you're building groundbreaking solutions,
                leading change within organisations, or contributing to the community —{' '}
                <span className="font-medium text-[#1a1a1a]">this is your moment to be recognised.</span>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <hr className="flex-1 border-[#e2e8f0]" />
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#FF6B00]">
                  <Star className="h-3.5 w-3.5 fill-[#FF6B00]" />
                  Why the TechDerby Awards?
                </span>
                <hr className="flex-1 border-[#e2e8f0]" />
              </div>

              {/* Why copy */}
              <p className="text-[#64748b] text-sm leading-relaxed">
                At TechDerby, we believe innovation thrives when it is{' '}
                <span className="italic text-[#1a1a1a]">seen, supported, and celebrated.</span> The awards aim to:
              </p>

              {/* Aims list */}
              <ul className="space-y-3">
                {aims.map((aim) => (
                  <li key={aim} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#f59e0b]">
                      <ChevronRight className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-[#2d3748] leading-relaxed">{aim}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Footer ── */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#e2e8f0] bg-[#f8fafc] px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleClose}
                className="text-sm text-[#64748b] underline-offset-4 hover:text-[#1a1a1a] hover:underline transition-colors"
              >
                Maybe later
              </button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="border-[#e2e8f0] text-[#64748b] hover:border-[#FF6B00] hover:text-[#FF6B00]"
                >
                  Learn More
                </Button>
                <Button
                  onClick={handleClose}
                  className="bg-[#FF6B00] text-white hover:bg-[#E55F00] shadow-md shadow-orange-500/20"
                >
                  Nominate Now
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
