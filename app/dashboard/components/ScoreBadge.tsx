export default function ScoreBadge({ score }: { score: string | null }) {
  const s = (score || 'laag').toLowerCase()
  const styles: Record<string, { background: string; color: string }> = {
    hoog: { background: 'rgba(91,110,245,0.15)', color: '#A99FF5' },
    middel: { background: 'rgba(236,178,46,0.12)', color: '#ECB22E' },
    laag: { background: 'rgba(255,255,255,0.06)', color: '#5A5E82' },
  }
  const style = styles[s] || styles.laag
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={style}
    >
      {s}
    </span>
  )
}
