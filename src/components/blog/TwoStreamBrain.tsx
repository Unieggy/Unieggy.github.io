"use client";

import { useState } from "react";

type StreamKey = "dorsal" | "ventral";

const streams = {
  dorsal: {
    name: "Dorsal Stream",
    subtitle: "The 'Where' Pathway",
    color: "#3b82f6",
    functions: ["Spatial awareness", "Motion processing", "Tool use", "Navigation"],
    description:
      "Projects from V1 to the parietal lobe. Processes where objects are in space and how to interact with them. This pathway is what your brain activates when you think geometrically.",
  },
  ventral: {
    name: "Ventral Stream",
    subtitle: "The 'What' Pathway",
    color: "#22c55e",
    functions: ["Object recognition", "Color processing", "Form identification", "Face recognition"],
    description:
      "Projects from V1 to the temporal lobe. Processes object identity, color, and form. This is the pathway overloaded by rote memorization.",
  },
};

export default function TwoStreamBrain() {
  const [hovered, setHovered] = useState<StreamKey | null>(null);

  const streamOpacity = (key: StreamKey) => {
    if (hovered === null) return 1;
    return hovered === key ? 1 : 0.15;
  };

  const streamFilter = (key: StreamKey) => {
    if (hovered === key) return "drop-shadow(0 0 6px currentColor)";
    return "none";
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised/40 p-6 my-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* SVG Brain */}
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 400 280"
            width="400"
            height="280"
            style={{ maxWidth: "100%" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Brain outline */}
            <path
              d="M 195,248 C 178,248 158,240 142,226 C 100,206 68,178 64,148 C 60,118 70,92 90,74 C 110,56 138,46 168,44 C 198,42 228,50 254,65 C 280,80 300,106 308,130 C 316,154 310,182 296,202 C 280,222 252,236 224,244 Z"
              fill="#1a2420"
              stroke="#3d5048"
              strokeWidth="1.5"
            />

            {/* Gyri lines */}
            <path
              d="M 110,80 C 130,70 160,68 180,75"
              fill="none"
              stroke="#2a3530"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 90,120 C 110,105 145,100 170,108"
              fill="none"
              stroke="#2a3530"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 200,60 C 230,65 255,80 265,100"
              fill="none"
              stroke="#2a3530"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 160,185 C 185,178 215,180 235,192"
              fill="none"
              stroke="#2a3530"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Brain stem */}
            <path
              d="M 195,248 C 192,256 190,262 190,268"
              fill="none"
              stroke="#3d5048"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Dorsal stream arrow defs */}
            <defs>
              <marker
                id="arrowBlue"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M 0,0 L 0,6 L 8,3 z" fill="#3b82f6" />
              </marker>
              <marker
                id="arrowGreen"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M 0,0 L 0,6 L 8,3 z" fill="#22c55e" />
              </marker>
            </defs>

            {/* Dorsal stream — invisible wide hit area */}
            <path
              d="M 305,118 C 268,90 228,76 210,72"
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered("dorsal")}
              onMouseLeave={() => setHovered(null)}
            />
            {/* Dorsal stream — visible dashed arrow */}
            <path
              d="M 305,118 C 268,90 228,76 210,72"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              markerEnd="url(#arrowBlue)"
              style={{
                opacity: streamOpacity("dorsal"),
                filter: streamFilter("dorsal"),
                transition: "opacity 0.25s, filter 0.25s",
                color: "#3b82f6",
                pointerEvents: "none",
              }}
            />

            {/* Ventral stream — invisible wide hit area */}
            <path
              d="M 305,142 C 262,168 205,190 163,200"
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered("ventral")}
              onMouseLeave={() => setHovered(null)}
            />
            {/* Ventral stream — visible dashed arrow */}
            <path
              d="M 305,142 C 262,168 205,190 163,200"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              markerEnd="url(#arrowGreen)"
              style={{
                opacity: streamOpacity("ventral"),
                filter: streamFilter("ventral"),
                transition: "opacity 0.25s, filter 0.25s",
                color: "#22c55e",
                pointerEvents: "none",
              }}
            />

            {/* Regions */}
            {/* Occipital */}
            <circle cx="310" cy="130" r="18" fill="#1e2a25" stroke="#3d5048" strokeWidth="1.5" />
            <text x="310" y="127" textAnchor="middle" fill="#8a9a92" fontSize="9" fontFamily="sans-serif">
              Occipital
            </text>
            <text x="310" y="138" textAnchor="middle" fill="#8a9a92" fontSize="8" fontFamily="sans-serif">
              (V1)
            </text>

            {/* Parietal */}
            <circle cx="195" cy="72" r="18" fill="#1e2a25" stroke="#3b82f6" strokeWidth="1.5"
              style={{ opacity: streamOpacity("dorsal"), transition: "opacity 0.25s" }} />
            <text x="195" y="69" textAnchor="middle" fill="#8a9a92" fontSize="9" fontFamily="sans-serif"
              style={{ opacity: streamOpacity("dorsal"), transition: "opacity 0.25s" }}>
              Parietal
            </text>
            <text x="195" y="79" textAnchor="middle" fill="#8a9a92" fontSize="8" fontFamily="sans-serif"
              style={{ opacity: streamOpacity("dorsal"), transition: "opacity 0.25s" }}>
              Lobe
            </text>

            {/* Temporal */}
            <circle cx="148" cy="205" r="18" fill="#1e2a25" stroke="#22c55e" strokeWidth="1.5"
              style={{ opacity: streamOpacity("ventral"), transition: "opacity 0.25s" }} />
            <text x="148" y="202" textAnchor="middle" fill="#8a9a92" fontSize="9" fontFamily="sans-serif"
              style={{ opacity: streamOpacity("ventral"), transition: "opacity 0.25s" }}>
              Temporal
            </text>
            <text x="148" y="212" textAnchor="middle" fill="#8a9a92" fontSize="8" fontFamily="sans-serif"
              style={{ opacity: streamOpacity("ventral"), transition: "opacity 0.25s" }}>
              Lobe
            </text>

            {/* Legend */}
            <circle cx="20" cy="262" r="5" fill="#3b82f6" />
            <text x="30" y="266" fill="#8a9a92" fontSize="9" fontFamily="sans-serif">
              Dorsal — &apos;Where&apos;
            </text>
            <circle cx="20" cy="275" r="5" fill="#22c55e" />
            <text x="30" y="279" fill="#8a9a92" fontSize="9" fontFamily="sans-serif">
              Ventral — &apos;What&apos;
            </text>
          </svg>
        </div>

        {/* Info card */}
        <div className="flex-1 min-h-[180px] flex items-start pt-4">
          {hovered === null ? (
            <div className="flex items-center justify-center w-full h-full min-h-[160px]">
              <p className="text-ash text-sm italic text-center">
                Hover over a stream to see its function
              </p>
            </div>
          ) : (
            <div
              className="rounded-lg border p-4 w-full"
              style={{
                borderColor: streams[hovered].color + "40",
                backgroundColor: streams[hovered].color + "0d",
              }}
            >
              <div
                className="text-xs font-medium tracking-wider uppercase mb-1"
                style={{ color: streams[hovered].color }}
              >
                {streams[hovered].subtitle}
              </div>
              <h4
                className="font-sans font-semibold text-base text-parchment mb-3"
              >
                {streams[hovered].name}
              </h4>
              <p className="text-parchment/75 text-sm leading-relaxed mb-4">
                {streams[hovered].description}
              </p>
              <div className="flex flex-wrap gap-2">
                {streams[hovered].functions.map((fn) => (
                  <span
                    key={fn}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: streams[hovered].color + "1a",
                      color: streams[hovered].color,
                      border: `1px solid ${streams[hovered].color}33`,
                    }}
                  >
                    {fn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
