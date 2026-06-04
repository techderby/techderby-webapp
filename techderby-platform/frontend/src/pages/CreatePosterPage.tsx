import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { removeBackground, type ProgressFn } from '../lib/removeBackground';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Path (served by Vite from `public/`) where the master poster artwork lives.
 * Save the EMTW 2026 design as `frontend/public/poster-template.png`.
 */
const TEMPLATE_URL = '/poster-template.png';

/**
 * Default placement of the portrait inside the template, expressed as
 * fractions of the template's width/height. These values roughly match the
 * person area on the supplied EMTW 2026 artwork (a 1:1 square). Users can
 * fine-tune via the controls on the page.
 */
const DEFAULT_PLACEMENT = {
  centerX: 0.66,
  centerY: 0.47,
  width: 0.55,
  height: 0.78,
  feather: 0.06,
};

type Placement = typeof DEFAULT_PLACEMENT;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Heuristically detect whether a template has the person area erased to
 * transparency. We sample alpha values inside the rectangular region where the
 * portrait would normally sit (matching DEFAULT_PLACEMENT). If a meaningful
 * portion of those pixels are transparent, the template is a 'cutout' variant
 * and the portrait should be drawn BEHIND it. Returns `true` when the
 * template appears to be person-erased.
 */
function templateHasCutout(img: HTMLImageElement): boolean {
  try {
    const off = document.createElement('canvas');
    // Downsample to keep the check cheap regardless of source resolution.
    const maxDim = 256;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const W = Math.max(1, Math.round(img.naturalWidth * scale));
    const H = Math.max(1, Math.round(img.naturalHeight * scale));
    off.width = W;
    off.height = H;
    const ctx = off.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, W, H);

    const pw = DEFAULT_PLACEMENT.width * W;
    const ph = DEFAULT_PLACEMENT.height * H;
    const px = Math.max(0, Math.floor(DEFAULT_PLACEMENT.centerX * W - pw / 2));
    const py = Math.max(0, Math.floor(DEFAULT_PLACEMENT.centerY * H - ph / 2));
    const sw = Math.min(W - px, Math.ceil(pw));
    const sh = Math.min(H - py, Math.ceil(ph));
    if (sw <= 0 || sh <= 0) return false;

    const { data } = ctx.getImageData(px, py, sw, sh);
    let transparent = 0;
    const total = data.length / 4;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 200) transparent++;
    }
    // 15% threshold avoids false positives from soft edges or shadows.
    return transparent / total > 0.15;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline icons (lucide-react is not a dependency of this app)
// ─────────────────────────────────────────────────────────────────────────────

function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Slider (lightweight, range-input based, themed to match the app)
// ─────────────────────────────────────────────────────────────────────────────

interface RangeFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  format?: (v: number) => string;
  onChange: (value: number) => void;
}

function RangeField({ id, label, value, min, max, step, disabled, format, onChange }: RangeFieldProps) {
  const display = format ? format(value) : value.toFixed(2);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <span className="text-xs tabular-nums text-slate-500">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-orange-500 disabled:opacity-50"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function CreatePosterPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [removedBgImg, setRemovedBgImg] = useState<HTMLImageElement | null>(null);
  const [portraitName, setPortraitName] = useState<string>('');
  const [placement, setPlacement] = useState<Placement>(DEFAULT_PLACEMENT);
  const [softEdge, setSoftEdge] = useState<boolean>(true);
  const [portraitOnTop, setPortraitOnTop] = useState<boolean>(true);
  const [removeBg, setRemoveBg] = useState<boolean>(false);
  const [bgProcessing, setBgProcessing] = useState<boolean>(false);
  const [bgPhase, setBgPhase] = useState<'loading' | 'processing' | 'compositing' | null>(null);
  const [bgError, setBgError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // The portrait actually used for compositing. When background removal is on
  // and finished, we use the cleaned image; otherwise we fall back to the
  // original upload (so users still see something while processing runs).
  const portraitImg = useMemo(
    () => (removeBg && removedBgImg ? removedBgImg : originalImg),
    [removeBg, removedBgImg, originalImg],
  );

  // Load default template on mount.
  useEffect(() => {
    let cancelled = false;
    loadImage(TEMPLATE_URL)
      .then((img) => {
        if (!cancelled) {
          setTemplateImg(img);
          setTemplateError(null);
          setPortraitOnTop(!templateHasCutout(img));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTemplateError(
            `Template not found at ${TEMPLATE_URL}. Save the master poster artwork there, or upload one below.`,
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !templateImg) return;

    const W = templateImg.naturalWidth;
    const H = templateImg.naturalHeight;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // Build the masked portrait (if any) on an offscreen canvas. We always
    // mask before compositing so the alpha mask doesn't leak outside the
    // portrait region when drawing on top of the template.
    let masked: HTMLCanvasElement | null = null;
    let mx = 0;
    let my = 0;
    if (portraitImg) {
      const pw = placement.width * W;
      const ph = placement.height * H;
      mx = placement.centerX * W - pw / 2;
      my = placement.centerY * H - ph / 2;

      const off = document.createElement('canvas');
      off.width = Math.max(1, Math.ceil(pw));
      off.height = Math.max(1, Math.ceil(ph));
      const octx = off.getContext('2d');
      if (octx) {
        // Cover-fit the portrait into the rectangle.
        const iw = portraitImg.naturalWidth;
        const ih = portraitImg.naturalHeight;
        const scale = Math.max(off.width / iw, off.height / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (off.width - dw) / 2;
        const dy = (off.height - dh) / 2;
        octx.drawImage(portraitImg, dx, dy, dw, dh);

        if (softEdge) {
          // Soft-edged elliptical alpha mask via radial gradient.
          octx.globalCompositeOperation = 'destination-in';
          const cx = off.width / 2;
          const cy = off.height / 2;
          const rx = off.width / 2;
          const ry = off.height / 2;
          const featherPx = placement.feather * Math.min(off.width, off.height);
          const innerStop = Math.max(0, 1 - featherPx / Math.min(rx, ry));
          octx.save();
          octx.translate(cx, cy);
          octx.scale(rx, ry);
          const grad = octx.createRadialGradient(0, 0, 0, 0, 0, 1);
          grad.addColorStop(0, 'rgba(0,0,0,1)');
          grad.addColorStop(innerStop, 'rgba(0,0,0,1)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          octx.fillStyle = grad;
          octx.beginPath();
          octx.arc(0, 0, 1, 0, Math.PI * 2);
          octx.fill();
          octx.restore();
          octx.globalCompositeOperation = 'source-over';
        }
        masked = off;
      }
    }

    if (portraitOnTop) {
      // Template first, then portrait on top. Use this mode when the
      // template still contains the original baked-in portrait — the new
      // portrait will cover it.
      ctx.drawImage(templateImg, 0, 0, W, H);
      if (masked) ctx.drawImage(masked, mx, my);
    } else {
      // Portrait first, then template on top. Use this mode when the
      // template has the person area erased to transparency — foreground
      // graphics (text, brushstrokes, ring) will sit cleanly on top.
      if (masked) ctx.drawImage(masked, mx, my);
      ctx.drawImage(templateImg, 0, 0, W, H);
    }
  }, [templateImg, portraitImg, placement, softEdge, portraitOnTop]);

  // Re-render whenever inputs change.
  useEffect(() => {
    const id = requestAnimationFrame(render);
    return () => cancelAnimationFrame(id);
  }, [render]);

  const runBackgroundRemoval = useCallback(async (file: Blob | File) => {
    setBgProcessing(true);
    setBgError(null);
    setBgPhase('loading');
    try {
      const onProgress: ProgressFn = (phase) => setBgPhase(phase);
      const cleaned = await removeBackground(file, onProgress);
      const url = URL.createObjectURL(cleaned);
      try {
        const img = await loadImage(url);
        setRemovedBgImg(img);
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setBgError(err instanceof Error ? err.message : 'Background removal failed');
    } finally {
      setBgProcessing(false);
      setBgPhase(null);
    }
  }, []);

  const handlePortraitFile = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    setOriginalFile(file);
    setPortraitName(file.name);
    setRemovedBgImg(null);
    setBgError(null);

    const url = URL.createObjectURL(file);
    loadImage(url)
      .then((img) => {
        setOriginalImg(img);
        if (removeBg) {
          void runBackgroundRemoval(file);
        }
      })
      .finally(() => URL.revokeObjectURL(url));
  };

  // When the toggle is flipped ON after an upload, lazily process the
  // current portrait (cache survives further toggles).
  useEffect(() => {
    if (removeBg && originalFile && !removedBgImg && !bgProcessing) {
      void runBackgroundRemoval(originalFile);
    }
  }, [removeBg, originalFile, removedBgImg, bgProcessing, runBackgroundRemoval]);

  const handleTemplateFile = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    loadImage(url)
      .then((img) => {
        setTemplateImg(img);
        setTemplateError(null);
        setPortraitOnTop(!templateHasCutout(img));
      })
      .finally(() => URL.revokeObjectURL(url));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handlePortraitFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'emtw-2026-i-will-be-attending.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const reset = () => {
    setPlacement(DEFAULT_PLACEMENT);
    setSoftEdge(true);
    setPortraitOnTop(true);
    setRemoveBg(false);
    setRemovedBgImg(null);
    setBgError(null);
  };

  const aspectRatio = useMemo(() => {
    if (!templateImg) return 1;
    return templateImg.naturalWidth / templateImg.naturalHeight;
  }, [templateImg]);

  const pctLabel = (v: number) => `${Math.round(v * 100)}%`;

  return (
    <>
      <PageSeo
        title="Create your EMTW 2026 poster | Tech Derby"
        description="Upload your portrait and generate a personalised 'I will be attending' poster for East Midlands Tech Week 2026."
      />

      {/* Hero */}
      <Section className="relative py-0">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(14,165,233,0.2),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(249,115,22,0.15),transparent_50%)]" />
        </div>
        <Container className="relative z-10 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              EMTW 2026
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Create your{' '}
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                "I will be attending"
              </span>{' '}
              poster
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Upload a portrait and we'll drop it straight into the East Midlands
              Tech Week 2026 poster. Download the finished image and share it on
              your socials.
            </p>
          </div>
        </Container>
      </Section>

      {/* Builder */}
      <Section className="bg-slate-50 py-12 md:py-16">
        <Container>
          {templateError && (
            <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Poster template missing</p>
              <p className="mt-1">{templateError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Live preview
                  </p>
                  <p className="text-sm text-slate-700">
                    {portraitImg
                      ? 'Your generated poster — adjust placement on the right, then download.'
                      : 'Upload a portrait to generate your poster.'}
                  </p>
                </div>
              </div>

              <div
                className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm"
                style={{ aspectRatio: String(aspectRatio) }}
              >
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                {!templateImg && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                    Loading template…
                  </div>
                )}
                {templateImg && !portraitImg && (
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-slate-900/80 to-transparent p-6 text-center">
                    <p className="text-sm font-medium text-white">
                      Upload a portrait to see it composed into the poster.
                    </p>
                  </div>
                )}
                {bgProcessing && (
                  <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-orange-400" />
                    {bgPhase === 'loading' && 'Loading model…'}
                    {bgPhase === 'processing' && 'Removing background…'}
                    {bgPhase === 'compositing' && 'Finalising…'}
                    {!bgPhase && 'Working…'}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleDownload}
                  disabled={!templateImg || !portraitImg}
                  className="gap-2"
                >
                  <IconDownload className="h-4 w-4" />
                  Generate &amp; download poster
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => portraitInputRef.current?.click()}
                  className="gap-2"
                >
                  <IconUpload className="h-4 w-4" />
                  {portraitImg ? 'Change portrait' : 'Upload portrait'}
                </Button>
                <Button variant="ghost" onClick={reset} className="gap-2">
                  <IconRefresh className="h-4 w-4" />
                  Reset placement
                </Button>
              </div>
              {!portraitImg && templateImg && (
                <p className="text-xs text-slate-500">
                  The download button activates as soon as you upload a portrait.
                </p>
              )}
            </div>

            {/* Controls */}
            <aside className="space-y-6">
              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => portraitInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') portraitInputRef.current?.click();
                }}
                className={`cursor-pointer rounded-xl border-2 border-dashed bg-white p-6 text-center transition-colors ${
                  isDragging ? 'border-orange-500 bg-orange-50' : 'border-slate-300 hover:border-orange-400'
                }`}
              >
                <IconUpload className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm font-medium text-slate-900">
                  {portraitImg ? portraitName || 'Portrait loaded' : 'Drop a portrait here'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PNG or JPG. A portrait-orientation photo works best.
                </p>
                <input
                  ref={portraitInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePortraitFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {/* Placement controls */}
              <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">Adjust placement</h2>

                <RangeField
                  id="centerX"
                  label="Horizontal position"
                  value={placement.centerX}
                  min={0}
                  max={1}
                  step={0.005}
                  format={pctLabel}
                  onChange={(v) => setPlacement((p) => ({ ...p, centerX: v }))}
                />
                <RangeField
                  id="centerY"
                  label="Vertical position"
                  value={placement.centerY}
                  min={0}
                  max={1}
                  step={0.005}
                  format={pctLabel}
                  onChange={(v) => setPlacement((p) => ({ ...p, centerY: v }))}
                />
                <RangeField
                  id="width"
                  label="Width"
                  value={placement.width}
                  min={0.1}
                  max={1}
                  step={0.005}
                  format={pctLabel}
                  onChange={(v) => setPlacement((p) => ({ ...p, width: v }))}
                />
                <RangeField
                  id="height"
                  label="Height"
                  value={placement.height}
                  min={0.1}
                  max={1}
                  step={0.005}
                  format={pctLabel}
                  onChange={(v) => setPlacement((p) => ({ ...p, height: v }))}
                />
                <RangeField
                  id="feather"
                  label="Edge softness"
                  value={placement.feather}
                  min={0}
                  max={0.3}
                  step={0.005}
                  format={pctLabel}
                  disabled={!softEdge}
                  onChange={(v) => setPlacement((p) => ({ ...p, feather: v }))}
                />

                <label className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm font-medium text-slate-700">Soft elliptical mask</span>
                  <input
                    type="checkbox"
                    checked={softEdge}
                    onChange={(e) => setSoftEdge(e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-orange-500"
                  />
                </label>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Remove background (AI)
                    </span>
                    <input
                      type="checkbox"
                      checked={removeBg}
                      onChange={(e) => setRemoveBg(e.target.checked)}
                      disabled={bgProcessing}
                      className="h-4 w-4 cursor-pointer accent-orange-500 disabled:opacity-50"
                    />
                  </label>
                  <p className="text-[11px] leading-snug text-slate-500">
                    Runs entirely in your browser. First use downloads a small
                    model (~25 MB) which is cached afterwards.
                  </p>
                  {bgProcessing && (
                    <p className="text-[11px] font-medium text-orange-600">
                      {bgPhase === 'loading' && 'Loading model…'}
                      {bgPhase === 'processing' && 'Removing background…'}
                      {bgPhase === 'compositing' && 'Finalising…'}
                      {!bgPhase && 'Working…'}
                    </p>
                  )}
                  {bgError && (
                    <p className="text-[11px] text-red-600">{bgError}</p>
                  )}
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <span className="block text-sm font-medium text-slate-700">Portrait order</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPortraitOnTop(true)}
                      className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                        portraitOnTop
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      In front of template
                    </button>
                    <button
                      type="button"
                      onClick={() => setPortraitOnTop(false)}
                      className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                        !portraitOnTop
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      Behind template
                    </button>
                  </div>
                  <p className="text-[11px] leading-snug text-slate-500">
                    Use <strong>In front</strong> when the template still has the original
                    portrait baked in — your upload will cover it. Use <strong>Behind</strong>
                    only when the template has the person area erased to transparency.
                  </p>
                </div>
              </div>

              {/* Optional template override */}
              <details className="rounded-xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-slate-900">
                  Use a custom template
                </summary>
                <p className="mt-2 text-xs text-slate-500">
                  By default the page loads <code className="rounded bg-slate-100 px-1 py-0.5">{TEMPLATE_URL}</code>.
                  Upload a different template image to override it for this session.
                </p>
                <Button
                  variant="ghost"
                  onClick={() => templateInputRef.current?.click()}
                  className="mt-3 gap-2 border border-slate-300"
                >
                  <IconUpload className="h-4 w-4" />
                  Choose template
                </Button>
                <input
                  ref={templateInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleTemplateFile(e.target.files?.[0] ?? null)}
                />
              </details>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
