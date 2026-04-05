import { timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still run comparison to avoid leaking length info via timing
    timingSafeEqual(Buffer.from(a), Buffer.from(a))
    return false
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export function checkDashboardSecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-dashboard-secret')
  const expected = process.env.DASHBOARD_SECRET
  if (!secret || !expected) return false
  return safeCompare(secret, expected)
}

export function checkReportSecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-report-secret')
  const expected = process.env.REPORT_SECRET
  if (!secret || !expected) return false
  return safeCompare(secret, expected)
}
