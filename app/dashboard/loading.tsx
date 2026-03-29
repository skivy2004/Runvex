export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0B0F' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 rounded-lg animate-pulse mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-4 w-24 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>

        {/* Stats skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-5" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="h-3 w-24 rounded animate-pulse mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-8 w-12 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
