import { Timer, CalendarDays, Share2 } from "lucide-react"

const highlights = [
  {
    icon: Timer,
    title: "คำนวณงบใน 30 วินาที",
    description: "ใส่ข้อมูลแล้วรู้ค่าใช้จ่ายทันที ไม่ต้องรอ",
  },
  {
    icon: CalendarDays,
    title: "เหมาะกับทริป 2-4 วัน",
    description: "วางแผนทริปสั้นๆ ได้ครบ ทั้งเส้นทางและงบ",
  },
  {
    icon: Share2,
    title: "แชร์แผนให้เพื่อนได้",
    description: "ส่งแผนการเดินทางให้เพื่อนร่วมทริปแบบง่ายๆ",
  },
]

export function SocialProof() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
