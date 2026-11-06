import { lazy, Suspense } from 'react'
import type { EngagementStatus } from '../../types/engagement'

const EngagementStatusChart = lazy(() => import('./EngagementStatusChart'))

interface LazyEngagementStatusChartProps {
  counts: Record<EngagementStatus, number>
}

export default function LazyEngagementStatusChart(
  props: LazyEngagementStatusChartProps
) {
  return (
    <Suspense
      fallback={
        <div
          className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground"
          aria-hidden
        >
          Loading chart…
        </div>
      }
    >
      <EngagementStatusChart {...props} />
    </Suspense>
  )
}
