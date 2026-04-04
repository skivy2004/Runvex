import { Metadata } from 'next'
import Link from 'next/link'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Systeemstatus — Runvex',
  description: 'Actuele status van de Runvex API, database en e-maildienst.',
}

export const revalidate = 60

type ServiceStatus = 'operational' | 'degraded' | 'down' | 'unknown'

interface HealthData {
  status: ServiceStatus
  services: { name: string; status: ServiceStatus }[]
  checkedAt: string
}

async function getHealth(): Promise<HealthData> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://runvex.app'
    const res = await fetch(`${base}/api/health`, { cache: 'no-store' })
    return res.json()
  } catch {
    return {
      status: 'unknown' as ServiceStatus,
      services: [],
      checkedAt: new Date().toISOString(),
    }
  }
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  operational: { label: 'Operationeel', color: '#3ECF8E', bg: 'rgba(62,207,142,0.1)', dot: '#3ECF8E' },
  degraded: { label: 'Verstoord', color: '#F5A623', bg: 'rgba(245,166,35,0.1)', dot: '#F5A623' },
  down: { label: 'Storing', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', dot: '#EF4444' },
  unknown: { label: 'Onbekend', color: '#8A8FA8', bg: 'rgba(138,143,168,0.1)', dot: '#8A8FA8' },
}

export default async function StatusPage() {
  const health = await getHealth()
  const overall = statusConfig[health.status] ?? statusConfig.unknown

  return (
    <>
      <main style={{ background: '#0A0B0F', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--text-3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Terug
          </Link>

          {/* Overall status banner */}
          <div className="rounded-2xl p-6 mb-8 flex items-center gap-4"
            style={{ background: overall.bg, border: `1px solid ${overall.color}30` }}>
            <div className="relative flex-shrink-0">
              <div className="w-4 h-4 rounded-full" style={{ background: overall.dot }} />
              {health.status === 'operational' && (
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: overall.dot, opacity: 0.4 }} />
              )}
            </div>
            <div>
              <div className="font-bricolage font-bold text-xl text-white">
                {health.status === 'operational' ? 'Alle systemen operationeel' :
                 health.status === 'degraded' ? 'Gedeeltelijke verstoring' :
                 health.status === 'down' ? 'Systeem storing' : 'Status onbekend'}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
                Bijgewerkt: {new Date(health.checkedAt).toLocaleString('nl-NL')}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3 mb-12">
            {health.services.length > 0 ? health.services.map((svc) => {
              const cfg = statusConfig[svc.status] ?? statusConfig.unknown
              return (
                <div key={svc.name} className="flex items-center justify-between rounded-xl px-5 py-4"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                  <span className="text-sm font-medium text-white">{svc.name}</span>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                    {cfg.label}
                  </span>
                </div>
              )
            }) : (
              <div className="text-center py-8 text-sm" style={{ color: 'var(--text-3)' }}>
                Kan status niet ophalen. Probeer de pagina te vernieuwen.
              </div>
            )}
          </div>

          {/* Uptime note */}
          <div className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Problemen? Neem contact op via{' '}
              <Link href="/contact" style={{ color: '#5B6EF5' }}>het contactformulier</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
