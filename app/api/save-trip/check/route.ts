import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ saved: false })
  }

  const body = await req.json()
  const { type, slug, origin, destination } = body

  const existing = await prisma.savedTrip.findFirst({
    where: {
      userId: session.user.id,
      type,
      ...(slug ? { slug } : { origin, destination }),
    },
  })

  return NextResponse.json({ saved: !!existing })
}
