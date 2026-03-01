"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, MapPin } from "lucide-react"

export function HeroSearch() {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    setLoading(true)
    router.push(
      `/trip/custom?origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(destination.trim())}&people=2&kmPerLiter=12&budgetTier=mid`
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Row 1 — origin / destination */}
        <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/8 p-2 backdrop-blur-md sm:flex-row">
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="ออกจาก... (เช่น กรุงเทพ)"
              className="h-12 w-full rounded-xl bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:bg-white/10 focus:outline-none"
            />
          </div>
          <div className="hidden items-center sm:flex">
            <ArrowRight className="h-4 w-4 text-white/30" />
          </div>
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="ไปที่... (เช่น เชียงใหม่)"
              className="h-12 w-full rounded-xl bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:bg-white/10 focus:outline-none"
            />
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !origin.trim() || !destination.trim()}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <><span>คำนวณงบ</span><ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </form>

    </div>
  )
}
