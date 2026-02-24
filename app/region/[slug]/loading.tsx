export default function RegionLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero skeleton */}
      <div className="relative h-[56vh] min-h-[400px] animate-pulse bg-slate-800 lg:h-[65vh]" />

      <div className="bg-white">
        {/* Highlights bar skeleton */}
        <div className="border-b border-slate-100 py-10">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Description + trips skeleton */}
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="space-y-3 mb-10">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
