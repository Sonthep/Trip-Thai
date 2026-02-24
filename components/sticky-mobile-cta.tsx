"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, X } from "lucide-react"

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return
      setVisible(window.scrollY > 320)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [dismissed])

  if (dismissed || !visible) return null

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 md:hidden animate-in slide-in-from-bottom-2 duration-300"
      role="complementary"
      aria-label="วางแผนทริปด่วน"
    >
      <div className="flex items-center gap-3 bg-orange-500 px-4 py-3 shadow-xl shadow-orange-500/30">
        <Link
          href="#quick-planner"
          onClick={() => setDismissed(true)}
          className="flex flex-1 items-center justify-between"
        >
          <div>
            <p className="text-xs font-medium text-orange-100">วางแผนทริปฟรี ใน 30 วินาที</p>
            <p className="text-sm font-bold text-white">รู้งบทุกเส้นทางทั่วไทย →</p>
          </div>
          <ArrowRight className="h-5 w-5 text-white" />
        </Link>

        <button
          onClick={() => setDismissed(true)}
          aria-label="ปิด"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-600/50 text-white transition-colors hover:bg-orange-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
