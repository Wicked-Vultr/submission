import type { CustomerReviewState } from '../types/research'
import { logActivity } from './activityStorage'

const KEY = 'eia_customer_review'

function loadAll(): CustomerReviewState[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as CustomerReviewState[]
  } catch {
    return []
  }
}

export function getReviewState(engagementId: string): CustomerReviewState {
  return (
    loadAll().find((r) => r.engagementId === engagementId) ?? {
      engagementId,
      decision: 'pending',
      customerComment: '',
      decidedAt: null,
    }
  )
}

export function submitReviewDecision(
  engagementId: string,
  decision: 'approved' | 'changes_requested',
  customerComment: string
): void {
  const state: CustomerReviewState = {
    engagementId,
    decision,
    customerComment: customerComment.trim(),
    decidedAt: new Date().toISOString(),
  }
  const rest = loadAll().filter((r) => r.engagementId !== engagementId)
  localStorage.setItem(KEY, JSON.stringify([...rest, state]))
  logActivity(
    decision === 'approved'
      ? 'Customer approved the proposal'
      : 'Customer requested changes',
    engagementId
  )
}

export function resetReview(engagementId: string): void {
  const rest = loadAll().filter((r) => r.engagementId !== engagementId)
  localStorage.setItem(KEY, JSON.stringify(rest))
}
