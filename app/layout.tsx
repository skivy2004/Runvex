import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import './globals.css'
import CookieBanner from './components/CookieBanner'
import CrispChat from './components/CrispChat'
import ExitIntentPopup from './components/ExitIntentPopup'
import ChatWidget from './components/ChatWidget'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Runvex — AI Lead Automatisering',
  description:
    'Volg elke lead automatisch op met Claude AI. Geen handmatig werk meer. Setup in minder dan 10 minuten.',
  openGraph: {
    title: 'Runvex — AI Lead Automatisering',
    description: 'Volg elke lead automatisch op met Claude AI. Geen handmatig werk meer.',
    url: 'https://runvex.app',
    siteName: 'Runvex',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Runvex AI Lead Automatisering' }],
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Runvex — AI Lead Automatisering',
    description: 'Volg elke lead automatisch op met Claude AI.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-sans)' }}>
        {children}
        <CookieBanner />
        <CrispChat />
        <ExitIntentPopup />
        <ChatWidget />
      </body>
    </html>
  )
}
