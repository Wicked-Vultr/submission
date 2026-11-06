import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { CheckCircle2, MessageSquareWarning } from 'lucide-react'
import type { Engagement } from '../../types/engagement'
import type { Customer } from '../../types/customer'
import { getRecommendation } from '../../lib/recommendationsStorage'
import {
  getReviewState,
  submitReviewDecision,
} from '../../lib/reviewStorage'
import { updateEngagement } from '../../lib/engagementStorage'
import '../engagements/EngagementWorkspace.css'
import './CustomerReviewPage.css'

interface EngagementContext {
  engagement: Engagement
  customer?: Customer
}

export default function CustomerReviewPage() {
  const { engagement, customer } = useOutletContext<EngagementContext>()
  const recommendation = getRecommendation(engagement.id)
  const [review, setReview] = useState(() => getReviewState(engagement.id))
  const [comment, setComment] = useState(review.customerComment)

  function decide(decision: 'approved' | 'changes_requested') {
    submitReviewDecision(engagement.id, decision, comment)
    setReview(getReviewState(engagement.id))
    updateEngagement({
      ...engagement,
      status: decision === 'approved' ? 'approved' : 'review',
    })
  }

  return (
    <>
      <div className="draft-banner" role="status">
        Customer-facing view — share only after Expert marks the recommendation
        ready for review.
      </div>

      <section className="dashboard-panel customer-review">
        <h2>Proposal for {customer?.name ?? 'customer'}</h2>
        <p className="form-description">Engagement: {engagement.title}</p>

        {!recommendation ? (
          <p className="form-description">
            No recommendation has been prepared yet. The Expert must generate and
            share a draft first.
          </p>
        ) : (
          <>
            <article className="review-proposal">
              <h3>Summary</h3>
              <p>{recommendation.summary}</p>
              <h3>Preferred option</h3>
              <p>
                {
                  recommendation.options.find((o) => o.recommended)?.name ??
                  recommendation.options[0]?.name
                }
              </p>
            </article>

            <label htmlFor="customer-comment">Comments</label>
            <textarea
              id="customer-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Feedback for the Expert..."
              disabled={review.decision !== 'pending'}
            />

            {review.decision === 'pending' ? (
              <div className="review-actions">
                <button
                  type="button"
                  className="new-engagement-btn"
                  onClick={() => decide('approved')}
                >
                  <CheckCircle2 size={16} />
                  Approve proposal
                </button>
                <button
                  type="button"
                  className="review-changes-btn"
                  onClick={() => decide('changes_requested')}
                >
                  <MessageSquareWarning size={16} />
                  Request changes
                </button>
              </div>
            ) : (
              <p className="review-decision">
                Decision recorded: <strong>{review.decision.replace('_', ' ')}</strong>
                {review.decidedAt &&
                  ` on ${new Date(review.decidedAt).toLocaleString()}`}
              </p>
            )}
          </>
        )}
      </section>
    </>
  )
}
