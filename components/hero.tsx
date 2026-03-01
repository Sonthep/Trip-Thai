import { MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-thailand.jpg"
        alt="Scenic road through Thailand mountains"
        fill
        sizes="100vw"
        quality={82}
        className="object-cover"
        priority
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(192,50%,5%)]/95 via-[hsl(192,50%,8%)]/70 to-[hsl(192,50%,8%)]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(192,50%,5%)]/85 via-transparent to-transparent" />

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
          fill="none" stroke="white" strokeWidth="2" strokeDasharray="12 8" opacity="0.3"
        />
        <path
          d="M 200 100 Q 400 300 600 200 T 1000 300 T 1400 100"
          fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.15"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-start justify-center px-4 pb-28 pt-32 lg:px-6 lg:pb-36 lg:pt-40">
        {/* Label badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-white/80">Thailand Road Trip Planner</span>
        </div>

        {/* Headline */}
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          อยากไปไหน?{" "}
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
            รู้งบก่อน ออกได้เลย
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
          คำนวณค่าน้ำมัน ที่พัก อาหาร ทุกเส้นทางทั่วไทย ใน 30 วินาที — พร้อมแผนวันต่อวัน
        </p>

        {/* Secondary link */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="#map-explorer"
            className="inline-flex items-center gap-1.5 text-sm text-white/55 transition hover:text-white/80"
          >
            <MapPin className="h-3.5 w-3.5" />
            สำรวจแผนที่ไทย
          </Link>
          <span className="h-4 w-px bg-white/20" />
          <Link
            href="/buddy"
            className="inline-flex items-center gap-1.5 text-sm text-white/55 transition hover:text-white/80"
          >
            <Users className="h-3.5 w-3.5" />
            หาเพื่อนร่วมทริป
          </Link>
        </div>

        {/* Trust row */}
        <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-400">★★★★★</span>
            <span>4.9 · 12,000+ แผนทริป</span>
          </span>
          <span className="h-4 w-px bg-white/20" />
          <span>🗺️ ครบ 77 จังหวัด</span>
          <span className="h-4 w-px bg-white/20" />
          <span>⚡ ใช้เวลา 30 วินาที</span>
          <span className="h-4 w-px bg-white/20" />
          <span>🆓 ฟรี ไม่ต้องสมัคร</span>
        </div>
      </div>
    </section>
  )
}
