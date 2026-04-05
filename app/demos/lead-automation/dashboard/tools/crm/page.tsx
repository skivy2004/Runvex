import { Metadata } from 'next'
import CrmClient from './CrmClient'

export const metadata: Metadata = { title: 'CRM Integratie — Runvex Dashboard' }

export default function CrmPage() {
  return <CrmClient />
}
