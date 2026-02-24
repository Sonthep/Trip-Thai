const EXPERIENCES = [
  {
    id: "beach",
    label: "ทะเลใต้",
    emoji: "🏖️",
    desc: "ภูเก็ต · กระบี่ · เกาะสมุย",
    img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1000&q=75",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    id: "temple",
    label: "วัดและอารยธรรม",
    emoji: "🛕",
    desc: "อยุธยา · สุโขทัย · เชียงแสน",
    img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=75",
    span: "",
  },
  {
    id: "mountain",
    label: "ภูเขาและหมอก",
    emoji: "🏔️",
    desc: "เชียงราย · แม่ฮ่องสอน · น่าน",
    img: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800&q=75",
    span: "",
  },
  {
    id: "food",
    label: "อาหารท้องถิ่น",
    emoji: "🍜",
    desc: "ผัดไทย · ข้าวซอย · ข้าวหมูแดง",
    img: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=75",
    span: "",
  },
  {
    id: "nature",
    label: "อุทยานธรรมชาติ",
    emoji: "🌿",
    desc: "เขาใหญ่ · ดอยอินทนนท์ · เอราวัณ",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75",
    span: "lg:col-span-2",
  },
]

export function ExperienceBento() {
  return (
    <section className="bg-slate-900 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Experiences
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            ประสบการณ์ที่รอคุณอยู่
          </h2>
          <p className="mt-4 text-slate-400">
            ทุกมุมของไทยมีสิ่งที่คุ้มค่าสำหรับ Road Trip — เลือกสไตล์การเดินทางของคุณ
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              className={`group relative min-h-[220px] cursor-pointer overflow-hidden rounded-2xl ${exp.span}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exp.img}
                alt={exp.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-2xl leading-none">{exp.emoji}</p>
                <p className="mt-2 text-lg font-bold text-white">{exp.label}</p>
                <p className="mt-0.5 text-sm text-white/60">{exp.desc}</p>
              </div>

              {/* Hover arrow */}
              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
