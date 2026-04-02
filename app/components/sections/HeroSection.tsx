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
                    <Link href="/#booking">
                      <span className="text-nowrap">Boek een call</span>
                    </Link>
                  </Button>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-xl px-6 text-[#8A8FA8] hover:text-white"
                >
                  <Link href="/#demos">
                    <span className="text-nowrap">Bekijk de demo →</span>
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
                {/* Mock dashboard UI */}
                <div
                  className="aspect-[15/8] relative rounded-xl overflow-hidden"
                  style={{ background: '#0A0B0F' }}
                >
                  {/* Top bar */}
                  <div
                    className="flex items-center justify-between px-6 py-3 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#5B6EF5,#7B6FF0)' }}>R</div>
                      <span className="font-bricolage font-bold text-white text-sm">runvex</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(91,110,245,0.15)', color: '#5B6EF5' }}>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span className="text-xs" style={{ color: '#5A5E82' }}>Live</span>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="grid grid-cols-4 gap-0 h-[calc(100%-44px)]">
                    {/* Sidebar */}
                    <div className="col-span-1 border-r p-4 space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      {['Overzicht', 'Leads', 'Analytics', 'Instellingen'].map((item, i) => (
                        <div
                          key={item}
                          className="px-3 py-2 rounded-lg text-xs"
                          style={{
                            background: i === 1 ? 'rgba(91,110,245,0.15)' : 'transparent',
                            color: i === 1 ? '#5B6EF5' : '#5A5E82',
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Main content */}
                    <div className="col-span-3 p-4 space-y-3">
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Leads vandaag', value: '12' },
                          { label: 'AI gescoord', value: '12' },
                          { label: 'Gem. score', value: '7.4' },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-lg p-3"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <div className="text-xs mb-1" style={{ color: '#5A5E82' }}>{stat.label}</div>
                            <div className="font-bricolage font-bold text-white text-xl">{stat.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Lead rows */}
                      <div className="space-y-2">
                        {[
                          { naam: 'Acme BV', score: 9, prioriteit: 'Hoog', sector: 'SaaS' },
                          { naam: 'Design Studio', score: 7, prioriteit: 'Middel', sector: 'Creatief' },
                          { naam: 'TechCorp', score: 8, prioriteit: 'Hoog', sector: 'Tech' },
                          { naam: 'LocalShop', score: 4, prioriteit: 'Laag', sector: 'Retail' },
                        ].map((lead) => (
                          <div
                            key={lead.naam}
                            className="flex items-center justify-between px-3 py-2 rounded-lg"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
                          >
                            <span className="text-xs text-white font-medium">{lead.naam}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs" style={{ color: '#5A5E82' }}>{lead.sector}</span>
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  background: lead.score >= 8
                                    ? 'rgba(91,245,130,0.12)'
                                    : lead.score >= 6
                                    ? 'rgba(245,181,91,0.12)'
                                    : 'rgba(245,91,91,0.12)',
                                  color: lead.score >= 8
                                    ? '#5BF582'
                                    : lead.score >= 6
                                    ? '#F5B55B'
                                    : '#F55B5B',
                                }}
                              >
                                {lead.score}/10
                              </span>
                            </div>
                          </div>
                        ))}
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
