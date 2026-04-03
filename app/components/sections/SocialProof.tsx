export default function SocialProof() {
  const items = [
    '✦ 500+ leads verwerkt',
    '✦ Gemiddelde responstijd: < 3 sec',
    '✦ Setup in minder dan 10 minuten',
    '✦ Gebruikt door freelancers & MKB in Nederland',
  ]

  return (
    <div
      style={{
        background: '#12141A',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
      className="py-3"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {items.map((item, i) => (
            <span key={i} className="text-sm" style={{ color: '#8A8FA8' }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
