import { useCallback, useEffect, useRef, useState } from 'react'
import { apiV1 } from '../../lib/api/config'
import { readStorage, removeStorage, writeStorage } from '../../lib/storage'
import type {
  ResearchJobSnapshot,
  ResearchPhaseId,
} from '../../types/engagement'
import { createInitialPhases } from './researchPhases'

const STORAGE_PREFIX = 'eia_research_job_'

function loadSnapshot(engagementId: string): ResearchJobSnapshot {
  const key = `${STORAGE_PREFIX}${engagementId}`
  const snapshot = readStorage<ResearchJobSnapshot>(key)
  if (snapshot) {
    return snapshot
  }

  return {
    jobId: null,
    engagementId,
    status: 'idle',
    currentPhase: null,
    progressPercent: 0,
    phases: createInitialPhases(),
    errorMessage: null,
    startedAt: null,
    finishedAt: null,
  }
}

function persistSnapshot(snapshot: ResearchJobSnapshot): void {
  writeStorage(`${STORAGE_PREFIX}${snapshot.engagementId}`, snapshot)
}

const PHASE_ORDER: ResearchPhaseId[] = [
  'plan',
  'discover',
  'deep_dive',
  'compare',
  'validate',
  'score',
  'self_correct',
  'synthesize',
]

/** Demo simulation when the API is unavailable (local hackathon dev). */
function runMockPipeline(
  engagementId: string,
  onUpdate: (snapshot: ResearchJobSnapshot) => void,
  cancelRef: { current: boolean }
): void {
  let step = 0
  const jobId = `mock-${engagementId}-${Date.now()}`

  const setTimer = typeof window !== 'undefined' ? window.setTimeout.bind(window) : globalThis.setTimeout

  const tick = () => {
    if (cancelRef.current) return

    const phases = createInitialPhases()
    for (let i = 0; i < step; i += 1) {
      phases[i].status = 'done'
    }
    if (step < phases.length) {
      phases[step].status = 'active'
    }

    const running = step < PHASE_ORDER.length
    const snapshot: ResearchJobSnapshot = {
      jobId,
      engagementId,
      status: running ? 'running' : 'completed',
      currentPhase: running ? PHASE_ORDER[step] : null,
      progressPercent: Math.round((step / PHASE_ORDER.length) * 100),
      phases,
      errorMessage: null,
      startedAt: step === 0 ? new Date().toISOString() : loadSnapshot(engagementId).startedAt,
      finishedAt: running ? null : new Date().toISOString(),
    }

    onUpdate(snapshot)
    persistSnapshot(snapshot)

    if (running) {
      step += 1
      setTimer(tick, 1400)
    }
  }

  tick()
}

export function useResearchJob(engagementId: string) {
  const [snapshot, setSnapshot] = useState<ResearchJobSnapshot>(() =>
    loadSnapshot(engagementId)
  )
  const cancelMockRef = useRef(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    setSnapshot(loadSnapshot(engagementId))
    cancelMockRef.current = false

    return () => {
      cancelMockRef.current = true
      eventSourceRef.current?.close()
    }
  }, [engagementId])

  const applySnapshot = useCallback((next: ResearchJobSnapshot) => {
    setSnapshot(next)
  }, [])

  const startResearch = useCallback(async () => {
    cancelMockRef.current = false
    eventSourceRef.current?.close()

    if (typeof fetch !== 'function') {
      runMockPipeline(engagementId, applySnapshot, cancelMockRef)
      return
    }

    const initial: ResearchJobSnapshot = {
      ...loadSnapshot(engagementId),
      jobId: null,
      status: 'running',
      currentPhase: 'plan',
      progressPercent: 0,
      phases: createInitialPhases().map((phase, index) =>
        index === 0 ? { ...phase, status: 'active' } : phase
      ),
      errorMessage: null,
      startedAt: new Date().toISOString(),
      finishedAt: null,
    }
    persistSnapshot(initial)
    setSnapshot(initial)

    try {
      const response = await fetch(
        apiV1(`/engagements/${engagementId}/research`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      )

      if (!response.ok) {
        throw new Error('API unavailable')
      }

      const body = (await response.json()) as { job_id: string }
      const jobId = body.job_id

      const withJob: ResearchJobSnapshot = {
        ...initial,
        jobId,
      }
      persistSnapshot(withJob)
      setSnapshot(withJob)

      if (typeof EventSource === 'undefined') {
        runMockPipeline(engagementId, applySnapshot, cancelMockRef)
        return
      }

      const streamUrl = apiV1(`/research/${jobId}/stream`)
      const source = new EventSource(streamUrl)
      eventSourceRef.current = source

      source.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as Partial<ResearchJobSnapshot> & {
            phase?: ResearchPhaseId
            progress?: number
          }
          const merged = {
            ...loadSnapshot(engagementId),
            ...payload,
            jobId,
            engagementId,
          }
          persistSnapshot(merged)
          setSnapshot(merged)
        } catch {
          /* ignore malformed SSE payloads */
        }
      }

      source.onerror = () => {
        source.close()
      }
    } catch {
      runMockPipeline(engagementId, applySnapshot, cancelMockRef)
    }
  }, [engagementId, applySnapshot])

  const resetResearch = useCallback(() => {
    cancelMockRef.current = true
    eventSourceRef.current?.close()
    removeStorage(`${STORAGE_PREFIX}${engagementId}`)
    setSnapshot(loadSnapshot(engagementId))
  }, [engagementId])

  return { snapshot, startResearch, resetResearch }
}
