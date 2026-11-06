import './ComparisonTable.css'
import type { ComparisonScores, EntityFinding } from '../types/research'
import { weightedTotal } from '../lib/findingsStorage'

interface ComparisonTableProps {
  findings: EntityFinding[]
  comparison: ComparisonScores
}

export default function ComparisonTable({
  findings,
  comparison,
}: ComparisonTableProps) {
  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Criterion (weight)</th>
            {findings.map((f) => (
              <th key={f.id}>
                {f.name}
                <span className="comparison-total">
                  {weightedTotal(comparison, f.id)}/100
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.criteria.map((criterion) => (
            <tr key={criterion.id}>
              <td>
                {criterion.label}{' '}
                <span className="criterion-weight">{criterion.weight}%</span>
              </td>
              {findings.map((finding) => (
                <td key={finding.id}>
                  {comparison.scores[criterion.id]?.[finding.id] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
