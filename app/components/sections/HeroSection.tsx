'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import FloatingIcon from '../ui/FloatingIcon'

/* ---------- SVG Icons for integrations ---------- */
function GmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M2 6l10 7 10-7" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="#8B8FB3" strokeWidth="1.5"/>
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#0A66C2" strokeWidth="1.5"/>
      <path d="M8 11v5M8 8v.01M12 16v-4a2 2 0 1 1 4 0v4" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function SlackIconSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" fill="#E01E5A"/>
      <path d="M20.5 10H19v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#E01E5A"/>
      <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" fill="#36C5F0"/>
      <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" fill="#36C5F0"/>
      <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" fill="#2EB67D"/>
      <path d="M14 20.5v-1.5h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" fill="#2EB67D"/>
      <path d="M10 9.5c0 .83-.67 1.5-1.5 1.5h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z" fill="#ECB22E"/>
      <path d="M10 3.5V5H8.5C7.67 5 7 4.33 7 3.5S7.67 2 8.5 2s1.5.67 1.5 1.5z" fill="#ECB22E"/>
    </svg>
  )
}
function SupabaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M13.5 21.2c-.4.5-1.2.1-1.1-.5l.9-8.7H5.7c-.5 0-.8-.6-.5-1l8.3-9.2c.4-.5 1.2-.1 1.1.5l-.9 8.7h7.6c.5 0 .8.6.5 1l-8.3 9.2z" fill="#3ECF8E"/>
    </svg>
  )
}
function ResendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 12h6a4 4 0 0 0 0-8H6v16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12l6 8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function N8nIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="3" stroke="#EA4B71" strokeWidth="1.5"/>
      <circle cx="18" cy="6" r="3" stroke="#EA4B71" strokeWidth="1.5"/>
      <circle cx="18" cy="18" r="3" stroke="#EA4B71" strokeWidth="1.5"/>
      <path d="M9 12h3l3-6M12 12l3 6" stroke="#EA4B71" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ---------- Dashboard Mockup (CSS-only) ---------- */
function DashboardMockup() {
  return (
    <div className="w-full">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 p-4 pb-3">
        {[
          { label: 'Totale leads', value: '142', change: '+12%' },
          { label: 'Hoge prioriteit', value: '28', change: '+3' },
          { label: 'Follow-ups vandaag', value: '5', change: '' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>{s.label}</div>
            <div className="text-lg font-semibold font-bricolage text-white mt-0.5">{s.value}</div>
            {s.change && (
              <div className="text-[10px] mt-0.5" style={{ color: '#3ECF8E' }}>{s.change}</div>
            )}
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="px-4 pb-4">
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Header */}
          <div
            className="grid text-[10px] font-medium px-4 py-2.5"
            style={{
              gridTemplateColumns: '1.2fr 1.5fr 0.6fr 0.8fr 0.8fr',
              color: 'var(--text-3)',
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div>Naam</div>
            <div>Email</div>
            <div>Score</div>
            <div>Sector</div>
            <div>Status</div>
          </div>
          {/* Rows */}
          {[
            { name: 'Jan de Vries', email: 'jan@devries.nl', score: 9, sector: 'IT', status: 'Nieuw' },
            { name: 'Sarah Bakker', email: 'sarah@company.nl', score: 7, sector: 'Marketing', status: 'Verstuurd' },
            { name: 'Tom Janssen', email: 'tom@startup.io', score: 8, sector: 'SaaS', status: 'Nieuw' },
            { name: 'Lisa Smit', email: 'lisa@agency.nl', score: 5, sector: 'Design', status: 'Beantwoord' },
          ].map((row, i) => (
            <div
              key={i}
              className="grid text-[11px] px-4 py-2.5 items-center"
              style={{
                gridTemplateColumns: '1.2fr 1.5fr 0.6fr 0.8fr 0.8fr',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div className="text-white font-medium">{row.name}</div>
              <div style={{ color: 'var(--text-3)' }}>{row.email}</div>
              <div>
                <span
                  className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold"
                  style={{
                    background: row.score >= 8 ? 'rgba(91,79,232,0.2)' : row.score >= 6 ? 'rgba(236,178,46,0.15)' : 'rgba(255,255,255,0.06)',
                    color: row.score >= 8 ? '#A99FF5' : row.score >= 6 ? '#ECB22E' : 'var(--text-3)',
                  }}
                >
                  {row.score}
                </span>
              </div>
              <div style={{ color: 'var(--text-2)' }}>{row.sector}</div>
              <div>
                <span
                  className="inline-flex px-1.5 py-0.5 rounded text-[10px]"
                  style={{
                    background: row.status === 'Nieuw' ? 'rgba(62,207,142,0.12)' : 'rgba(255,255,255,0.05)',
                    color: row.status === 'Nieuw' ? '#3ECF8E' : 'var(--text-3)',
                  }}
                >
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hero-badge]', { y: 10, opacity: 0, duration: 0.5 }, 0.1)
        .from('[data-hero-line1]', { y: 30, opacity: 0, duration: 0.6 }, 0.2)
        .from('[data-hero-line2]', { y: 30, opacity: 0, duration: 0.6 }, 0.35)
        .from('[data-hero-sub]', { opacity: 0, duration: 0.5 }, 0.5)
        .from('[data-hero-cta]', { y: 10, opacity: 0, scale: 0.97, duration: 0.5 }, 0.65)
        .from('[data-hero-mockup]', { y: 40, opacity: 0, duration: 0.8 }, 0.3)
        .from('[data-hero-float]', { opacity: 0, duration: 0.6, stagger: 0.08 }, 0.6)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative pt-28 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="hero-bg absolute inset-0 pointer-events-none" />
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Content */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div data-hero-badge className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: 'rgba(91,79,232,0.15)',
              border: '1px solid rgba(91,79,232,0.35)',
              color: '#A99FF5',
            }}
          >
            <span
              className="inline-block"
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#7B6FF0' }}
            />
            Leads automatisch opvolgen met Claude AI
          </div>

          {/* Headline */}
          <h1 className="font-bricolage font-extrabold mb-6" style={{ letterSpacing: '-0.03em', lineHeight: 1.0, fontSize: 'clamp(42px, 6.5vw, 82px)' }}>
            <span data-hero-line1 className="block text-white">Automatiseer je leads.</span>
            <span data-hero-line2 className="block text-white">Verlies geen klant meer.</span>
          </h1>

          {/* Subheadline */}
          <p data-hero-sub className="text-base md:text-lg mx-auto mb-10" style={{ color: 'var(--text-2)', maxWidth: 520 }}>
            Runvex legt leads vast, scoort ze met AI en stuurt gepersonaliseerde
            opvolgmails — zonder dat jij er iets voor hoeft te doen.
          </p>

          {/* CTAs */}
          <div data-hero-cta className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all duration-150"
              style={{ background: 'var(--purple)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#6B5FF8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--purple)')}
            >
              Gratis starten
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-150 group-hover:translate-x-[3px]">
                <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="/#hoe-het-werkt"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all duration-150"
              style={{ border: '1px solid rgba(255,255,255,0.18)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
            >
              Bekijk de demo
            </a>
          </div>
        </div>

        {/* Mockup with floating icons */}
        <div className="relative mt-16 md:mt-20 max-w-[900px] mx-auto">
          {/* Floating icons - left */}
          <div className="absolute -left-4 md:-left-16 top-1/4 flex flex-col gap-4 z-10 hidden md:flex">
            <div data-hero-float><FloatingIcon delay={0}><GmailIcon /></FloatingIcon></div>
            <div data-hero-float><FloatingIcon delay={0.4} duration={2.8}><LinkedInIcon /></FloatingIcon></div>
            <div data-hero-float><FloatingIcon delay={0.8} duration={3.2}><SlackIconSVG /></FloatingIcon></div>
          </div>

          {/* Floating icons - right */}
          <div className="absolute -right-4 md:-right-16 top-1/3 flex flex-col gap-4 z-10 hidden md:flex">
            <div data-hero-float><FloatingIcon delay={0.2} duration={3}><SupabaseIcon /></FloatingIcon></div>
            <div data-hero-float><FloatingIcon delay={0.6} duration={2.6}><ResendIcon /></FloatingIcon></div>
            <div data-hero-float><FloatingIcon delay={1} duration={3.4}><N8nIcon /></FloatingIcon></div>
          </div>

          {/* Browser frame */}
          <div
            data-hero-mockup
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-2)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(91,79,232,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Chrome bar */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex gap-1.5">
                {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
              </div>
              <div
                className="flex-1 text-center text-xs rounded-md py-1 px-3"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)' }}
              >
                app.runvex.nl/dashboard
              </div>
            </div>

            {/* Dashboard content */}
            <div className="relative">
              <DashboardMockup />
              {/* Fade at bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent 0%, #07071A 100%)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
