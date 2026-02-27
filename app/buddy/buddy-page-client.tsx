"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { BuddyPostCard } from "@/components/buddy-post-card"
import { BuddyPostForm } from "@/components/buddy-post-form"

type BuddyPost = {
  id: string
  origin: string
  destination: string
  travelDate: string
  returnDate: string | null
  seats: number
  groupSize: number | null
  budget: number | null
  genderPref: string | null
  vehicle: string | null
  costShare: string | null
  places: string | null
  note: string | null
  lineContact: string
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
  interests: { user: { id: string; name: string | null; image: string | null } }[]
}

type Props = {
  initialPosts: BuddyPost[]
  initialDestination: string
}

export function BuddyPageClient({ initialPosts, initialDestination }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [posts, setPosts] = useState<BuddyPost[]>(initialPosts)
  const [destination, setDestination] = useState(initialDestination)

  function applyFilter(dest: string) {
    const params = new URLSearchParams()
    if (dest) params.set("destination", dest)
    startTransition(() => {
      router.push(`/buddy${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false })
    })
  }

  function handleDestinationSubmit(e: React.FormEvent) {
    e.preventDefault()
    applyFilter(destination)
  }

  function clearFilter() {
    setDestination("")
    applyFilter("")
  }

  function handleCreated(post: BuddyPost) {
    setPosts((prev) => [post, ...prev])
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      {/* Filter + Action bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleDestinationSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="กรองตามปลายทาง..."
              className="h-10 w-64 rounded-xl border border-white/10 bg-white/5 pl-9 pr-9 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            />
            {destination && (
              <button
                type="button"
                onClick={clearFilter}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:opacity-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            กรอง
          </button>
        </form>

        <BuddyPostForm onCreated={handleCreated} />
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="py-20 text-center text-white/40">
          <p className="text-lg">ยังไม่มีโพสต์{destination ? ` ไป ${destination}` : ""}</p>
          <p className="mt-1 text-sm">เป็นคนแรกที่โพสต์หาเพื่อนร่วมทริป!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BuddyPostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
