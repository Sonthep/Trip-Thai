import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

// GET /api/reviews?slug=bangkok-chiang-mai
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  const reviews = await prisma.tripReview.findMany({
    where: { slug },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  })

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

  return NextResponse.json({ reviews, avg, count: reviews.length })
}

// POST /api/reviews  (auth required)
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { slug, rating, content } = body

    if (!slug?.trim()) return NextResponse.json({ error: "slug required" }, { status: 400 })
    if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 })
    if (!content?.trim()) return NextResponse.json({ error: "กรุณาเขียนรีวิว" }, { status: 400 })

    const review = await prisma.tripReview.upsert({
      where: { userId_slug: { userId: session.user.id, slug } },
      update: { rating: Number(rating), content: content.trim() },
      create: {
        userId: session.user.id,
        slug,
        rating: Number(rating),
        content: content.trim(),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("review error:", error)
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 })
  }
}
