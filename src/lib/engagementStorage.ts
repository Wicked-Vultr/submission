import type { Engagement, LegacyEngagement } from '../types/engagement'
import { normalizeEngagement } from '../types/engagement'

const STORAGE_KEY = 'eia_engagements'

export function getEngagements(): Engagement[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []

  try {
    const parsed = JSON.parse(data) as (Engagement | LegacyEngagement)[]
    const engagements = parsed.map(normalizeEngagement)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(engagements))
    return engagements
  } catch {
    return []
  }
}

export function getEngagementById(id: string): Engagement | undefined {
  return getEngagements().find((engagement) => engagement.id === id)
}

export function saveEngagement(engagement: Engagement): void {
  const engagements = getEngagements()
  engagements.push(engagement)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(engagements))
}

export function updateEngagement(updated: Engagement): void {
  const engagements = getEngagements().map((item) =>
    item.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : item
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(engagements))
}
