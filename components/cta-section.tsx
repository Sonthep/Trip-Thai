import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[hsl(192,50%,6%)] px-6 py-20 text-center shadow-2xl sm:px-12 lg:px-20">
          {/* Star / dot field background */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {/* Star dots */}
            <circle cx="10%" cy="15%" r="1" fill="white" opacity="0.3" />
            <circle cx="25%" cy="8%" r="0.8" fill="white" opacity="0.2" />
            <circle cx="40%" cy="20%" r="1.2" fill="white" opacity="0.25" />
            <circle cx="55%" cy="5%" r="0.6" fill="white" opacity="0.15" />
            <circle cx="70%" cy="18%" r="1" fill="white" opacity="0.2" />
            <circle cx="85%" cy="10%" r="0.8" fill="white" opacity="0.3" />
            <circle cx="15%" cy="80%" r="0.8" fill="white" opacity="0.15" />
            <circle cx="30%" cy="90%" r="1" fill="white" opacity="0.2" />
            <circle cx="60%" cy="85%" r="0.6" fill="white" opacity="0.25" />
            <circle cx="75%" cy="92%" r="1.2" fill="white" opacity="0.15" />
            <circle cx="90%" cy="75%" r="0.8" fill="white" opacity="0.2" />
            <circle cx="5%" cy="50%" r="0.6" fill="white" opacity="0.1" />
            <circle cx="95%" cy="45%" r="1" fill="white" opacity="0.15" />
            <circle cx="48%" cy="60%" r="0.8" fill="white" opacity="0.1" />
            <circle cx="20%" cy="40%" r="0.6" fill="white" opacity="0.12" />
            <circle cx="80%" cy="55%" r="0.8" fill="white" opacity="0.1" />

            {/* Night road dashes */}
            <path
              d="M 0 85% Q 25% 75% 50% 80% T 100% 70%"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="8 12"
              opacity="0.08"
            />
          </svg>

          {/* Soft glow orbs */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-accent/8 blur-3xl" />

          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
              เริ่มต้นฟรี · ไม่ต้องสมัครสมาชิก
            </p>
            <h2 className="mx-auto mt-3 max-w-xl text-balance text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              หยุดเดา เริ่มรู้งบจริง
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-white/60">
              คำนวณค่าน้ำมัน ค่าอาหาร ค่าที่พัก รวมเป็นงบทริปครบในหน้าเดียว — ใช้เวลา 30 วินาที
            </p>
            <div className="mt-9">
              <Button
                size="lg"
                className="gap-2 bg-accent px-10 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30"
              >
                {"เริ่มวางแผนฟรี"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
