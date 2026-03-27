"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const options = {
  fpsLimit: 60,
  background: { color: "transparent" },
  particles: {
    number: {
      value: 50,
      density: { enable: true, width: 1440, height: 900 },
    },
    color: { value: "#5c7365" },
    opacity: {
      value: { min: 0.04, max: 0.14 },
      animation: { enable: true, speed: 0.4, sync: false },
    },
    size: { value: { min: 1, max: 2 } },
    links: {
      enable: true,
      color: "#5c7365",
      opacity: 0.07,
      distance: 160,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.2,
      direction: "none" as const,
      random: true,
      straight: false,
      outModes: { default: "bounce" as const },
    },
  },
  interactivity: {
    detectsOn: "window" as const,
    events: {
      onHover: { enable: true, mode: "grab" as const },
    },
    modes: {
      grab: {
        distance: 220,
        links: { opacity: 0.18 },
      },
    },
  },
  detectRetina: true,
} as const;

export default function ParticleBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="tsparticles"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options={options as any}
      className="!fixed !inset-0 !z-0 pointer-events-none"
    />
  );
}
