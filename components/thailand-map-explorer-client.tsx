"use client"

import dynamic from "next/dynamic"

function MapSkeleton() {
  return (
    <div className="w-full px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">

          {/* LEFT PANEL skeleton */}
          <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            {/* Search bar */}
            <div>
              <div className="mb-1.5 h-3 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>

            {/* Region filter chips */}
            <div className="flex flex-wrap gap-2">
              {[72, 56, 80, 68].map((w, i) => (
                <div
                  key={i}
                  className="h-7 animate-pulse rounded-full bg-slate-100"
                  style={{ width: w, animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>

            {/* Province list */}
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-200" style={{ animationDelay: `${i * 40}ms` }} />
                    <div className="h-3.5 animate-pulse rounded bg-slate-200" style={{ width: 60 + (i % 4) * 20, animationDelay: `${i * 40}ms` }} />
                  </div>
                  <div className="h-3 w-5 animate-pulse rounded bg-slate-200" style={{ animationDelay: `${i * 40}ms` }} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT MAP skeleton */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/60" style={{ minHeight: 520 }}>
            {/* Faint grid lines */}
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* Province shape blobs */}
            {[
              { top: "12%", left: "20%", w: 80, h: 64 },
              { top: "18%", left: "55%", w: 100, h: 80 },
              { top: "35%", left: "30%", w: 120, h: 90 },
              { top: "30%", left: "62%", w: 90, h: 70 },
              { top: "52%", left: "18%", w: 110, h: 85 },
              { top: "50%", left: "48%", w: 130, h: 100 },
              { top: "68%", left: "35%", w: 95, h: 72 },
              { top: "65%", left: "62%", w: 85, h: 68 },
            ].map((blob, i) => (
              <div
                key={i}
                className="absolute animate-pulse rounded-2xl bg-slate-300/60"
                style={{
                  top: blob.top, left: blob.left,
                  width: blob.w, height: blob.h,
                  animationDelay: `${i * 120}ms`,
                }}
              />
            ))}

            {/* Centre loading indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-300">
                <svg className="h-6 w-6 animate-spin text-orange-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3.5A4.5 4.5 0 007.5 12H4z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-slate-400">กำลังโหลดแผนที่…</p>
            </div>

            {/* Legend placeholder */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5 backdrop-blur-sm">
              {[48, 56, 40, 52].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-300" style={{ animationDelay: `${i * 80}ms` }} />
                  <div className="h-2.5 animate-pulse rounded bg-slate-200" style={{ width: w, animationDelay: `${i * 80}ms` }} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const ThailandMapExplorerInner = dynamic(
  () => import("@/components/thailand-map-explorer").then((module) => module.ThailandMapExplorer),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  },
)

export function ThailandMapExplorerClient() {
  return <ThailandMapExplorerInner />
}

