import type { Metadata } from "next"
import Link from "next/link"
import { Users } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/db"
import { BuddyPageClient } from "./buddy-page-client"

export const metadata: Metadata = {
  title: "หาเพื่อนร่วมทริป | TripThai",
  description: "โพสต์หาเพื่อนร่วมทริปขับรถในไทย กรองตามปลายทางและวันที่ ติดต่อผ่าน LINE ได้เลย",
}

type Props = {
  searchParams: Promise<{ destination?: string; date?: string }>
}

export default async function BuddyPage({ searchParams }: Props) {
  const sp = await searchParams
  const destination = sp.destination?.trim() ?? ""
  const date = sp.date?.trim() ?? ""

  const where: Record<string, unknown> = { active: true }
  if (destination) {
    where.destination = { contains: destination, mode: "insensitive" }
  }
  if (date) {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    where.travelDate = { gte: start, lte: end }
  }

  const posts = await prisma.tripBuddyPost.findMany({
    where,
    orderBy: { travelDate: "asc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  })

  // JSON serialization (Dates → strings)
  const serialized = posts.map((p) => ({
    ...p,
    travelDate: p.travelDate.toISOString(),
    createdAt: p.createdAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
          <Link href="/" className="transition hover:text-white/70">หน้าแรก</Link>
          <span>/</span>
          <span className="text-white/70">หาเพื่อนร่วมทริป</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300 ring-1 ring-orange-500/30">
            <Users className="h-3.5 w-3.5" />
            Trip Buddy
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">หาเพื่อนร่วมทริป</h1>
          <p className="mt-2 text-white/50">
            โพสต์หาเพื่อนขับรถไปด้วยกัน กรองตามปลายทาง ติดต่อผ่าน LINE ได้เลย
          </p>
        </div>

        {/* Stats bar */}
        <div className="mb-8 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-400">{serialized.length}</p>
            <p className="text-xs text-white/50">โพสต์{destination ? ` ไป ${destination}` : "ทั้งหมด"}</p>
          </div>
          <div className="my-auto h-10 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {[...new Set(serialized.map((p) => p.destination))].length}
            </p>
            <p className="text-xs text-white/50">ปลายทาง</p>
          </div>
        </div>

        <BuddyPageClient initialPosts={serialized} initialDestination={destination} />
      </main>
      <Footer />
    </div>
  )
}
