"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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

// ── Look ───────────────────────────────────────────────────────────────────
// NOISE_SCALE is the master dial: very low = enormous gentle curves that
// bundle into thick ribbons with wide negative space between them.
const NOISE_SCALE   = 0.0012;  // frequency of the flow field
const STEP_LEN      = 2;       // px per integration step
const STEPS         = 620;     // streamline length (~1240px) — long & smooth
const LINE_W        = 0.27;    // hairline — weight comes from overlap
const LINE_ALPHA    = 0.09;    // very low; density built by overlapping strands
const NUM_SEEDS     = 620;     // number of streamlines
const ANGLE_SPAN    = Math.PI * 1.8; // noise → heading range
const DRIFT_PER_SEC = 0.006;   // field evolution (0.0001 per frame at 60fps)

// ── Performance ────────────────────────────────────────────────────────────
// Tracing the whole field costs ~20ms, so it is NOT done every frame. The
// field is traced once per CYCLE, spread across that cycle's frames, and
// positions are interpolated between consecutive traces. The drift is slow
// enough that this is indistinguishable from re-tracing every frame.
const CYCLE      = 2;                         // s between traces
const KEEP_EVERY = 4;                         // store every 4th step (8px chords)
const POINTS     = STEPS / KEEP_EVERY + 1;    // stored points per streamline
const TOTAL      = NUM_SEEDS * POINTS;
const MARGIN     = 40;                        // px — cull points beyond this

// ── Interaction ────────────────────────────────────────────────────────────
// Every stored point is a damped spring anchored to its traced position. The
// cursor pushes points away within RADIUS; the springs pull them back after.
// Bending the drawn points (rather than the field) keeps the effect local:
// nothing outside RADIUS moves.
const RADIUS  = 220;   // px    cursor reach
const PUSH    = 2400;  // px/s² peak push (≈ PUSH/SPRING ≈ 30px of bend)
const SOFT    = 30;    // px    softens the push right under the cursor
const SPRING  = 60;    // 1/s²  pull back toward rest
const DAMPING = 11;    // 1/s   ζ≈0.7: settles without wobbling

// Integrate streamlines [from, to) through the field at time t, keeping every
// KEEP_EVERY-th point. RK2 (midpoint) keeps long lines stable.
function trace(seeds: Float32Array, t: number, out: Float32Array, from: number, to: number) {
  for (let s = from; s < to; s++) {
    let x = seeds[2 * s];
    let y = seeds[2 * s + 1];
    let o = s * POINTS * 2;
    out[o++] = x;
    out[o++] = y;
    for (let i = 1; i <= STEPS; i++) {
      const a1 = noise(x * NOISE_SCALE + t, y * NOISE_SCALE + t) * ANGLE_SPAN;
      const mx = x + Math.cos(a1) * STEP_LEN * 0.5;
      const my = y + Math.sin(a1) * STEP_LEN * 0.5;
      const a2 = noise(mx * NOISE_SCALE + t, my * NOISE_SCALE + t) * ANGLE_SPAN;
      x += Math.cos(a2) * STEP_LEN;
      y += Math.sin(a2) * STEP_LEN;
      if (i % KEEP_EVERY === 0) {
        out[o++] = x;
        out[o++] = y;
      }
    }
  }
}

export default function FlowField() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;

    // Seeds cover 140% of the area they were made for, anchored to the page,
    // so a resize only re-seeds when the window grows well past that. The
    // mobile address bar showing/hiding no longer reshuffles the pattern.
    const seeds = new Float32Array(NUM_SEEDS * 2);
    let areaW = 0;
    let areaH = 0;

    // A → B is what's on screen (interpolated); C is traced in the background.
    let A = new Float32Array(TOTAL * 2);
    let B = new Float32Array(TOTAL * 2);
    let C = new Float32Array(TOTAL * 2);
    let tB = 0;
    let tNext = 0;
    let traced = 0;   // streamlines of C done so far
    let cycleT = 0;   // s into the current A → B interpolation

    // Spring state per stored point.
    const dx = new Float32Array(TOTAL);
    const dy = new Float32Array(TOTAL);
    const vx = new Float32Array(TOTAL);
    const vy = new Float32Array(TOTAL);
    let moving = 0;   // points still displaced; 0 = physics can be skipped

    // Cursor. `presence` eases 0↔1 so the push fades in and out; the last
    // position is kept while it fades.
    let px = 0;
    let py = 0;
    let hasPointer = false;
    let active = false;
    let presence = 0;

    const restart = () => {
      areaW = W;
      areaH = H;
      for (let s = 0; s < NUM_SEEDS; s++) {
        seeds[2 * s] = (Math.random() * 1.4 - 0.2) * W;
        seeds[2 * s + 1] = (Math.random() * 1.4 - 0.2) * H;
      }
      trace(seeds, tB, A, 0, NUM_SEEDS);
      B.set(A);
      tNext = tB + DRIFT_PER_SEC * CYCLE;
      traced = 0;
      cycleT = 0;
      dx.fill(0); dy.fill(0); vx.fill(0); vy.fill(0);
      moving = 0;
    };

    const render = (s: number, dt: number) => {
      const isDark = document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = LINE_W;
      ctx.lineJoin = "round";
      ctx.strokeStyle = isDark
        ? `rgba(192, 208, 200, ${LINE_ALPHA})`  // silver-sage on charcoal
        : `rgba(48, 65, 57, ${LINE_ALPHA})`;    // dark ink on warm off-white

      const force = hasPointer ? PUSH * presence : 0;
      const physics = dt > 0 && (force > 0.5 || moving > 0);
      const R2 = RADIUS * RADIUS;
      const S2 = SOFT * SOFT;
      const x0 = -MARGIN, y0 = -MARGIN, x1 = W + MARGIN, y1 = H + MARGIN;
      let stillMoving = 0;

      ctx.beginPath();
      for (let line = 0; line < NUM_SEEDS; line++) {
        let pen = false;
        const base = line * POINTS;
        for (let k = 0; k < POINTS; k++) {
          const i = base + k;
          const j = 2 * i;
          const rx = A[j] + (B[j] - A[j]) * s;
          const ry = A[j + 1] + (B[j + 1] - A[j + 1]) * s;

          if (physics) {
            let ax = -SPRING * dx[i] - DAMPING * vx[i];
            let ay = -SPRING * dy[i] - DAMPING * vy[i];
            let pushed = false;
            if (force > 0.5) {
              const ox = rx + dx[i] - px;
              const oy = ry + dy[i] - py;
              const r2 = ox * ox + oy * oy;
              if (r2 < R2) {
                const f = (force * (1 - r2 / R2) ** 2) / Math.sqrt(r2 + S2);
                ax += ox * f;
                ay += oy * f;
                pushed = true;
              }
            }
            if (pushed || dx[i] !== 0 || dy[i] !== 0 || vx[i] !== 0 || vy[i] !== 0) {
              vx[i] += ax * dt;
              vy[i] += ay * dt;
              dx[i] += vx[i] * dt;
              dy[i] += vy[i] * dt;
              // Snap fully-settled points to exactly zero so they drop out.
              if (!pushed && Math.abs(dx[i]) < 0.02 && Math.abs(dy[i]) < 0.02 &&
                  Math.abs(vx[i]) < 0.05 && Math.abs(vy[i]) < 0.05) {
                dx[i] = 0; dy[i] = 0; vx[i] = 0; vy[i] = 0;
              } else {
                stillMoving++;
              }
            }
          }

          const x = rx + dx[i];
          const y = ry + dy[i];
          if (x > x0 && x < x1 && y > y0 && y < y1) {
            if (pen) ctx.lineTo(x, y);
            else { ctx.moveTo(x, y); pen = true; }
          } else {
            pen = false;
          }
        }
      }
      ctx.stroke();
      if (physics) moving = stillMoving;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (areaW === 0 || W > areaW * 1.15 || H > areaH * 1.15) restart();
      if (reduceMotion.matches) render(0, 0);
    };

    // ── Loop ──────────────────────────────────────────────────────────────────
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let last = 0;

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05); // clamp after tab switches
      last = now;

      // Trace a slice of the next field so it's done by 75% of the cycle.
      if (traced < NUM_SEEDS) {
        const quota = Math.ceil((NUM_SEEDS * dt) / (CYCLE * 0.75));
        const to = Math.min(NUM_SEEDS, traced + quota);
        trace(seeds, tNext, C, traced, to);
        traced = to;
      }
      cycleT += dt;
      if (cycleT >= CYCLE) {
        if (traced < NUM_SEEDS) {
          trace(seeds, tNext, C, traced, NUM_SEEDS);
          traced = NUM_SEEDS;
        }
        const old = A;
        A = B;
        B = C;
        C = old;
        tB = tNext;
        tNext = tB + DRIFT_PER_SEC * CYCLE;
        traced = 0;
        cycleT = Math.min(cycleT - CYCLE, CYCLE);
      }

      presence += ((active ? 1 : 0) - presence) * (1 - Math.exp(-dt * 8));
      render(cycleT / CYCLE, dt);
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      if (reduceMotion.matches) {
        render(0, 0); // still lines, no drift, no interaction
        return;
      }
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    // ── Input ────────────────────────────────────────────────────────────────
    // Mouse: hovering bends, leaving the window releases. Touch/pen: pressing
    // bends, lifting (or the browser taking over to scroll) releases.
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      hasPointer = true;
      active = true;
    };
    const onEnd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") active = false;
    };
    const onLeave = () => {
      active = false;
    };
    const onTheme = () => {
      if (reduceMotion.matches) render(0, 0);
    };
    const themeObserver = new MutationObserver(onTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    reduceMotion.addEventListener("change", start);

    resize();
    start();

    return () => {
      cancelAnimationFrame(rafId);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      reduceMotion.removeEventListener("change", start);
    };
  }, [isHome]);

  if (!isHome) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
