import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Roadmap — Runvex',
  description: 'Wat er aan zit te komen bij Runvex. Bekijk onze publieke roadmap en stem op features.',
}

const shipped = [
  { title: 'AI lead scoring met Claude', desc: 'Elke lead krijgt automatisch een score op basis van urgentie, sector en berichtinhoud.' },
  { title: 'Automatische follow-up e-mail', desc: 'Lead ontvangt een gepersonaliseerde bevestiging binnen 60 seconden.' },
  { title: 'Lead management dashboard', desc: 'Overzicht van alle leads met score, status en activiteitsgrafiek.' },
  { title: 'Blog / kennisbank', desc: 'SEO-artikelen over lead opvolging en automatisering voor MKB.' },
  { title: 'ROI calculator', desc: 'Interactieve calculator die laat zien hoeveel tijd en geld Runvex bespaart.' },
]

const inProgress = [
  { title: 'Referral programma', desc: 'Verdien gratis maanden door vrienden uit te nodigen.' },
  { title: 'Sector-specifieke onboarding', desc: 'Gepersonaliseerde setup voor webdesigners, accountants, coaches en meer.' },
  { title: 'Crisp live chat integratie', desc: 'Direct chatten met bezoekers via de Runvex site.' },
]

const planned = [
  { title: 'Email sequence builder', desc: 'Stel visuele follow-up flows in: dag 1, dag 3, dag 7.', votes: 34 },
  { title: 'Aanpasbare AI scoring criteria', desc: 'Stel eigen prioriteitsregels in per sector of budget.', votes: 28 },
  { title: 'Wekelijkse AI rapportage via email', desc: 'Elke maandag een overzicht van je beste leads.', votes: 21 },
  { title: 'WhatsApp notificaties', desc: 'Ontvang een bericht als er een high-priority lead binnenkomt.', votes: 19 },
  { title: 'CRM sync (HubSpot / Pipedrive)', desc: 'Automatisch leads doorsturen naar je bestaande CRM.', votes: 15 },
  { title: 'Mobiele app', desc: 'Dashboard en notificaties op je telefoon.', votes: 12 },
]

function StatusBadge({ status }: { status: 'shipped' | 'in-progress' | 'planned' }) {
  const map = {
    shipped: { label: 'Live', bg: 'rgba(62,207,142,0.12)', color: '#3ECF8E' },
    'in-progress': { label: 'In ontwikkeling', bg: 'rgba(245,166,35,0.12)', color: '#F5A623' },
    planned: { label: 'Gepland', bg: 'rgba(91,110,245,0.12)', color: '#5B6EF5' },
  }
  const s = map[status]
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{s.label}</span>
}

export default function RoadmapPage() {
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
            Publieke Roadmap
          </div>
          <h1 className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Wat er aankomt</h1>
          <p className="text-lg mb-14" style={{ color: 'var(--text-2)' }}>Transparantie over wat we bouwen. Mis je iets? Laat het weten via <Link href="/contact" style={{ color: '#5B6EF5' }}>contact</Link>.</p>

          {[
            { label: 'Live', status: 'shipped' as const, items: shipped },
            { label: 'In ontwikkeling', status: 'in-progress' as const, items: inProgress },
            { label: 'Gepland', status: 'planned' as const, items: planned },
          ].map((section) => (
            <div key={section.label} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status={section.status} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>{section.label}</span>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.title} className="flex items-start justify-between gap-4 rounded-xl p-4" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                      <div className="text-xs" style={{ color: 'var(--text-3)' }}>{item.desc}</div>
                    </div>
                    {'votes' in item && (
                      <div className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(91,110,245,0.1)', color: '#5B6EF5' }}>
                        ↑ {item.votes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
