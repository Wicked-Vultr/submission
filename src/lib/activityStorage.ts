import type { ActivityEvent } from '../types/research'
import { readStorage, writeStorage } from './storage'

const KEY = 'eia_activity'

export function logActivity(message: string, engagementId?: string): void {
  const events = getActivity()
  events.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    message,
    createdAt: new Date().toISOString(),
    engagementId,
  })
  writeStorage(KEY, events.slice(0, 50))
}

export function getActivity(): ActivityEvent[] {
  return readStorage<ActivityEvent[]>(KEY) ?? []
}
