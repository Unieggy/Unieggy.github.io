"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const W = 360;
const H = 280;
const CX = 180;
const CY = 140;
const SCALE = 40; // pixels per unit

// Matrix A = [[2,1],[1,2]]
// Eigenvalue λ1=3, eigenvector [1,1]/√2
// Eigenvalue λ2=1, eigenvector [1,-1]/√2
function applyMatrix(t: number, x: number, y: number): [number, number] {
  // Lerp between identity and A
  const a11 = 1 + t * (2 - 1); // 1 → 2
  const a12 = t * 1;            // 0 → 1
  const a21 = t * 1;            // 0 → 1
  const a22 = 1 + t * (2 - 1); // 1 → 2
  return [a11 * x + a12 * y, a21 * x + a22 * y];
}

function toCanvas(x: number, y: number): [number, number] {
  return [CX + x * SCALE, CY - y * SCALE];
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 6),
    y2 - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 6),
    y2 - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export default function EigenvalueViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  const dirRef = useRef(1);
  const rafRef = useRef<number>(0);

  const draw = useCallback((tVal: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#121614";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(36,45,40,0.8)";
    ctx.lineWidth = 1;
    for (let gx = -4; gx <= 4; gx++) {
      const [cx] = toCanvas(gx, 0);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      ctx.stroke();
    }
    for (let gy = -4; gy <= 4; gy++) {
      const [, cy] = toCanvas(0, gy);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(100,120,110,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, CY);
    ctx.lineTo(W, CY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CX, 0);
    ctx.lineTo(CX, H);
    ctx.stroke();

    // Transformed ellipse (dim)
    if (tVal > 0) {
      ctx.save();
      ctx.globalAlpha = 0.2 * tVal;
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const nPts = 100;
      for (let i = 0; i <= nPts; i++) {
        const angle = (i / nPts) * Math.PI * 2;
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        const [ax, ay] = applyMatrix(1, ux, uy);
        const [cx, cy] = toCanvas(ax, ay);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // Unit circle (dashed)
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(CX, CY, SCALE, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 6 sample vectors (none are eigenvectors — all drawn gray)
    const sampleAngles = [0, 60, 120, 180, 240, 300].map((d) => (d * Math.PI) / 180);
    const [ox, oy] = toCanvas(0, 0);
    sampleAngles.forEach((angle) => {
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const [ax, ay] = applyMatrix(tVal, ux, uy);
      const [x2, y2] = toCanvas(ax, ay);
      drawArrow(ctx, ox, oy, x2, y2, "rgba(220,220,220,0.35)", 1.5);
    });

    // Eigenvectors drawn explicitly
    const ev1 = 1 / Math.sqrt(2);
    // λ=3: direction [1,1]/√2
    const [bx, by] = applyMatrix(tVal, ev1, ev1);
    const [bx2, by2] = toCanvas(bx, by);
    drawArrow(ctx, ox, oy, bx2, by2, "#3b82f6", 2.5);
    // λ=1: direction [1,-1]/√2
    const [gx, gy] = applyMatrix(tVal, ev1, -ev1);
    const [gx2, gy2] = toCanvas(gx, gy);
    drawArrow(ctx, ox, oy, gx2, gy2, "#5c7365", 2.5);

    // Eigenvector guide lines (always visible, full extent)
    const lineExtent = 3.2;

    // Eigenvector 1: [1,1]/√2, λ=3 — blue
    ctx.save();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.5;
    const [lx1a, ly1a] = toCanvas(-lineExtent * ev1, -lineExtent * ev1);
    const [lx1b, ly1b] = toCanvas(lineExtent * ev1, lineExtent * ev1);
    ctx.beginPath();
    ctx.moveTo(lx1a, ly1a);
    ctx.lineTo(lx1b, ly1b);
    ctx.stroke();
    ctx.restore();
    // λ=3 label
    const [labelX1, labelY1] = toCanvas(3 * ev1 + 0.15, 3 * ev1 - 0.15);
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("λ = 3", labelX1, labelY1);

    // Eigenvector 2: [1,-1]/√2, λ=1 — sage green
    ctx.save();
    ctx.strokeStyle = "#5c7365";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.5;
    const [lx2a, ly2a] = toCanvas(-lineExtent * ev1, lineExtent * ev1);
    const [lx2b, ly2b] = toCanvas(lineExtent * ev1, -lineExtent * ev1);
    ctx.beginPath();
    ctx.moveTo(lx2a, ly2a);
    ctx.lineTo(lx2b, ly2b);
    ctx.stroke();
    ctx.restore();
    // λ=1 label
    const [labelX2, labelY2] = toCanvas(1 * ev1 + 0.15, -(1 * ev1) - 0.25);
    ctx.fillStyle = "#5c7365";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("λ = 1", labelX2, labelY2);

    // Border
    ctx.strokeStyle = "rgba(36,45,40,0.8)";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
  }, []);

  useEffect(() => {
    draw(t);
  }, [t, draw]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    function animate() {
      tRef.current += 0.008 * dirRef.current;
      if (tRef.current >= 1) {
        tRef.current = 1;
        dirRef.current = -1;
      } else if (tRef.current <= 0) {
        tRef.current = 0;
        dirRef.current = 1;
      }
      setT(tRef.current);
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised/40 p-6 my-8">
      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ borderRadius: "8px", display: "block", maxWidth: "100%" }}
        />

        <div className="flex items-center gap-4 w-full max-w-sm">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors duration-200"
            style={{
              backgroundColor: playing ? "var(--color-sage-deep)" : "transparent",
              color: playing ? "var(--color-parchment)" : "var(--color-ash)",
              borderColor: playing ? "var(--color-sage)" : "var(--color-surface-border)",
              flexShrink: 0,
            }}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs text-ash">
              Transform: {Math.round(t * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(t * 100)}
              onChange={(e) => {
                const val = Number(e.target.value) / 100;
                tRef.current = val;
                setT(val);
              }}
              className="w-full accent-sage"
              style={{ accentColor: "var(--color-sage)" }}
            />
          </div>
        </div>

        <p className="text-ash text-xs text-center italic">
          Eigenvectors (blue, green) only stretch — they never rotate.
        </p>
      </div>
    </div>
  );
}
