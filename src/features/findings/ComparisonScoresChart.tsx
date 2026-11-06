import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import type { EntityFinding, ComparisonScores } from '../../types/research'
import { weightedTotal } from '../../lib/findingsStorage'
import './ComparisonScoresChart.css'

interface ComparisonScoresChartProps {
  findings: EntityFinding[]
  comparison: ComparisonScores
}

export default function ComparisonScoresChart({
  findings,
  comparison,
}: ComparisonScoresChartProps) {
  const data = findings.map((f) => ({
    name: f.name.length > 18 ? `${f.name.slice(0, 16)}…` : f.name,
    fullName: f.name,
    score: weightedTotal(comparison, f.id),
  }))

  return (
    <div className="comparison-scores-chart" aria-label="Weighted comparison scores">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value) => [`${value ?? 0}/100`, 'Weighted score']}
            labelFormatter={(_, payload) =>
              (payload?.[0]?.payload as { fullName?: string } | undefined)
                ?.fullName ?? ''
            }
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="score" fill="#7c3aed" radius={[0, 6, 6, 0]} name="Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
