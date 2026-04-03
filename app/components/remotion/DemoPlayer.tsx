'use client'

import { Player } from '@remotion/player'
import { DemoComposition, DEMO_FPS, DEMO_DURATION_FRAMES } from './DemoComposition'

export default function DemoPlayer() {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(91,110,245,0.2)',
        boxShadow: '0 0 60px rgba(91,110,245,0.08)',
      }}
    >
      <Player
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
      />
    </div>
  )
}
