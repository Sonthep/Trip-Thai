import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000"

const unique = Date.now()
const email = `smoke-${unique}@example.com`
const tripSlug = "chiang-mai-3d2n"
const tripName = "เชียงใหม่ 3 วัน 2 คืน"
const source = "npm-smoke"

async function run() {
  const response = await fetch(`${baseUrl}/api/submit-lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      tripSlug,
      tripName,
      source,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`API failed with status ${response.status}: ${body}`)
  }

  const body = await response.json()
  if (!body?.success) {
    throw new Error(`Unexpected API response: ${JSON.stringify(body)}`)
  }

  const lead = await prisma.lead.findUnique({
    where: {
      email_tripSlug: {
        email,
        tripSlug,
      },
    },
  })

  if (!lead) {
    throw new Error("Lead was not found in database after API call")
  }

  if (lead.tripName !== tripName || lead.source !== source) {
    throw new Error("Lead data in database does not match request payload")
  }

  console.log("Smoke test passed")
  console.log(JSON.stringify({ id: lead.id, email: lead.email, tripSlug: lead.tripSlug }, null, 2))
}

run()
  .catch((error) => {
    console.error("Smoke test failed")
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
