"use client"

import dynamic from "next/dynamic"

function ThailandMapExplorerLoadError() {
  return (
    <div className="mx-auto flex h-[72vh] min-h-[520px] w-full max-w-7xl items-center justify-center rounded-2xl border border-red-300/40 bg-red-50 px-6 text-center text-sm text-red-700">
      โหลดหน้าแผนที่ไม่สำเร็จ กรุณารีเฟรชอีกครั้ง
    </div>
  )
}

const ThailandMapExplorerInner = dynamic(
  () =>
    import("@/components/thailand-map-explorer")
      .then((module) => module.ThailandMapExplorer)
      .catch((error) => {
        console.error("Failed to load ThailandMapExplorer:", error)
        return ThailandMapExplorerLoadError
      }),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex h-[72vh] min-h-[520px] w-full max-w-7xl items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 px-6 text-center text-sm text-white/80">
        กำลังโหลดแผนที่...
      </div>
    ),
  },
)

export function ThailandMapExplorerClient() {
  return <ThailandMapExplorerInner />
}
