"use client"

import dynamic from "next/dynamic"
import type { TripMapProps } from "@/components/TripMap"

const TripMapInner = dynamic(() => import("@/components/TripMap").then((mod) => mod.TripMap), {
  ssr: false,
  loading: () => (
    <div className="h-56 animate-pulse rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
  ),
})

export function TripMapClient(props: TripMapProps) {
  return <TripMapInner {...props} />
}

