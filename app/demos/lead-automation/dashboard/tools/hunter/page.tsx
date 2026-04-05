import { Metadata } from 'next'
import HunterClient from './HunterClient'

export const metadata: Metadata = { title: 'Hunter.io Verrijking — Runvex Dashboard' }

export default function HunterPage() {
  return <HunterClient />
}
