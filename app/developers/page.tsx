import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'API Documentatie — Runvex',
  description: 'Koppel Runvex direct aan je eigen systemen via de REST API. Webhooks, leads en dashboard data.',
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/contact',
    desc: 'Stuur een nieuwe lead in vanuit je eigen formulier of systeem.',
    body: `{
  "naam": "Lars van den Berg",
  "email": "lars@techflow.nl",
  "bedrijf": "TechFlow B.V.",
  "bericht": "Ik zoek een oplossing voor lead automatisering.",
  "telefoon": "+31 6 12345678",
  "form_token": "YOUR_FORM_TOKEN"
}`,
    response: `{ "success": true }`,
  },
  {
    method: 'PUT',
    path: '/api/leads/behandeld',
    desc: 'Markeer een lead als behandeld in het dashboard.',
    body: `{ "id": "lead-uuid", "behandeld": true }`,
    response: `{ "success": true }`,
  },
  {
    method: 'POST',
    path: '/api/leads/followup',
    desc: 'Stuur een handmatige follow-up e-mail naar een specifieke lead.',
    body: `{ "id": "lead-uuid" }`,
    response: `{ "success": true, "messageId": "email-id" }`,
  },
]

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: '#3ECF8E',
    POST: '#5B6EF5',
    PUT: '#F5A623',
    DELETE: '#EF4444',
  }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono" style={{ background: `${colors[method]}20`, color: colors[method] }}>
      {method}
    </span>
  )
}

export default function DevelopersPage() {
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
            API Docs
          </div>
          <h1 className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>API Documentatie</h1>
          <p className="text-lg mb-4" style={{ color: 'var(--text-2)' }}>Koppel Runvex direct aan je eigen systemen via onze REST API.</p>

          <div className="rounded-xl p-4 mb-12 text-sm font-mono" style={{ background: 'rgba(91,110,245,0.08)', border: '1px solid rgba(91,110,245,0.2)', color: '#5B6EF5' }}>
            Base URL: <span className="text-white">https://runvex.app</span>
          </div>

          <div className="mb-10">
            <h2 className="font-bricolage font-bold text-xl text-white mb-2">Authenticatie</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-2)' }}>Alle API-aanroepen vereisen je <code style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5', padding: '2px 6px', borderRadius: 4 }}>form_token</code> in de request body. Je vindt deze in je dashboard onder Instellingen.</p>
          </div>

          <div className="space-y-6">
            {endpoints.map((ep) => (
              <div key={ep.path} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 px-5 py-3" style={{ background: '#0C0E1B', borderBottom: '1px solid var(--border)' }}>
                  <MethodBadge method={ep.method} />
                  <code className="text-sm text-white font-mono">{ep.path}</code>
                </div>
                <div className="p-5" style={{ background: 'var(--bg-2)' }}>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-2)' }}>{ep.desc}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Request body</div>
                      <pre className="text-xs rounded-lg p-4 overflow-auto" style={{ background: '#0A0B0F', color: '#3ECF8E', border: '1px solid rgba(255,255,255,0.06)' }}>{ep.body}</pre>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Response</div>
                      <pre className="text-xs rounded-lg p-4 overflow-auto" style={{ background: '#0A0B0F', color: '#5B6EF5', border: '1px solid rgba(255,255,255,0.06)' }}>{ep.response}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl p-6 text-center" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-2)' }}>Vragen over de API of hulp nodig bij integreren?</p>
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
