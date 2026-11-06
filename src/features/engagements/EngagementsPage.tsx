import { useEffect, useState } from 'react'
import { Plus, BriefcaseBusiness } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getEngagements } from '../../lib/engagementStorage'
import { getCustomerById } from '../../lib/customerStorage'
import StatusBadge from '../../components/StatusBadge'
import type { Engagement } from '../../types/engagement'
import './EngagementsPage.css'

export default function EngagementsPage() {
  const [engagements, setEngagements] = useState<Engagement[]>([])

  useEffect(() => {
    setEngagements(getEngagements())
  }, [])

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">WORKSPACE</p>
          <h1>Engagements</h1>
          <p>Manage and track your customer engagements.</p>
        </div>

        <Link to="/app/engagements/new" className="new-engagement-btn">
          <Plus size={18} />
          New Engagement
        </Link>
      </header>

      {engagements.length === 0 ? (
        <section className="dashboard-panel">
          <div className="empty-state">
            <BriefcaseBusiness size={30} />
            <h3>No engagements yet</h3>
            <p>Create an engagement to scope a problem and run CHRONICLE research.</p>
          </div>
        </section>
      ) : (
        <section className="dashboard-panel engagements-list">
          <h2 className="engagements-list-title">
            All engagements ({engagements.length})
          </h2>

          <ul className="engagements-list-items">
            {engagements.map((engagement) => {
              const customer = getCustomerById(engagement.customerId)

              return (
                <li key={engagement.id}>
                  <Link
                    to={`/app/engagements/${engagement.id}`}
                    className="engagement-row"
                  >
                    <div>
                      <strong>{engagement.title}</strong>
                      <span>
                        {customer?.name ?? 'Unknown customer'} ·{' '}
                        {new Date(engagement.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <StatusBadge status={engagement.status} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
