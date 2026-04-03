import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Footer from '../../components/layout/Footer'

const sectors = {
  webdesigners: {
    title: 'Runvex voor webdesigners & bureaus',
    headline: 'Stop met leads handmatig opvolgen. Focus op je werk.',
    sub: 'Webdesigners en bureaus verliezen elke maand omzet doordat leads te lang moeten wachten op een reactie. Runvex reageert direct, scoort de lead en plant automatisch een follow-up.',
    pains: [
      'Je zit midden in een project en mist een offerte-aanvraag',
      'Leads haken af omdat je 2 dagen later reageert',
      'Je weet niet welke leads serieus zijn en welke tijd verspillen',
    ],
    gains: [
      'Elke aanvraag krijgt binnen 60 seconden een bevestiging',
      'AI scoort de lead: heeft het budget? Is het urgent?',
      'Jij krijgt alleen de serieuze leads op je bord',
    ],
    cta: 'Perfect voor: Freelance webdesigners, kleine bureaus, UX/UI designers',
  },
  accountants: {
    title: 'Runvex voor accountants & boekhouders',
    headline: 'Nieuwe klanten binnenhalen zonder extra administratie.',
    sub: 'Accountants zijn druk met deadlines en belastingaangiftes. Nieuwe leads opvolgen blijft er bij in. Runvex doet de eerste opvolging automatisch — inclusief kwalificatie en planning.',
    pains: [
      'Aanvragen stranden in je inbox tijdens drukke periodes',
      'Je mist nieuwe klanten omdat je niet snel genoeg reageert',
      'Kwalificeren kost te veel tijd voor leads die toch niet converteren',
    ],
    gains: [
      'Automatische bevestiging bij elke aanvraag, ook buiten kantooruren',
      'AI analyseert of de lead past bij jouw praktijk',
      'Follow-up email na 3 dagen als ze nog niet gereageerd hebben',
    ],
    cta: 'Perfect voor: Zelfstandige accountants, boekhoudbureaus, belastingadviseurs',
  },
  coaches: {
    title: 'Runvex voor coaches & trainers',
    headline: 'Meer cliënten, minder e-mails.',
    sub: 'Als coach is je tijd je meest waardevolle bezit. Elke minuut die je besteedt aan het kwalificeren van leads, is een minuut minder voor je cliënten. Runvex neemt dat werk over.',
    pains: [
      'Potentiële cliënten schrijven je aan, maar je hebt geen tijd om direct te reageren',
      'Je stuurt offertes naar mensen die nooit serieus waren',
      'Je weet niet welk kanaal de beste cliënten oplevert',
    ],
    gains: [
      'Elke coachingaanvraag krijgt direct een persoonlijke bevestiging',
      'AI scoort op motivatie, budget en urgentie',
      'Dashboard toont welke leads de meeste kans hebben',
    ],
    cta: 'Perfect voor: Life coaches, business coaches, trainers, therapeuten',
  },
  bouwbedrijven: {
    title: 'Runvex voor bouwbedrijven & aannemers',
    headline: 'Elke offerte-aanvraag snel en professioneel beantwoord.',
    sub: 'In de bouw gaat de opdracht naar wie het eerst reageert. Runvex zorgt dat jij altijd de eerste bent — met een professionele reactie en een geautomatiseerde follow-up.',
    pains: [
      'Je bent op de bouwplaats en mist aanvragen die via je website binnenkomen',
      'Concurrenten reageren sneller en pakken de opdracht',
      'Je hebt geen tijd om te beoordelen of een aanvraag de moeite waard is',
    ],
    gains: [
      'Directe reactie op elke aanvraag, ook als jij aan het werk bent',
      'AI beoordeelt of het project past bij jouw specialisme',
      'Professionele follow-up als de klant nog geen keuze heeft gemaakt',
    ],
    cta: 'Perfect voor: Aannemers, installatiebedrijven, schilders, dakdekkers',
  },
} as const

type SectorKey = keyof typeof sectors

export function generateStaticParams() {
  return Object.keys(sectors).map((sector) => ({ sector }))
}

export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }): Promise<Metadata> {
  const { sector } = await params
  const data = sectors[sector as SectorKey]
  if (!data) return {}
  return { title: `${data.title} — Runvex`, description: data.sub }
}

export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params
  const data = sectors[sector as SectorKey]
  if (!data) notFound()

  return (
    <>
      <main style={{ background: '#0A0B0F', minHeight: '100vh' }}>
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--text-3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Terug naar home
          </Link>

          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.2)', color: '#5B6EF5' }}>
            {data.title.split(' voor ')[1]}
          </div>

          <h1 className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
            {data.headline}
          </h1>
          <p className="text-base md:text-lg mb-14 max-w-2xl" style={{ color: 'var(--text-2)' }}>{data.sub}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div className="text-sm font-semibold mb-4" style={{ color: '#EF4444' }}>Zonder Runvex</div>
              <ul className="space-y-3">
                {data.pains.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-2)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-6" style={{ background: 'rgba(62,207,142,0.06)', border: '1px solid rgba(62,207,142,0.15)' }}>
              <div className="text-sm font-semibold mb-4" style={{ color: '#3ECF8E' }}>Met Runvex</div>
              <ul className="space-y-3">
                {data.gains.map((g) => (
                  <li key={g} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-2)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg,rgba(91,110,245,0.12),rgba(91,110,245,0.04))', border: '1px solid rgba(91,110,245,0.25)' }}>
            <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>{data.cta}</p>
            <h2 className="font-bricolage font-bold text-2xl text-white mb-2">Klaar om te beginnen?</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>Geen creditcard. Binnen 10 minuten live.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white hover:bg-[#6B5FF8] transition-colors" style={{ background: 'var(--purple)' }}>
              Start gratis
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
