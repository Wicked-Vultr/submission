export type ValidationStatus = 'supported' | 'uncertain' | 'conflicting' | 'missing'

export interface ResearchSource {
  id: string
  url: string
  title: string
  publisher: string
  accessedAt: string
}

export interface EntityFinding {
  id: string
  engagementId: string
  name: string
  summary: string
  pricing: string
  features: string
  pros: string
  cons: string
  depthScore: number
  confidence: number
  validationStatus: ValidationStatus
  sourceIds: string[]
}

export interface ComparisonCriterion {
  id: string
  label: string
  weight: number
}

export interface ComparisonScores {
  engagementId: string
  criteria: ComparisonCriterion[]
  scores: Record<string, Record<string, number>>
  updatedAt: string
}

export interface SolutionOption {
  id: string
  engagementId: string
  name: string
  description: string
  estimatedCost: string
  feasibility: 'high' | 'medium' | 'low'
  riskLevel: 'low' | 'medium' | 'high'
  pros: string[]
  cons: string[]
  scoreExplanation: string
  recommended: boolean
}

export interface RecommendationDraft {
  engagementId: string
  version: number
  summary: string
  rationale: string
  status: 'draft' | 'expert_review' | 'shared' | 'approved'
  options: SolutionOption[]
  updatedAt: string
}

export interface RoadmapItem {
  id: string
  engagementId: string
  title: string
  owner: string
  dueDate: string
  dependencies: string
  status: 'planned' | 'in_progress' | 'done' | 'blocked'
  phase: string
}

export interface CustomerReviewState {
  engagementId: string
  decision: 'pending' | 'approved' | 'changes_requested'
  customerComment: string
  decidedAt: string | null
}

export interface ActivityEvent {
  id: string
  message: string
  createdAt: string
  engagementId?: string
}
