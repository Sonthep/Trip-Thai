import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-xl sm:px-12 lg:px-20">
          {/* Decorative route pattern */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
            aria-hidden="true"
          >
            <pattern id="cta-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-dots)" />
          </svg>

          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              {"พร้อมออกเดินทางแล้วหรือยัง?"}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-primary-foreground/80">
              {"เริ่มวางแผน Road Trip ทั่วไทยได้ฟรี คำนวณค่าใช้จ่ายและเส้นทางได้ทันที"}
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="gap-2 bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90"
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
