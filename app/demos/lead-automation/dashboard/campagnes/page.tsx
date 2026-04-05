import { Metadata } from 'next'
import CampagnesClient from './CampagnesClient'

export const metadata: Metadata = { title: 'E-mail Campagnes — Runvex Dashboard' }

export default function CampagnesPage() {
  return <CampagnesClient />
}
