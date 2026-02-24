import Link from "next/link"
import { ArrowRight } from "lucide-react"

type Season = "cool" | "hot" | "rainy"

type SeasonalDestination = {
  region: string
  emoji: string
  why: string
  detail: string
  highlights: string[]
  slug: string
  img: string
}

// Month → season mapping (Thai climate)
const MONTH_SEASON: Record<number, Season> = {
  11: "cool", 12: "cool", 1: "cool", 2: "cool",  // พ.ย.–ก.พ.
  3: "hot",  4: "hot",  5: "hot",                 // มี.ค.–พ.ค.
  6: "rainy", 7: "rainy", 8: "rainy",
  9: "rainy", 10: "rainy",                        // มิ.ย.–ต.ค.
}

const SEASON_LABEL: Record<Season, { th: string; badge: string; bg: string; text: string }> = {
  cool:  { th: "หน้าหนาว ❄️", badge: "bg-sky-100 text-sky-700", bg: "from-sky-900", text: "sky" },
  hot:   { th: "หน้าร้อน ☀️", badge: "bg-amber-100 text-amber-700", bg: "from-amber-900", text: "amber" },
  rainy: { th: "หน้าฝน 🌧️", badge: "bg-emerald-100 text-emerald-700", bg: "from-emerald-900", text: "emerald" },
}

const SEASON_DESTINATIONS: Record<Season, SeasonalDestination[]> = {
  cool: [
    {
      region: "ภาคเหนือ",
      emoji: "🏔️",
      why: "อากาศเย็น 12–20°C ฟ้าใส ไม่มีฝน",
      detail: "ช่วงที่ดีที่สุดของปีสำหรับภาคเหนือ ดอกไม้บาน ทะเลหมอกสวยสุด",
      highlights: ["ดอยอินทนนท์", "เชียงราย", "ปาย"],
      slug: "bangkok-chiang-mai",
      img: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&q=75",
    },
    {
      region: "อันดามัน",
      emoji: "🏝️",
      why: "ทะเลใสสุด คลื่นเบา Visibility ดี",
      detail: "หน้าหนาวเป็นช่วง High Season ของทะเลอันดามัน น้ำใสที่สุดในรอบปี",
      highlights: ["ภูเก็ต", "กระบี่", "พังงา"],
      slug: "bangkok-phuket",
      img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=75",
    },
    {
      region: "ภาคกลาง",
      emoji: "🌿",
      why: "อากาศเย็นสบาย เหมาะขับรถไกล",
      detail: "เขาใหญ่เขียวขจีหลังฝน อากาศดีสำหรับ Day Trip และ Weekend Trip",
      highlights: ["เขาใหญ่", "กาญจนบุรี", "อยุธยา"],
      slug: "bangkok-khao-yai",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
    },
  ],
  hot: [
    {
      region: "อ่าวไทย",
      emoji: "🌊",
      why: "ทะเลฝั่งอ่าวไทยสงบ คลื่นเบา",
      detail: "ฝั่งอ่าวไทยเหมาะกว่าอันดามันในหน้าร้อน ราคาที่พักถูกกว่า High Season",
      highlights: ["สมุย", "หัวหิน", "พัทยา"],
      slug: "bangkok-hua-hin",
      img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=75",
    },
    {
      region: "ภาคเหนือ (เย็น)",
      emoji: "💨",
      why: "หนีร้อน ภูเขาสูง 1,000+ ม. เย็นกว่า 5–8°C",
      detail: "แม้หน้าร้อน ยอดดอยยังเย็นสบาย เหมาะสำหรับคนหนีความร้อน",
      highlights: ["แม่ฮ่องสอน", "น่าน", "ดอยอินทนนท์"],
      slug: "bangkok-chiang-mai",
      img: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&q=75",
    },
    {
      region: "ประวัติศาสตร์",
      emoji: "🛕",
      why: "พิพิธภัณฑ์ + วัด เที่ยวในร่ม ไม่โดนแดด",
      detail: "อยุธยา สุโขทัย เที่ยวเช้าวันสบาย หลีกเลี่ยงแดดกลางวัน",
      highlights: ["อยุธยา", "สุโขทัย", "กรุงเทพฯ เก่า"],
      slug: "bangkok-ayutthaya",
      img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=75",
    },
  ],
  rainy: [
    {
      region: "ภาคอีสาน",
      emoji: "🌾",
      why: "ฝนน้อยกว่าภาคอื่น ทุ่งนาเขียว ราคาถูก",
      detail: "หน้าฝนภาคอีสานมีฝนน้อย ทุ่งนาเขียว บรรยากาศสงบ ราคาที่พักต่ำสุด",
      highlights: ["โคราช", "ขอนแก่น", "อุดรธานี"],
      slug: "bangkok-khao-yai",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
    },
    {
      region: "อ่าวไทย (ฝนน้อย)",
      emoji: "⛅",
      why: "ฝั่งอ่าวไทยไม่ค่อยมีฝนช่วงมิ.ย.–ต.ค.",
      detail: "ขณะที่อันดามันมีมรสุม อ่าวไทยยังเที่ยวได้สบาย ราคาถูกที่สุด",
      highlights: ["สมุย", "หัวหิน", "พัทยา"],
      slug: "bangkok-hua-hin",
      img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=75",
    },
    {
      region: "น้ำตก + ป่า",
      emoji: "💧",
      why: "น้ำตกสวยที่สุดในรอบปี น้ำเต็ม",
      detail: "เขาใหญ่ เอราวัณ น้ำตกดีที่สุดในหน้าฝน ธรรมชาติเขียวสด",
      highlights: ["เอราวัณ", "เขาใหญ่", "กาญจนบุรี"],
      slug: "bangkok-kanchanaburi",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
    },
  ],
}

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1 // 1-12
  return MONTH_SEASON[month] ?? "cool"
}

function getMonthName(): string {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
  return months[new Date().getMonth()]
}

export function SeasonalCallout() {
  const season = getCurrentSeason()
  const meta = SEASON_LABEL[season]
  const destinations = SEASON_DESTINATIONS[season]
  const monthName = getMonthName()

  return (
    <section className="bg-slate-900 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}>
              {meta.th}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
              เดือน{monthName}นี้ ไปที่ไหนดี?
            </h2>
            <p className="mt-2 text-slate-400">
              เราแนะนำจากสภาพอากาศจริง — พร้อมงบประมาณ
            </p>
          </div>
          <p className="text-sm text-slate-500">อัปเดตตามฤดูกาล</p>
        </div>

        {/* Destination cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {destinations.map((dest) => (
            <div
              key={dest.region}
              className="group relative overflow-hidden rounded-2xl bg-slate-800"
            >
              {/* Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dest.img}
                alt={dest.region}
                className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 h-44 bg-gradient-to-b from-transparent via-transparent to-slate-800" />

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {dest.emoji} {dest.region}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-orange-400">
                      {dest.why}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-400">{dest.detail}</p>

                {/* Highlight chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dest.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-slate-300"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/trip/${dest.slug}`}
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-orange-400 hover:text-orange-300"
                >
                  ดูเส้นทาง
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
