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

export default function FlowField() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    let rafId = 0;
    let t = 0;
    let W = 0;
    let H = 0;
    let seeds: { x: number; y: number }[] = [];

    // Mouse state. `influence` is a 0→1 envelope so the warp fades in/out in
    // place — the warp centre is NEVER flown across the screen (that was the
    // source of the sudden sweeping "swing").
    let mouseX = 0;
    let mouseY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let hasMouse = false;
    let influence = 0;        // eased presence, 0..1
    let targetInfluence = 0;  // 1 while cursor is over the page, else 0

    // ── Parameters ─────────────────────────────────────────────────────────
    //
    // NOISE_SCALE is the master dial: very low = enormous gentle curves that
    // bundle into thick ribbons with wide negative space between them.
    const NOISE_SCALE    = 0.0012;  // frequency of the flow field
    const STEP_LEN       = 2;       // px per integration step
    const STEPS          = 620;     // streamline length (~1240px) — long & smooth
    const LINE_W         = 0.27;    // hairline — weight comes from overlap
    const LINE_ALPHA     = 0.09;    // very low; density built by overlapping strands
    const NUM_SEEDS      = 620;     // number of streamlines
    const DRIFT          = 0.0001;  // field evolution — slow enough to avoid swings
    const ANGLE_SPAN     = Math.PI * 1.8; // noise → heading range
    const WARP_RADIUS    = 270;     // px — mouse influence radius
    const WARP_STRENGTH  = 46;      // px — max displacement of the sample point

    const r2 = WARP_RADIUS * WARP_RADIUS;

    // Heading of the flow at a point, including the (enveloped) cursor warp.
    // Sampling the same function at the midpoint gives RK2 integration, which
    // keeps long streamlines stable frame-to-frame (no sudden bends).
    const headingAt = (px: number, py: number): number => {
      let sx = px * NOISE_SCALE + t;
      let sy = py * NOISE_SCALE + t;

      if (influence > 0.001) {
        const dx = px - smoothX;
        const dy = py - smoothY;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < r2 && dist2 > 0.001) {
          const dist = Math.sqrt(dist2);
          // Push the SAMPLE POINT outward from the cursor — the flow parts
          // smoothly around it rather than being yanked. Enveloped by
          // `influence` so it eases in and out with no cross-screen sweep.
          const falloff = (1 - dist2 / r2) ** 2 * influence;
          const warp = falloff * WARP_STRENGTH * NOISE_SCALE;
          sx += (dx / dist) * warp;
          sy += (dy / dist) * warp;
        }
      }

      return noise(sx, sy) * ANGLE_SPAN;
    };

    // ── Resize: regenerate fixed seed positions ─────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fixed origins, spread 20% beyond the edges to hide seam artefacts.
      seeds = Array.from({ length: NUM_SEEDS }, () => ({
        x: (Math.random() * 1.4 - 0.2) * W,
        y: (Math.random() * 1.4 - 0.2) * H,
      }));
    };

    // ── Mouse handlers ──────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Snap on first contact so the warp doesn't sweep in from off-screen.
      if (!hasMouse) { smoothX = mouseX; smoothY = mouseY; hasMouse = true; }
      targetInfluence = 1;
    };
    const onMouseLeave = () => { targetInfluence = 0; }; // fade out in place

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    setTimeout(resize, 50);

    // ── Frame loop ──────────────────────────────────────────────────────────
    function frame() {
      rafId = requestAnimationFrame(frame);
      if (W === 0) return;

      // Track the cursor and ease the presence envelope.
      smoothX += (mouseX - smoothX) * 0.12;
      smoothY += (mouseY - smoothY) * 0.12;
      influence += (targetInfluence - influence) * 0.05;

      const isDark = document.documentElement.classList.contains("dark");

      // Hard clear — streamlines are fully redrawn each frame, never accumulated.
      ctx.fillStyle = isDark ? "#121614" : "#f2f0eb";
      ctx.fillRect(0, 0, W, H);

      ctx.lineWidth   = LINE_W;
      ctx.lineJoin    = "round";
      ctx.strokeStyle = isDark
        ? `rgba(192, 208, 200, ${LINE_ALPHA})`  // silver-sage on charcoal
        : `rgba(48, 65, 57, ${LINE_ALPHA})`;    // dark ink on warm off-white

      ctx.beginPath();

      for (const seed of seeds) {
        let cx = seed.x;
        let cy = seed.y;
        ctx.moveTo(cx, cy);

        for (let i = 0; i < STEPS; i++) {
          // RK2 (midpoint) integration — sample the heading, step half-way,
          // re-sample, then take the full step along that corrected heading.
          const a1 = headingAt(cx, cy);
          const mx = cx + Math.cos(a1) * STEP_LEN * 0.5;
          const my = cy + Math.sin(a1) * STEP_LEN * 0.5;
          const a2 = headingAt(mx, my);
          cx += Math.cos(a2) * STEP_LEN;
          cy += Math.sin(a2) * STEP_LEN;
          ctx.lineTo(cx, cy);
        }
      }

      ctx.stroke();

      t += DRIFT;
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isHome]);

  if (!isHome) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
