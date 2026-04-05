import { Metadata } from 'next'
import SlackClient from './SlackClient'

export const metadata: Metadata = { title: 'Slack Alerts — Runvex Dashboard' }

export default function SlackPage() {
  return <SlackClient />
}
