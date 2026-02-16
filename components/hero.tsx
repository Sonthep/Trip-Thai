"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Search, MapPin, Calendar, Sparkles } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-[94vh] overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-thailand.jpg"
        alt="Scenic road through Thailand mountains"
        fill
        className="object-cover"
        priority
      />

      {/* Stronger dark gradient overlay — heavier on left for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(192,50%,5%)]/95 via-[hsl(192,50%,8%)]/75 to-[hsl(192,50%,8%)]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(192,50%,5%)]/80 via-transparent to-[hsl(192,50%,8%)]/40" />

      {/* SVG dashed route pattern overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
      >
        <pattern id="route-dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="1" fill="white" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#route-dots)" />
        <path
          d="M 80 700 Q 250 500 400 550 T 700 350 T 1000 400 T 1300 200 T 1600 280"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="12 8"
          opacity="0.3"
        />
        <path
          d="M 200 100 Q 400 300 600 200 T 1000 300 T 1400 100"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity="0.15"
        />
      </svg>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-4 pb-20 pt-24 lg:flex-row lg:items-center lg:gap-16 lg:px-6 lg:pb-28 lg:pt-32">
        {/* Left: Headlines */}
        <div className="flex flex-1 flex-col lg:items-start">
          <h1 className="max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-left lg:text-6xl">
            {"เที่ยวทั่วไทย วางแผน Road Trip"}
            <br />
            <span className="text-[hsl(24,90%,60%)]">{"ได้ในไม่กี่วินาที"}</span>
          </h1>

          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-white/70 lg:text-left">
            {"คำนวณเส้นทาง เวลาเดินทาง ค่าน้ำมัน และงบรวมทั้งทริป — พร้อมแนะนำทริปตามภาค"}
          </p>

          {/* Differentiator line */}
          <p className="mt-4 max-w-lg text-sm font-medium text-[hsl(24,90%,65%)] lg:text-left">
            {"มากกว่าแค่บอกเวลาเดินทาง — เราบอกงบรวมทั้งทริป"}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="gap-2 bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-[hsl(24,90%,55%)]/25 hover:bg-accent/90 hover:shadow-xl hover:shadow-[hsl(24,90%,55%)]/30">
              {"วางแผนทริปเลย"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/15 hover:text-white"
            >
              {"ดูตัวอย่าง"}
            </Button>
          </div>
        </div>

        {/* Right: Quick Planner card — premium feel */}
        <div className="mt-12 w-full max-w-md lg:mt-0">
          <Card className="border-white/[0.08] bg-white/[0.07] shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                  <Sparkles className="h-4 w-4 text-[hsl(24,90%,60%)]" />
                </div>
                <span className="text-sm font-bold text-white">Quick Planner</span>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                    <MapPin className="h-3 w-3" />
                    {"จุดเริ่มต้น"}
                  </label>
                  <Input
                    placeholder="กรุงเทพ"
                    defaultValue="กรุงเทพ"
                    className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                    <MapPin className="h-3 w-3" />
                    {"ปลายทาง"}
                  </label>
                  <Input
                    placeholder="เชียงใหม่"
                    className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                    <Calendar className="h-3 w-3" />
                    {"จำนวนวัน"}
                  </label>
                  <Input
                    placeholder="3"
                    type="number"
                    min={1}
                    className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                  />
                </div>
                <Button className="mt-1 w-full gap-2 bg-accent font-semibold text-accent-foreground shadow-lg shadow-[hsl(24,90%,55%)]/20 hover:bg-accent/90">
                  <Search className="h-4 w-4" />
                  {"คำนวณทันที"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
