import { prisma } from "@/lib/db"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= rating ? "fill-amber-400 stroke-amber-400" : "fill-transparent stroke-white/20"}`}
        />
      ))}
    </div>
  )
}

// Map slug → trip name label
function slugToName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace("Bangkok", "กรุงเทพ →")
    .replace("Chiang Mai", "เชียงใหม่")
    .replace("Phuket", "ภูเก็ต")
    .replace("Krabi", "กระบี่")
    .replace("Hua Hin", "หัวหิน")
    .replace("Pattaya", "พัทยา")
    .replace("Khao Yai", "เขาใหญ่")
}

export async function TestimonialsSection() {
  const reviews = await prisma.tripReview.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { user: { select: { name: true, image: true } } },
  })

  // Need at least 1 real review to show, else show placeholder
  const items = reviews.length >= 1 ? reviews : []

  if (items.length === 0) return null

  const avg = items.reduce((s, r) => s + r.rating, 0) / items.length

  return (
    <section className="bg-slate-950 py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-2">
              รีวิวจากผู้เดินทางจริง
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">ที่พวกเขาพูดถึงเรา</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5">
            <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
            <span className="text-sm font-bold text-amber-300">{avg.toFixed(1)}</span>
            <span className="text-xs text-white/50">({items.length} รีวิว)</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <StarRow rating={r.rating} />
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75">
                &ldquo;{r.content}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={r.user.image ?? undefined} />
                  <AvatarFallback className="bg-orange-500/20 text-orange-300 text-xs">
                    {r.user.name?.slice(0, 2) ?? "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-white">{r.user.name ?? "นักเดินทาง"}</p>
                  <p className="text-[10px] text-white/40">{slugToName(r.slug)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
