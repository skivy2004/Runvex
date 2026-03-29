'use client'

import { useEffect, useRef } from 'react'

export default function HeroSection() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 25
      const y = (window.innerHeight / 2 - e.pageY) / 25
      canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`
      layersRef.current.forEach((layer, index) => {
        if (!layer) return
        const depth = (index + 1) * 15
        const moveX = x * (index + 1) * 0.2
        const moveY = y * (index + 1) * 0.2
        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`
      })
    }

    // Entrance animation
    canvas.style.opacity = '0'
    canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.8)'
    const timeout = setTimeout(() => {
      canvas.style.transition = 'all 2.5s cubic-bezier(0.16, 1, 0.3, 1)'
      canvas.style.opacity = '1'
      canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)'
    }, 300)

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

        .rv-hero {
          background-color: #0a0b0f;
          color: #e0e0e0;
          font-family: 'Syncopate', sans-serif;
          overflow: hidden;
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .rv-grain {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 100;
          opacity: 0.1;
        }

        .rv-viewport {
          perspective: 2000px;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: absolute;
          inset: 0;
        }

        .rv-canvas {
          position: relative;
          width: 800px;
          height: 500px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .rv-layer {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(91,110,245,0.08);
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        .rv-layer-1 {
          background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.2) brightness(0.3) hue-rotate(220deg) saturate(0.4);
        }
        .rv-layer-2 {
          background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(0.8) contrast(1.1) brightness(0.5) hue-rotate(220deg) saturate(0.6);
          opacity: 0.45;
          mix-blend-mode: screen;
        }
        .rv-layer-3 {
          background-image: url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(0.6) contrast(1.3) brightness(0.6) hue-rotate(220deg) saturate(0.5);
          opacity: 0.3;
          mix-blend-mode: overlay;
        }

        .rv-purple-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(91,110,245,0.18) 0%,
            rgba(123,111,240,0.08) 50%,
            rgba(10,11,15,0.6) 100%
          );
          transform: translateZ(5px);
          pointer-events: none;
        }

        .rv-contours {
          position: absolute;
          width: 200%; height: 200%;
          top: -50%; left: -50%;
          background-image: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0,
            transparent 40px,
            rgba(91,110,245,0.06) 41px,
            transparent 42px
          );
          transform: translateZ(120px);
          pointer-events: none;
        }

        .rv-interface {
          position: absolute;
          inset: 0;
          padding: 3rem 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto 1fr auto;
          z-index: 10;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .rv-interface { padding: 2rem 1.5rem; }
        }

        .rv-cta {
          pointer-events: auto;
          background: #5b6ef5;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: normal;
          border-radius: 0.5rem;
          transition: background 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .rv-cta:hover {
          background: #6b5ff8;
        }

        .rv-scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, rgba(91,110,245,0.8), transparent);
          animation: rv-flow 2s infinite ease-in-out;
        }

        @keyframes rv-flow {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50%       { transform: scaleY(1); transform-origin: top; }
          51%       { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>

      <div className="rv-hero">
        {/* Grain */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="rv-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div className="rv-grain" style={{ filter: 'url(#rv-grain)' }} />

        {/* Interface overlay */}
        <div className="rv-interface">
          {/* Top left — empty spacer */}
          <div />

          {/* Top right */}
          <div style={{ textAlign: 'right', fontFamily: 'monospace', color: '#5B6EF5', fontSize: '0.65rem', lineHeight: 1.8 }}>
            <div>LEADS VERWERKT: ∞</div>
            <div>RESPONSE TIME: &lt; 3 SEC</div>
          </div>

          {/* Bottom row */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', lineHeight: 1.9, color: '#5A5E82' }}>
              <p>[ DEMO BESCHIKBAAR ]</p>
              <p>LEAD AUTOMATISERING MET CLAUDE AI</p>
            </div>
            <a href="/demos/lead-automation/contact" className="rv-cta">
              Probeer demo's
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 3D scene */}
        <div className="rv-viewport">
          <div className="rv-canvas" ref={canvasRef}>
            <div className="rv-layer rv-layer-1" ref={(el) => { if (el) layersRef.current[0] = el }} />
            <div className="rv-layer rv-layer-2" ref={(el) => { if (el) layersRef.current[1] = el }} />
            <div className="rv-layer rv-layer-3" ref={(el) => { if (el) layersRef.current[2] = el }} />
            <div className="rv-purple-overlay" />
            <div className="rv-contours" />
          </div>
        </div>

        {/* Scroll line */}
        <div className="rv-scroll-hint" />
      </div>
    </>
  )
}
