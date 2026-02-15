"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Search, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-thailand.jpg"
        alt="Scenic road through Thailand mountains"
        fill
        className="object-cover"
        priority
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(192,50%,8%)]/80 via-[hsl(192,50%,8%)]/60 to-[hsl(192,50%,8%)]/90" />

      {/* SVG dashed route pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        aria-hidden="true"
      >
        <pattern id="route-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="white" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#route-pattern)" />
        <path
          d="M 100 50 Q 300 200 500 100 T 900 300 T 1300 150 T 1700 350"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="8 6"
          opacity="0.4"
        />
      </svg>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-24 lg:px-6 lg:pb-28 lg:pt-32">
        {/* Headlines */}
        <h1 className="max-w-4xl text-balance text-center text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          {"เที่ยวทั่วไทย วางแผน Road Trip"}
          <br />
          <span className="text-[hsl(24,90%,55%)]">{"ได้ในไม่กี่วินาที"}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-center text-lg leading-relaxed text-white/75">
          {"คำนวณเส้นทาง เวลาเดินทาง ค่าน้ำมัน และงบรวมทั้งทริป — พร้อมแนะนำทริปตามภาค"}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2 bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90">
            {"วางแผนทริปเลย"}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-white/25 bg-white/10 px-8 text-base text-white hover:bg-white/20 hover:text-white"
          >
            {"ดูตัวอย่าง"}
          </Button>
        </div>

        {/* Quick Planner card */}
        <Card className="mt-14 w-full max-w-2xl border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-[hsl(24,90%,55%)]" />
              <span className="text-sm font-semibold text-white">Quick Planner</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="กรุงเทพ"
                  defaultValue="กรุงเทพ"
                  className="border-white/15 bg-white/10 pl-9 text-white placeholder:text-white/40 focus-visible:ring-accent"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="ปลายทาง"
                  className="border-white/15 bg-white/10 pl-9 text-white placeholder:text-white/40 focus-visible:ring-accent"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="จำนวนวัน"
                  type="number"
                  min={1}
                  className="border-white/15 bg-white/10 pl-9 text-white placeholder:text-white/40 focus-visible:ring-accent"
                />
              </div>
              <Button className="w-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
                {"คำนวณทันที"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
