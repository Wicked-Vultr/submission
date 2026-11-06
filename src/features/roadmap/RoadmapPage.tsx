import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Map, ListPlus } from 'lucide-react'
import type { Engagement } from '../../types/engagement'
import type { Customer } from '../../types/customer'
import {
  generateRoadmapFromRecommendation,
  getRoadmapItems,
} from '../../lib/roadmapStorage'
import { getRecommendation } from '../../lib/recommendationsStorage'
import '../engagements/EngagementWorkspace.css'
import './RoadmapPage.css'

interface EngagementContext {
  engagement: Engagement
  customer?: Customer
}

export default function RoadmapPage() {
  const { engagement } = useOutletContext<EngagementContext>()
  const [items, setItems] = useState(() => getRoadmapItems(engagement.id))
  const hasRecommendation = Boolean(getRecommendation(engagement.id))

  function handleGenerate() {
    setItems(generateRoadmapFromRecommendation(engagement.id))
  }

  return (
    <>
      <div className="draft-banner" role="status">
        Roadmap milestones are drafts until the Expert approves the proposal.
      </div>

      <section className="dashboard-panel">
        <div className="roadmap-toolbar">
          <div>
            <h2>Implementation roadmap</h2>
            <p className="form-description">
              Phases, milestones, owners, and dependencies from the approved
              direction.
            </p>
          </div>
          <button
            type="button"
            className="new-engagement-btn"
            disabled={!hasRecommendation}
            onClick={handleGenerate}
          >
            <ListPlus size={16} />
            Generate from recommendation
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <Map size={30} />
            <h3>No roadmap items</h3>
            <p>Generate a recommendation first, then build the roadmap.</p>
          </div>
        ) : (
          <ul className="roadmap-list">
            {items.map((item) => (
              <li key={item.id} className="roadmap-item">
                <div className="roadmap-phase">{item.phase}</div>
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    Owner: {item.owner} · Due: {item.dueDate}
                  </p>
                  <p className="roadmap-deps">{item.dependencies}</p>
                </div>
                <span className={`roadmap-status roadmap-status--${item.status}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
