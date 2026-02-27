import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Car,
  Clock,
  Coins,
  Fuel,
  Map,
  MapPin,
  Utensils,
  BedDouble,
} from "lucide-react"
import { TripBudgetChart } from "@/components/TripBudgetChart"
import { TripMapClient as TripMap } from "@/components/TripMapClient"
import { getTripBySlug, TRIPS } from "@/lib/trips"
import { getSiteUrl } from "@/lib/site"
import { LeadCaptureDialog } from "@/components/lead-capture-dialog"
import { TripPageClient } from "@/app/trip/[slug]/page-client"
import { ShareButton } from "@/components/share-button"
import { SaveTripButton } from "@/components/save-trip-button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { CopyItineraryButton } from "@/components/copy-itinerary-button"
import { ReviewSection } from "@/components/review-section"
import { prisma } from "@/lib/db"

const TRIP_PHOTOS: Record<string, string> = {
  "bangkok-chiang-mai":   "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80",
  "bangkok-chiang-rai":   "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80",
  "bangkok-phuket":       "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80",
  "bangkok-krabi":        "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1200&q=80",
  "bangkok-koh-samui":    "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
  "bangkok-hua-hin":      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
  "bangkok-pattaya":      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
  "bangkok-kanchanaburi": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  "bangkok-ayutthaya":    "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200&q=80",
  "bangkok-khao-yai":     "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  "chiang-mai-pai":       "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=80",
  "chiang-mai-chiang-rai":"https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
  "chiang-mai-lampang":   "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80",
  "phuket-krabi":         "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1200&q=80",
  "phuket-koh-samui":     "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80",
  "phuket-phang-nga":     "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80",
}
const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=1200&q=80"

type TripPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return TRIPS.map((trip) => ({ slug: trip.slug }))
}

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const { slug } = await params
  const trip = getTripBySlug(slug)

  if (!trip) {
    return {
      title: "ไม่พบทริป | TripThai",
      description: "ไม่พบทริปที่คุณกำลังค้นหา",
    }
  }

  const baseUrl = getSiteUrl()
  const pageUrl = `${baseUrl}/trip/${trip.slug}`
  const ogImageUrl = `${baseUrl}/trip/${trip.slug}/opengraph-image`
  const title = `${trip.name} | TripThai`
  const description = `แผนทริป ${trip.from} ไป ${trip.to} ระยะทาง ${trip.distanceKm} กม. ${trip.durationLabel} พร้อมงบประมาณโดยประมาณ ${trip.budgetRangeLabel}`

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${trip.name} - TripThai`,
        },
      ],
      siteName: "TripThai",
      locale: "th_TH",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function TripPage({ params }: TripPageProps) {
  const { slug } = await params
  const trip = getTripBySlug(slug)

  if (!trip) {
    notFound()
  }

  const { budget } = trip
  const baseUrl = getSiteUrl()
  const budgetData = [
    { key: "fuel", name: "ค่าน้ำมัน", value: budget.fuel },
    { key: "toll", name: "ค่าทางด่วน", value: budget.toll },
    { key: "food", name: "ค่าอาหาร", value: budget.food },
    { key: "accommodation", name: "ค่าที่พัก", value: budget.accommodation },
  ]

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Fetch reviews
  const rawReviews = await prisma.tripReview.findMany({
    where: { slug },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, image: true } } },
  })
  const reviewAvg = rawReviews.length > 0
    ? rawReviews.reduce((s, r) => s + r.rating, 0) / rawReviews.length
    : null
  const reviews = rawReviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))

  const relatedTrips = TRIPS.filter(
    (t) =>
      t.slug !== trip.slug &&
      (t.from === trip.from || t.to === trip.to || t.from === trip.to)
  ).slice(0, 3)

  const photoUrl = TRIP_PHOTOS[trip.slug] ?? FALLBACK_PHOTO

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "@id": `${baseUrl}/trip/${trip.slug}`,
        name: trip.name,
        description: `แผนทริป ${trip.from} ไป ${trip.to} ระยะทาง ${trip.distanceKm} กม.`,
        url: `${baseUrl}/trip/${trip.slug}`,
        image: photoUrl,
        touristType: "Road Trip",
        itinerary: trip.itinerary.map((day) => ({
          "@type": "TouristAttraction",
          name: day.title,
        })),
        offers: {
          "@type": "Offer",
          price: trip.budget.total,
          priceCurrency: "THB",
          description: trip.budgetRangeLabel,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "หน้าหลัก", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "ทริปทั้งหมด", item: `${baseUrl}/#featured-trips` },
          { "@type": "ListItem", position: 3, name: trip.name, item: `${baseUrl}/trip/${trip.slug}` },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="print:hidden"><Navbar /></div>
      <TripPageClient tripSlug={trip.slug} tripName={trip.name} />

      {/* ── Full-bleed Hero Photo ──────────────────────────── */}
      <section className="relative h-[52vh] min-h-[360px] overflow-hidden print:hidden">
        <Image
          src={photoUrl}
          alt={trip.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute left-0 top-0 px-6 pt-6">
          <nav className="flex items-center gap-2 text-xs text-white/50" aria-label="breadcrumb">
            <Link href="/" className="transition-colors hover:text-white">หน้าหลัก</Link>
            <span>/</span>
            <Link href="/explore" className="transition-colors hover:text-white">สำรวจ</Link>
            <span>/</span>
            <span className="text-white/80">{trip.name}</span>
          </nav>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 px-6 pb-10 lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/40 mb-3">
            <Car className="h-3 w-3" /> Road Trip
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{trip.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" />{trip.durationLabel}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 rounded-full border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-200 backdrop-blur-sm">
              <Coins className="h-3.5 w-3.5" />{trip.budgetRangeLabel}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 rounded-full border-sky-400/40 bg-sky-400/10 px-3 py-1 text-[11px] font-medium text-sky-200 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" />{trip.distanceKm} กม.
            </Badge>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 md:px-6">
        {/* Actions + description */}
        <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="space-y-3 md:max-w-xl">
            <p className="text-sm text-white/70 md:text-base">
              ทริปขับรถยอดนิยมจาก {trip.from} ไป {trip.to} พร้อมสรุปงบประมาณเบื้องต้น
              และแพลนเที่ยววันต่อวันที่ปรับใช้ได้จริง เหมาะสำหรับทริป 2–4 คน
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70 w-fit">
              <Car className="h-3.5 w-3.5 flex-shrink-0" />
              <span>เหมาะสำหรับการขับรถส่วนตัว</span>
              <span className="h-3 w-px bg-white/15" />
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{trip.itinerary.length} วัน / แวะเที่ยวหลายจุดระหว่างทาง</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 md:flex-shrink-0">
            <LeadCaptureDialog tripName={trip.name} tripSlug={trip.slug} />
            <ShareButton
              tripSlug={trip.slug}
              title={`${trip.name} | TripThai`}
              description={`${trip.durationLabel} · ${trip.budgetRangeLabel}`}
            />
            <SaveTripButton
              type="curated"
              slug={trip.slug}
              title={trip.name}
            />
          </div>
        </section>

        {/* Budget Summary Card */}
        <section>
          <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/30">
            <CardHeader className="pb-3">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">งบประมาณรวมสำหรับทั้งทริป</p>
              <CardTitle className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                {formatCurrency(budget.total)}
              </CardTitle>
              <p className="mt-1 text-[11px] text-white/55">
                ประมาณการสำหรับ {trip.itinerary.length} วัน ({trip.budgetRangeLabel})
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs text-white/75 sm:grid-cols-4">
              {[
                { icon: Fuel, color: "text-amber-400", label: "ค่าน้ำมัน", value: budget.fuel },
                { icon: Coins, color: "text-sky-400", label: "ค่าทางด่วน", value: budget.toll },
                { icon: Utensils, color: "text-emerald-400", label: "ค่าอาหาร", value: budget.food },
                { icon: BedDouble, color: "text-violet-400", label: "ค่าที่พัก", value: budget.accommodation },
              ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="rounded-xl border border-white/8 bg-white/5 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                    <span>{label}</span>
                  </div>
                  <p className="font-semibold text-white text-sm">{formatCurrency(value)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Budget Breakdown Section */}
        <section className="grid gap-6 md:grid-cols-[3fr,2fr] md:items-stretch">
          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Coins className="h-4 w-4 text-amber-400" />
                รายละเอียดงบประมาณ
              </CardTitle>
              <p className="mt-1 text-xs text-white/60">
                สัดส่วนค่าใช้จ่ายหลักของทริปนี้ แบ่งตามหมวดหมู่ เพื่อช่วยให้คุณวางแผนได้ง่ายขึ้น
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-white/75">
              {budgetData.map((item) => {
                const percentage = (item.value / budget.total) * 100
                const colorClass =
                  item.key === "fuel"
                    ? "bg-amber-400"
                    : item.key === "toll"
                      ? "bg-sky-400"
                      : item.key === "food"
                        ? "bg-emerald-400"
                        : "bg-violet-400"

                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{formatCurrency(item.value)}</p>
                        <p className="text-[11px] text-white/55">{percentage.toFixed(0)}% ของงบรวม</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full ${colorClass}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">สัดส่วนงบประมาณ (กราฟ)</CardTitle>
            </CardHeader>
            <CardContent>
              <TripBudgetChart
                data={budgetData as {
                  key: "fuel" | "toll" | "food" | "accommodation"
                  name: string
                  value: number
                }[]}
              />
            </CardContent>
          </Card>
        </section>

        {/* Day-by-day Itinerary */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <Map className="h-4 w-4 text-emerald-400" />
              แผนเที่ยววันต่อวัน
            </h2>
            <div className="flex items-center gap-2">
              <p className="hidden text-[11px] text-white/55 sm:block">ข้อมูลตัวอย่าง สามารถปรับเปลี่ยนตามสไตล์การเที่ยวของคุณ</p>
              <CopyItineraryButton trip={trip} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {trip.itinerary.map((day) => (
              <Card
                key={day.day}
                className="relative border-white/10 bg-slate-900/80 shadow-md shadow-black/20"
              >
                <div className="absolute left-4 top-4 flex h-7 items-center rounded-full bg-emerald-500/10 px-3 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-500/40">
                  Day {day.day}
                </div>
                <CardHeader className="pb-2 pt-11">
                  <CardTitle className="text-sm font-semibold text-white">
                    {day.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-white/75">
                  <ul className="space-y-2">
                    {day.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Map Preview */}
        <section className="space-y-4 print:hidden">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <MapPin className="h-4 w-4 text-sky-400" />
              แผนที่เส้นทาง
            </h2>
            <p className="text-[11px] text-white/55">แผนที่ตัวอย่างจาก Google Maps สำหรับเส้นทางทริปนี้</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 items-center rounded-full bg-white/10 px-3 font-medium text-white">
                  {trip.from} → {trip.to}
                </span>
                <span className="text-[11px] text-white/60">แผนที่ตัวอย่างสำหรับการแสดงผลเส้นทาง</span>
              </div>
            </div>
            <div className="mt-4 h-56 rounded-xl bg-slate-950/80">
              <TripMap
                origin={{
                  position: trip.originLocation,
                  label: trip.from,
                }}
                destination={{
                  position: trip.destinationLocation,
                  label: trip.to,
                }}
                distanceKm={trip.distanceKm}
                durationHours={trip.durationHours}
                fuelCost={trip.budget.fuel}
              />
            </div>
          </div>
        </section>

        {/* Related Trips */}
        {relatedTrips.length > 0 && (
          <section className="space-y-4 print:hidden">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <Car className="h-4 w-4 text-orange-400" />
              ทริปที่น่าสนใจอื่น ๆ
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTrips.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/trip/${rt.slug}`}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/80 p-4 transition-all hover:border-orange-500/40 hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-white text-sm leading-snug">
                      {rt.name}
                    </p>
                    <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-white/70">
                      <Clock className="h-3 w-3" />
                      {rt.durationLabel.split(" ").slice(0, 3).join(" ")}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-amber-200">
                      <Coins className="h-3 w-3" />
                      {formatCurrency(rt.budget.total)}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-white/50">
                    {rt.distanceKm} กม. · {rt.itinerary.length} วัน
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <ReviewSection
          slug={slug}
          initialReviews={reviews}
          initialAvg={reviewAvg}
          initialCount={reviews.length}
        />

        {/* CTA Footer */}
        <section className="mt-2 print:hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent px-4 py-4 text-xs text-white/80 md:flex md:items-center md:justify-between md:gap-4">
          <div className="mb-3 space-y-1 md:mb-0">
            <p className="text-sm font-semibold text-white">
              ชอบแพลนนี้เหรอ? เก็บไว้ใช้รอบหน้า หรือแชร์ให้เพื่อนดูเลย
            </p>
            <p className="max-w-xl text-[11px] text-white/65">
              ในอนาคต TripThai จะให้คุณล็อกอินเพื่อบันทึกทริปทั้งหมดไว้ในบัญชีเดียว
              พร้อมซิงก์ระหว่างมือถือและเดสก์ท็อป
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LeadCaptureDialog tripName={trip.name} tripSlug={trip.slug} />
            <ShareButton
              tripSlug={trip.slug}
              title={`${trip.name} | TripThai`}
              description={`${trip.durationLabel} · ${trip.budgetRangeLabel}`}
            />
            <SaveTripButton
              type="curated"
              slug={trip.slug}
              title={trip.name}
            />
          </div>
        </section>
      </div>
      <div className="print:hidden"><Footer /></div>
    </div>
  )
}

