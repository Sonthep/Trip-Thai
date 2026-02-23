"use client"

import dynamic from "next/dynamic"

const ThailandMapExplorerInner = dynamic(
  () => import("@/components/thailand-map-explorer").then((module) => module.ThailandMapExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto h-[72vh] min-h-[520px] w-full max-w-7xl animate-pulse rounded-2xl border border-white/10 bg-slate-900/70" />
    ),
  },
)

export function ThailandMapExplorerClient() {
  return <ThailandMapExplorerInner />
}
