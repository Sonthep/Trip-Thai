import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Bookmark, Calendar, Car, MapPin } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "ทริปที่บันทึก | TripThai",
  description: "ดูทริปที่คุณบันทึกไว้",
  robots: { index: false },
}

export default async function MyTripsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/")
  }

  const savedTrips = await prisma.savedTrip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            {session.user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                className="h-12 w-12 rounded-full border-2 border-orange-400"
              />
            )}
            <div>
              <p className="text-sm text-white/50">{session.user.email ?? "Social Account"}</p>
              <p className="text-lg font-bold">{session.user.name}</p>
            </div>
          </div>
          <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <Bookmark className="h-7 w-7 text-amber-400" />
            ทริปที่บันทึกไว้
          </h1>
          <p className="mt-1 text-sm text-white/50">{savedTrips.length} ทริป</p>
        </div>

        {savedTrips.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-8 py-16 text-center">
            <Bookmark className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <p className="text-lg font-medium text-white/60">ยังไม่มีทริปที่บันทึก</p>
            <p className="mt-1 text-sm text-white/40">กด &quot;บันทึกทริป&quot; บนหน้าทริปใด ๆ เพื่อเก็บไว้ดูภายหลัง</p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              สำรวจทริปเลย →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {savedTrips.map((trip) => {
              const href =
                trip.type === "curated" && trip.slug
                  ? `/trip/${trip.slug}`
                  : `/trip/custom?origin=${encodeURIComponent(trip.origin ?? "")}&destination=${encodeURIComponent(trip.destination ?? "")}&people=${trip.people ?? 2}&kmPerLiter=${trip.kmPerLiter ?? 12}${trip.places ? `&places=${encodeURIComponent(trip.places)}` : ""}`

              return (
                <Link
                  key={trip.id}
                  href={href}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition-all hover:border-orange-500/40 hover:bg-slate-900"
                >
                  {/* Type badge */}
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
                  <p className="mb-2 text-base font-bold text-white group-hover:text-orange-300 transition-colors">
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
                    <span className="flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {new Date(trip.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
