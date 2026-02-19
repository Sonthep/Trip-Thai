"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { QuickPlanner } from "@/components/QuickPlanner"

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
        <div className="flex flex-1 flex-col space-y-4 lg:items-start">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-white/80">{"เครื่องมือวางแผนทริปที่ครบครัน"}</span>
          </div>

          <h1 className="max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-left lg:text-6xl">
            {"เที่ยวทั่วไทย วางแผน Road Trip"}
            <br />
            <span className="bg-gradient-to-r from-[hsl(24,90%,60%)] via-[hsl(15,95%,65%)] to-[hsl(24,90%,60%)] bg-clip-text text-transparent">
              {"ได้ในไม่กี่วินาที"}
            </span>
          </h1>

          <p className="mt-2 max-w-lg text-balance text-lg leading-relaxed text-white/70 lg:text-left">
            {"คำนวณเส้นทาง เวลาเดินทาง ค่าน้ำมัน และงบรวมทั้งทริป — พร้อมแนะนำทริปตามภาค"}
          </p>

          {/* Differentiator line with emphasis */}
          <div className="mt-2 flex items-center gap-2 rounded-lg border-l-2 border-[hsl(24,90%,60%)] bg-white/5 pl-4 py-2">
            <span className="text-sm font-semibold text-[hsl(24,90%,65%)]">
              {"💡 "}
            </span>
            <p className="text-sm font-medium text-white/80 lg:text-left">
              {"มากกว่าแค่บอกเวลาเดินทาง — เราบอกงบรวมทั้งทริป"}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button 
              size="lg" 
              className="gap-2 bg-gradient-to-r from-[hsl(24,90%,55%)] to-[hsl(15,95%,60%)] px-8 text-base font-semibold text-white shadow-lg shadow-[hsl(24,90%,55%)]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(24,90%,55%)]/40 hover:-translate-y-1"
            >
              {"วางแผนทริปเลย"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/40 hover:text-white hover:-translate-y-1"
            >
              {"ดูตัวอย่าง"}
            </Button>
          </div>
        </div>

        {/* Right: TripThai Quick Planner */}
        <div className="mt-12 w-full max-w-md lg:mt-0">
          <QuickPlanner />
        </div>
      </div>
    </section>
  )
}
