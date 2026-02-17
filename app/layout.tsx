import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Thai } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-noto-thai',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'TripThai - Trip Budget Optimization Engine',
  description:
    'Compare travel modes, accommodation, and total cost in one intelligent dashboard. Optimize your trip budget across Thailand.',
}

export const viewport: Viewport = {
  themeColor: '#1a8a5c',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansThai.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
