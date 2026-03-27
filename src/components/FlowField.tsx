"use client";

import { useEffect, useRef } from "react";

// ── Permutation table (built once at module load) ──────────────────────────
const PERM = (() => {
  const arr = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return new Uint8Array([...arr, ...arr]);
})();

// ── Classic 2D Perlin noise ────────────────────────────────────────────────
function fade(t: number) { return t * t * t * (t * (6 * t - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad(h: number, x: number, y: number) {
  const H = h & 3;
  return ((H & 1) ? -x : x) + ((H & 2) ? -y : y);
}
function noise(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = PERM[PERM[X] + Y];
  const ba = PERM[PERM[X + 1] + Y];
  const ab = PERM[PERM[X] + Y + 1];
  const bb = PERM[PERM[X + 1] + Y + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v,
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let rafId    = 0;
    let t        = 0;
    let lastTime = 0;
    let W = 0;
    let H = 0;

    const FPS_CAP = 1000 / 30; // 30 fps is plenty for a slow ambient field

    // ── Design parameters ────────────────────────────────────────────────
    //
    // Very low noise frequency → curves have a "wavelength" > viewport width,
    // producing long sweeping arcs instead of tight curls.
    const NOISE_SCALE  = 0.00065;
    const ANGLE_RANGE  = Math.PI * 2.4; // full angle sweep without over-rotating
    const STEP         = 5;             // px per integration step
    const STEPS        = 80;            // 80 × 5 px = 400 px per line
    const LINE_W       = 0.5;

    // Mouse repulsion radius. Larger = wider void.
    const REPEL_R      = 110;

    // Golden ratio for quasi-random uniform seed distribution
    const PHI = 1.6180339887;

    // ── Resize ───────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ── Input ────────────────────────────────────────────────────────────
    const onMouseMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onMouseLeave = ()              => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener("resize",     resize);
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    resize();

    // ── Frame loop ───────────────────────────────────────────────────────
    function frame(ts: number) {
      rafId = requestAnimationFrame(frame);
      if (ts - lastTime < FPS_CAP) return;
      lastTime = ts;

      const isDark   = document.documentElement.classList.contains("dark");
      const bgColor  = isDark ? "#121614"       : "#f4f5f4";
      const lineRgb  = isDark ? "42,54,48"      : "190,200,195";
      const lineOpacity = 0.4;

      const { x: mx, y: my } = mouseRef.current;

      // Full clear each frame — crisp streamlines with no trail accumulation.
      // The animated "motion" comes from the slowly-evolving noise field (t).
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      // Line count scales with viewport area
      const lineCount = Math.max(80, Math.round((W * H) / 7000));

      ctx.lineWidth   = LINE_W;
      ctx.strokeStyle = `rgba(${lineRgb},${lineOpacity})`;

      // Batch all streamlines into one path — single stroke() call per frame
      ctx.beginPath();

      for (let i = 0; i < lineCount; i++) {
        // Quasi-random seed positions via golden-ratio sequence.
        // Small time-varying jitter prevents any zone from being permanently
        // empty while keeping the overall distribution uniform.
        let x = ((i * PHI)       % 1) * W + noise(i * 0.31,       t * 0.06) * 18;
        let y = ((i * PHI * PHI) % 1) * H + noise(i * 0.47 + 100, t * 0.06) * 18;

        ctx.moveTo(x, y);

        for (let s = 0; s < STEPS; s++) {
          // ── Flow direction from two-octave Perlin noise ─────────────────
          // First octave: large-scale structure (wide sweeping curves)
          // Second octave (2.1×): subtle undulation that avoids repetition
          const n =
            noise(x * NOISE_SCALE,         y * NOISE_SCALE         + t * 0.038) +
            noise(x * NOISE_SCALE * 2.1 + 40, y * NOISE_SCALE * 2.1 + t * 0.025) * 0.38;
          const angle = n * ANGLE_RANGE;

          // Natural unit-velocity from the noise field
          let vx = Math.cos(angle);
          let vy = Math.sin(angle);

          // ── Mouse repulsion: "rock in a river" ──────────────────────────
          //
          // Physics: a rock in a river deflects streamlines tangentially —
          // it does NOT break or scatter them. Achieved by projecting out
          // the velocity component pointing *toward* the cursor.
          //
          // If a streamline would head toward the cursor, we remove that
          // inward component, leaving only the tangential part.
          // At full influence (cursor centre) the line becomes perfectly
          // tangential to the repulsion circle and glides cleanly around it.
          const dx = x - mx;
          const dy = y - my;
          const d2 = dx * dx + dy * dy;

          if (d2 < REPEL_R * REPEL_R && d2 > 0.25) {
            const d  = Math.sqrt(d2);
            const rx = dx / d; // unit vector pointing away from cursor
            const ry = dy / d;

            // Dot product: how much of the velocity is heading toward cursor
            // (negative because rx/ry points away, so inward = –dot)
            const inward = -(vx * rx + vy * ry);

            if (inward > 0) {
              // Smooth falloff: full effect near centre, none at edge
              const influence = Math.pow(1 - d / REPEL_R, 1.5);
              // Remove the inward component proportionally
              vx += rx * inward * influence;
              vy += ry * inward * influence;
              // Re-normalise so step size stays constant
              const len = Math.sqrt(vx * vx + vy * vy) || 1;
              vx /= len;
              vy /= len;
            }
          }

          x += vx * STEP;
          y += vy * STEP;

          // Clip at canvas boundary — no wrap, lines terminate at edge
          if (x < 0 || x > W || y < 0 || y > H) break;

          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Slow drift: full angle period completes in ~50 s at 30 fps
      t += 0.004;
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",     resize);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
