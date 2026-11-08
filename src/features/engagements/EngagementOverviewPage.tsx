import { Link, useOutletContext } from 'react-router-dom'
import ExportPanel from '../../components/ExportPanel'
import type { Engagement } from '../../types/engagement'
import type { Customer } from '../../types/customer'

interface EngagementContext {
  engagement: Engagement
  customer?: Customer
}

export default function EngagementOverviewPage() {
  const { engagement } = useOutletContext<EngagementContext>()

  return (
    <>
      <div className="draft-banner" role="status">
        AI-assisted content on this engagement is shown as drafts until an
        Expert reviews and approves customer-facing deliverables.
      </div>

      <section className="dashboard-panel">
        <div className="panel-heading" style={{ marginBottom: '20px' }}>
          <div>
            <h2>Problem brief</h2>
            <p>Scope confirmed by the expert before supplier research begins.</p>
          </div>
          <Link
            to={`/app/engagements/${engagement.id}/research`}
            className="new-engagement-btn"
            style={{ fontSize: '13px', padding: '10px 14px' }}
          >
            Open research workspace
          </Link>
        </div>

        <div className="detail-grid">
          <div className="detail-block">
            <h3>Problem statement</h3>
            <p>{engagement.problemStatement || '—'}</p>
          </div>
          <div className="detail-block">
            <h3>Objectives</h3>
            <p>{engagement.objectives || '—'}</p>
          </div>
          <div className="detail-block">
            <h3>Constraints</h3>
            <p>{engagement.constraints || '—'}</p>
          </div>
          <div className="detail-block">
            <h3>Success metrics</h3>
            <p>{engagement.successMetrics || '—'}</p>
          </div>
          <div className="detail-block" style={{ gridColumn: '1 / -1' }}>
            <h3>Stakeholders</h3>
            <p>{engagement.stakeholders || '—'}</p>
          </div>
        </div>
      </section>

      <ExportPanel engagementId={engagement.id} />
    </>
  )
}
