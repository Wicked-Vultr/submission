import type { ResearchPhaseState } from '../../types/engagement'

/** CHRONICLE eight-phase pipeline labels (aligned with backend chronicle_adapter). */
export const CHRONICLE_PHASES: Omit<ResearchPhaseState, 'status'>[] = [
  {
    id: 'plan',
    label: 'Plan',
    description: 'Research strategy and targeted queries',
  },
  {
    id: 'discover',
    label: 'Discover',
    description: 'Candidate tools, vendors, and options',
  },
  {
    id: 'deep_dive',
    label: 'Deep dive',
    description: 'Pricing, features, reviews per entity',
  },
  {
    id: 'compare',
    label: 'Compare',
    description: 'Head-to-head option analysis',
  },
  {
    id: 'validate',
    label: 'Validate',
    description: 'Cross-check sources and claims',
  },
  {
    id: 'score',
    label: 'Score',
    description: 'Semantic quality evaluation',
  },
  {
    id: 'self_correct',
    label: 'Self-correct',
    description: 'Re-research shallow findings',
  },
  {
    id: 'synthesize',
    label: 'Synthesize',
    description: 'Executive summary and recommendations input',
  },
]

export function createInitialPhases(): ResearchPhaseState[] {
  return CHRONICLE_PHASES.map((phase) => ({ ...phase, status: 'pending' }))
}
