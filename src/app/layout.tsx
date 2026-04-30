import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['400', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pollen Polymer Index',
  description:
    'Real-time polymer pellet price tracking for industrial 3D printing — powered by Pollen AM.',
  keywords: ['polymer', 'price', '3D printing', 'pellet', 'industrial', 'Pollen AM'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-bg text-ink antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
