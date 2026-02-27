"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { PlusCircle, Loader2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlaceAutocomplete } from "@/components/place-autocomplete"

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
  interests: { user: { id: string; name: string | null; image: string | null } }[]
}

type Props = {
  onCreated: (post: BuddyPost) => void
}

export function BuddyPostForm({ onCreated }: Props) {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    travelDate: "",
    seats: "1",
    note: "",
    lineContact: "",
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.origin.trim()) return setError("กรุณาใส่ต้นทาง")
    if (!form.destination.trim()) return setError("กรุณาใส่ปลายทาง")
    if (!form.travelDate) return setError("กรุณาเลือกวันที่เดินทาง")
    if (!form.lineContact.trim()) return setError("กรุณาใส่ LINE ID หรือลิงก์ LINE")

    setLoading(true)
    try {
      const res = await fetch("/api/buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          seats: Number(form.seats),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "เกิดข้อผิดพลาด")
        return
      }
      const post: BuddyPost = await res.json()
      onCreated(post)
      setOpen(false)
      setForm({ origin: "", destination: "", travelDate: "", seats: "1", note: "", lineContact: "" })
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setLoading(false)
    }
  }

  // Not logged in
  if (status !== "loading" && !session) {
    return (
      <button
        onClick={() => signIn()}
        className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        <PlusCircle className="h-4 w-4" />
        โพสต์หาเพื่อนร่วมทริป
      </button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
          <PlusCircle className="h-4 w-4" />
          โพสต์หาเพื่อนร่วมทริป
        </button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-slate-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">โพสต์หาเพื่อนร่วมทริป</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Origin + Destination */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">ต้นทาง *</Label>
              <PlaceAutocomplete
                value={form.origin}
                onChange={(v) => update("origin", v)}
                placeholder="เช่น กรุงเทพ"
                inputClassName="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">ปลายทาง *</Label>
              <PlaceAutocomplete
                value={form.destination}
                onChange={(v) => update("destination", v)}
                placeholder="เช่น เชียงใหม่"
                inputClassName="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
              />
            </div>
          </div>

          {/* Date + Seats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">วันที่เดินทาง *</Label>
              <Input
                type="date"
                value={form.travelDate}
                onChange={(e) => update("travelDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="border-white/10 bg-white/5 text-white [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">จำนวนที่นั่งว่าง *</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.seats}
                onChange={(e) => update("seats", e.target.value)}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>

          {/* LINE contact */}
          <div className="space-y-1.5">
            <Label className="text-xs text-white/70">LINE ID หรือลิงก์ LINE *</Label>
            <Input
              value={form.lineContact}
              onChange={(e) => update("lineContact", e.target.value)}
              placeholder="เช่น @mylineid หรือ https://line.me/ti/p/~xxx"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label className="text-xs text-white/70">หมายเหตุ (ไม่บังคับ)</Label>
            <Textarea
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="เช่น ไปรถ SUV นั่งได้ 4 คน แวะพักที่ลำปาง"
              rows={3}
              className="resize-none border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
              <X className="h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            โพสต์เลย
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
