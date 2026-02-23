# TripThai - Road Trip Planning SaaS

แพลตฟอร์มวางแผนการเดินทางท่องเที่ยวทั่วไทยแบบ Road Trip พร้อมคำนวณค่าใช้จ่ายและเส้นทาง

## 🚀 Features

- ✅ **Trip Planning** - แผนการเดินทาง 9 เส้นทางยอดนิยม
- ✅ **Budget Calculator** - คำนวณค่าน้ำมัน ที่พัก อาหาร
- ✅ **Interactive Map** - แผนที่แสดงเส้นทางเดินทาง
- ✅ **Lead Capture** - รวบรวม email สำหรับการตลาด
- ✅ **Analytics Tracking** - ติดตามพฤติกรรมผู้ใช้
- ✅ **SEO Optimized** - Sitemap, Robots.txt, OG Images
- ✅ **Mobile Responsive** - รองรับทุกขนาดหน้าจอ

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Email**: Resend
- **Analytics**: Google Analytics 4

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/tripthai.git
cd tripthai

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์

## ⚙️ Environment Variables

สร้างไฟล์ `.env.local` และกรอกค่าต่อไปนี้:

### Google Analytics 4 (ทางเลือก)

1. ไปที่ [Google Analytics](https://analytics.google.com/)
2. สร้าง Property ใหม่และเลือก "Web"
3. คัดลอก Measurement ID (รูปแบบ `G-XXXXXXXXXX`)
4. เพิ่มในไฟล์ `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Resend Email Service (ทางเลือก)

1. สมัครที่ [Resend.com](https://resend.com)
2. ยืนยันโดเมนของคุณ (หรือใช้ onboarding@resend.dev สำหรับทดสอบ)
3. สร้าง API Key
4. เพิ่มในไฟล์ `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=TripThai <hello@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com
```

> **หมายเหตุ**: ถ้าไม่ตั้งค่า Email Service แอปจะทำงานได้ตามปกติ แต่จะไม่ส่งอีเมลจริง

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── calculate-trip/    # API คำนวณงบทริป
│   │   └── submit-lead/        # API รับ email lead
│   ├── trip/[slug]/            # หน้ารายละเอียดทริป (dynamic routing)
│   ├── layout.tsx              # Root layout + GA4
│   ├── page.tsx                # หน้าแรก
│   ├── robots.ts               # SEO: robots.txt
│   ├── sitemap.ts              # SEO: sitemap.xml
│   └── manifest.ts             # PWA manifest
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── lead-capture-dialog.tsx # Dialog สำหรับเก็บ email
│   ├── google-analytics.tsx    # GA4 tracking script
│   └── ...                     # Components ต่างๆ
├── lib/
│   ├── analytics.ts            # Event tracking utility
│   ├── trips.ts                # ข้อมูลทริปทั้งหมด
│   ├── calculateTrip.ts        # Logic คำนวณงบ
│   └── utils.ts                # Helper functions
└── public/
    └── images/                 # รูปภาพ assets
```

## 🎯 Event Tracking

ระบบติดตาม Events ต่อไปนี้:

- `view_trip` - เมื่อเปิดหน้ารายละเอียดทริป
- `click_save_trip` - เมื่อกดปุ่ม "บันทึกทริป"
- `submit_lead` - เมื่อกรอก email สำเร็จ
- `click_share` - เมื่อกดปุ่มแชร์
- `calculate_trip` - เมื่อคำนวณทริปจาก Quick Planner

## 🗺️ Available Trips

1. กรุงเทพ → เชียงใหม่ (3 วัน 2 คืน)
2. กรุงเทพ → เขาใหญ่ (2 วัน 1 คืน)
3. กรุงเทพ → กาญจนบุรี (2 วัน 1 คืน)
4. กรุงเทพ → หัวหิน (3 วัน 2 คืน)
5. กรุงเทพ → ภูเก็ต (4 วัน 3 คืน)
6. กรุงเทพ → อยุธยา (1 วัน)
7. กรุงเทพ → พัทยา (2 วัน 1 คืน)
8. กรุงเทพ → เชียงราย (4 วัน 3 คืน)
9. กรุงเทพ → กระบี่ (4 วัน 3 คืน)

## 📝 Adding New Trips

แก้ไขไฟล์ `lib/trips.ts` และเพิ่มข้อมูลทริปใหม่:

```typescript
{
  slug: "bangkok-destination",
  name: "กรุงเทพ → ปลายทาง",
  from: "กรุงเทพ",
  to: "ปลายทาง",
  distanceKm: 500,
  durationHours: 6,
  // ... ข้อมูลอื่นๆ
}
```

## 🚢 Deployment

### Vercel (แนะนำ)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### การตั้งค่า Environment Variables บน Vercel:

1. ไปที่ Project Settings → Environment Variables
2. เพิ่มตัวแปรจาก `.env.local`
3. Redeploy

## 📊 Performance

- ✅ Static Site Generation (SSG) สำหรับหน้าทริป
- ✅ Dynamic Sitemap generation
- ✅ Optimized images and fonts
- ✅ Code splitting
- ✅ Client-side caching

## 🔐 Security

- API routes ใช้ validation
- Email format validation
- Environment variables ไม่ถูก expose ไปที่ client
- Rate limiting ควรเพิ่มสำหรับ production

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - ดูรายละเอียดที่ [LICENSE](LICENSE)

## 👥 Author

Built with ❤️ by [Your Name]

## 📫 Contact

- Website: [tripthai.app](https://tripthai.app)
- Email: hello@tripthai.app
- GitHub: [@yourusername](https://github.com/yourusername)
