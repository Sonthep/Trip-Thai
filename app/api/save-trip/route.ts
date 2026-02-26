import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { type, slug, title, origin, destination, people, kmPerLiter, places, imageUrl } = body

  if (!type || !title) {
    return NextResponse.json({ error: "type and title are required" }, { status: 400 })
  }

  // Check if already saved (for curated trips: by slug; for custom: by origin+destination)
  const existing = await prisma.savedTrip.findFirst({
    where: {
      userId: session.user.id,
      type,
      ...(slug ? { slug } : { origin, destination }),
    },
  })

  if (existing) {
    // Toggle off: delete
    await prisma.savedTrip.delete({ where: { id: existing.id } })
    return NextResponse.json({ saved: false })
  }

  // Save new
  const saved = await prisma.savedTrip.create({
    data: {
      userId: session.user.id,
      type,
      slug: slug ?? null,
      title,
      origin: origin ?? null,
      destination: destination ?? null,
      people: people ? Number(people) : null,
      kmPerLiter: kmPerLiter ? Number(kmPerLiter) : null,
      places: places ?? null,
      imageUrl: imageUrl ?? null,
    },
  })

  return NextResponse.json({ saved: true, id: saved.id })
}
