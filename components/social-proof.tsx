const STATS = [
  { number: "77", unit: "จังหวัด", desc: "ครอบคลุมทุกจังหวัดทั่วไทย" },
  { number: "300+", unit: "สถานที่", desc: "คัดเลือกจากผู้เดินทางจริง" },
  { number: "30", unit: "วินาที", desc: "ก็รู้งบรวมทั้งทริป" },
  { number: "80+", unit: "เส้นทาง", desc: "Road Trip สำเร็จรูปพร้อมใช้" },
]

export function SocialProof() {
  return (
    <section className="border-y border-slate-100 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.unit} className="text-center">
              <p className="text-4xl font-black text-slate-900 lg:text-5xl">
                {s.number}
                <span className="ml-1 text-orange-500">{s.unit}</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
