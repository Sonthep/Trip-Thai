import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Thai, Inter } from 'next/font/google'

import './globals.css'
import 'leaflet/dist/leaflet.css'

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-noto-thai',
  weight: ['300', '400', '500', '600', '700'],
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'TripThai - วางแผน Road Trip ทั่วไทย',
  description:
    'คำนวณเส้นทาง เวลาเดินทาง ค่าน้ำมัน และงบรวมทั้งทริป พร้อมแนะนำทริปตามภาค',
}

export const viewport: Viewport = {
  themeColor: '#0d9668',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body
        className={`${notoSansThai.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
