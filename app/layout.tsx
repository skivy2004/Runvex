import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import './globals.css'

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
    'Van lead naar klant. Runvex legt leads vast, scoort ze met AI en volgt ze op — volledig automatisch.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-sans)' }}>{children}</body>
    </html>
  )
}
