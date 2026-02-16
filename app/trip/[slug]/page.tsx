import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Car,
  Clock,
  Coins,
  Fuel,
  Map,
  MapPin,
  Plane,
  Utensils,
  BedDouble,
  Share2,
  BookmarkPlus,
} from "lucide-react"
import { TripBudgetChart } from "@/components/TripBudgetChart"
import { TripMapClient as TripMap } from "@/components/TripMapClient"

type TripDay = {
  day: number
  title: string
  items: string[]
}

type TripBudget = {
  fuel: number
  toll: number
  food: number
  accommodation: number
  total: number
}

type TripDetail = {
  slug: string
  name: string
  from: string
  to: string
  distanceKm: number
  durationHours: number
  durationLabel: string
  budgetRangeLabel: string
  budget: TripBudget
  itinerary: TripDay[]
  originLocation: { lat: number; lng: number }
  destinationLocation: { lat: number; lng: number }
}

const TRIPS: TripDetail[] = [
  {
    slug: "bangkok-chiang-mai",
    name: "กรุงเทพ → เชียงใหม่",
    from: "กรุงเทพ",
    to: "เชียงใหม่",
    distanceKm: 700,
    durationHours: 9.5,
    durationLabel: "ขับรถประมาณ 9–10 ชม.",
    budgetRangeLabel: "งบรวม 8,000 – 12,000 บาท / ทริป 3 วัน 2 คืน",
    budget: {
      fuel: 2600,
      toll: 320,
      food: 3600,
      accommodation: 2400,
      total: 2600 + 320 + 3600 + 2400,
    },
    itinerary: [
      {
        day: 1,
        title: "ออกเดินทางจากกรุงเทพ – เชียงใหม่",
        items: [
          "ออกเดินทางจากกรุงเทพ ช่วงเช้ามืด แวะปั๊มน้ำมันใหญ่เพื่อเติมน้ำมันและซื้ออาหารเช้า",
          "แวะพักรถที่นครสวรรค์ / กำแพงเพชร สำหรับเข้าห้องน้ำและยืดเส้นยืดสาย",
          "มาถึงเชียงใหม่ช่วงบ่าย เช็คอินที่โรงแรม/โฮเทลในตัวเมือง",
          "เย็น: เดินเล่นถนนนิมมานฯ หรือคาเฟ่บนดาดฟ้า ชมวิวพระอาทิตย์ตก",
        ],
      },
      {
        day: 2,
        title: "เที่ยวรอบเชียงใหม่ – วัด คาเฟ่ และจุดชมวิว",
        items: [
          "เช้า: ไหว้พระที่ดอยสุเทพ หรือวัดพระธาตุดอยคำ ชมวิวเมืองเชียงใหม่",
          "กลางวัน: คาเฟ่วิวภูเขา/แม่น้ำ รอบนอกตัวเมือง",
          "บ่าย: เดินเล่นคูเมืองเชียงใหม่ / คาเฟ่สไตล์มินิมอล",
          "ค่ำ: ดินเนอร์ร้านอาหารท้องถิ่น หรือถนนคนเดิน (ถ้าตรงกับวันเสาร์/อาทิตย์)",
        ],
      },
      {
        day: 3,
        title: "เดินทางกลับกรุงเทพ",
        items: [
          "เช้า: เช็คเอาท์ ออกเดินทางจากเชียงใหม่",
          "แวะทานกลางวันระหว่างทางที่กำแพงเพชร / นครสวรรค์",
          "ถึงกรุงเทพช่วงค่ำ พักผ่อนหลังจบทริป",
        ],
      },
    ],
    originLocation: {
      lat: 13.7563, // Bangkok
      lng: 100.5018,
    },
    destinationLocation: {
      lat: 18.7883, // Chiang Mai
      lng: 98.9853,
    },
  },
]

function getTripBySlug(slug: string): TripDetail | undefined {
  return TRIPS.find((trip) => trip.slug === slug)
}

type TripPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function TripPage({ params }: TripPageProps) {
  const { slug } = await params
  const trip = getTripBySlug(slug)

  if (!trip) {
    notFound()
  }

  const { budget } = trip
  const budgetData = [
    { key: "fuel", name: "ค่าน้ำมัน", value: budget.fuel },
    { key: "toll", name: "ค่าทางด่วน", value: budget.toll },
    { key: "food", name: "ค่าอาหาร", value: budget.food },
    { key: "accommodation", name: "ค่าที่พัก", value: budget.accommodation },
  ]

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-20 md:px-6">
        {/* Hero Section */}
        <section className="grid gap-6 md:grid-cols-[3fr,2fr] md:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-500/40">
              <Plane className="h-3.5 w-3.5" />
              <span>Road Trip แนะนำโดย TripThai</span>
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              {trip.name}
            </h1>

            <p className="max-w-xl text-sm text-white/70 md:text-base">
              ทริปขับรถยอดนิยมจาก {trip.from} ไป {trip.to} พร้อมสรุปงบประมาณเบื้องต้น
              และแพลนเที่ยววันต่อวันที่ปรับใช้ได้จริง เหมาะสำหรับทริป 2–4 คน
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white">
                <Clock className="h-3.5 w-3.5" />
                {trip.durationLabel}
              </Badge>

              <Badge
                variant="outline"
                className="flex items-center gap-1.5 rounded-full border-amber-400/50 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-100"
              >
                <Coins className="h-3.5 w-3.5" />
                {trip.budgetRangeLabel}
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/75">
              <div className="flex items-center gap-2">
                <Car className="h-3.5 w-3.5" />
                <span>เหมาะสำหรับการขับรถส่วนตัว</span>
              </div>
              <div className="h-3 w-px bg-white/15" />
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{trip.itinerary.length} วัน / แวะเที่ยวหลายจุดระหว่างทาง</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="gap-2 rounded-full bg-emerald-500 px-6 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400">
                <BookmarkPlus className="h-4 w-4" />
                บันทึกทริปนี้
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-full border-white/30 bg-transparent px-5 text-sm text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
                แชร์ให้เพื่อน
              </Button>
            </div>
          </div>

          {/* Budget highlight on the right */}
          <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/30">
            <CardHeader className="pb-3">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                งบประมาณรวมสำหรับทั้งทริป
              </p>
              <CardTitle className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                {formatCurrency(budget.total)}
              </CardTitle>
              <p className="mt-1 text-[11px] text-white/55">
                ประมาณการสำหรับ {trip.itinerary.length} วัน ({trip.budgetRangeLabel})
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-white/75">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Fuel className="h-3.5 w-3.5 text-amber-400" />
                  ค่าน้ำมัน
                </span>
                <span className="font-medium text-white">{formatCurrency(budget.fuel)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-sky-400" />
                  ค่าทางด่วน
                </span>
                <span className="font-medium text-white">{formatCurrency(budget.toll)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5 text-emerald-400" />
                  ค่าอาหาร (โดยประมาณ)
                </span>
                <span className="font-medium text-white">{formatCurrency(budget.food)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BedDouble className="h-3.5 w-3.5 text-violet-400" />
                  ค่าที่พัก (โดยประมาณ)
                </span>
                <span className="font-medium text-white">{formatCurrency(budget.accommodation)}</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Budget Breakdown Section */}
        <section className="grid gap-6 md:grid-cols-[3fr,2fr] md:items-stretch">
          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Coins className="h-4 w-4 text-amber-400" />
                รายละเอียดงบประมาณ
              </CardTitle>
              <p className="mt-1 text-xs text-white/60">
                สัดส่วนค่าใช้จ่ายหลักของทริปนี้ แบ่งตามหมวดหมู่ เพื่อช่วยให้คุณวางแผนได้ง่ายขึ้น
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-white/75">
              {budgetData.map((item) => {
                const percentage = (item.value / budget.total) * 100
                const colorClass =
                  item.key === "fuel"
                    ? "bg-amber-400"
                    : item.key === "toll"
                      ? "bg-sky-400"
                      : item.key === "food"
                        ? "bg-emerald-400"
                        : "bg-violet-400"

                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{formatCurrency(item.value)}</p>
                        <p className="text-[11px] text-white/55">{percentage.toFixed(0)}% ของงบรวม</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full ${colorClass}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">สัดส่วนงบประมาณ (กราฟ)</CardTitle>
            </CardHeader>
            <CardContent>
              <TripBudgetChart
                data={budgetData as {
                  key: "fuel" | "toll" | "food" | "accommodation"
                  name: string
                  value: number
                }[]}
              />
            </CardContent>
          </Card>
        </section>

        {/* Day-by-day Itinerary */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <Map className="h-4 w-4 text-emerald-400" />
              แผนเที่ยววันต่อวัน
            </h2>
            <p className="text-[11px] text-white/55">ข้อมูลตัวอย่าง สามารถปรับเปลี่ยนตามสไตล์การเที่ยวของคุณ</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {trip.itinerary.map((day) => (
              <Card
                key={day.day}
                className="relative border-white/10 bg-slate-900/80 shadow-md shadow-black/20"
              >
                <div className="absolute left-4 top-4 flex h-7 items-center rounded-full bg-emerald-500/10 px-3 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-500/40">
                  Day {day.day}
                </div>
                <CardHeader className="pb-2 pt-11">
                  <CardTitle className="text-sm font-semibold text-white">
                    {day.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-white/75">
                  <ul className="space-y-2">
                    {day.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Map Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <MapPin className="h-4 w-4 text-sky-400" />
              แผนที่เส้นทาง
            </h2>
            <p className="text-[11px] text-white/55">แผนที่ตัวอย่างจาก Google Maps สำหรับเส้นทางทริปนี้</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 items-center rounded-full bg-white/10 px-3 font-medium text-white">
                  {trip.from} → {trip.to}
                </span>
                <span className="text-[11px] text-white/60">แผนที่ตัวอย่างสำหรับการแสดงผลเส้นทาง</span>
              </div>
            </div>
            <div className="mt-4 h-56 rounded-xl bg-slate-950/80">
              <TripMap
                origin={{
                  position: trip.originLocation,
                  label: trip.from,
                }}
                destination={{
                  position: trip.destinationLocation,
                  label: trip.to,
                }}
                distanceKm={trip.distanceKm}
                durationHours={trip.durationHours}
                fuelCost={trip.budget.fuel}
              />
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="mt-2 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent px-4 py-4 text-xs text-white/80 md:flex md:items-center md:justify-between md:gap-4">
          <div className="mb-3 space-y-1 md:mb-0">
            <p className="text-sm font-semibold text-white">
              ชอบแพลนนี้เหรอ? เก็บไว้ใช้รอบหน้า หรือแชร์ให้เพื่อนดูเลย
            </p>
            <p className="max-w-xl text-[11px] text-white/65">
              ในอนาคต TripThai จะให้คุณล็อกอินเพื่อบันทึกทริปทั้งหมดไว้ในบัญชีเดียว
              พร้อมซิงก์ระหว่างมือถือและเดสก์ท็อป
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2 rounded-full bg-emerald-500 px-5 text-xs font-semibold text-emerald-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-400">
              <BookmarkPlus className="h-4 w-4" />
              บันทึกทริปนี้
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-full border-white/30 bg-transparent px-5 text-xs text-white hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
              แชร์ลิงก์ทริป
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

