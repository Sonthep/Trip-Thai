import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, phone, email, tripSlug, tripName } = await request.json()

    // Validate required fields
    if (!name || !tripSlug || !tripName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Save lead to database
    await prisma.lead.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        tripSlug,
        tripName,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
    })
  } catch (error) {
    console.error("Error in submit-lead:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
