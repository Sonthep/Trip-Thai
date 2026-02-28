import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Bookmark } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MyTripsList } from "./my-trips-list"

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
        </div>

        {/* Trips */}
        <MyTripsList initialTrips={savedTrips} />
      </div>

      <Footer />
    </div>
  )
}
