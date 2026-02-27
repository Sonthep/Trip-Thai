"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, X, MapPin } from "lucide-react"

const QUICK_PICKS = ["เชียงใหม่", "ภูเก็ต", "กระบี่", "หัวหิน", "พัทยา"]

export function StickyMobileCTA() {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return
      setVisible(window.scrollY > 400)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [dismissed])

  if (dismissed || !visible) return null

  function go(dest: string) {
    setDismissed(true)
    router.push(`/trip/custom?origin=${encodeURIComponent("กรุงเทพมหานคร")}&destination=${encodeURIComponent(dest)}&people=2&kmPerLiter=12`)
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden animate-in slide-in-from-bottom-2 duration-300">
      {/* Expanded quick-pick panel */}
      {expanded && (
        <div className="bg-slate-900 border-t border-white/10 px-4 pt-3 pb-2">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">เลือกปลายทางเลย</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PICKS.map((dest) => (
              <button
                key={dest}
                onClick={() => go(dest)}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition active:bg-orange-500/20"
              >
                <MapPin className="h-3 w-3 text-orange-400" />
                {dest}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main bar */}
      <div className="flex items-center gap-3 bg-orange-500 px-4 py-3 shadow-xl shadow-orange-500/30">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center justify-between text-left"
        >
          <div>
            <p className="text-[11px] font-medium text-orange-100">วางแผนทริปฟรี ใน 30 วินาที</p>
            <p className="text-sm font-bold text-white">
              {expanded ? "ปิดเมนู" : "เลือกปลายทาง →"}
            </p>
          </div>
          <ArrowRight className={`h-5 w-5 text-white transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="ปิด"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600/50 text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

