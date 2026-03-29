export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Stats skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-3" />
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
