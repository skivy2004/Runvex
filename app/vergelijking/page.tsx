import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Runvex vs HubSpot vs Pipedrive — Welk systeem past bij jou?',
  description:
    'Vergelijk Runvex met HubSpot, Pipedrive en handmatige opvolging. Zie welk lead management systeem het beste past bij MKB en freelancers in Nederland.',
}

const features = [
  { label: 'Startprijs per maand', runvex: 'Gratis', hubspot: '€45', pipedrive: '€14', handmatig: '€0' },
  { label: 'Setup tijd', runvex: '< 10 min', hubspot: '1–4 weken', pipedrive: '2–5 dagen', handmatig: '0 min' },
  { label: 'AI lead scoring', runvex: true, hubspot: 'Betaald', pipedrive: false, handmatig: false },
  { label: 'Automatische follow-up', runvex: true, hubspot: true, pipedrive: 'Beperkt', handmatig: false },
  { label: 'Nederlandstalig', runvex: true, hubspot: 'Deels', pipedrive: true, handmatig: '—' },
  { label: 'Geen technische kennis nodig', runvex: true, hubspot: false, pipedrive: 'Deels', handmatig: true },
  { label: 'Dashboard met AI inzichten', runvex: true, hubspot: true, pipedrive: false, handmatig: false },
  { label: 'Gemaakt voor MKB / freelancers', runvex: true, hubspot: false, pipedrive: 'Deels', handmatig: true },
  { label: 'Geen verborgen kosten', runvex: true, hubspot: false, pipedrive: 'Deels', handmatig: true },
  { label: 'Direct live na aanmelden', runvex: true, hubspot: false, pipedrive: false, handmatig: true },
]

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <span className="inline-flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  if (value === false)
    return (
      <span className="inline-flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    )
  return <span className="text-sm" style={{ color: 'var(--text-2)' }}>{value as string}</span>
}

export default function VergelijkingPage() {
  return (
    <>
      <main style={{ background: '#0A0B0F', minHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--text-3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Terug naar home
          </Link>

          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.2)', color: '#5B6EF5' }}>
            Vergelijking
          </div>
          <h1 className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Runvex vs HubSpot vs Pipedrive
          </h1>
          <p className="text-base md:text-lg mb-16 max-w-2xl" style={{ color: 'var(--text-2)' }}>
            Welk systeem past écht bij een MKB-ondernemer of freelancer? We zetten de opties eerlijk naast elkaar.
          </p>

          {/* Comparison table */}
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {/* Header */}
            <div className="grid grid-cols-5 border-b" style={{ background: '#0C0E1B', borderColor: 'var(--border)' }}>
              <div className="p-4 col-span-1" />
              {[
                { name: 'Runvex', highlight: true },
                { name: 'HubSpot', highlight: false },
                { name: 'Pipedrive', highlight: false },
                { name: 'Handmatig', highlight: false },
              ].map((col) => (
                <div key={col.name} className="p-4 text-center">
                  <div className={`font-bricolage font-bold text-sm ${col.highlight ? 'text-[#5B6EF5]' : 'text-white'}`}>
                    {col.name}
                  </div>
                  {col.highlight && (
                    <div className="mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block"
                      style={{ background: 'rgba(91,110,245,0.15)', color: '#5B6EF5' }}>
                      Aanbevolen
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            {features.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-5 border-b last:border-b-0"
                style={{ borderColor: 'var(--border)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
              >
                <div className="p-4 text-sm font-medium" style={{ color: 'var(--text-2)' }}>
                  {row.label}
                </div>
                {/* Runvex — highlighted column */}
                <div className="p-4 text-center" style={{ background: 'rgba(91,110,245,0.05)', borderLeft: '1px solid rgba(91,110,245,0.1)', borderRight: '1px solid rgba(91,110,245,0.1)' }}>
                  <Cell value={row.runvex} />
                </div>
                <div className="p-4 text-center"><Cell value={row.hubspot} /></div>
                <div className="p-4 text-center"><Cell value={row.pipedrive} /></div>
                <div className="p-4 text-center"><Cell value={row.handmatig} /></div>
              </div>
            ))}
          </div>

          {/* Why Runvex */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              { title: 'Gebouwd voor MKB', body: 'HubSpot en Pipedrive zijn ontworpen voor sales teams met tientallen medewerkers. Runvex is gemaakt voor de ondernemer die alles zelf doet.' },
              { title: 'AI zonder complexiteit', body: 'Claude AI scoort elke lead automatisch. Geen workflows configureren, geen scoring rules aanpassen. Het werkt direct.' },
              { title: 'Eerlijke prijs', body: 'HubSpot rekent €45+ per maand voor basisfuncties. Runvex start gratis. Geen creditcard, geen verborgen kosten.' },
            ].map((card) => (
              <div key={card.title} className="rounded-xl p-6" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <div className="font-bricolage font-bold text-white mb-3">{card.title}</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{card.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-colors hover:bg-[#6B5FF8]"
              style={{ background: 'var(--purple)' }}>
              Start gratis met Runvex
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-3)' }}>Geen creditcard · Binnen 10 minuten live</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
