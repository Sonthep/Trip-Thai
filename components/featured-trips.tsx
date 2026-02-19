import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Route, Wallet, Fuel, Utensils, BedDouble } from "lucide-react"
import { getFeaturedTrips } from "@/lib/trips"

export function FeaturedTrips() {
  const trips = getFeaturedTrips()

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
              key={trip.slug}
              className="group relative border-border/60 bg-card shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/40 overflow-hidden"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg font-bold text-card-foreground">
                    {trip.name}
                  </CardTitle>
                  <Badge className={`shrink-0 border-0 text-xs font-semibold ${trip.featured.tagColor}`}>
                    {trip.featured.tag}
                  </Badge>
                </div>
                <Badge variant="outline" className="mt-2 w-fit text-xs font-medium text-muted-foreground">
                  {trip.featured.duration}
                </Badge>
              </CardHeader>
              <CardContent className="pb-4 relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <Route className="h-4 w-4 shrink-0 text-primary" />
                    <span>{"ระยะทาง: "}{trip.distanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    <span>{"เวลาขับรถ: "}{trip.featured.driveTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm group-hover:text-foreground transition-colors">
                    <Wallet className="h-4 w-4 shrink-0 text-accent" />
                    <span className="font-semibold text-card-foreground">{trip.featured.budgetLabel}</span>
                  </div>
                </div>

                {/* Mini budget breakdown bar */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">{"สัดส่วนค่าใช้จ่าย"}</p>
                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                      style={{ width: `${trip.featured.breakdown.fuel}%` }}
                    />
                    <div
                      className="bg-gradient-to-r from-accent to-accent/80 transition-all duration-500"
                      style={{ width: `${trip.featured.breakdown.food}%` }}
                    />
                    <div
                      className="bg-gradient-to-r from-secondary-foreground/30 to-secondary-foreground/20 transition-all duration-500"
                      style={{ width: `${trip.featured.breakdown.stay}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Fuel className="h-3 w-3 text-primary" />
                      {"น้ำมัน"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Utensils className="h-3 w-3 text-accent" />
                      {"อาหาร"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="h-3 w-3 text-secondary-foreground/50" />
                      {"ที่พัก"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button asChild variant="ghost" size="sm" className="gap-1.5 px-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-accent hover:translate-x-1 transition-all duration-300">
                  <Link href={`/trip/${trip.slug}`}>
                  {"เปิดทริปนี้"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
