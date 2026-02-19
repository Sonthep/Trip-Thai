import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const regions = [
  {
    name: "ภาคเหนือ",
    nameEn: "Northern",
    image: "/images/region-north.jpg",
    destinations: ["เชียงใหม่", "เชียงราย", "ปาย"],
    budget: "เริ่มต้น ~3,500 ฿",
    color: "from-emerald-900/80",
  },
  {
    name: "ภาคอีสาน",
    nameEn: "Isan",
    image: "/images/region-isan.jpg",
    destinations: ["โคราช", "อุดรธานี", "ขอนแก่น"],
    budget: "เริ่มต้น ~2,800 ฿",
    color: "from-amber-900/80",
  },
  {
    name: "ภาคกลาง",
    nameEn: "Central",
    image: "/images/region-central.jpg",
    destinations: ["อยุธยา", "กาญจนบุรี", "นครปฐม"],
    budget: "เริ่มต้น ~2,500 ฿",
    color: "from-orange-900/80",
  },
  {
    name: "ภาคใต้",
    nameEn: "Southern",
    image: "/images/region-south.jpg",
    destinations: ["ภูเก็ต", "กระบี่", "สมุย"],
    budget: "เริ่มต้น ~5,000 ฿",
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
              className="group relative h-[340px] cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image with hover zoom */}
              <Image
                src={region.image}
                alt={`${region.nameEn} Thailand - ${region.name}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={78}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Gradient overlays */}
              <div className={`absolute inset-0 bg-gradient-to-t ${region.color} via-transparent to-transparent`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/85" />

              <div className="relative flex h-full flex-col justify-between p-5">
                {/* Budget badge at top */}
                <div className="flex justify-end">
                  <Badge className="border-0 bg-accent/90 text-xs font-semibold text-accent-foreground backdrop-blur-sm">
                    {region.budget}
                  </Badge>
                </div>

                {/* Bottom content */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-white/50">
                    {region.nameEn}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {region.name}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {region.destinations.map((dest) => (
                      <span
                        key={dest}
                        className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {dest}
                      </span>
                    ))}
                  </div>

                  {/* Arrow that animates on hover */}
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-white">
                    <span>{"ดูทริปแนะนำ"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
