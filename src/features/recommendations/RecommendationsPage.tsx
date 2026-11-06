import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Scale, Sparkles } from 'lucide-react'
import type { Engagement } from '../../types/engagement'
import type { Customer } from '../../types/customer'
import {
  generateRecommendationDraft,
  getRecommendation,
  markRecommendationShared,
} from '../../lib/recommendationsStorage'
import { getFindings } from '../../lib/findingsStorage'
import { updateEngagement } from '../../lib/engagementStorage'
import '../engagements/EngagementWorkspace.css'
import './RecommendationsPage.css'

interface EngagementContext {
  engagement: Engagement
  customer?: Customer
}

export default function RecommendationsPage() {
  const { engagement } = useOutletContext<EngagementContext>()
  const [draft, setDraft] = useState(() => getRecommendation(engagement.id))

  const findings = getFindings(engagement.id)

  function handleGenerate() {
    const next = generateRecommendationDraft(engagement.id, engagement.title)
    if (next) setDraft(next)
  }

  function handleShareForReview() {
    markRecommendationShared(engagement.id)
    updateEngagement({ ...engagement, status: 'review' })
    setDraft(getRecommendation(engagement.id))
  }

  return (
    <>
      <div className="draft-banner" role="status">
        Recommendation drafts require Expert review before customer presentation.
      </div>

      <section className="dashboard-panel">
        <div className="rec-toolbar">
          <div>
            <h2>Recommendation builder</h2>
            <p className="form-description">
              Uses validated findings and comparison scores to draft options.
            </p>
          </div>
          <button
            type="button"
            className="new-engagement-btn"
            disabled={findings.length === 0}
            onClick={handleGenerate}
          >
            <Sparkles size={16} />
            Generate draft
          </button>
        </div>

        {findings.length === 0 ? (
          <div className="empty-state">
            <Scale size={30} />
            <h3>Findings required</h3>
            <p>Complete research before generating recommendations.</p>
          </div>
        ) : !draft ? (
          <p className="form-description">
            Click generate to create a scored recommendation draft.
          </p>
        ) : (
          <>
            <div className="rec-summary">
              <p className="rec-status">Status: {draft.status.replace('_', ' ')}</p>
              <h3>Executive summary</h3>
              <p>{draft.summary}</p>
              <p className="rec-rationale">{draft.rationale}</p>
            </div>

            <div className="option-cards">
              {draft.options.map((option) => (
                <article
                  key={option.id}
                  className={
                    option.recommended ? 'option-card option-card--preferred' : 'option-card'
                  }
                >
                  <header>
                    <h4>{option.name}</h4>
                    {option.recommended && (
                      <span className="preferred-tag">Preferred</span>
                    )}
                  </header>
                  <p>{option.description}</p>
                  <ul>
                    <li>
                      <strong>Cost:</strong> {option.estimatedCost}
                    </li>
                    <li>
                      <strong>Feasibility:</strong> {option.feasibility}
                    </li>
                    <li>
                      <strong>Risk:</strong> {option.riskLevel}
                    </li>
                  </ul>
                  <p className="score-expl">{option.scoreExplanation}</p>
                  <div className="pros-cons">
                    <div>
                      <strong>Pros</strong>
                      <ul>
                        {option.pros.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Cons</strong>
                      <ul>
                        {option.cons.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="new-engagement-btn rec-share-btn"
              onClick={handleShareForReview}
            >
              Mark ready for customer review
            </button>
          </>
        )}
      </section>
    </>
  )
}
