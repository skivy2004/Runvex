import { Metadata } from 'next'
import SettingsClient from './SettingsClient'

export const metadata: Metadata = { title: 'Instellingen — Runvex Dashboard' }

export default function InstellingenPage() {
  return <SettingsClient />
}
