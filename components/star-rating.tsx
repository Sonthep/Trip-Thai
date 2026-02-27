"use client"

import { Star } from "lucide-react"

type Props = {
  value: number          // current value 1-5
  onChange?: (v: number) => void  // if undefined → read-only
  size?: "sm" | "md"
}

export function StarRating({ value, onChange, size = "md" }: Props) {
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5"

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className={`transition-transform ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <Star
            className={`${dim} transition-colors ${
              star <= value
                ? "fill-amber-400 stroke-amber-400"
                : "fill-transparent stroke-white/30"
            }`}
          />
        </button>
      ))}
    </div>
  )
}
