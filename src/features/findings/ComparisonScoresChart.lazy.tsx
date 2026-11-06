import { lazy, Suspense } from 'react'
import type { EntityFinding, ComparisonScores } from '../../types/research'

const ComparisonScoresChart = lazy(() => import('./ComparisonScoresChart'))

interface LazyComparisonScoresChartProps {
  findings: EntityFinding[]
  comparison: ComparisonScores
}

export default function LazyComparisonScoresChart(
  props: LazyComparisonScoresChartProps
) {
  return (
    <Suspense
      fallback={
        <div
          className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground"
          aria-hidden
        >
          Loading chart…
        </div>
      }
    >
      <ComparisonScoresChart {...props} />
    </Suspense>
  )
}
