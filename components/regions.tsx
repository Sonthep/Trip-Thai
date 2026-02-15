import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const regions = [
  {
    name: "ภาคเหนือ",
    nameEn: "Northern",
    image: "/images/region-north.jpg",
    destinations: ["เชียงใหม่", "เชียงราย", "ปาย"],
    color: "from-emerald-900/80",
  },
  {
    name: "ภาคอีสาน",
    nameEn: "Isan",
    image: "/images/region-isan.jpg",
    destinations: ["โคราช", "อุดรธานี", "ขอนแก่น"],
    color: "from-amber-900/80",
  },
  {
    name: "ภาคกลาง",
    nameEn: "Central",
    image: "/images/region-central.jpg",
    destinations: ["อยุธยา", "กาญจนบุรี", "นครปฐม"],
    color: "from-orange-900/80",
  },
  {
    name: "ภาคใต้",
    nameEn: "Southern",
    image: "/images/region-south.jpg",
    destinations: ["ภูเก็ต", "กระบี่", "สมุย"],
    color: "from-cyan-900/80",
  },
]

export function Regions() {
  return (
    <section id="regions" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Explore Thailand
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"เลือกภาคที่อยากไป"}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {"สำรวจเส้นทางยอดนิยมทั้ง 4 ภาค ตั้งแต่ภูเขาทางเหนือจนถึงทะเลทางใต้"}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <Card
              key={region.name}
              className="group relative h-80 cursor-pointer overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <Image
                src={region.image}
                alt={`${region.nameEn} Thailand - ${region.name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${region.color} via-transparent to-transparent`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative flex h-full flex-col justify-end p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                  {region.nameEn}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-white">
                  {region.name}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {region.destinations.map((dest) => (
                    <span
                      key={dest}
                      className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-fit gap-1.5 px-0 text-sm font-semibold text-white hover:bg-transparent hover:text-[hsl(24,90%,55%)]"
                >
                  {"ดูทริปแนะนำ"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
