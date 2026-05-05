"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";

type View = "both" | "place" | "grid";

interface PulseRing {
  x: number; y: number;
  radius: number; maxRadius: number;
  frame: number; maxFrames: number;
  color: string;
}

const PLACE_CENTER = { x: 75, y: 75 };
const PLACE_RADIUS = 55;
const GRID_SPACING = 55;
const GRID_ACTIVATION_RADIUS = 18;

function computeHexCenters(): { x: number; y: number }[] {
  const hexH = GRID_SPACING * (Math.sqrt(3) / 2);
  const centers: { x: number; y: number }[] = [];
  for (let row = -1; row < 8; row++) {
    for (let col = -1; col < 8; col++) {
      const x = col * GRID_SPACING + (row % 2 === 0 ? 0 : GRID_SPACING / 2);
      const y = row * hexH;
      if (x >= 0 && x <= 300 && y >= 0 && y <= 300) {
        centers.push({ x, y });
      }
    }
  }
  return centers;
}

const hexCenters = computeHexCenters();

type InfoState = { label: string; msg: string; color: string };

type Colors = { place: string; grid: string; both: string; idle: string; tabBoth: string };

function getInfo(view: View, placeActive: boolean, gridCount: number, c: Colors): InfoState {
  if (view === "place") {
    if (placeActive)
      return {
        label: "FIRING",
        color: c.place,
        msg: "Place cell active — this neuron has one job: signal that you are inside this specific region of space. Outside this zone it stays completely silent.",
      };
    return {
      label: "SILENT",
      color: c.idle,
      msg: "Place cell is quiet. Move your cursor into the amber circle to trigger it. Each place cell covers a distinct patch; together they tile the whole environment.",
    };
  }

  if (view === "grid") {
    if (gridCount > 0)
      return {
        label: `${gridCount} NODE${gridCount > 1 ? "S" : ""} ACTIVE`,
        color: c.grid,
        msg: `${gridCount} grid cell${gridCount > 1 ? "s" : ""} firing. Unlike place cells, grid cells repeat — they tile all of space in a hexagonal lattice, giving the brain a metric coordinate system.`,
      };
    return {
      label: "EXPLORING",
      color: c.idle,
      msg: "No grid cells firing yet. Hover over the sage nodes scattered across the arena. Notice how they form a regular hexagonal pattern — the brain's ruler.",
    };
  }

  if (placeActive && gridCount > 0)
    return {
      label: "BOTH SYSTEMS ACTIVE",
      color: c.both,
      msg: "Grid cells supply the coordinate (where on the map) and the place cell confirms the location (which place this is). This cross-reference is how the hippocampus builds a cognitive map.",
    };
  if (placeActive)
    return {
      label: "PLACE CELL ACTIVE",
      color: c.place,
      msg: "Only the place cell fires here — you're inside its field but between grid-cell nodes. The system logs a known location without a grid signal.",
    };
  if (gridCount > 0)
    return {
      label: `GRID ×${gridCount}`,
      color: c.grid,
      msg: `${gridCount} grid cell${gridCount > 1 ? "s" : ""} updating. The hexagonal lattice continuously tracks movement; this signal is fed downstream to place cells.`,
    };
  return {
    label: "NAVIGATING",
    color: c.idle,
    msg: "Move your cursor into the amber circle or over the sage nodes. Grid cells compute coordinates; place cells anchor memories to locations. Both run in parallel.",
  };
}

export default function GridPlaceCells() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agentRef = useRef({ x: 150, y: 150 });
  const pulseRingsRef = useRef<PulseRing[]>([]);
  const viewRef = useRef<View>("both");
  const rafRef = useRef<number>(0);
  const [view, setView] = useState<View>("both");
  const [firingState, setFiringState] = useState({ placeActive: false, gridCount: 0 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const colors: Colors = isDark
    ? { place: "#c4956a", grid: "#7a9e8c", both: "#9b8ab4", idle: "#5c6b64", tabBoth: "#5c7365" }
    : { place: "#8b5c30", grid: "#2c5248", both: "#5c4878", idle: "#3a4a42", tabBoth: "#2c4a3c" };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    agentRef.current = {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  useEffect(() => { viewRef.current = view; }, [view]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastPlaceActive = false;
    const lastGridActive: Set<number> = new Set();
    let frameCount = 0;

    function draw() {
      if (!ctx || !canvas) return;
      const currentView = viewRef.current;
      const agent = agentRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0c110e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const showPlace = currentView === "both" || currentView === "place";
      const showGrid  = currentView === "both" || currentView === "grid";

      // ── Place Cell ──
      const dxP = agent.x - PLACE_CENTER.x;
      const dyP = agent.y - PLACE_CENTER.y;
      const distP = Math.sqrt(dxP * dxP + dyP * dyP);
      const placeActive = distP <= PLACE_RADIUS;

      if (showPlace) {
        if (placeActive) {
          const t = Math.max(0, 1 - distP / PLACE_RADIUS);
          const grad = ctx.createRadialGradient(
            PLACE_CENTER.x, PLACE_CENTER.y, 0,
            PLACE_CENTER.x, PLACE_CENTER.y, PLACE_RADIUS,
          );
          grad.addColorStop(0, `rgba(196,149,106,${0.45 * t})`);
          grad.addColorStop(1, "rgba(196,149,106,0)");
          ctx.beginPath();
          ctx.arc(PLACE_CENTER.x, PLACE_CENTER.y, PLACE_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(PLACE_CENTER.x, PLACE_CENTER.y, PLACE_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = placeActive ? "rgba(196,149,106,0.8)" : "rgba(196,149,106,0.2)";
        ctx.lineWidth = placeActive ? 1.5 : 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(PLACE_CENTER.x, PLACE_CENTER.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = placeActive ? "#c4956a" : "rgba(196,149,106,0.28)";
        ctx.fill();

        ctx.fillStyle = placeActive ? "rgba(196,149,106,0.8)" : "rgba(196,149,106,0.28)";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText("PLACE CELL", PLACE_CENTER.x, PLACE_CENTER.y - PLACE_RADIUS - 5);

        if (placeActive && !lastPlaceActive) {
          pulseRingsRef.current.push({
            x: PLACE_CENTER.x, y: PLACE_CENTER.y,
            radius: PLACE_RADIUS, maxRadius: PLACE_RADIUS + 28,
            frame: 0, maxFrames: 35, color: "rgba(196,149,106",
          });
        }
      }
      lastPlaceActive = placeActive;

      // ── Grid Cells ──
      let activeGridCount = 0;
      if (showGrid) {
        hexCenters.forEach((center, idx) => {
          const dx = agent.x - center.x;
          const dy = agent.y - center.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const active = dist <= GRID_ACTIVATION_RADIUS;

          if (active) {
            activeGridCount++;
            const grad = ctx.createRadialGradient(
              center.x, center.y, 0,
              center.x, center.y, GRID_ACTIVATION_RADIUS * 2,
            );
            grad.addColorStop(0, "rgba(122,158,140,0.28)");
            grad.addColorStop(1, "rgba(122,158,140,0)");
            ctx.beginPath();
            ctx.arc(center.x, center.y, GRID_ACTIVATION_RADIUS * 2, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(center.x, center.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#7a9e8c";
            ctx.fill();

            if (!lastGridActive.has(idx)) {
              pulseRingsRef.current.push({
                x: center.x, y: center.y,
                radius: 5, maxRadius: 24,
                frame: 0, maxFrames: 28, color: "rgba(122,158,140",
              });
              lastGridActive.add(idx);
            }
          } else {
            ctx.beginPath();
            ctx.arc(center.x, center.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(92,115,101,0.35)";
            ctx.fill();
            lastGridActive.delete(idx);
          }
        });
      }

      // ── Pulse rings ──
      pulseRingsRef.current = pulseRingsRef.current.filter((ring) => {
        const progress = ring.frame / ring.maxFrames;
        const r = ring.radius + (ring.maxRadius - ring.radius) * progress;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${ring.color},${(1 - progress) * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ring.frame++;
        return ring.frame < ring.maxFrames;
      });

      // ── Agent ──
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = "rgba(36,50,42,0.9)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);

      if (frameCount % 6 === 0) {
        setFiringState({ placeActive, gridCount: activeGridCount });
      }
      frameCount++;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const info = getInfo(view, firingState.placeActive, firingState.gridCount, colors);

  const tabs: { key: View; label: string; accent: string }[] = [
    { key: "both",  label: "Both Systems", accent: colors.tabBoth },
    { key: "place", label: "Place Cells",  accent: colors.place   },
    { key: "grid",  label: "Grid Cells",   accent: colors.grid    },
  ];

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised/40 p-5 mt-2 mb-8">
      {/* Mode tabs */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {tabs.map(({ key, label, accent }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: view === key
                ? isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"
                : "transparent",
              color: view === key ? accent : "var(--color-ash)",
              border: "1px solid",
              borderColor: view === key ? accent + "55" : "var(--color-surface-border)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          onMouseMove={handleMouseMove}
          style={{ cursor: "none", borderRadius: "8px", display: "block", maxWidth: "100%" }}
        />
      </div>

      {/* Live status panel */}
      <div className="mt-3 rounded-lg border border-surface-border/50 bg-surface-raised px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-mono font-bold tracking-widest"
            style={{ color: info.color }}
          >
            {info.label}
          </span>
          <span className="text-surface-border/50 text-xs">—</span>
          <span className="text-ash/50 text-xs uppercase tracking-widest">
            {view === "both" ? "dual system" : view === "place" ? "place cells" : "grid cells"}
          </span>
        </div>
        <p className="text-parchment/60 text-xs leading-relaxed">{info.msg}</p>
      </div>
    </div>
  );
}
