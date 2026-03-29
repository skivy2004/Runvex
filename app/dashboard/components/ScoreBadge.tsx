export default function ScoreBadge({ score }: { score: string | null }) {
  const map: Record<string, string> = {
    hoog: 'bg-green-100 text-green-800',
    middel: 'bg-yellow-100 text-yellow-800',
    laag: 'bg-gray-100 text-gray-600',
  }
  const s = (score || 'laag').toLowerCase()
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[s] || map.laag}`}>
      {s}
    </span>
  )
}
