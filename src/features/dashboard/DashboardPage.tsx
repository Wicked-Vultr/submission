import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './DashboardPage.css'
import {
  BriefcaseBusiness,
  Users,
  ClipboardList,
  Activity,
  ArrowUpRight,
  Plus,
  Clock3,
} from 'lucide-react'
import { getCustomers } from '../../lib/customerStorage'
import { getEngagements } from '../../lib/engagementStorage'
import { getActivity } from '../../lib/activityStorage'
import StatusBadge from '../../components/StatusBadge'
import EngagementStatusChart from './EngagementStatusChart'
import type { Engagement } from '../../types/engagement'
import type { EngagementStatus } from '../../types/engagement'

const STATUS_KEYS: EngagementStatus[] = [
  'draft',
  'scoping',
  'research',
  'review',
  'approved',
  'closed',
]

export default function DashboardPage() {
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [customerCount, setCustomerCount] = useState(0)
  const [activity, setActivity] = useState(getActivity())

  useEffect(() => {
    setEngagements(getEngagements())
    setCustomerCount(getCustomers().length)
    setActivity(getActivity())
  }, [])

  const statusCounts = useMemo(() => {
    const initial: Record<EngagementStatus, number> = {
      draft: 0,
      scoping: 0,
      research: 0,
      review: 0,
      approved: 0,
      closed: 0,
    }
    for (const e of engagements) {
      initial[e.status] += 1
    }
    return initial
  }, [engagements])

  const active = engagements.filter(
    (e) => !['approved', 'closed'].includes(e.status)
  ).length
  const completed = engagements.filter((e) =>
    ['approved', 'closed'].includes(e.status)
  ).length
  const pendingReview = engagements.filter((e) => e.status === 'review').length
  const recent = [...engagements]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">WORKSPACE OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>Welcome back! Here&apos;s an overview of your workspace.</p>
        </div>

        <Link to="/app/engagements/new" className="new-engagement-btn">
          <Plus size={18} />
          New Engagement
        </Link>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BriefcaseBusiness />
          </div>
          <p>Active Engagements</p>
          <h2>{String(active).padStart(2, '0')}</h2>
          <span>Currently in progress</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Users />
          </div>
          <p>Total Customers</p>
          <h2>{String(customerCount).padStart(2, '0')}</h2>
          <span>Across your workspace</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <ClipboardList />
          </div>
          <p>Pending Reviews</p>
          <h2>{String(pendingReview).padStart(2, '0')}</h2>
          <span>Require your attention</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Activity />
          </div>
          <p>Completed Engagements</p>
          <h2>{String(completed).padStart(2, '0')}</h2>
          <span>Approved or closed</span>
        </div>
      </section>

      {engagements.length > 0 && (
        <section className="dashboard-panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Engagements by status</h2>
              <p>Progress across the expert-led lifecycle</p>
            </div>
          </div>
          <EngagementStatusChart counts={statusCounts} />
          <div className="status-legend">
            {STATUS_KEYS.map((key) => (
              <span key={key} className="status-legend-item">
                <strong>{statusCounts[key]}</strong> {key}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="dashboard-content">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Engagements</h2>
              <p>Track your latest customer projects</p>
            </div>
            <Link to="/app/engagements" className="view-all-btn">
              View all <ArrowUpRight size={16} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state">
              <BriefcaseBusiness size={30} />
              <h3>No engagements yet</h3>
              <p>Create an engagement to start the expert-led workflow.</p>
            </div>
          ) : (
            <ul className="dashboard-engagement-list">
              {recent.map((engagement) => (
                <li key={engagement.id}>
                  <Link to={`/app/engagements/${engagement.id}`}>
                    <strong>{engagement.title}</strong>
                    <span>
                      Updated {new Date(engagement.updatedAt).toLocaleDateString()}
                    </span>
                  </Link>
                  <StatusBadge status={engagement.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest workspace updates</p>
            </div>
            <Clock3 size={19} />
          </div>

          {activity.length === 0 ? (
            <div className="empty-state">
              <Activity size={30} />
              <h3>No recent activity</h3>
              <p>Actions across engagements will appear here.</p>
            </div>
          ) : (
            <ul className="activity-list">
              {activity.slice(0, 8).map((event) => (
                <li key={event.id}>
                  <span>{event.message}</span>
                  <time dateTime={event.createdAt}>
                    {new Date(event.createdAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
