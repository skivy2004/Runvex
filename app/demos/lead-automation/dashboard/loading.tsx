export default function Loading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="h-7 w-52 rounded-lg animate-pulse mb-3" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <div className="h-6 w-36 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="h-9 w-36 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl p-5" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-xl animate-pulse mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="h-3 w-24 rounded animate-pulse mb-2" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="h-8 w-12 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-2 rounded-xl p-5 h-48 animate-pulse" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }} />
        <div className="lg:col-span-3 rounded-xl p-5 h-48 animate-pulse" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      {/* Table */}
      <div className="rounded-xl p-5 space-y-3" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-4 w-24 rounded animate-pulse mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
        ))}
      </div>
    </div>
  )
}
