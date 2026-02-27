import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

// POST /api/buddy/[id]/interest  — toggle interest (upsert / delete)
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: postId } = await params
  const userId = session.user.id

  const post = await prisma.tripBuddyPost.findUnique({ where: { id: postId, active: true } })
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Toggle: if exists → delete, else → create
  const existing = await prisma.tripBuddyInterest.findUnique({
    where: { userId_postId: { userId, postId } },
  })

  if (existing) {
    await prisma.tripBuddyInterest.delete({ where: { id: existing.id } })
    return NextResponse.json({ interested: false })
  } else {
    await prisma.tripBuddyInterest.create({ data: { userId, postId } })
    return NextResponse.json({ interested: true })
  }
}
