"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, MapPin } from "lucide-react"

const POPULAR_DESTINATIONS = [
  "เชียงใหม่", "ภูเก็ต", "กระบี่", "เขาใหญ่", "หัวหิน", "พัทยา", "เชียงราย",
]

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
      `/trip/custom?origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(destination.trim())}&people=2&kmPerLiter=12`
    )
  }

  function setDest(dest: string) {
    setDestination(dest)
    if (!origin.trim()) setOrigin("กรุงเทพมหานคร")
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/8 p-2 backdrop-blur-md sm:flex-row"
      >
        {/* Origin */}
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="ออกจาก... (เช่น กรุงเทพ)"
            className="h-12 w-full rounded-xl bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:bg-white/10 focus:outline-none"
          />
        </div>

        {/* Arrow divider */}
        <div className="hidden items-center sm:flex">
          <ArrowRight className="h-4 w-4 text-white/30" />
        </div>

        {/* Destination */}
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
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-50 sm:shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            <><span>คำนวณงบ</span><ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </form>

      {/* Popular quick-pick */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-white/35">ยอดนิยม:</span>
        {POPULAR_DESTINATIONS.map((dest) => (
          <button
            key={dest}
            type="button"
            onClick={() => setDest(dest)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-orange-300"
          >
            {dest}
          </button>
        ))}
      </div>
    </div>
  )
}
