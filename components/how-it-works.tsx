const steps = [
  {
    step: "01",
    emoji: "📍",
    title: "บอกว่าจะไปไหน",
    desc: "เลือกจุดเริ่มต้นและปลายทาง หรือเลือกทริปสำเร็จรูปที่คนนิยม",
    detail: "กรุงเทพ → เชียงใหม่, ภูเก็ต, เขาใหญ่ ...",
    color: "bg-orange-50 border-orange-100",
    badge: "bg-orange-500",
  },
  {
    step: "02",
    emoji: "🚗",
    title: "ใส่ข้อมูลรถ 3 อย่าง",
    desc: "ประเภทรถ · อัตราสิ้นเปลือง · จำนวนวัน ระบบจะคำนวณงบให้ทันที",
    detail: "รถเก๋ง 15 กม./ล. · 3 วัน 2 คืน · 2 คน",
    color: "bg-sky-50 border-sky-100",
    badge: "bg-sky-500",
  },
  {
    step: "03",
    emoji: "💰",
    title: "ได้งบรวมทันที",
    desc: "ค่าน้ำมัน ค่าทางด่วน ค่าอาหาร ค่าที่พัก รวมเป็น งบรวมต่อคน",
    detail: "น้ำมัน 2,600 ฿ · อาหาร 3,600 ฿ · รวม 8,920 ฿",
    color: "bg-emerald-50 border-emerald-100",
    badge: "bg-emerald-500",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            รู้งบทั้งทริปใน 3 ขั้นตอน
          </h2>
          <p className="mt-4 text-slate-500">
            ไม่ต้องเปิด Google Maps หลายหน้า ไม่ต้องคำนวณเอง แค่ใส่ข้อมูล แล้วออกเดินทาง
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((item, i) => (
            <div
              key={item.step}
              className={`relative rounded-2xl border p-6 ${item.color}`}
            >
              {/* Step connector */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-slate-300 md:block">
                  →
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.emoji}</span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white ${item.badge}`}
                >
                  {item.step}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>

              {/* Mockup snippet */}
              <div className="mt-4 rounded-xl border border-white bg-white/70 px-3 py-2.5 font-mono text-xs text-slate-500">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
