'use client'

import { motion } from 'framer-motion'

/* Check icon */
function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="9" cy="9" r="9" fill="rgba(91,110,245,0.15)" />
      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="var(--purple-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Dashboard mockup for block 1 */
function DashboardPreview() {
  const leads = [
    { name: 'Jan de Vries', score: 9, sector: 'IT & Software', status: 'Nieuw', followUp: 'Gepland' },
    { name: 'Sarah Bakker', score: 7, sector: 'Marketing', status: 'Verstuurd', followUp: 'Verzonden' },
    { name: 'Tom Janssen', score: 8, sector: 'SaaS', status: 'Nieuw', followUp: 'Gepland' },
    { name: 'Lisa Smit', score: 5, sector: 'Design', status: 'Beantwoord', followUp: '—' },
    { name: 'Mark Visser', score: 6, sector: 'E-commerce', status: 'Nieuw', followUp: 'Gepland' },
  ]
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-2)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="text-xs font-semibold text-white">Alle leads</div>
        <div className="flex gap-2">
          {['Sector', 'Score', 'Bron'].map((f) => (
            <div
              key={f}
              className="px-2 py-1 rounded-md text-[10px]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-3)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {f} ↓
            </div>
          ))}
        </div>
      </div>
      {/* Rows */}
      {leads.map((lead, i) => (
        <div
          key={i}
          className="grid px-5 py-3 items-center text-[11px]"
          style={{
            gridTemplateColumns: '1.2fr 0.5fr 1fr 0.7fr 0.7fr',
            borderBottom: i < leads.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}
        >
          <div className="text-white font-medium">{lead.name}</div>
          <div>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
              style={{
                background: lead.score >= 8 ? 'rgba(91,110,245,0.2)' : 'rgba(255,255,255,0.06)',
                color: lead.score >= 8 ? '#A99FF5' : 'var(--text-3)',
              }}
            >
              {lead.score}
            </span>
          </div>
          <div style={{ color: 'var(--text-2)' }}>{lead.sector}</div>
          <div style={{ color: 'var(--text-3)' }}>{lead.status}</div>
          <div style={{ color: 'var(--text-3)' }}>{lead.followUp}</div>
        </div>
      ))}
    </div>
  )
}

/* Lead detail mockup for block 2 */
function LeadDetailPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-2)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, var(--purple), var(--purple-2))',
            }}
          >
            JV
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Jan de Vries</div>
            <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              jan@devries.nl · IT & Software
            </div>
          </div>
          <div className="ml-auto">
            <div
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
              style={{
                background: 'rgba(91,110,245,0.2)',
                color: '#A99FF5',
                border: '1px solid rgba(91,110,245,0.3)',
              }}
            >
              Score: 9/10
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="px-5 py-3 flex gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['Nieuw', 'In behandeling', 'Offerte', 'Gewonnen'].map((s, i) => (
          <div
            key={s}
            className="px-2 py-1 rounded-md text-[10px] font-medium"
            style={{
              background: i === 0 ? 'rgba(91,110,245,0.2)' : 'rgba(255,255,255,0.04)',
              color: i === 0 ? '#A99FF5' : 'var(--text-3)',
              border: i === 0 ? '1px solid rgba(91,110,245,0.3)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {/* AI summary */}
      <div className="px-5 py-4">
        <div className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-3)' }}>
          AI Samenvatting
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
          Ervaren tech lead bij een snel groeiend SaaS-bedrijf. Zoekt specifiek
          naar AI-automatisering voor hun sales pipeline. Hoge urgentie —
          direct inzetbaar budget beschikbaar.
        </p>
      </div>

      {/* Messages */}
      <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-3)' }}>
          Berichten
        </div>
        <div className="space-y-2">
          <div
            className="rounded-lg p-3 text-[11px]"
            style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-2)' }}
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium text-white">Jan</span>
              <span style={{ color: 'var(--text-3)' }}>14:22</span>
            </div>
            Ik ben geïnteresseerd in jullie AI lead scoring tool...
          </div>
          <div
            className="rounded-lg p-3 text-[11px]"
            style={{ background: 'rgba(91,110,245,0.08)', color: 'var(--text-2)' }}
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium text-white">Runvex AI</span>
              <span style={{ color: 'var(--text-3)' }}>14:24</span>
            </div>
            Bedankt Jan! Op basis van je profiel heb ik een...
          </div>
        </div>
      </div>
    </div>
  )
}

const block1Checks = [
  'Gesorteerd op AI-prioriteit (1-10)',
  'Filter op sector, score, bron, datum',
  'AI-samenvatting zichtbaar per lead',
  'Follow-up status in één kolom',
]

const block2Checks = [
  'Volledige berichtshistorie per lead',
  'AI-samenvatting en herkwalificatie',
  'Notities toevoegen per lead',
  'Status bijwerken: Nieuw → Gewonnen',
]

export default function ProductShowcase() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-32">
        {/* Block 1: text left, mockup right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0.15, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: 'var(--text-3)' }}
            >
              Dashboard
            </div>
            <h2
              className="font-bricolage font-extrabold text-2xl md:text-4xl text-white mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              Alle leads. Eén overzicht.
            </h2>
            <div className="space-y-3">
              {block1Checks.map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <Check />
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0.15, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <DashboardPreview />
          </motion.div>
        </div>

        {/* Block 2: mockup left, text right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0.15, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <LeadDetailPreview />
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0.15, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: 'var(--text-3)' }}
            >
              Lead Detail
            </div>
            <h2
              className="font-bricolage font-extrabold text-2xl md:text-4xl text-white mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              Elk gesprek. Volledig bijgehouden.
            </h2>
            <div className="space-y-3">
              {block2Checks.map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <Check />
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
