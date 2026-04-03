import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Help Center — Runvex',
  description: 'Veelgestelde vragen, handleidingen en video tutorials voor Runvex.',
}

const articles = [
  {
    category: 'Aan de slag',
    items: [
      { title: 'Hoe maak ik een Runvex account aan?', desc: 'Stap-voor-stap handleiding om binnen 10 minuten live te zijn.' },
      { title: 'Mijn contactformulier koppelen', desc: 'Hoe je de webhook URL toevoegt aan je bestaande formulier.' },
      { title: 'Eerste lead testen', desc: 'Verstuur een testlead en bekijk de AI analyse in het dashboard.' },
    ],
  },
  {
    category: 'Dashboard',
    items: [
      { title: 'Wat betekent de AI score?', desc: 'Uitleg over hoe Claude elke lead beoordeelt op 1–100.' },
      { title: 'Lead als behandeld markeren', desc: 'Status bijhouden in het dashboard.' },
      { title: 'Follow-up handmatig versturen', desc: 'Wanneer en hoe je een extra follow-up stuurt.' },
    ],
  },
  {
    category: 'Integraties',
    items: [
      { title: 'Koppelen met Typeform', desc: 'Webhook instellen vanuit Typeform naar Runvex.' },
      { title: 'Koppelen met Webflow', desc: 'Formulieren uit Webflow doorsturen naar Runvex.' },
      { title: 'Koppelen met WordPress / Contact Form 7', desc: 'Webhook URL instellen in je WordPress plugin.' },
    ],
  },
  {
    category: 'Problemen oplossen',
    items: [
      { title: 'Mijn lead komt niet aan in het dashboard', desc: 'Controleer de webhook URL en form token.' },
      { title: 'De follow-up e-mail wordt niet verstuurd', desc: 'RESEND_API_KEY en e-mailinstellingen checken.' },
      { title: 'AI score is altijd 0', desc: 'Controleer of het berichtveld correct doorgestuurd wordt.' },
    ],
  },
]

export default function HelpPage() {
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
            Help Center
          </div>
          <h1 className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Hoe kunnen we helpen?</h1>

          <div className="relative mb-12">
            <input type="search" placeholder="Zoek in help artikelen..." className="w-full rounded-xl px-5 py-3.5 text-sm text-white placeholder-[#8A8FA8] focus:outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', paddingLeft: 44 }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
            </svg>
          </div>

          <div className="space-y-10">
            {articles.map((section) => (
              <div key={section.category}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-3)' }}>{section.category}</div>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.title} className="flex items-center justify-between rounded-xl p-4 cursor-pointer transition-colors hover:bg-[rgba(91,110,245,0.04)]"
                      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                      <div>
                        <div className="text-sm font-semibold text-white mb-0.5">{item.title}</div>
                        <div className="text-xs" style={{ color: 'var(--text-3)' }}>{item.desc}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 ml-4" style={{ color: 'var(--text-3)' }}>
                        <path d="M6 3.5L10 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center rounded-2xl p-8" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <div className="font-bricolage font-bold text-white mb-2">Antwoord niet gevonden?</div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-2)' }}>Stuur ons een bericht en we helpen je binnen 24 uur.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:bg-[#6B5FF8] transition-colors" style={{ background: 'var(--purple)' }}>
              Contact opnemen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
