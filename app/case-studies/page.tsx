import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Case Studies — Runvex',
  description: 'Hoe MKB-bedrijven hun lead opvolging transformeerden met Runvex. Echte resultaten, echte verhalen.',
}

const cases = [
  {
    company: 'TechFlow B.V.',
    sector: 'IT / SaaS',
    person: 'Lars van den Berg, Growth Manager',
    initials: 'LB',
    color: 'linear-gradient(135deg,#5B6EF5,#3B4FD5)',
    challenge: 'TechFlow ontving 80+ leads per maand maar miste er wekelijks meerdere omdat het sales team te druk was met bestaande klanten.',
    approach: 'Runvex werd gekoppeld aan het bestaande contactformulier. Elke lead werd direct gescoord door Claude AI en ontving een gepersonaliseerde bevestigingsmail binnen 60 seconden.',
    results: [
      '8 uur per week bespaard op handmatige opvolging',
      'Reactietijd van gemiddeld 4 uur naar < 1 minuut',
      '23% meer geplande gesprekken na 30 dagen',
    ],
    quote: 'Runvex heeft ons leadproces volledig getransformeerd. We besparen nu 8 uur per week en onze opvolging is 3x sneller.',
  },
  {
    company: 'MarketPro Amsterdam',
    sector: 'Marketing & Communicatie',
    person: 'Sanne Dijkstra, Directeur',
    initials: 'SD',
    color: 'linear-gradient(135deg,#3ECF8E,#27A870)',
    challenge: 'Als klein marketingbureau concurreerde MarketPro met grotere bureaus die sneller offertes konden maken. Leads kozen vaak voor de concurrent die het eerst reageerde.',
    approach: 'AI scoring op urgentie en budget. Leads met score 75+ kregen direct een call-to-action voor een kennismakingsgesprek. Lagere scores gingen in een automatische nurture-flow.',
    results: [
      'Conversie gestegen met 40% in 60 dagen',
      'Alleen nog gesprekken met gekwalificeerde leads',
      'Maandelijkse omzet +€4.200 na 3 maanden',
    ],
    quote: 'De AI scoring is ongelooflijk accuraat. We focussen nu alleen op leads met een hoge score en onze conversie is met 40% gestegen.',
  },
  {
    company: 'Groei.io',
    sector: 'Groei-consultancy',
    person: 'Daan Vermeer, Sales Lead',
    initials: 'DV',
    color: 'linear-gradient(135deg,#F5A623,#E08000)',
    challenge: 'Groei.io werkte met een handmatig spreadsheet voor lead tracking. Bij drukte vielen follow-ups weg, wat leidde tot gemiste opdrachten.',
    approach: 'Setup in 5 minuten via het Runvex contactformulier. Alle leads worden automatisch gescoord en bijgehouden in het dashboard. Follow-up na 3 en 7 dagen bij geen reactie.',
    results: [
      'Nul gemiste leads in de eerste maand',
      'Dashboard verving het handmatige spreadsheet volledig',
      '2 nieuwe klanten direct via de automatische follow-up',
    ],
    quote: 'Setup was klaar in 5 minuten. Geen gedoe, gewoon werken. Runvex is de beste investering die we dit jaar hebben gedaan.',
  },
]

export default function CaseStudiesPage() {
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
            Case Studies
          </div>
          <h1 className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Echte resultaten van echte klanten
          </h1>
          <p className="text-lg mb-16" style={{ color: 'var(--text-2)', maxWidth: 560 }}>
            Hoe MKB-bedrijven hun lead opvolging transformeerden met Runvex.
          </p>

          <div className="space-y-12">
            {cases.map((c) => (
              <div key={c.company} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="p-6 md:p-8" style={{ background: 'var(--bg-2)' }}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: c.color }}>{c.initials}</div>
                    <div>
                      <div className="font-semibold text-white">{c.company}</div>
                      <div className="text-xs" style={{ color: 'var(--text-3)' }}>{c.person} · {c.sector}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Uitdaging</div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{c.challenge}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Aanpak</div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{c.approach}</p>
                    </div>
                  </div>

                  <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(62,207,142,0.06)', border: '1px solid rgba(62,207,142,0.15)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#3ECF8E' }}>Resultaten</div>
                    <ul className="space-y-2">
                      {c.results.map((r) => (
                        <li key={r} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <blockquote className="text-sm italic" style={{ color: 'var(--text-2)', borderLeft: '3px solid rgba(91,110,245,0.4)', paddingLeft: 16 }}>
                    &ldquo;{c.quote}&rdquo;
                    <div className="text-xs mt-2 not-italic" style={{ color: 'var(--text-3)' }}>— {c.person}</div>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white hover:bg-[#6B5FF8] transition-colors" style={{ background: 'var(--purple)' }}>
              Start gratis met Runvex
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
