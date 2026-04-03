'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { AnimatedGroup } from '@/app/components/ui/animated-group'

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring' as const, bounce: 0.3, duration: 1.5 },
    },
  },
}

export default function HeroSection() {
  return (
    <main className="overflow-hidden">
      {/* Subtle light rays */}
      <div
        aria-hidden
        className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
      >
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(91,110,245,0.12)_0,rgba(91,110,245,0.03)_50%,transparent_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(91,110,245,0.07)_0,rgba(91,110,245,0.02)_80%,transparent_100%)] [translate:5%_-50%]" />
      </div>

      <section>
        <div className="relative pt-32 md:pt-44">
          {/* Night background image */}
          <AnimatedGroup
            variants={{
              container: {
                visible: { transition: { delayChildren: 0.8 } },
              },
              item: {
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: 'spring' as const, bounce: 0.3, duration: 2 },
                },
              },
            }}
            className="absolute inset-0 -z-20"
          >
            <img
              src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
              alt=""
              aria-hidden
              className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 lg:block w-full object-cover opacity-60"
              width="3276"
              height="4095"
            />
          </AnimatedGroup>

          {/* Radial fade to background at bottom */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full"
            style={{
              background: 'radial-gradient(125% 125% at 50% 100%, transparent 0%, #0A0B0F 70%)',
            }}
          />

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto">
              <AnimatedGroup variants={transitionVariants}>
                {/* Announcement badge */}
                <Link
                  href="/#demos"
                  className="group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md transition-all duration-300 mb-0"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-sm" style={{ color: '#8A8FA8' }}>
                    Demo nu beschikbaar — Lead automatisering met Claude AI
                  </span>
                  <span
                    className="block h-4 w-0.5"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                  />
                  <div
                    className="size-6 overflow-hidden rounded-full duration-500 flex items-center justify-center"
                    style={{ background: 'rgba(91,110,245,0.15)' }}
                  >
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6 items-center justify-center">
                        <ArrowRight className="size-3 text-[#5B6EF5]" />
                      </span>
                      <span className="flex size-6 items-center justify-center">
                        <ArrowRight className="size-3 text-[#5B6EF5]" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Headline */}
                <h1
                  className="mt-8 font-bricolage font-extrabold text-balance text-5xl md:text-7xl lg:mt-14 xl:text-[5.25rem] text-white lg:max-w-5xl mx-auto"
                  style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
                >
                  Laat geen enkele lead{' '}
                  <span style={{ color: '#5B6EF5' }}>meer liggen.</span>
                </h1>

                {/* Subtitle */}
                <p
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                  style={{ color: '#8A8FA8' }}
                >
                  Runvex scoort, opvolgt en beheert al je leads automatisch met Claude AI —
                  zodat jij je focust op groeien, niet op inbox-management.
                </p>
              </AnimatedGroup>

              {/* CTA buttons */}
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.75 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row"
              >
                <div
                  className="rounded-[14px] border p-0.5"
                  style={{ background: 'rgba(91,110,245,0.12)', borderColor: 'rgba(91,110,245,0.25)' }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl px-6 text-base font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #5B6EF5, #7B5EF5)',
                      boxShadow: '0 0 20px rgba(91,110,245,0.4)',
                    }}
                  >
                    <Link href="/contact">
                      <span className="text-nowrap">Start gratis</span>
                    </Link>
                  </Button>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-xl px-6 text-[#8A8FA8] hover:text-white"
                >
                  <Link href="/#booking">
                    <span className="text-nowrap">Boek een call →</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>

          {/* Dashboard mockup */}
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.75 },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="relative -mr-56 mt-12 overflow-hidden px-2 sm:mr-0 sm:mt-16 md:mt-20">
              {/* Gradient fade at bottom of mockup */}
              <div
                aria-hidden
                className="absolute inset-0 z-10 from-transparent from-35%"
                style={{
                  background: 'linear-gradient(to bottom, transparent 35%, #0A0B0F 100%)',
                }}
              />
              <div
                className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg"
                style={{
                  background: '#0D0F1A',
                  borderColor: 'rgba(91,110,245,0.15)',
                  boxShadow: '0 0 0 1px rgba(91,110,245,0.08), 0 40px 80px rgba(0,0,0,0.6)',
                }}
              >
                {/* Mock dashboard UI — matches real dashboard */}
                <div
                  className="aspect-[15/8] relative rounded-xl overflow-hidden flex"
                  style={{ background: '#0A0B0F' }}
                >
                  {/* ── Sidebar ── */}
                  <div
                    className="w-[18%] flex-shrink-0 flex flex-col border-r h-full"
                    style={{ background: '#0C0E1B', borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    {/* Logo */}
                    <div className="flex items-center gap-1.5 px-3 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="w-4 h-4 rounded flex items-center justify-center text-white font-bold flex-shrink-0" style={{ fontSize: 8, background: 'linear-gradient(135deg,#5B6EF5,#7B6FF0)' }}>R</div>
                      <span className="font-bricolage font-bold text-white" style={{ fontSize: 9 }}>Runvex</span>
                    </div>
                    {/* Search */}
                    <div className="mx-2 mt-2 rounded px-2 py-1 flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <svg width="7" height="7" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#5A5E82" strokeWidth="1.5"/><path d="M10 10l2.5 2.5" stroke="#5A5E82" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span style={{ fontSize: 7, color: '#5A5E82' }}>Zoeken...</span>
                    </div>
                    {/* Nav sections */}
                    <div className="px-2 mt-2 space-y-0.5">
                      <div style={{ fontSize: 6, color: '#3A3E5E', letterSpacing: '0.08em' }} className="px-2 py-1 font-semibold uppercase">ALGEMEEN</div>
                      {/* Overzicht - active */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(91,110,245,0.15)' }}>
                        <svg width="7" height="7" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="#5B6EF5"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="#5B6EF5" opacity=".5"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="#5B6EF5" opacity=".5"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="#5B6EF5" opacity=".3"/></svg>
                        <span style={{ fontSize: 7, color: '#5B6EF5', fontWeight: 600 }}>Overzicht</span>
                      </div>
                      {/* Leads */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded">
                        <svg width="7" height="7" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="#5A5E82" strokeWidth="1.5"/><path d="M1 13c0-2.76 2.24-4 5-4s5 1.24 5 4" stroke="#5A5E82" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <span style={{ fontSize: 7, color: '#5A5E82' }}>Leads</span>
                      </div>
                      <div style={{ fontSize: 6, color: '#3A3E5E', letterSpacing: '0.08em' }} className="px-2 py-1 font-semibold uppercase mt-1">TOOLS</div>
                      {/* AI Insights with badge */}
                      <div className="flex items-center justify-between px-2 py-1 rounded">
                        <div className="flex items-center gap-1.5">
                          <svg width="7" height="7" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10l-3.7 2.5 1.4-4.3L2 5.5h4.5z" stroke="#5A5E82" strokeWidth="1.2"/></svg>
                          <span style={{ fontSize: 7, color: '#5A5E82' }}>AI Insights</span>
                        </div>
                        <span className="rounded-full px-1" style={{ fontSize: 6, background: '#5B6EF5', color: '#fff', fontWeight: 700 }}>2</span>
                      </div>
                      {/* Automatisering */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded">
                        <svg width="7" height="7" viewBox="0 0 16 16" fill="none"><path d="M13 3H3a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1z" stroke="#5A5E82" strokeWidth="1.2"/><path d="M5 7h6M5 10h4" stroke="#5A5E82" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        <span style={{ fontSize: 7, color: '#5A5E82' }}>Automatisering</span>
                      </div>
                      <div style={{ fontSize: 6, color: '#3A3E5E', letterSpacing: '0.08em' }} className="px-2 py-1 font-semibold uppercase mt-1">OVERIG</div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded">
                        <svg width="7" height="7" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#5A5E82" strokeWidth="1.2"/><path d="M2 7h12" stroke="#5A5E82" strokeWidth="1.2"/></svg>
                        <span style={{ fontSize: 7, color: '#5A5E82' }}>Contactformulier</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded">
                        <svg width="7" height="7" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#5A5E82" strokeWidth="1.2"/><path d="M8 5v3.5l2 1.5" stroke="#5A5E82" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        <span style={{ fontSize: 7, color: '#5A5E82' }}>Instellingen</span>
                      </div>
                    </div>
                    {/* Bottom — live automatisering card */}
                    <div className="mx-2 mt-auto mb-2 rounded p-2" style={{ background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.2)' }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <svg width="7" height="7" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10l-3.7 2.5 1.4-4.3L2 5.5h4.5z" fill="#5B6EF5"/></svg>
                        <span style={{ fontSize: 6.5, color: '#A99FF5', fontWeight: 600 }}>Live automatisering</span>
                      </div>
                      <span style={{ fontSize: 6, color: '#6A6E9A' }}>Leads worden real-time gescoord door Claude AI.</span>
                    </div>
                  </div>

                  {/* ── Main content ── */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center gap-1" style={{ fontSize: 7, color: '#5A5E82' }}>
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-white">Overzicht</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Bell with badge */}
                        <div className="relative">
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="none"><path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="#5A5E82" strokeWidth="1.5"/><path d="M8 16a2 2 0 004 0" stroke="#5A5E82" strokeWidth="1.5"/></svg>
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center text-white font-bold" style={{ fontSize: 5, background: '#5B6EF5' }}>2</span>
                        </div>
                        {/* User chip */}
                        <div className="flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white font-bold" style={{ fontSize: 6, background: 'linear-gradient(135deg,#5B6EF5,#7B6FF0)' }}>R</div>
                          <div>
                            <div style={{ fontSize: 6, color: '#fff', fontWeight: 600, lineHeight: 1.2 }}>Runvex</div>
                            <div style={{ fontSize: 5, color: '#5A5E82', lineHeight: 1.2 }}>admin</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-3 pt-2 pb-1 overflow-hidden flex flex-col gap-2">
                      {/* Title row */}
                      <div className="flex items-center justify-between flex-shrink-0">
                        <div>
                          <div className="font-bricolage font-extrabold text-white" style={{ fontSize: 11 }}>Lead Dashboard</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <svg width="6" height="6" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="11" rx="2" stroke="#5A5E82" strokeWidth="1.2"/><path d="M4 1v2M10 1v2M1 6h12" stroke="#5A5E82" strokeWidth="1.2" strokeLinecap="round"/></svg>
                              <span style={{ fontSize: 6, color: '#5A5E82' }}>3 april 2026</span>
                            </div>
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'rgba(62,207,142,0.12)', border: '1px solid rgba(62,207,142,0.25)' }}>
                              <div className="w-1 h-1 rounded-full" style={{ background: '#3ECF8E' }} />
                              <span style={{ fontSize: 6, color: '#3ECF8E' }}>Live</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ border: '1px solid rgba(91,110,245,0.4)', color: '#A99FF5', fontSize: 6.5, fontWeight: 500 }}>
                          + Formulier bekijken
                        </div>
                      </div>

                      {/* 4 stat cards */}
                      <div className="grid grid-cols-4 gap-1.5 flex-shrink-0">
                        {[
                          { icon: '👥', label: 'Totaal leads', value: '9', sub: '4 hoge prioriteit', iconBg: 'rgba(91,110,245,0.15)', iconColor: '#5B6EF5' },
                          { icon: '✦', label: 'Hoge prioriteit', value: '4', sub: '44% van alle leads', iconBg: 'rgba(245,166,35,0.15)', iconColor: '#F5A623' },
                          { icon: '!', label: 'Follow-up verstuurd', value: '9', sub: '100% bereikt', iconBg: 'rgba(62,207,142,0.15)', iconColor: '#3ECF8E' },
                          { icon: '○', label: 'Behandeld', value: '2', sub: '22% afgehandeld', iconBg: 'rgba(180,180,200,0.1)', iconColor: '#8A8FA8' },
                        ].map((s) => (
                          <div key={s.label} className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <div className="w-4 h-4 rounded flex items-center justify-center mb-1.5" style={{ background: s.iconBg, color: s.iconColor, fontSize: 7 }}>{s.icon}</div>
                            <div style={{ fontSize: 6, color: '#5A5E82', marginBottom: 2 }}>{s.label}</div>
                            <div className="font-bricolage font-extrabold text-white" style={{ fontSize: 13 }}>{s.value}</div>
                            <div style={{ fontSize: 5.5, color: '#5A5E82', marginTop: 1 }}>{s.sub}</div>
                          </div>
                        ))}
                      </div>

                      {/* Chart */}
                      <div className="flex-1 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', minHeight: 0 }}>
                        <div className="flex items-center justify-between px-2.5 pt-1.5 pb-1">
                          <div>
                            <div style={{ fontSize: 7, color: '#fff', fontWeight: 600 }}>Lead activiteit</div>
                            <div style={{ fontSize: 5.5, color: '#5A5E82' }}>Afgelopen 28 dagen</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-px" style={{ background: '#5B6EF5' }} />
                              <span style={{ fontSize: 5.5, color: '#5A5E82' }}>Alle leads</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-px border-t border-dashed" style={{ borderColor: '#F5A623' }} />
                              <span style={{ fontSize: 5.5, color: '#5A5E82' }}>Hoge prioriteit</span>
                            </div>
                            <div className="px-1.5 py-0.5 rounded" style={{ fontSize: 5.5, color: '#5A5E82', background: 'rgba(255,255,255,0.05)' }}>9 leads totaal</div>
                          </div>
                        </div>
                        {/* SVG chart */}
                        <svg width="100%" height="100%" viewBox="0 0 400 60" preserveAspectRatio="none" style={{ display: 'block' }}>
                          {/* Grid lines */}
                          {[15, 30, 45].map(y => (
                            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                          ))}
                          {/* All leads line + fill */}
                          <defs>
                            <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#5B6EF5" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#5B6EF5" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M0,55 L80,52 L160,50 L220,48 L280,20 L320,35 L350,10 L380,25 L400,18 L400,60 L0,60Z" fill="url(#fillGrad)" />
                          <path d="M0,55 L80,52 L160,50 L220,48 L280,20 L320,35 L350,10 L380,25 L400,18" fill="none" stroke="#5B6EF5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          {/* High priority dashed line */}
                          <path d="M0,57 L80,56 L160,55 L220,54 L280,40 L320,50 L350,28 L380,18 L400,12" fill="none" stroke="#F5A623" strokeWidth="1" strokeDasharray="3,2" strokeLinecap="round" strokeLinejoin="round" />
                          {/* X-axis labels */}
                          <text x="10" y="59" fill="#3A3E5E" fontSize="4">7 mrt</text>
                          <text x="110" y="59" fill="#3A3E5E" fontSize="4">14 mrt</text>
                          <text x="210" y="59" fill="#3A3E5E" fontSize="4">21 mrt</text>
                          <text x="300" y="59" fill="#3A3E5E" fontSize="4">28 mrt</text>
                          <text x="378" y="59" fill="#3A3E5E" fontSize="4">3 apr</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </main>
  )
}
