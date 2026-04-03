import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { Intro } from './scenes/Intro'
import { FormScene } from './scenes/FormScene'
import { LeadScene } from './scenes/LeadScene'
import { ScoringScene } from './scenes/ScoringScene'
import { EmailScene } from './scenes/EmailScene'
import { Outro } from './scenes/Outro'

// Scene timing at 30fps
// 0   - 120:  Intro         (0s - 4s)
// 90  - 390:  Form          (3s - 13s)
// 360 - 540:  Lead notify   (12s - 18s)
// 510 - 870:  AI scoring    (17s - 29s)
// 840 - 1140: Email         (28s - 38s)
// 1110 - 1350: Outro        (37s - 45s)

export const DEMO_FPS = 30
export const DEMO_DURATION_FRAMES = 1350 // 45 seconds

const SCENES = {
  intro:   { start: 0,    end: 120  },
  form:    { start: 90,   end: 390  },
  lead:    { start: 360,  end: 540  },
  scoring: { start: 510,  end: 870  },
  email:   { start: 840,  end: 1140 },
  outro:   { start: 1110, end: 1350 },
}

function SceneWrapper({ start, end, children }: { start: number; end: number; children: React.ReactNode }) {
  const frame = useCurrentFrame()
  if (frame < start || frame > end) return null
  return <>{children}</>
}

export function DemoComposition() {
  const frame = useCurrentFrame()

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0A0B0F',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

      <SceneWrapper {...SCENES.intro}>
        <Intro />
      </SceneWrapper>

      <SceneWrapper {...SCENES.form}>
        <FormScene relativeFrame={frame - SCENES.form.start} />
      </SceneWrapper>

      <SceneWrapper {...SCENES.lead}>
        <LeadScene relativeFrame={frame - SCENES.lead.start} />
      </SceneWrapper>

      <SceneWrapper {...SCENES.scoring}>
        <ScoringScene relativeFrame={frame - SCENES.scoring.start} />
      </SceneWrapper>

      <SceneWrapper {...SCENES.email}>
        <EmailScene relativeFrame={frame - SCENES.email.start} />
      </SceneWrapper>

      <SceneWrapper {...SCENES.outro}>
        <Outro relativeFrame={frame - SCENES.outro.start} />
      </SceneWrapper>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ height: '100%', width: `${(frame / DEMO_DURATION_FRAMES) * 100}%`, background: '#5B6EF5', transition: 'none' }} />
      </div>
    </div>
  )
}
