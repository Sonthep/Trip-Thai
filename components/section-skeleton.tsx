export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="py-14 animate-pulse">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 h-7 w-48 rounded-xl bg-white/5" />
        <div className={`grid gap-4 ${rows === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  )
}
