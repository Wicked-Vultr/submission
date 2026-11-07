import type { RecommendationDraft } from '../types/research'
import { getFindings, weightedTotal, getComparison } from './findingsStorage'
import { logActivity } from './activityStorage'
import { readStorage, writeStorage } from './storage'

const KEY = 'eia_recommendations'

function loadAll(): RecommendationDraft[] {
  return readStorage<RecommendationDraft[]>(KEY) ?? []
}

export function getRecommendation(engagementId: string): RecommendationDraft | undefined {
  return loadAll().find((r) => r.engagementId === engagementId)
}

export function generateRecommendationDraft(
  engagementId: string,
  engagementTitle: string
): RecommendationDraft | null {
  const findings = getFindings(engagementId)
  if (findings.length === 0) return null

  const comparison = getComparison(engagementId)
  const ranked = [...findings].sort((a, b) => {
    if (!comparison) return b.depthScore - a.depthScore
    return weightedTotal(comparison, b.id) - weightedTotal(comparison, a.id)
  })

  const options = ranked.map((finding, index) => ({
    id: finding.id,
    engagementId,
    name: finding.name,
    description: finding.summary,
    estimatedCost: finding.pricing,
    feasibility: (finding.depthScore >= 0.82
      ? 'high'
      : finding.depthScore >= 0.75
        ? 'medium'
        : 'low') as 'high' | 'medium' | 'low',
    riskLevel: (finding.validationStatus === 'supported'
      ? 'low'
      : finding.validationStatus === 'uncertain'
        ? 'medium'
        : 'high') as 'low' | 'medium' | 'high',
    pros: finding.pros.split(';').filter(Boolean).length
      ? finding.pros.split(';').map((s) => s.trim())
      : [finding.pros],
    cons: finding.cons.split(';').filter(Boolean).length
      ? finding.cons.split(';').map((s) => s.trim())
      : [finding.cons],
    scoreExplanation: comparison
      ? `Weighted score ${weightedTotal(comparison, finding.id)}/100 using workspace criteria.`
      : `Depth score ${Math.round(finding.depthScore * 100)}% from CHRONICLE.`,
    recommended: index === 0,
  }))

  const draft: RecommendationDraft = {
    engagementId,
    version: (getRecommendation(engagementId)?.version ?? 0) + 1,
    summary: `Based on validated research for "${engagementTitle}", ${ranked[0].name} is the preferred option for balanced fit, cost, and evidence quality.`,
    rationale:
      'Recommendation weighs requirement fit, cost, adoption time, support, and evidence confidence. Expert must confirm before customer sharing.',
    status: 'draft',
    options,
    updatedAt: new Date().toISOString(),
  }

  const rest = loadAll().filter((r) => r.engagementId !== engagementId)
  writeStorage(KEY, [...rest, draft])
  logActivity(`Recommendation draft v${draft.version} generated`, engagementId)
  return draft
}

export function markRecommendationShared(engagementId: string): void {
  const draft = getRecommendation(engagementId)
  if (!draft) return
  const updated = { ...draft, status: 'expert_review' as const, updatedAt: new Date().toISOString() }
  const rest = loadAll().filter((r) => r.engagementId !== engagementId)
  writeStorage(KEY, [...rest, updated])
}
