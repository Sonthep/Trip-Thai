import Link from "next/link"
import { Flame, ArrowRight, Clock, MapPin } from "lucide-react"
import { prisma } from "@/lib/db"
import { getTripBySlug } from "@/lib/trips"

const TRIP_PHOTOS: Record<string, string> = {
  "bangkok-chiang-mai":    "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&q=75",
  "bangkok-phuket":        "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=75",
  "bangkok-krabi":         "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&q=75",
  "bangkok-hua-hin":       "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=75",
  "bangkok-pattaya":       "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=75",
  "bangkok-khao-yai":      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
  "chiang-mai-pai":        "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=600&q=75",
  "phuket-krabi":          "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&q=75",
  "bangkok-ayutthaya":     "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=75",
}
const FALLBACK = "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=600&q=75"

function formatBudget(n: number) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n)
}

export async function TrendingTrips() {
  // Count saves per slug (curated only)
  const counts = await prisma.savedTrip.groupBy({
    by: ["slug"],
    where: { type: "curated", slug: { not: null } },
    _count: { slug: true },
    orderBy: { _count: { slug: "desc" } },
    take: 6,
  })

  // Enrich with trip data
  const trips = counts
    .map((c) => {
      const trip = getTripBySlug(c.slug!)
      if (!trip) return null
      return { trip, saveCount: c._count.slug }
    })
    .filter(Boolean) as { trip: NonNullable<ReturnType<typeof getTripBySlug>>; saveCount: number }[]

  // If no saves yet, fall back to first 4 trips by name
  if (trips.length === 0) return null

  return (
    <section className="bg-slate-950 py-14">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">เส้นทางยอดนิยม</h2>
          <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-medium text-orange-300">
            บันทึกมากสุด
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map(({ trip, saveCount }) => (
            <Link
              key={trip.slug}
              href={`/trip/${trip.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-orange-500/30 hover:bg-white/8"
            >
              {/* Photo */}
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={TRIP_PHOTOS[trip.slug] ?? FALLBACK}
                  alt={trip.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-orange-500/90 px-2.5 py-1 text-[11px] font-semibold text-white">
                  🔥 บันทึก {saveCount} ครั้ง
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors">
                  {trip.from}
                  <ArrowRight className="inline h-3.5 w-3.5 mx-1 text-white/40" />
                  {trip.to}
                </h3>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {trip.distanceKm} กม.
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {trip.durationLabel}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-orange-300">
                  ≈ ฿{formatBudget(trip.budget.total)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
