import { Metadata } from 'next'
import CalendlyClient from './CalendlyClient'

export const metadata: Metadata = { title: 'Calendly Integratie — Runvex Dashboard' }

export default function CalendlyPage() {
  return <CalendlyClient />
}
