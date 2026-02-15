import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Route, Wallet } from "lucide-react"

const trips = [
  {
    title: "กรุงเทพ → เขาใหญ่",
    duration: "2 วัน 1 คืน",
    distance: "200 km",
    driveTime: "3 ชม.",
    budget: "3,500 - 5,000 THB",
  },
  {
    title: "กรุงเทพ → กาญจนบุรี",
    duration: "2 วัน 1 คืน",
    distance: "130 km",
    driveTime: "2.5 ชม.",
    budget: "2,800 - 4,500 THB",
  },
  {
    title: "กรุงเทพ → หัวหิน",
    duration: "3 วัน 2 คืน",
    distance: "195 km",
    driveTime: "3 ชม.",
    budget: "4,500 - 7,000 THB",
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
              className="group border-border/60 bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-card-foreground">
                    {trip.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {trip.duration}
                  </Badge>
                </div>
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
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Wallet className="h-4 w-4 shrink-0 text-accent" />
                    <span className="font-medium text-card-foreground">{trip.budget}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1.5 px-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-accent">
                  {"เปิดทริปนี้"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
