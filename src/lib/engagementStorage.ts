import type { Engagement, LegacyEngagement } from '../types/engagement'
import { normalizeEngagement } from '../types/engagement'
import { readStorage, writeStorage } from './storage'

const STORAGE_KEY = 'eia_engagements'

export function getEngagements(): Engagement[] {
  const parsed = readStorage<Array<Engagement | LegacyEngagement>>(STORAGE_KEY)
  if (!parsed) return []

  const engagements = parsed.map(normalizeEngagement)
  writeStorage(STORAGE_KEY, engagements)
  return engagements
}

export function getEngagementById(id: string): Engagement | undefined {
  return getEngagements().find((engagement) => engagement.id === id)
}

export function saveEngagement(engagement: Engagement): void {
  const engagements = getEngagements()
  engagements.push(engagement)
  writeStorage(STORAGE_KEY, engagements)
}

export function updateEngagement(updated: Engagement): void {
  const engagements = getEngagements().map((item) =>
    item.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : item
  )
  writeStorage(STORAGE_KEY, engagements)
}
