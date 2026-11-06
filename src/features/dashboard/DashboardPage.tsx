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
  ArrowUpRight as ArrowUp,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'
import { getCustomers } from '../../lib/customerStorage'
import { getEngagements } from '../../lib/engagementStorage'
import { getActivity } from '../../lib/activityStorage'
import StatusBadge from '../../components/StatusBadge'
import EngagementStatusChart from './EngagementStatusChart'
import { engagementProgressPercent } from './dashboardUtils'
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

  const totalCustomers = customerCount

  return (
    <div className="dashboard-page" id="knowledge">
      <section className="dashboard-hero" aria-labelledby="dashboard-hero-title">
        <div className="dashboard-hero-copy">
          <p className="dashboard-eyebrow dashboard-eyebrow--hero">
            Expert-led workspace
          </p>
          <h1 id="dashboard-hero-title">Welcome to Expert Intelligence Assistant</h1>
          <p className="dashboard-hero-lead">
            Collaborate with AI-accelerated research, traceable evidence, and
            human approval gates—before anything reaches your customer.
          </p>
          <div className="dashboard-hero-actions">
            <Link to="/app/engagements/new" className="dashboard-hero-cta">
              <Plus size={18} strokeWidth={2.5} />
              New Engagement
            </Link>
            <Link to="/app/solutions/procureiq" className="dashboard-hero-link">
              Open ProcureIQ
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="dashboard-hero-visual" aria-hidden>
          <div className="dashboard-hero-glow" />
          <div className="dashboard-hero-card">
            <span className="hero-chip">AI</span>
            <p className="hero-card-title">Mission control</p>
            <p className="hero-card-sub">Plan → Research → Recommend → Approve</p>
            <div className="hero-mini-stats">
              <span>CHRONICLE</span>
              <span>8 phases</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-stats">
        <div className="stat-card stat-card--elevated">
          <div className="stat-card-top">
            <div className="stat-icon blue">
              <BriefcaseBusiness />
            </div>
            <span className="stat-delta stat-delta--positive">
              <ArrowUp size={14} strokeWidth={2.5} /> 20%
            </span>
          </div>
          <p>Active Engagements</p>
          <div className="stat-value-row">
            <h2>{String(active).padStart(2, '0')}</h2>
          </div>
          <span>Currently in progress</span>
        </div>

        <div className="stat-card stat-card--elevated">
          <div className="stat-card-top">
            <div className="stat-icon purple">
              <Users />
            </div>
            <span className="stat-delta stat-delta--positive">
              <ArrowUp size={14} strokeWidth={2.5} /> 12%
            </span>
          </div>
          <p>Total Customers</p>
          <div className="stat-value-row">
            <h2>{String(totalCustomers).padStart(2, '0')}</h2>
          </div>
          <span>Across your workspace</span>
        </div>

        <div className="stat-card stat-card--elevated">
          <div className="stat-card-top">
            <div className="stat-icon orange">
              <ClipboardList />
            </div>
            <span className="stat-delta stat-delta--neutral">—</span>
          </div>
          <p>Pending Reviews</p>
          <div className="stat-value-row">
            <h2>{String(pendingReview).padStart(2, '0')}</h2>
          </div>
          <span>Require your attention</span>
        </div>

        <div className="stat-card stat-card--elevated">
          <div className="stat-card-top">
            <div className="stat-icon green">
              <Activity />
            </div>
            <span className="stat-delta stat-delta--positive">
              <ArrowUp size={14} strokeWidth={2.5} /> 8%
            </span>
          </div>
          <p>Completed Engagements</p>
          <div className="stat-value-row">
            <h2>{String(completed).padStart(2, '0')}</h2>
          </div>
          <span>Approved or closed</span>
        </div>
      </section>

      <section className="dashboard-solutions">
        <div className="dashboard-solutions-head">
          <div>
            <h2 className="dashboard-section-title">Your solutions</h2>
            <p className="dashboard-section-sub">
              MVP highlights the <strong>ProcureIQ</strong> procurement module (HR / Finance /
              Support are post‑MVP in the blueprint).
            </p>
          </div>
          <Link to="/app/solutions" className="view-all-btn">
            Solutions hub <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="solution-tiles solution-tiles--single">
          <Link to="/app/solutions/procureiq" className="solution-tile solution-tile--featured">
            <div className="solution-tile-icon">
              <ShoppingCart size={22} />
            </div>
            <div className="solution-tile-body">
              <h3>ProcureIQ</h3>
              <p>
                Vendor research, weighted comparison, and RFQ-style drafts on top of the same
                engagements and CHRONICLE pipeline.
              </p>
            </div>
            <span className="solution-tile-cta">
              Open ProcureIQ <ArrowUpRight size={16} />
            </span>
          </Link>
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

      <section className="dashboard-content dashboard-content--split">
        <div className="dashboard-panel dashboard-panel--stretch">
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
            <ul className="dashboard-engagement-list dashboard-engagement-list--rich">
              {recent.map((engagement) => {
                const pct = engagementProgressPercent(engagement.status)
                return (
                  <li key={engagement.id}>
                    <Link
                      to={`/app/engagements/${engagement.id}`}
                      className="engagement-row-main"
                    >
                      <div>
                        <strong>{engagement.title}</strong>
                        <span>
                          Updated{' '}
                          {new Date(engagement.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="engagement-row-progress">
                        <div className="progress-track" role="presentation">
                          <div
                            className="progress-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="progress-label">{pct}%</span>
                      </div>
                    </Link>
                    <StatusBadge status={engagement.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="dashboard-right-col">
          <div className="dashboard-panel activity-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent Activity</h2>
                <p>Latest workspace updates</p>
              </div>
              <Clock3 size={19} />
            </div>

            {activity.length === 0 ? (
              <div className="empty-state empty-state--compact">
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

          <div className="blast-radius-card" role="note">
            <div className="blast-radius-icon" aria-hidden>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="blast-radius-title">Blast radius zero</h3>
              <p className="blast-radius-copy">
                Research runs in isolated jobs; experts approve before customer-facing
                exports—aligned with the blueprint&apos;s human-in-the-loop model.
              </p>
              <a className="blast-radius-link" href="#knowledge">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
