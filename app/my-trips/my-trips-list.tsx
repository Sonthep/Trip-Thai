"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, Calendar, Car, MapPin, Trash2 } from "lucide-react"

type SavedTrip = {
  id: string
  type: string
  slug: string | null
  title: string
  origin: string | null
  destination: string | null
  people: number | null
  kmPerLiter: number | null
  places: string | null
  createdAt: Date
}

export function MyTripsList({ initialTrips }: { initialTrips: SavedTrip[] }) {
  const [trips, setTrips] = useState(initialTrips)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDeletingId(id)
    try {
      await fetch(`/api/save-trip?id=${id}`, { method: "DELETE" })
      setTrips((prev) => prev.filter((t) => t.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  if (trips.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-8 py-16 text-center">
        <Bookmark className="mx-auto mb-4 h-12 w-12 text-white/20" />
        <p className="text-lg font-medium text-white/60">ยังไม่มีทริปที่บันทึก</p>
        <p className="mt-1 text-sm text-white/40">
          กด &quot;บันทึกทริป&quot; บนหน้าทริปใด ๆ เพื่อเก็บไว้ดูภายหลัง
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          สำรวจทริปเลย →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">{trips.length} ทริป</p>
      <div className="grid gap-4 sm:grid-cols-2">
      {trips.map((trip) => {
        const href =
          trip.type === "curated" && trip.slug
            ? `/trip/${trip.slug}`
            : `/trip/custom?origin=${encodeURIComponent(trip.origin ?? "")}&destination=${encodeURIComponent(trip.destination ?? "")}&people=${trip.people ?? 2}&kmPerLiter=${trip.kmPerLiter ?? 12}${trip.places ? `&places=${encodeURIComponent(trip.places)}` : ""}`

        const isDeleting = deletingId === trip.id

        return (
          <div key={trip.id} className="group relative">
            <Link
              href={href}
              className={`flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition-all hover:border-orange-500/40 hover:bg-slate-900 ${
                isDeleting ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {/* Type badge + bookmark icon */}
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    trip.type === "curated"
                      ? "bg-sky-500/15 text-sky-300"
                      : "bg-orange-500/15 text-orange-300"
                  }`}
                >
                  {trip.type === "curated" ? "🗺️ เส้นทางแนะนำ" : "🚗 ทริปที่คำนวณ"}
                </span>
                <Bookmark className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>

              {/* Title */}
              <p className="mb-2 text-base font-bold text-white transition-colors group-hover:text-orange-300">
                {trip.title}
              </p>

              {/* Meta */}
              <div className="mt-auto flex flex-wrap gap-3 text-xs text-white/50">
                {trip.origin && trip.destination && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {trip.origin} → {trip.destination}
                  </span>
                )}
                {trip.people && (
                  <span className="flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    {trip.people} คน
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(trip.createdAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
              </div>
            </Link>

            {/* Delete button — absolute top-right */}
            <button
              onClick={(e) => handleDelete(trip.id, e)}
              disabled={isDeleting}
              title="ลบทริปนี้"
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-500 opacity-0 transition-all hover:bg-rose-500/20 hover:text-rose-400 group-hover:opacity-100 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-t-rose-400" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )
      })}
    </div>
    </div>
  )
}
