import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")

  if (!secret || secret !== process.env.ADMIN_API_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(leads)
}
