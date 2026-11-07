import type { RoadmapItem } from '../types/research'
import { getRecommendation } from './recommendationsStorage'
import { logActivity } from './activityStorage'
import { readStorage, writeStorage } from './storage'

const KEY = 'eia_roadmap'

function loadAll(): RoadmapItem[] {
  return readStorage<RoadmapItem[]>(KEY) ?? []
}

export function getRoadmapItems(engagementId: string): RoadmapItem[] {
  return loadAll().filter((item) => item.engagementId === engagementId)
}

export function generateRoadmapFromRecommendation(engagementId: string): RoadmapItem[] {
  const rec = getRecommendation(engagementId)
  const preferred = rec?.options.find((o) => o.recommended)?.name ?? 'Selected solution'

  const items: RoadmapItem[] = [
    {
      id: `${engagementId}-rm-1`,
      engagementId,
      title: `Finalize decision: ${preferred}`,
      owner: 'Expert',
      dueDate: offsetDays(14),
      dependencies: 'Approved recommendation',
      status: 'planned',
      phase: 'Decision',
    },
    {
      id: `${engagementId}-rm-2`,
      engagementId,
      title: 'Pilot with one team (10–15 users)',
      owner: 'Customer IT',
      dueDate: offsetDays(30),
      dependencies: 'Procurement / security review',
      status: 'planned',
      phase: 'Pilot',
    },
    {
      id: `${engagementId}-rm-3`,
      engagementId,
      title: 'Training & rollout playbook',
      owner: 'Expert',
      dueDate: offsetDays(45),
      dependencies: 'Pilot feedback',
      status: 'planned',
      phase: 'Rollout',
    },
    {
      id: `${engagementId}-rm-4`,
      engagementId,
      title: 'Measure success metrics & retrospective',
      owner: 'Customer stakeholder',
      dueDate: offsetDays(75),
      dependencies: 'Rollout complete',
      status: 'planned',
      phase: 'Measure',
    },
  ]

  const rest = loadAll().filter((i) => i.engagementId !== engagementId)
  writeStorage(KEY, [...rest, ...items])
  logActivity('Implementation roadmap generated', engagementId)
  return items
}

function offsetDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
