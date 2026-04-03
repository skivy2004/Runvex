'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const DEMO_VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || ''

const steps = [
  { num: '01', label: 'Lead komt binnen via formulier' },
  { num: '02', label: 'Claude AI scoort en analyseert de lead' },
  { num: '03', label: 'Follow-up e-mail verstuurd in < 60 sec' },
]

function VideoEmbed({ url }: { url: string }) {
  // Support Loom and YouTube
  let src = url
  if (url.includes('loom.com/share/')) {
    src = url.replace('loom.com/share/', 'loom.com/embed/')
  } else if (url.includes('youtube.com/watch?v=')) {
    const id = new URL(url).searchParams.get('v')
    src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
  } else if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0]
    src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
  }

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full rounded-2xl"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{ border: 'none' }}
      />
    </div>
  )
}

function VideoPlaceholder() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: '#0C0E1B',
        border: '1px solid rgba(91,110,245,0.2)',
        aspectRatio: '16/9',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Fake dashboard background */}
      <div className="absolute inset-0 flex">
        {/* Sidebar */}
        <div className="w-[18%] h-full flex flex-col gap-3 p-3" style={{ background: '#080910', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#5B6EF5,#3B4FD5)' }}>
              <svg width="8" height="8" viewBox="0 0 16 16" fill="none"><path d="M4 3h4.5a3.5 3.5 0 0 1 0 7H7l4 3M4 3v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="h-1.5 rounded-full w-10" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
          {[40, 32, 36, 28, 40].map((w, i) => (
            <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'opacity-100' : 'opacity-30'}`} style={{ width: `${w}%`, background: i === 0 ? '#5B6EF5' : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-3 flex flex-col gap-2">
          <div className="flex gap-2">
            {['#5B6EF5', '#3ECF8E', '#F5A623', 'rgba(255,255,255,0.15)'].map((bg, i) => (
              <div key={i} className="flex-1 rounded-lg p-2 flex flex-col gap-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-1 rounded w-1/2" style={{ background: 'rgba(255,255,255,0.2)' }} />
                <div className="h-2 rounded w-3/4 mt-1" style={{ background: bg, opacity: i < 3 ? 0.7 : 0.3 }} />
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-col gap-1.5 p-2">
              {[85, 70, 60].map((score, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: `rgba(${i === 0 ? '91,110,245' : i === 1 ? '62,207,142' : '245,166,35'},0.3)` }} />
                  <div className="flex-1 h-1 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded" style={{ width: `${score}%`, background: `rgba(${i === 0 ? '91,110,245' : i === 1 ? '62,207,142' : '245,166,35'},0.6)` }} />
                  </div>
                  <div className="text-[6px] font-bold" style={{ color: i === 0 ? '#5B6EF5' : i === 1 ? '#3ECF8E' : '#F5A623' }}>{score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,11,31,0.6) 0%, rgba(10,11,31,0.3) 100%)' }} />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className="w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center"
            style={{
              background: hovered ? '#6B5FF8' : 'var(--purple)',
              boxShadow: '0 0 40px rgba(91,110,245,0.5)',
              transition: 'background 0.2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-white/60">Demo video — binnenkort beschikbaar</span>
        </motion.div>
      </div>

      {/* Duration badge */}
      <div
        className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-xs font-medium"
        style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}
      >
        ~90 sec
      </div>
    </div>
  )
}

export default function DemoVideo() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="demo-video" className="py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: 'rgba(91,110,245,0.1)',
              border: '1px solid rgba(91,110,245,0.2)',
              color: '#5B6EF5',
            }}
          >
            Zie het in actie
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Van lead tot follow-up
            <br />
            in 60 seconden
          </h2>
          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--text-2)' }}>
            Bekijk hoe een binnenkomende lead automatisch door Claude AI wordt gescoord en een gepersonaliseerde follow-up ontvangt.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {DEMO_VIDEO_URL && playing ? (
            <VideoEmbed url={DEMO_VIDEO_URL} />
          ) : (
            <div onClick={() => DEMO_VIDEO_URL && setPlaying(true)}>
              <VideoPlaceholder />
            </div>
          )}
        </motion.div>

        {/* Steps below video */}
        <motion.div
          className="grid grid-cols-3 gap-4 mt-8"
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center gap-2">
              <div
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(91,110,245,0.12)',
                  border: '1px solid rgba(91,110,245,0.25)',
                  color: '#5B6EF5',
                }}
              >
                {step.num}
              </div>
              <p className="text-xs md:text-sm" style={{ color: 'var(--text-2)' }}>
                {step.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
