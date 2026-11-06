export type EngagementStatus =
  | 'draft'
  | 'scoping'
  | 'research'
  | 'review'
  | 'approved'
  | 'closed'

export interface Engagement {
  id: string
  title: string
  customerId: string
  problemStatement: string
  objectives: string
  constraints: string
  successMetrics: string
  stakeholders: string
  status: EngagementStatus
  createdAt: string
  updatedAt: string
}

/** Maps legacy stored shapes before problemStatement field existed. */
export interface LegacyEngagement {
  id: string
  title: string
  customerId: string
  problem: string
  objectives: string
  constraints: string
  stakeholders: string
  status: string
  createdAt: string
}

export function normalizeEngagement(
  item: Engagement | LegacyEngagement
): Engagement {
  if ('updatedAt' in item && 'problemStatement' in item) {
    return item as Engagement
  }

  const legacy = item as LegacyEngagement
  const status = legacy.status as EngagementStatus

  return {
    id: legacy.id,
    title: legacy.title,
    customerId: legacy.customerId,
    problemStatement: legacy.problem,
    objectives: legacy.objectives || '',
    constraints: legacy.constraints || '',
    successMetrics: '',
    stakeholders: legacy.stakeholders || '',
    status: [
      'draft',
      'scoping',
      'research',
      'review',
      'approved',
      'closed',
    ].includes(status)
      ? status
      : 'draft',
    createdAt: legacy.createdAt,
    updatedAt: legacy.createdAt,
  }
}

export type ResearchPhaseId =
  | 'plan'
  | 'discover'
  | 'deep_dive'
  | 'compare'
  | 'validate'
  | 'score'
  | 'self_correct'
  | 'synthesize'

export type ResearchJobStatus = 'idle' | 'running' | 'completed' | 'failed'

export interface ResearchPhaseState {
  id: ResearchPhaseId
  label: string
  description: string
  status: 'pending' | 'active' | 'done' | 'skipped'
}

export interface ResearchJobSnapshot {
  jobId: string | null
  engagementId: string
  status: ResearchJobStatus
  currentPhase: ResearchPhaseId | null
  progressPercent: number
  phases: ResearchPhaseState[]
  errorMessage: string | null
  startedAt: string | null
  finishedAt: string | null
}
