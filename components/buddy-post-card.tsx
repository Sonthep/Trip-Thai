"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { ArrowRight, Calendar, MapPin, Users, MessageCircle, Trash2, Heart, Car, Banknote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type InterestUser = { id: string; name: string | null; image: string | null }

type PlaceItem = { id: string; name: string; province: string }

const VEHICLE_LABELS: Record<string, string> = {
  sedan:      "🚗 รถยนต์",
  suv:        "🚙 SUV/PPV",
  van:        "🚐 รถตู้",
  motorcycle: "🏍️ มอเตอร์ไซค์",
}

const COST_SHARE_LABELS: Record<string, string> = {
  fuel:               "⛽ แชร์ค่าน้ำมัน",
  fuel_accommodation: "⛽🏨 น้ำมัน+ที่พัก",
  free:               "🎁 ฟรี",
  discuss:            "💬 คุยกันเอง",
}

type BuddyPost = {
  id: string
  origin: string
  destination: string
  travelDate: string
  returnDate: string | null
  seats: number
  vehicle: string | null
  costShare: string | null
  places: string | null
  note: string | null
  lineContact: string
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
  interests: { user: InterestUser }[]
}

type Props = {
  post: BuddyPost
  onDelete?: (id: string) => void
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("th-TH", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function BuddyPostCard({ post, onDelete }: Props) {
  const { data: session } = useSession()
  const isOwner = session?.user?.id === post.user.id
  const [deleting, setDeleting] = useState(false)

  // Interest state (optimistic)
  const initialInterested = post.interests.some((i) => i.user.id === session?.user?.id)
  const [interested, setInterested] = useState(initialInterested)
  const [interestUsers, setInterestUsers] = useState<InterestUser[]>(
    post.interests.map((i) => i.user)
  )
  const [toggling, setToggling] = useState(false)

  async function handleDelete() {
    if (!confirm("ลบโพสต์นี้?")) return
    setDeleting(true)
    const res = await fetch(`/api/buddy/${post.id}`, { method: "DELETE" })
    if (res.ok) onDelete?.(post.id)
    else setDeleting(false)
  }

  async function handleInterest() {
    if (!session) {
      signIn()
      return
    }
    if (toggling) return
    setToggling(true)

    // Optimistic update
    const wasInterested = interested
    setInterested(!wasInterested)
    if (wasInterested) {
      setInterestUsers((prev) => prev.filter((u) => u.id !== session.user!.id))
    } else {
      setInterestUsers((prev) => [
        ...prev,
        { id: session.user!.id!, name: session.user!.name ?? null, image: session.user!.image ?? null },
      ])
    }

    try {
      const res = await fetch(`/api/buddy/${post.id}/interest`, { method: "POST" })
      if (!res.ok) {
        setInterested(wasInterested)
        setInterestUsers(post.interests.map((i) => i.user))
      }
    } catch {
      setInterested(wasInterested)
      setInterestUsers(post.interests.map((i) => i.user))
    } finally {
      setToggling(false)
    }
  }

  const lineUrl = post.lineContact.startsWith("http")
    ? post.lineContact
    : `https://line.me/ti/p/~${post.lineContact}`

  const isPast = new Date(post.travelDate) < new Date()

  // Avatar stack: up to 4 avatars
  const AVATAR_LIMIT = 4
  const shownAvatars = interestUsers.slice(0, AVATAR_LIMIT)
  const extra = interestUsers.length - AVATAR_LIMIT

  return (
    <Card className="group border-white/10 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/8">
      <CardContent className="p-4">
        {/* Top row: avatar + name + date */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={post.user.image ?? undefined} />
              <AvatarFallback className="bg-orange-500/20 text-orange-300 text-xs">
                {post.user.name?.slice(0, 2) ?? "??"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {post.user.name ?? "ผู้ใช้"}
              </p>
              <p className="text-[11px] text-white/40">
                โพสต์เมื่อ {new Date(post.createdAt).toLocaleDateString("th-TH")}
              </p>
            </div>
          </div>
          {isPast && (
            <Badge variant="outline" className="shrink-0 border-white/20 text-white/40 text-[10px]">
              ผ่านมาแล้ว
            </Badge>
          )}
        </div>

        {/* Route */}
        <div className="mt-3 flex items-center gap-2 text-base font-semibold">
          <MapPin className="h-4 w-4 shrink-0 text-orange-400" />
          <span className="truncate">{post.origin}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-white/40" />
          <span className="truncate text-orange-300">{post.destination}</span>
        </div>

        {/* Meta chips */}
        <div className="mt-2.5 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/70">
            <Calendar className="h-3 w-3" />
            {formatDate(post.travelDate)}
            {post.returnDate && (() => {
              const days = Math.round((new Date(post.returnDate).getTime() - new Date(post.travelDate).getTime()) / 86400000) + 1
              const nights = days - 1
              return nights > 0 ? ` · ${days} วัน ${nights} คืน` : ""
            })()}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/70">
            <Users className="h-3 w-3" />
            ว่าง {post.seats} ที่นั่ง
          </span>
          {post.vehicle && (
            <span className="flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-300/90 ring-1 ring-sky-500/20">
              <Car className="h-3 w-3" />
              {VEHICLE_LABELS[post.vehicle] ?? post.vehicle}
            </span>
          )}
          {post.costShare && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300/90 ring-1 ring-emerald-500/20">
              <Banknote className="h-3 w-3" />
              {COST_SHARE_LABELS[post.costShare] ?? post.costShare}
            </span>
          )}
        </div>

        {/* Places chips */}
        {(() => {
          const parsedPlaces: PlaceItem[] = post.places ? (() => { try { return JSON.parse(post.places) } catch { return [] } })() : []
          return parsedPlaces.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {parsedPlaces.map((p) => (
                <span
                  key={p.id}
                  className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-medium text-orange-300/80 ring-1 ring-orange-500/20"
                >
                  {p.name}
                </span>
              ))}
            </div>
          ) : null
        })()}

        {/* Note */}
        {post.note && (
          <p className="mt-2.5 line-clamp-2 text-xs text-white/55">{post.note}</p>
        )}

        {/* Interest avatars */}
        {interestUsers.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {shownAvatars.map((u) => (
                <Avatar key={u.id} className="h-6 w-6 ring-2 ring-slate-900">
                  <AvatarImage src={u.image ?? undefined} />
                  <AvatarFallback className="bg-orange-500/20 text-[9px] text-orange-300">
                    {u.name?.slice(0, 2) ?? "?"}
                  </AvatarFallback>
                </Avatar>
              ))}
              {extra > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ring-2 ring-slate-900 text-[9px] text-white/60">
                  +{extra}
                </div>
              )}
            </div>
            <span className="text-[11px] text-white/40">
              {interestUsers.length} คนสนใจ
            </span>
          </div>
        )}

        {/* Action row */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#06C755] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              ติดต่อทาง LINE
            </a>

            {/* Interest button (not shown to post owner) */}
            {!isOwner && (
              <button
                onClick={handleInterest}
                disabled={toggling}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all disabled:opacity-60 ${
                  interested
                    ? "bg-pink-500/20 text-pink-400 ring-1 ring-pink-500/40 hover:bg-pink-500/30"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${interested ? "fill-pink-400" : ""}`} />
                สนใจ
              </button>
            )}
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
