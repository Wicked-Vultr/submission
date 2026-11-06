import type { ActivityEvent } from '../types/research'

const KEY = 'eia_activity'

export function logActivity(message: string, engagementId?: string): void {
  const events = getActivity()
  events.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    message,
    createdAt: new Date().toISOString(),
    engagementId,
  })
  localStorage.setItem(KEY, JSON.stringify(events.slice(0, 50)))
}

export function getActivity(): ActivityEvent[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ActivityEvent[]
  } catch {
    return []
  }
}
