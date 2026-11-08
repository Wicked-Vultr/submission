import type {
  ComparisonScores,
  EntityFinding,
  ResearchSource,
} from '../types/research'
import { logActivity } from './activityStorage'
import { readStorage, writeStorage } from './storage'

const FINDINGS_KEY = 'eia_findings'
const SOURCES_KEY = 'eia_sources'
const COMPARISON_KEY = 'eia_comparison'

const DEMO_ENTITIES = [
  {
    name: 'Notion',
    summary: 'Flexible workspace combining docs, tasks, and lightweight databases.',
    pricing: 'Free tier; Plus ~$10/user/mo; Business ~$18/user/mo',
    features: 'Wiki, databases, templates, AI assistant',
    pros: 'Highly flexible; strong for documentation',
    cons: 'Learning curve for advanced setups',
    depthScore: 0.86,
    confidence: 0.82,
    validationStatus: 'supported' as const,
  },
  {
    name: 'Asana',
    summary: 'Task and project tracking focused on team coordination.',
    pricing: 'Basic free; Premium ~$10.99/user/mo; Business ~$24.99/user/mo',
    features: 'Tasks, timelines, portfolios, automations',
    pros: 'Clear task ownership; mature reporting',
    cons: 'Less suited as a primary knowledge base',
    depthScore: 0.81,
    confidence: 0.78,
    validationStatus: 'supported' as const,
  },
  {
    name: 'ClickUp',
    summary: 'All-in-one productivity hub with views and docs.',
    pricing: 'Free tier; Unlimited ~$7/user/mo; Business ~$12/user/mo',
    features: 'Tasks, docs, goals, time tracking, dashboards',
    pros: 'Feature-rich; competitive pricing',
    cons: 'Can feel busy; performance varies by workspace size',
    depthScore: 0.79,
    confidence: 0.74,
    validationStatus: 'uncertain' as const,
  },
]

export function seedFindingsForEngagement(engagementId: string, title: string): void {
  if (getFindings(engagementId).length > 0) return

  const accessedAt = new Date().toISOString()
  const sources: ResearchSource[] = DEMO_ENTITIES.map((entity, index) => ({
    id: `${engagementId}-src-${index}`,
    url: `https://example.com/research/${entity.name.toLowerCase().replace(/\s+/g, '-')}`,
    title: `${entity.name} — official pricing & features`,
    publisher: 'Public web (demo)',
    accessedAt,
  }))

  const findings: EntityFinding[] = DEMO_ENTITIES.map((entity, index) => ({
    id: `${engagementId}-finding-${index}`,
    engagementId,
    ...entity,
    sourceIds: [sources[index].id],
  }))

  const allSources = loadAllSources().filter((s) => !s.id.startsWith(engagementId))
  const allFindings = loadAllFindings().filter((f) => f.engagementId !== engagementId)

  writeStorage(SOURCES_KEY, [...allSources, ...sources])
  writeStorage(FINDINGS_KEY, [...allFindings, ...findings])

  const comparison: ComparisonScores = {
    engagementId,
    criteria: [
      { id: 'fit', label: 'Requirement fit', weight: 30 },
      { id: 'cost', label: 'Total cost / value', weight: 25 },
      { id: 'delivery', label: 'Time to adopt', weight: 20 },
      { id: 'support', label: 'Support & ecosystem', weight: 15 },
      { id: 'evidence', label: 'Evidence confidence', weight: 10 },
    ],
    scores: {
      fit: { [findings[0].id]: 88, [findings[1].id]: 82, [findings[2].id]: 85 },
      cost: { [findings[0].id]: 75, [findings[1].id]: 70, [findings[2].id]: 90 },
      delivery: { [findings[0].id]: 80, [findings[1].id]: 85, [findings[2].id]: 72 },
      support: { [findings[0].id]: 78, [findings[1].id]: 84, [findings[2].id]: 76 },
      evidence: { [findings[0].id]: 90, [findings[1].id]: 85, [findings[2].id]: 70 },
    },
    updatedAt: accessedAt,
  }

  const comparisons = loadAllComparisons().filter((c) => c.engagementId !== engagementId)
  writeStorage(COMPARISON_KEY, [...comparisons, comparison])

  logActivity(`Supplier research completed for "${title}"`, engagementId)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('eia-findings-updated', { detail: engagementId }))
  }
}

function loadAllFindings(): EntityFinding[] {
  return readStorage<EntityFinding[]>(FINDINGS_KEY) ?? []
}

function loadAllSources(): ResearchSource[] {
  return readStorage<ResearchSource[]>(SOURCES_KEY) ?? []
}

function loadAllComparisons(): ComparisonScores[] {
  return readStorage<ComparisonScores[]>(COMPARISON_KEY) ?? []
}

export function getFindings(engagementId: string): EntityFinding[] {
  return loadAllFindings().filter((f) => f.engagementId === engagementId)
}

export function getSourcesForEngagement(engagementId: string): ResearchSource[] {
  const findingSourceIds = new Set(
    getFindings(engagementId).flatMap((f) => f.sourceIds)
  )
  return loadAllSources().filter((s) => findingSourceIds.has(s.id))
}

export function getComparison(engagementId: string): ComparisonScores | undefined {
  return loadAllComparisons().find((c) => c.engagementId === engagementId)
}

export function weightedTotal(
  comparison: ComparisonScores,
  findingId: string
): number {
  let total = 0
  let weights = 0
  for (const criterion of comparison.criteria) {
    const score = comparison.scores[criterion.id]?.[findingId]
    if (score !== undefined) {
      total += score * (criterion.weight / 100)
      weights += criterion.weight
    }
  }
  return weights ? Math.round(total) : 0
}
