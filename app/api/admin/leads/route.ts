import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"
import { timingSafeEqual } from "node:crypto"

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 200

export const dynamic = "force-dynamic"

function isTokenValid(providedToken: string | null, expectedToken: string) {
  if (!providedToken) {
    return false
  }

  const providedBuffer = Buffer.from(providedToken)
  const expectedBuffer = Buffer.from(expectedToken)

  if (providedBuffer.length !== expectedBuffer.length) {
    return false
  }

  return timingSafeEqual(providedBuffer, expectedBuffer)
}

function getAuthorizationError(request: Request) {
  const expectedToken = process.env.ADMIN_API_TOKEN

  if (!expectedToken) {
    return NextResponse.json(
      { error: "Admin API token is not configured" },
      { status: 503 },
    )
  }

  const providedToken = request.headers.get("x-admin-token")

  if (!isTokenValid(providedToken, expectedToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}

function parseLimit(value: string | null) {
  if (!value) {
    return DEFAULT_LIMIT
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT
  }

  return Math.min(Math.floor(parsed), MAX_LIMIT)
}

export async function GET(request: Request) {
  const authError = getAuthorizationError(request)
  if (authError) {
    return authError
  }

  try {
    const { searchParams } = new URL(request.url)

    const limit = parseLimit(searchParams.get("limit"))
    const tripSlug = searchParams.get("tripSlug") ?? undefined
    const email = searchParams.get("email") ?? undefined
    const cursor = searchParams.get("cursor") ?? undefined

    const where: Prisma.LeadWhereInput = {
      tripSlug,
      email: email
        ? {
            contains: email,
            mode: "insensitive",
          }
        : undefined,
    }

    const [total, leads] = await db.$transaction([
      db.lead.count({ where }),
      db.lead.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        take: limit,
      }),
    ])

    const nextCursor = leads.length === limit ? leads[leads.length - 1]?.id ?? null : null

    return NextResponse.json(
      {
        total,
        limit,
        cursor,
        nextCursor,
        leads,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error("Admin leads API error:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}
