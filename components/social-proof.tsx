import { Timer, CalendarDays, Share2, Database } from "lucide-react"

const highlights = [
  {
    icon: Timer,
    title: "คำนวณงบใน 30 วินาที",
    description: "ใส่ข้อมูลแล้วรู้ค่าใช้จ่ายทันที ไม่ต้องรอนาน",
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
  {
    icon: Database,
    title: "ข้อมูลจากระยะทางจริง",
    description: "คำนวณจากข้อมูลระยะทางและราคาน้ำมันที่อัปเดต",
  },
]

export function SocialProof() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            {"ทำไมถึงเชื่อถือได้"}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"สิ่งที่ทำให้ TripThai ต่างออกไป"}
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
