import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import type { EngagementStatus } from '../../types/engagement'
import './EngagementStatusChart.css'

const LABELS: Record<EngagementStatus, string> = {
  draft: 'Draft',
  scoping: 'Scoping',
  research: 'Research',
  review: 'Review',
  approved: 'Approved',
  closed: 'Closed',
}

interface EngagementStatusChartProps {
  counts: Record<EngagementStatus, number>
}

export default function EngagementStatusChart({
  counts,
}: EngagementStatusChartProps) {
  const data = (Object.keys(LABELS) as EngagementStatus[]).map((key) => ({
    status: LABELS[key],
    count: counts[key],
  }))

  const total = data.reduce((sum, row) => sum + row.count, 0)

  if (total === 0) {
    return (
      <p className="chart-empty">
        Chart appears when you have at least one engagement.
      </p>
    )
  }

  return (
    <div className="engagement-status-chart" aria-label="Engagements by status">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <XAxis dataKey="status" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} width={32} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            formatter={(value) => [value ?? 0, 'Engagements']}
          />
          <Bar dataKey="count" name="Engagements" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
