import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'Thailand Road Trip Planner - Plan Your Adventure Instantly',
  description:
    'Calculate travel time, fuel cost, and total trip budget for your Thailand road trip in seconds. Smart route planning made easy.',
}

export const viewport: Viewport = {
  themeColor: '#1a8fc4',
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
        className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
