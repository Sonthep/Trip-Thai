import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

// DELETE /api/reviews/[id]  (owner only)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const review = await prisma.tripReview.findUnique({ where: { id } })
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (review.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.tripReview.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
