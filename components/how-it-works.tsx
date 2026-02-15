import { MapPinned, Car, BarChart3 } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: MapPinned,
    title: "เลือกปลายทาง/ภาค",
    description:
      "เลือกจุดเริ่มต้นและปลายทางจากหลายร้อยจุดทั่วประเทศไทย หรือเลือกตามภาคที่อยากไป",
  },
  {
    step: "02",
    icon: Car,
    title: "ใส่ข้อมูลรถ & จำนวนวัน",
    description:
      "บอกเราเกี่ยวกับประเภทรถ อัตราสิ้นเปลือง และจำนวนวันที่อยากไป เพื่อคำนวณค่าใช้จ่ายที่แม่นยำ",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "ได้งบรวม + แผนการเดินทาง",
    description:
      "รับรายละเอียดค่าน้ำมัน ค่าทางด่วน เวลาเดินทาง และงบรวมทั้งทริปทันที พร้อมใช้งาน",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            How It Works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"วางแผนทริปง่ายๆ 3 ขั้นตอน"}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {"ไม่ต้องตั้งค่าอะไรยุ่งยาก แค่เลือก ใส่ข้อมูล แล้วออกเดินทางได้เลย"}
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              {/* Connector dashed line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+48px)] top-10 hidden h-px w-[calc(100%-96px)] border-t-2 border-dashed border-border md:block" />
              )}

              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <item.icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {item.step}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
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
