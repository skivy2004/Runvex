import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Partner & Affiliate Programma — Runvex',
  description: 'Verdien 25% commissie als Runvex partner. Ideaal voor bureaus, freelancers en consultants.',
}

const tiers = [
  { name: 'Starter', commission: '20%', minReferrals: '1–4 per kwartaal', support: 'Email', badge: false },
  { name: 'Pro', commission: '25%', minReferrals: '5–14 per kwartaal', support: 'Prioriteit email + call', badge: true },
  { name: 'Agency', commission: '30%', minReferrals: '15+ per kwartaal', support: 'Dedicated account manager', badge: true },
]

export default function PartnersPage() {
  return (
    <>
      <main style={{ background: '#0A0B0F', minHeight: '100vh' }}>
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--text-3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Terug
          </Link>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.2)', color: '#5B6EF5' }}>
            Partner Programma
          </div>
          <h1 className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Verdien met Runvex</h1>
          <p className="text-lg mb-14 max-w-2xl" style={{ color: 'var(--text-2)' }}>
            Bureaus, freelancers en consultants die Runvex aanbevelen aan hun klanten verdienen tot 30% maandelijkse commissie — zolang de klant actief blijft.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-14">
            {tiers.map((tier) => (
              <div key={tier.name} className="rounded-2xl p-6" style={{ background: 'var(--bg-2)', border: `1px solid ${tier.badge ? 'rgba(91,110,245,0.3)' : 'var(--border)'}` }}>
                {tier.badge && (
                  <div className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-3" style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5' }}>Populair</div>
                )}
                <div className="font-bricolage font-bold text-xl text-white mb-1">{tier.name}</div>
                <div className="text-3xl font-extrabold mb-1" style={{ color: '#5B6EF5' }}>{tier.commission}</div>
                <div className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>commissie per betaalde maand</div>
                <div className="space-y-2 text-xs" style={{ color: 'var(--text-2)' }}>
                  <div>📊 {tier.minReferrals}</div>
                  <div>💬 {tier.support}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <h2 className="font-bricolage font-bold text-2xl text-white mb-3">Interesse in het partner programma?</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>Stuur ons een bericht via het contactformulier en vermeld "Partner programma" in je bericht. We nemen binnen 24 uur contact op.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white hover:bg-[#6B5FF8] transition-colors" style={{ background: 'var(--purple)' }}>
              Aanmelden als partner
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
