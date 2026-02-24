"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, BookmarkPlus, Loader2 } from "lucide-react"
import { analytics } from "@/lib/analytics"

export function LeadCaptureDialog({ tripName, tripSlug }: { tripName: string; tripSlug: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Call real API to submit lead
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          tripSlug,
          tripName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit lead")
      }

      // Track lead submission
      analytics.submitLead(tripSlug, email)

      console.log(`Lead Captured: ${email} for trip ${tripName}`)
      setSuccess(true)
    } catch (error) {
      console.error("Error submitting lead:", error)
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    
    // Track when dialog is opened
    if (isOpen && !success) {
      analytics.clickSaveTrip(tripSlug)
    }
    
    if (!isOpen) {
      // Reset state when closed with delay for smooth exit
      setTimeout(() => {
        setSuccess(false)
        setName("")
        setPhone("")
        setEmail("")
      }, 300)
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="gap-2 rounded-full bg-emerald-500 px-6 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400">
            <BookmarkPlus className="h-4 w-4" />
            บันทึกทริปนี้
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">บันทึกทริปเรียบร้อย!</h3>
              <p className="text-sm text-gray-500">
                เราได้ส่งรายละเอียดทริป <strong>{tripName}</strong> ไปที่อีเมล {email} แล้ว
                ขอให้สนุกกับการเดินทางครับ
              </p>
            </div>
            <Button onClick={() => setOpen(false)} variant="outline" className="mt-4">
              ปิดหน้าต่าง
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full bg-emerald-500 px-6 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400">
          <BookmarkPlus className="h-4 w-4" />
          บันทึกทริปนี้
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>บันทึกแผนการเดินทาง</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลเพื่อรับแผนทริป <strong>{tripName}</strong> พร้อมงบประมาณและพิกัดแผนที่แบบละเอียด (ฟรี)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อของคุณ</Label>
              <Input
                id="name"
                type="text"
                placeholder="เช่น สมชาย"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="เช่น 081-234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล (ไม่บังคับ)</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "กำลังบันทึก..." : "ส่งแผนเข้าอีเมล"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
