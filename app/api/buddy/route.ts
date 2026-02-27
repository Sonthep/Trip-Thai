import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

// GET /api/buddy?destination=xxx&date=2026-03-01
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const destination = searchParams.get("destination")
  const date = searchParams.get("date")

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

  return NextResponse.json(posts)
}

// POST /api/buddy  (auth required)
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { origin, destination, travelDate, seats, note, lineContact } = body

    if (!origin?.trim() || !destination?.trim() || !travelDate || !lineContact?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const post = await prisma.tripBuddyPost.create({
      data: {
        userId: session.user.id,
        origin: origin.trim(),
        destination: destination.trim(),
        travelDate: new Date(travelDate),
        seats: Math.max(1, Math.min(10, Number(seats) || 1)),
        note: note?.trim() || null,
        lineContact: lineContact.trim(),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("buddy post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
