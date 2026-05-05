"use client";

import { useRef, useEffect, useState, useCallback } from "react";

type View = "both" | "place" | "grid";

interface PulseRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  frame: number;
  maxFrames: number;
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

export default function GridPlaceCells() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agentRef = useRef({ x: 150, y: 150 });
  const pulseRingsRef = useRef<PulseRing[]>([]);
  const viewRef = useRef<View>("both");
  const rafRef = useRef<number>(0);
  const [view, setView] = useState<View>("both");

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    agentRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastPlaceActive = false;
    const lastGridActive: Set<number> = new Set();

    function draw() {
      if (!ctx || !canvas) return;
      const currentView = viewRef.current;
      const agent = agentRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#121614";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Place Cell ---
      const dxP = agent.x - PLACE_CENTER.x;
      const dyP = agent.y - PLACE_CENTER.y;
      const distP = Math.sqrt(dxP * dxP + dyP * dyP);
      const placeActive = distP <= PLACE_RADIUS;

      const showPlace = currentView === "both" || currentView === "place";
      const showGrid = currentView === "both" || currentView === "grid";

      if (showPlace) {
        // Faint circle outline
        ctx.beginPath();
        ctx.arc(PLACE_CENTER.x, PLACE_CENTER.y, PLACE_RADIUS, 0, Math.PI * 2);
        if (placeActive) {
          ctx.fillStyle = "rgba(250,200,50,0.6)";
          ctx.fill();
        } else {
          ctx.strokeStyle = "rgba(250,200,50,0.2)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = "rgba(250,200,50,0.5)";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Place Cell", PLACE_CENTER.x, PLACE_CENTER.y - PLACE_RADIUS - 6);

        // Trigger pulse
        if (placeActive && !lastPlaceActive) {
          pulseRingsRef.current.push({
            x: PLACE_CENTER.x,
            y: PLACE_CENTER.y,
            radius: PLACE_RADIUS,
            maxRadius: PLACE_RADIUS + 30,
            frame: 0,
            maxFrames: 30,
            color: "rgba(250,200,50",
          });
        }
      }
      lastPlaceActive = placeActive;

      // --- Grid Cells ---
      if (showGrid) {
        hexCenters.forEach((center, idx) => {
          const dx = agent.x - center.x;
          const dy = agent.y - center.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const active = dist <= GRID_ACTIVATION_RADIUS;

          ctx.beginPath();
          ctx.arc(center.x, center.y, 3, 0, Math.PI * 2);

          if (active) {
            ctx.fillStyle = "rgba(100,200,120,0.9)";
            ctx.fill();

            if (!lastGridActive.has(idx)) {
              pulseRingsRef.current.push({
                x: center.x,
                y: center.y,
                radius: 3,
                maxRadius: 25,
                frame: 0,
                maxFrames: 30,
                color: "rgba(100,200,120",
              });
              lastGridActive.add(idx);
            }
          } else {
            ctx.fillStyle = "rgba(92,115,101,0.4)";
            ctx.fill();
            lastGridActive.delete(idx);
          }
        });
      }

      // --- Pulse rings ---
      pulseRingsRef.current = pulseRingsRef.current.filter((ring) => {
        const progress = ring.frame / ring.maxFrames;
        const r = ring.radius + (ring.maxRadius - ring.radius) * progress;
        const alpha = 1 - progress;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${ring.color},${alpha * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ring.frame++;
        return ring.frame < ring.maxFrames;
      });

      // --- Agent ---
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Arena border
      ctx.strokeStyle = "rgba(36,45,40,0.8)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const viewLabels: { key: View; label: string }[] = [
    { key: "both", label: "Both" },
    { key: "place", label: "Place Cell" },
    { key: "grid", label: "Grid Cell" },
  ];

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised/40 p-6 my-8">
      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          onMouseMove={handleMouseMove}
          style={{
            cursor: "none",
            borderRadius: "8px",
            display: "block",
            maxWidth: "100%",
          }}
        />
        <div className="flex gap-2">
          {viewLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
              style={{
                backgroundColor: view === key ? "var(--color-sage-deep)" : "transparent",
                color: view === key ? "var(--color-parchment)" : "var(--color-ash)",
                border: "1px solid",
                borderColor:
                  view === key ? "var(--color-sage)" : "var(--color-surface-border)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-ash text-xs text-center">
          Move your cursor over the arena · White dot = agent position
        </p>
      </div>
    </div>
  );
}
