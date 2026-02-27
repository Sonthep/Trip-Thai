"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { Loader2, MessageSquarePlus, Trash2, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/star-rating"

type Review = {
  id: string
  rating: number
  content: string
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
}

type Props = {
  slug: string
  initialReviews: Review[]
  initialAvg: number | null
  initialCount: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ReviewSection({ slug, initialReviews, initialAvg, initialCount }: Props) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [avg, setAvg] = useState(initialAvg)
  const [count, setCount] = useState(initialCount)

  // Form state
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const myReview = reviews.find((r) => r.user.id === session?.user?.id)

  function recalcAvg(list: Review[]) {
    if (list.length === 0) { setAvg(null); setCount(0); return }
    setAvg(list.reduce((s, r) => s + r.rating, 0) / list.length)
    setCount(list.length)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return setFormError("กรุณาเขียนรีวิว")
    setSubmitting(true)
    setFormError("")
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, rating, content }),
      })
      if (!res.ok) {
        const d = await res.json()
        setFormError(d.error ?? "เกิดข้อผิดพลาด")
        return
      }
      const review: Review = await res.json()
      // replace existing or prepend
      const next = myReview
        ? reviews.map((r) => (r.user.id === session?.user?.id ? review : r))
        : [review, ...reviews]
      setReviews(next)
      recalcAvg(next)
      setContent("")
    } catch {
      setFormError("เกิดข้อผิดพลาด")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบรีวิวนี้?")) return
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" })
    if (res.ok) {
      const next = reviews.filter((r) => r.id !== id)
      setReviews(next)
      recalcAvg(next)
    }
  }

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h2 className="text-xl font-bold text-white">รีวิวจากผู้เดินทาง</h2>
        {count > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <StarRating value={Math.round(avg ?? 0)} size="sm" />
            <span className="text-sm font-semibold text-white">{avg?.toFixed(1)}</span>
            <span className="text-xs text-white/40">({count} รีวิว)</span>
          </div>
        )}
      </div>

      {/* Write review */}
      {!session ? (
        <div className="mb-8 rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-center">
          <p className="mb-3 text-sm text-white/60">เข้าสู่ระบบเพื่อเขียนรีวิว</p>
          <button
            onClick={() => signIn()}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <MessageSquarePlus className="h-4 w-4" />
            เขียนรีวิว
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
          <p className="text-sm font-medium text-white">
            {myReview ? "แก้ไขรีวิวของคุณ" : "เขียนรีวิว"}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-3">
            <StarRating value={myReview ? myReview.rating : rating} onChange={setRating} />
            <span className="text-xs text-white/40">
              {["", "แย่มาก", "พอใช้", "ดี", "ดีมาก", "ยอดเยี่ยม"][myReview ? myReview.rating : rating]}
            </span>
          </div>

          <textarea
            value={myReview ? undefined : content}
            defaultValue={myReview?.content}
            onChange={(e) => { setContent(e.target.value); setFormError("") }}
            placeholder="เล่าประสบการณ์ทริปนี้สักหน่อย..."
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
          />

          {formError && (
            <p className="flex items-center gap-1.5 text-xs text-red-400">
              <X className="h-3 w-3" /> {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquarePlus className="h-4 w-4" />}
            {myReview ? "แก้ไขรีวิว" : "ส่งรีวิว"}
          </button>
        </form>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวทริปนี้!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={r.user.image ?? undefined} />
                    <AvatarFallback className="bg-orange-500/20 text-orange-300 text-xs">
                      {r.user.name?.slice(0, 2) ?? "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{r.user.name ?? "ผู้ใช้"}</p>
                    <p className="text-[11px] text-white/40">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} size="sm" />
                  {r.user.id === session?.user?.id && (
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/30 transition hover:border-red-500/40 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{r.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
