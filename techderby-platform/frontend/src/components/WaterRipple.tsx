import { useEffect, useRef, useCallback, type ReactNode } from 'react';

/*
 * Two-buffer water heightmap simulation.
 * Uses half-resolution buffers for performance.
 * On each frame the heightmap propagates waves, then we render
 * a light/shadow overlay based on the gradient of the heightmap,
 * giving the appearance of water refracting / distorting light
 * over the hero image underneath.
 */

const DAMPING = 0.97;
const SCALE = 4; // each simulation cell = 4×4 CSS pixels

export function WaterRippleContainer({ children, className }: { children: ReactNode; className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastDropRef = useRef(0);

  // Two heightmap buffers (ping-pong)
  const buf1Ref = useRef<Float32Array>(new Float32Array(0));
  const buf2Ref = useRef<Float32Array>(new Float32Array(0));
  const colsRef = useRef(0);
  const rowsRef = useRef(0);

  const dropRipple = useCallback((cx: number, cy: number, strength = 512) => {
    const cols = colsRef.current;
    const rows = rowsRef.current;
    const buf = buf1Ref.current;
    const gx = Math.floor(cx / SCALE);
    const gy = Math.floor(cy / SCALE);
    const radius = 3;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx < 1 || ny < 1 || nx >= cols - 1 || ny >= rows - 1) continue;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
          buf[ny * cols + nx] += strength * (1 - dist / radius);
        }
      }
    }
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      if (now - lastDropRef.current > 50) {
        dropRipple(x, y, 400);
        lastDropRef.current = now;
      }
    },
    [dropRipple],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      dropRipple(e.clientX - rect.left, e.clientY - rect.top, 1024);
    },
    [dropRipple],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      const cols = Math.ceil(w / SCALE) + 2;
      const rows = Math.ceil(h / SCALE) + 2;
      colsRef.current = cols;
      rowsRef.current = rows;
      buf1Ref.current = new Float32Array(cols * rows);
      buf2Ref.current = new Float32Array(cols * rows);
    };
    resize();
    window.addEventListener('resize', resize);

    // Ambient ripple every 3s to show the water is alive
    const ambientId = setInterval(() => {
      const cols = colsRef.current;
      const rows = rowsRef.current;
      if (cols < 4 || rows < 4) return;
      const ax = (2 + Math.random() * (cols - 4)) * SCALE;
      const ay = (2 + Math.random() * (rows - 4)) * SCALE;
      dropRipple(ax, ay, 200);
    }, 3000);

    const animate = () => {
      const cols = colsRef.current;
      const rows = rowsRef.current;
      const prev = buf1Ref.current;
      const curr = buf2Ref.current;

      // Propagate heightmap
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const i = y * cols + x;
          curr[i] =
            (prev[i - 1] + prev[i + 1] + prev[i - cols] + prev[i + cols]) * 0.5 -
            curr[i];
          curr[i] *= DAMPING;
        }
      }

      // Swap buffers
      buf1Ref.current = curr;
      buf2Ref.current = prev;

      // Render light/shadow overlay from heightmap gradient
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.createImageData(w, h);
      const pixels = imgData.data;

      for (let py = 0; py < h; py++) {
        const gy = Math.min(Math.floor(py / SCALE) + 1, rows - 2);
        for (let px = 0; px < w; px++) {
          const gx = Math.min(Math.floor(px / SCALE) + 1, cols - 2);
          const i = gy * cols + gx;

          // Gradient gives us a fake normal
          const dx = curr[i - 1] - curr[i + 1];
          const dy = curr[i - cols] - curr[i + cols];

          // Map gradient to light intensity
          const light = dx * 0.3;
          const pidx = (py * w + px) * 4;

          if (light > 0) {
            // bright highlight (white)
            pixels[pidx] = 255;
            pixels[pidx + 1] = 255;
            pixels[pidx + 2] = 255;
            pixels[pidx + 3] = Math.min(255, light * 6) | 0;
          } else {
            // shadow (dark blue-ish)
            pixels[pidx] = 0;
            pixels[pidx + 1] = 10;
            pixels[pidx + 2] = 30;
            pixels[pidx + 3] = Math.min(255, -light * 6) | 0;
          }

          // Add subtle caustic shimmer from dy
          const caustic = dy * 0.15;
          if (caustic > 0) {
            pixels[pidx] = Math.min(255, pixels[pidx] + 60);
            pixels[pidx + 1] = Math.min(255, pixels[pidx + 1] + 90);
            pixels[pidx + 2] = Math.min(255, pixels[pidx + 2] + 120);
            pixels[pidx + 3] = Math.min(255, pixels[pidx + 3] + (caustic * 4) | 0);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(ambientId);
      window.removeEventListener('resize', resize);
    };
  }, [dropRipple]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      onMouseMove={handleMove}
      onClick={handleClick}
      style={{ position: 'relative' }}
    >
      {children}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
