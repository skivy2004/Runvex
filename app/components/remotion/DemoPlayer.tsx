'use client'

import { useEffect, useRef } from 'react'
import { Player, PlayerRef } from '@remotion/player'
import { DemoComposition, DEMO_FPS, DEMO_DURATION_FRAMES } from './DemoComposition'

export default function DemoPlayer() {
  const playerRef = useRef<PlayerRef>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playerRef.current?.play()
        } else {
          playerRef.current?.pause()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(91,110,245,0.2)',
        boxShadow: '0 0 60px rgba(91,110,245,0.08)',
      }}
    >
      <Player
        ref={playerRef}
        component={DemoComposition}
        durationInFrames={DEMO_DURATION_FRAMES}
        compositionWidth={1280}
        compositionHeight={720}
        fps={DEMO_FPS}
        style={{ width: '100%' }}
        controls
        loop
        autoPlay={false}
        clickToPlay
        showVolumeControls={false}
        playbackRate={1.5}
      />
    </div>
  )
}
