export default function TripLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero skeleton */}
      <div className="relative h-[52vh] min-h-[360px] animate-pulse bg-slate-800" />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-8 md:px-6">
        {/* Actions row skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-96 animate-pulse rounded-lg bg-slate-800" />
            <div className="h-4 w-72 animate-pulse rounded-lg bg-slate-800" />
            <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-800" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-800" />
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-800" />
          </div>
        </div>

        {/* Budget card skeleton */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="h-4 w-48 animate-pulse rounded bg-slate-800 mb-2" />
          <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-800 mb-4" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-800" />
            ))}
          </div>
        </div>

        {/* Budget breakdown skeleton */}
        <div className="grid gap-6 md:grid-cols-[3fr,2fr]">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-900/80 border border-slate-800" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-900/80 border border-slate-800" />
        </div>

        {/* Itinerary skeleton */}
        <div className="space-y-4">
          <div className="h-5 w-36 animate-pulse rounded bg-slate-800" />
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-900/80 border border-slate-800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
