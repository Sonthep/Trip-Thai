"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { analytics } from "@/lib/analytics"

export function ShareButton({ tripSlug }: { tripSlug: string }) {
  function handleShare() {
    analytics.clickShare(tripSlug)
    
    // You can implement actual share functionality here
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href)
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Button
      variant="outline"
      className="gap-2 rounded-full border-white/30 bg-transparent px-5 text-sm text-white hover:bg-white/10"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
      แชร์ให้เพื่อน
    </Button>
  )
}
