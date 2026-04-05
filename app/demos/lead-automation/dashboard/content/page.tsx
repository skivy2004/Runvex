import { Metadata } from 'next'
import ContentClient from './ContentClient'

export const metadata: Metadata = { title: 'LinkedIn Content — Runvex Dashboard' }

export default function ContentPage() {
  return <ContentClient />
}
