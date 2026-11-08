import { useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Loader2, Play, RotateCcw } from 'lucide-react'
import type { Engagement } from '../../types/engagement'
import type { Customer } from '../../types/customer'
import { updateEngagement } from '../../lib/engagementStorage'
import { seedFindingsForEngagement } from '../../lib/findingsStorage'
import { useResearchJob } from './useResearchJob'
import './ResearchWorkspacePage.css'

interface EngagementContext {
  engagement: Engagement
  customer?: Customer
}

export default function ResearchWorkspacePage() {
  const { engagement } = useOutletContext<EngagementContext>()
  const { snapshot, startResearch, resetResearch } = useResearchJob(
    engagement.id
  )

  const isRunning = snapshot.status === 'running'
  const isComplete = snapshot.status === 'completed'

  useEffect(() => {
    if (snapshot.status === 'completed') {
      seedFindingsForEngagement(engagement.id, engagement.title)
    }
  }, [snapshot.status, engagement.id, engagement.title])

  function handleStart() {
    if (engagement.status !== 'research') {
      updateEngagement({ ...engagement, status: 'research' })
    }
    void startResearch()
  }

  return (
    <>
      <div className="draft-banner" role="status">
        Supplier research follows an eight-phase workflow. Live progress uses SSE when the
        backend is connected; otherwise a local demo simulation runs for UI development.
      </div>

      <section className="dashboard-panel research-panel">
        <div className="research-toolbar">
          <div>
            <h2>Research job</h2>
            <p className="form-description">
              {snapshot.jobId
                ? `Job ${snapshot.jobId}`
                : 'No active job — start research from the approved brief.'}
            </p>
          </div>

          <div className="research-actions">
            <button
              type="button"
              className="new-engagement-btn"
              onClick={handleStart}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play size={16} />
                  {isComplete ? 'Run again' : 'Start supplier research'}
                </>
              )}
            </button>

            {(isComplete || snapshot.status === 'failed') && (
              <button
                type="button"
                className="view-all-btn research-reset-btn"
                onClick={resetResearch}
              >
                <RotateCcw size={16} />
                Reset progress
              </button>
            )}
          </div>
        </div>

        <div className="research-progress-bar" aria-hidden={!isRunning && !isComplete}>
          <div
            className="research-progress-fill"
            style={{ width: `${snapshot.progressPercent}%` }}
          />
        </div>
        <p className="research-progress-label">
          {snapshot.progressPercent}% complete
          {snapshot.currentPhase ? ` · ${snapshot.currentPhase.replace('_', ' ')}` : ''}
        </p>

        {snapshot.errorMessage && (
          <p className="research-error">{snapshot.errorMessage}</p>
        )}

        <ol className="phase-list">
          {snapshot.phases.map((phase) => (
            <li
              key={phase.id}
              className={`phase-item phase-item--${phase.status}`}
            >
              <span className="phase-indicator" aria-hidden />
              <div>
                <strong>{phase.label}</strong>
                <span>{phase.description}</span>
              </div>
            </li>
          ))}
        </ol>

        {isComplete && (
          <p className="research-next-step">
            Findings will appear under{' '}
            <Link to={`/app/engagements/${engagement.id}/findings`}>
              Findings
            </Link>{' '}
            once supplier research output is normalized (demo UI ready).
          </p>
        )}
      </section>
    </>
  )
}
