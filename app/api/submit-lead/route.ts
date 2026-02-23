import { NextResponse } from "next/server"
import { Resend } from "resend"
import { db } from "@/lib/db"

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function POST(request: Request) {
  try {
    const { email, tripSlug, tripName, source } = await request.json()

    // Validate input
    if (!email || !tripSlug || !tripName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    await db.lead.upsert({
      where: {
        email_tripSlug: {
          email: normalizedEmail,
          tripSlug,
        },
      },
      update: {
        tripName,
        source: typeof source === "string" ? source : undefined,
      },
      create: {
        email: normalizedEmail,
        tripSlug,
        tripName,
        source: typeof source === "string" ? source : undefined,
      },
    })

    // Send email notification (if RESEND_API_KEY is configured)
    if (resend) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "TripThai <onboarding@resend.dev>",
          to: email,
          subject: `ทริป${tripName}ของคุณถูกบันทึกแล้ว 🎉`,
          html: `
            <h2>สวัสดีครับ 👋</h2>
            <p>ขอบคุณที่สนใจทริป <strong>${tripName}</strong></p>
            <p>เราได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว และจะแจ้งข่าวสารอัปเดตให้ทราบเร็วๆ นี้</p>
            <p>ในอนาคต คุณจะสามารถ:</p>
            <ul>
              <li>📱 บันทึกและซิงค์ทริปทั้งหมดของคุณ</li>
              <li>🗺️ ปรับแต่งเส้นทางและกิจกรรมได้เองตามใจชอบ</li>
              <li>💰 คำนวณงบประมาณแบบเรียลไทม์</li>
              <li>📊 ติดตามค่าใช้จ่ายจริงระหว่างการเดินทาง</li>
            </ul>
            <p>แล้วพบกันเร็วๆ นี้!</p>
            <p style="color: #64748b; font-size: 14px; margin-top: 40px;">
              ทีมงาน TripThai<br/>
              <a href="https://tripThai.com" style="color: #0ea5e9;">tripThai.com</a>
            </p>
          `,
        })

        // Also send notification to admin (optional)
        if (process.env.ADMIN_EMAIL) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "TripThai <onboarding@resend.dev>",
            to: process.env.ADMIN_EMAIL,
            subject: `🎯 New Lead: ${email} for ${tripName}`,
            html: `
              <h3>New Lead Captured</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Trip:</strong> ${tripName} (${tripSlug})</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString("th-TH")}</p>
            `,
          })
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        // Don't fail the request if email fails, just log it
      }
    }

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
