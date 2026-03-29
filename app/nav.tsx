import Link from 'next/link'

export default function Nav() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href="/demos/lead-automation/dashboard"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors">
        Dashboard →
      </Link>
    </div>
  )
}
