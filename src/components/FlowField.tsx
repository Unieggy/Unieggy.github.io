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

export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    let rafId = 0;
    let t = 0;
    let W = 0;
    let H = 0;
    let seeds: { x: number; y: number }[] = [];

    // Mouse: parked far off-screen until cursor enters the viewport
    let mouseX = -9999;
    let mouseY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;

    // ── Parameters ─────────────────────────────────────────────────────────
    //
    // NOISE_SCALE is the single most important dial.
    // Very low (0.001) = enormous, gentle curves → lines naturally bundle
    // into thick ribbons with wide negative space between them.
    const NOISE_SCALE    = 0.0012;  // frequency of the flow field
    const STEP_LEN       = 2;      // px per integration step
    const STEPS          = 780;    // how long each streamline grows
    const LINE_W         = 0.27;   // hairline — weight comes from overlap
    const LINE_ALPHA     = 0.09;   // very low; density built by many overlapping strands
    const NUM_SEEDS      = 560;    // number of streamlines
    const WARP_RADIUS    = 260;    // px — mouse influence radius
    const WARP_STRENGTH  = 40;     // px — max displacement of noise sample point

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

      // Seeds are fixed spatial starting points. Each frame the streamlines
      // are re-integrated from these same origins, so the field "breathes"
      // as t advances rather than having lines jump around.
      // Spreading 20% beyond the canvas edges avoids visible seam artefacts.
      seeds = Array.from({ length: NUM_SEEDS }, () => ({
        x: (Math.random() * 1.4 - 0.2) * W,
        y: (Math.random() * 1.4 - 0.2) * H,
      }));
    };

    // ── Mouse handlers ──────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    setTimeout(resize, 50);

    // ── Frame loop ──────────────────────────────────────────────────────────
    function frame() {
      rafId = requestAnimationFrame(frame);

      // Smooth mouse so the warp fades in and out organically
      smoothX += (mouseX - smoothX) * 0.09;
      smoothY += (mouseY - smoothY) * 0.09;

      const isDark = document.documentElement.classList.contains("dark");

      // Hard clear every frame — streamlines are permanent, not accumulated.
      // This is the opposite of the fading-trail approach: each frame is a
      // complete, clean redraw of all strands at the current t.
      ctx.fillStyle = isDark ? "#121614" : "#f2f0eb";
      ctx.fillRect(0, 0, W, H);

      // Hairline strokes in the site's sage palette, very low opacity.
      // Visual density is emergent: dozens of strands converging in the
      // noise "valleys" stack their alpha and form the bright ribbons.
      ctx.lineWidth   = LINE_W;
      ctx.strokeStyle = isDark
        ? `rgba(192, 208, 200, ${LINE_ALPHA})`  // silver-sage on charcoal
        : `rgba(48, 65, 57, ${LINE_ALPHA})`;    // dark ink on warm off-white

      ctx.beginPath();

      const r2 = WARP_RADIUS * WARP_RADIUS;

      for (const seed of seeds) {
        let cx = seed.x;
        let cy = seed.y;
        ctx.moveTo(cx, cy);

        for (let i = 0; i < STEPS; i++) {
          // Base noise sample coordinates, slowly drifting with t
          let sx = cx * NOISE_SCALE + t;
          let sy = cy * NOISE_SCALE + t;

          // Mouse warp: push the noise sample point outward from the cursor.
          // Displacing the *sample point* (not the angle directly) produces
          // a smooth, organic parting of the flow field — strands appear to
          // stream around an invisible obstacle rather than being yanked.
          const dx    = cx - smoothX;
          const dy    = cy - smoothY;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < r2 && dist2 > 0.001) {
            const dist      = Math.sqrt(dist2);
            const influence = (1 - dist2 / r2) ** 2;          // smooth falloff
            const warp      = (influence * WARP_STRENGTH) * NOISE_SCALE;
            sx += (dx / dist) * warp;
            sy += (dy / dist) * warp;
          }

          const angle = noise(sx, sy) * Math.PI * 1.8;
          cx += Math.cos(angle) * STEP_LEN;
          cy += Math.sin(angle) * STEP_LEN;
          ctx.lineTo(cx, cy);
        }
      }

      ctx.stroke();

      // Very slow drift — the field shifts and breathes over tens of seconds
      t += 0.00025;
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
