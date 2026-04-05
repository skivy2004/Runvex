export default function About() {
  return (
    <section id="over" className="py-14 md:py-20" style={{ background: '#0A0B0F' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-10 items-center">
          {/* Left column — photo */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/jeremy.jpg"
              alt="Jeremy — oprichter Runvex"
              className="w-64 h-80 md:w-80 md:h-96 object-cover rounded-2xl flex-shrink-0"
              style={{ border: '1px solid rgba(91,110,245,0.2)' }}
            />
          </div>

          {/* Right column — copy */}
          <div>
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
              style={{
                background: 'rgba(91,110,245,0.1)',
                border: '1px solid rgba(91,110,245,0.2)',
                color: '#5B6EF5',
              }}
            >
              Over Runvex
            </div>
            <h2
              className="font-bricolage font-extrabold text-2xl md:text-4xl text-white mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              Gebouwd door een ondernemer, voor ondernemers.
            </h2>
            <div className="space-y-4">
              <p className="text-[#8A8FA8] leading-relaxed">
                Runvex is ontstaan uit frustratie. Als freelancer merkte ik dat ik uren per week kwijt was aan het
                handmatig opvolgen van leads — terwijl de beste leads ondertussen naar een concurrent gingen.
              </p>
              <p className="text-[#8A8FA8] leading-relaxed">
                Ik heb Runvex gebouwd om dat probleem op te lossen: een systeem dat elke lead direct scoort, opvolgt en
                in je CRM zet — zonder dat jij er iets voor hoeft te doen.
              </p>
              <p className="text-[#8A8FA8] leading-relaxed">
                Geen groot team. Geen VC-geld. Gewoon een tool die werkt, gebouwd door iemand die hetzelfde probleem had
                als jij.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
