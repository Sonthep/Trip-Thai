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

export function LeadCaptureDialog({ tripName }: { tripName: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulate API call for lead collection
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log(`Lead Captured: ${email} for trip ${tripName}`)
    setLoading(false)
    setSuccess(true)
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset state when closed with delay for smooth exit
      setTimeout(() => {
        setSuccess(false)
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
            กรอกอีเมลเพื่อรับแผนทริป <strong>{tripName}</strong> พร้อมงบประมาณและพิกัดแผนที่แบบละเอียด (ฟรี)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">อีเมลของคุณ</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="col-span-3"
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
