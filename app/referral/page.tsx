import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Referral programma — Runvex',
  description: 'Nodig vrienden uit voor Runvex en verdien gratis maanden. 1 gratis maand voor elke succesvolle referral.',
}

export default function ReferralPage() {
  return (
    <>
      <main style={{ background: '#0A0B0F', minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--text-3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Terug
          </Link>

          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.2)', color: '#5B6EF5' }}>
            Referral Programma
          </div>
          <h1 className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
            Verdien gratis maanden door te delen
          </h1>
          <p className="text-lg mb-12" style={{ color: 'var(--text-2)' }}>
            Nodig een vriend of collega-ondernemer uit. Als zij zich aanmelden, krijgen jullie allebei een gratis maand Runvex.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { step: '01', title: 'Meld je aan', desc: 'Maak een gratis Runvex account en ga naar je dashboard.' },
              { step: '02', title: 'Deel je link', desc: 'Kopieer je unieke referral link en stuur hem naar vrienden of collega\'s.' },
              { step: '03', title: 'Verdien gratis maanden', desc: 'Elke succesvolle aanmelding = 1 gratis maand voor jou én voor hen.' },
            ].map((s) => (
              <div key={s.step} className="rounded-xl p-5" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-bold mb-3 px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5' }}>{s.step}</div>
                <div className="font-semibold text-white mb-2">{s.title}</div>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg,rgba(91,110,245,0.12),rgba(91,110,245,0.04))', border: '1px solid rgba(91,110,245,0.25)' }}>
            <h2 className="font-bricolage font-bold text-2xl text-white mb-2">Referral dashboard beschikbaar na aanmelden</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>Jouw unieke link en statistieken vind je in je Runvex dashboard.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white hover:bg-[#6B5FF8] transition-colors" style={{ background: 'var(--purple)' }}>
              Start gratis
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
