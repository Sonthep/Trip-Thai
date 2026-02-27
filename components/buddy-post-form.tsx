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

type PlaceItem = { id: string; name: string; province: string }

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
    returnDate: "",
    seats: "1",
    vehicle: "",
    costShare: "",
    note: "",
    lineContact: "",
  })
  const [places, setPlaces] = useState<PlaceItem[]>([])
  const [placeQuery, setPlaceQuery] = useState("")

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
          places,
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
      setForm({ origin: "", destination: "", travelDate: "", returnDate: "", seats: "1", vehicle: "", costShare: "", note: "", lineContact: "" })
      setPlaces([])
      setPlaceQuery("")
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1 pb-1">

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

            {/* Travel dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-white/70">วันออกเดินทาง *</Label>
                <Input
                  type="date"
                  value={form.travelDate}
                  onChange={(e) => update("travelDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="border-white/10 bg-white/5 text-white [color-scheme:dark]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-white/70">
                  วันกลับ <span className="text-white/30">(ถ้ารู้)</span>
                </Label>
                <Input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => update("returnDate", e.target.value)}
                  min={form.travelDate || new Date().toISOString().split("T")[0]}
                  className="border-white/10 bg-white/5 text-white [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Seats */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">จำนวนที่นั่งว่าง *</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.seats}
                onChange={(e) => update("seats", e.target.value)}
                className="w-20 border-white/10 bg-white/5 text-white"
              />
            </div>

            {/* Vehicle type */}
            <div className="space-y-2">
              <Label className="text-xs text-white/70">ยานพาหนะ</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "sedan",      label: "🚗 รถยนต์" },
                  { value: "suv",        label: "🚙 SUV/PPV" },
                  { value: "van",        label: "🚐 รถตู้" },
                  { value: "motorcycle", label: "🏍️ มอเตอร์ไซค์" },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => update("vehicle", form.vehicle === opt.value ? "" : opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      form.vehicle === opt.value
                        ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40"
                        : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost sharing */}
            <div className="space-y-2">
              <Label className="text-xs text-white/70">แชร์ค่าใช้จ่าย</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "fuel",               label: "⛽ แชร์ค่าน้ำมัน" },
                  { value: "fuel_accommodation", label: "⛽🏨 น้ำมัน+ที่พัก" },
                  { value: "free",               label: "🎁 ฟรี ไม่คิดค่าใช้จ่าย" },
                  { value: "discuss",            label: "💬 คุยกันเอง" },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => update("costShare", form.costShare === opt.value ? "" : opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      form.costShare === opt.value
                        ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
                        : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Places to visit */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">สถานที่ที่อยากไป (ไม่บังคับ)</Label>
              <PlaceAutocomplete
                value={placeQuery}
                onChange={setPlaceQuery}
                onSelect={(place) => {
                  if (!places.find((p) => p.id === place.id)) {
                    setPlaces((prev) => [...prev, place])
                  }
                  setPlaceQuery("")
                }}
                placeholder="ค้นหาสถานที่ท่องเที่ยว..."
                inputClassName="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
              />
              {places.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {places.map((p) => (
                    <span
                      key={p.id}
                      className="flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-1 text-xs text-orange-300 ring-1 ring-orange-500/30"
                    >
                      {p.name}
                      <button
                        type="button"
                        onClick={() => setPlaces((prev) => prev.filter((x) => x.id !== p.id))}
                        className="ml-0.5 rounded-full text-orange-300/60 hover:text-orange-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                placeholder="รายละเอียดเพิ่มเติม เช่น แวะพักที่ไหน หรือเงื่อนไขพิเศษ"
                rows={2}
                className="resize-none border-white/10 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

          </div>{/* end scrollable */}

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
