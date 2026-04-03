export default function Integrations() {
  const integrations = [
    { name: 'Slack', soon: false },
    { name: 'HubSpot', soon: false },
    { name: 'Pipedrive', soon: false },
    { name: 'Gmail', soon: false },
    { name: 'Notion', soon: false },
    { name: 'Zapier', soon: false },
    { name: 'Calendly', soon: true },
    { name: 'Hunter.io', soon: true },
  ]

  return (
    <section id="integraties" className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              background: 'rgba(91,110,245,0.1)',
              border: '1px solid rgba(91,110,245,0.2)',
              color: '#5B6EF5',
            }}
          >
            INTEGRATIES
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            Werkt met jouw bestaande tools.
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#8A8FA8' }}>
            Koppel Runvex in minuten aan de tools die je al gebruikt.
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center rounded-xl px-5 py-3 text-white text-sm font-medium"
              style={{
                background: '#12141A',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {integration.name}
              {integration.soon && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full ml-2"
                  style={{
                    background: 'rgba(91,110,245,0.2)',
                    color: '#5B6EF5',
                  }}
                >
                  Binnenkort
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
