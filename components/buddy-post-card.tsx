"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ArrowRight, Calendar, MapPin, Users, MessageCircle, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type BuddyPost = {
  id: string
  origin: string
  destination: string
  travelDate: string
  seats: number
  note: string | null
  lineContact: string
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
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

  async function handleDelete() {
    if (!confirm("ลบโพสต์นี้?")) return
    setDeleting(true)
    const res = await fetch(`/api/buddy/${post.id}`, { method: "DELETE" })
    if (res.ok) onDelete?.(post.id)
    else setDeleting(false)
  }

  const lineUrl = post.lineContact.startsWith("http")
    ? post.lineContact
    : `https://line.me/ti/p/~${post.lineContact}`

  const isPast = new Date(post.travelDate) < new Date()

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
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/70">
            <Users className="h-3 w-3" />
            ว่าง {post.seats} ที่นั่ง
          </span>
        </div>

        {/* Note */}
        {post.note && (
          <p className="mt-2.5 line-clamp-2 text-xs text-white/55">{post.note}</p>
        )}

        {/* Action row */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#06C755] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            ติดต่อทาง LINE
          </a>
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
