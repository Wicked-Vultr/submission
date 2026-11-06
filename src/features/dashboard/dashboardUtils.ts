import type { EngagementStatus } from '../../types/engagement'

const STATUS_ORDER: EngagementStatus[] = [
  'draft',
  'scoping',
  'research',
  'review',
  'approved',
  'closed',
]

/** Derive a demo progress % from lifecycle status for dashboard rows. */
export function engagementProgressPercent(status: EngagementStatus): number {
  const idx = STATUS_ORDER.indexOf(status)
  const safe = idx < 0 ? 0 : idx
  return Math.min(100, Math.round(((safe + 1) / STATUS_ORDER.length) * 100))
}
