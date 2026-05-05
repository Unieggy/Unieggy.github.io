"use client";

import dynamic from "next/dynamic";

export const TwoStreamBrain = dynamic(
  () => import("@/components/blog/TwoStreamBrain"),
  { ssr: false, loading: () => <div className="h-64 rounded-xl border border-surface-border animate-pulse bg-surface-raised/40" /> }
);

export const GridPlaceCells = dynamic(
  () => import("@/components/blog/GridPlaceCells"),
  { ssr: false, loading: () => <div className="h-64 rounded-xl border border-surface-border animate-pulse bg-surface-raised/40" /> }
);

export const EigenvalueViz = dynamic(
  () => import("@/components/blog/EigenvalueViz"),
  { ssr: false, loading: () => <div className="h-64 rounded-xl border border-surface-border animate-pulse bg-surface-raised/40" /> }
);
