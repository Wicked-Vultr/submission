import { Outlet, Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getEngagementById } from '../../lib/engagementStorage'
import { getCustomerById } from '../../lib/customerStorage'
import StatusBadge from '../../components/StatusBadge'
import EngagementTabs from '../../components/EngagementTabs'
import './EngagementWorkspace.css'

export default function EngagementLayout() {
  const { id } = useParams<{ id: string }>()
  const engagement = id ? getEngagementById(id) : undefined

  if (!id || !engagement) {
    return <Navigate to="/app/engagements" replace />
  }

  const customer = getCustomerById(engagement.customerId)

  return (
    <div className="dashboard-page engagement-workspace">
      <header className="dashboard-header engagement-workspace-header">
        <div>
          <Link to="/app/engagements" className="view-all-btn back-link">
            <ArrowLeft size={16} />
            All engagements
          </Link>
          <p className="dashboard-eyebrow">ENGAGEMENT</p>
          <div className="engagement-title-row">
            <h1>{engagement.title}</h1>
            <StatusBadge status={engagement.status} />
          </div>
          <p className="engagement-meta">
            {customer?.name ?? 'Unknown customer'}
            {' · '}
            Updated {new Date(engagement.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </header>

      <EngagementTabs />
      <Outlet context={{ engagement, customer }} />
    </div>
  )
}
