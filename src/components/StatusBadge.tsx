import type { EngagementStatus } from '../types/engagement'
import './StatusBadge.css'

const LABELS: Record<EngagementStatus, string> = {
  draft: 'Draft',
  scoping: 'Scoping',
  research: 'Research',
  review: 'In review',
  approved: 'Approved',
  closed: 'Closed',
}

interface StatusBadgeProps {
  status: EngagementStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {LABELS[status]}
    </span>
  )
}
