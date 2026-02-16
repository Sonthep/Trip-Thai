import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Route, Wallet, Fuel, Utensils, BedDouble } from "lucide-react"

const trips = [
  {
    title: "กรุงเทพ → เขาใหญ่",
    duration: "2 วัน 1 คืน",
    distance: "200 km",
    driveTime: "3 ชม.",
    budget: "3,500 - 5,000 ฿",
    tag: "Popular",
    tagColor: "bg-accent text-accent-foreground",
    breakdown: { fuel: 35, food: 30, stay: 35 },
  },
  {
    title: "กรุงเทพ → กาญจนบุรี",
    duration: "2 วัน 1 คืน",
    distance: "130 km",
    driveTime: "2.5 ชม.",
    budget: "2,800 - 4,500 ฿",
    tag: "Weekend Trip",
    tagColor: "bg-primary text-primary-foreground",
    breakdown: { fuel: 25, food: 35, stay: 40 },
  },
  {
    title: "กรุงเทพ → หัวหิน",
    duration: "3 วัน 2 คืน",
    distance: "195 km",
    driveTime: "3 ชม.",
    budget: "4,500 - 7,000 ฿",
    tag: "Family Friendly",
    tagColor: "bg-secondary text-secondary-foreground",
    breakdown: { fuel: 20, food: 35, stay: 45 },
  },
]

export function FeaturedTrips() {
  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Featured Road Trips
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"ทริปยอดนิยม"}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {"เส้นทางที่คนนิยมเดินทางมากที่สุด พร้อมประมาณการค่าใช้จ่าย"}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {trips.map((trip) => (
            <Card
              key={trip.title}
              className="group border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg font-bold text-card-foreground">
                    {trip.title}
                  </CardTitle>
                  <Badge className={`shrink-0 border-0 text-xs font-semibold ${trip.tagColor}`}>
                    {trip.tag}
                  </Badge>
                </div>
                <Badge variant="outline" className="mt-2 w-fit text-xs font-medium text-muted-foreground">
                  {trip.duration}
                </Badge>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Route className="h-4 w-4 shrink-0 text-primary" />
                    <span>{"ระยะทาง: "}{trip.distance}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    <span>{"เวลาขับรถ: "}{trip.driveTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Wallet className="h-4 w-4 shrink-0 text-accent" />
                    <span className="font-semibold text-card-foreground">{trip.budget}</span>
                  </div>
                </div>

                {/* Mini budget breakdown bar */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">{"สัดส่วนค่าใช้จ่าย"}</p>
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary transition-all"
                      style={{ width: `${trip.breakdown.fuel}%` }}
                    />
                    <div
                      className="bg-accent transition-all"
                      style={{ width: `${trip.breakdown.food}%` }}
                    />
                    <div
                      className="bg-secondary-foreground/30 transition-all"
                      style={{ width: `${trip.breakdown.stay}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Fuel className="h-3 w-3 text-primary" />
                      {"น้ำมัน"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Utensils className="h-3 w-3 text-accent" />
                      {"อาหาร"}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3 w-3 text-secondary-foreground/50" />
                      {"ที่พัก"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1.5 px-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-accent">
                  {"เปิดทริปนี้"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
