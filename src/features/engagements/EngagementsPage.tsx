import { useEffect, useMemo, useState } from 'react'
import { Plus, BriefcaseBusiness, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getEngagements } from '../../lib/engagementStorage'
import { getCustomerById } from '../../lib/customerStorage'
import StatusBadge from '../../components/StatusBadge'
import { engagementProgressPercent } from '../dashboard/dashboardUtils'
import type { Engagement } from '../../types/engagement'
import '../dashboard/DashboardPage.css'
import './EngagementsPage.css'

export default function EngagementsPage() {
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    setEngagements(getEngagements())
  }, [])

  const sorted = useMemo(
    () =>
      [...engagements].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [engagements]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter((e) => {
      const customer = getCustomerById(e.customerId)
      const haystack = [
        e.title,
        e.problemStatement,
        e.status,
        customer?.name,
        customer?.department,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [sorted, query])

  const inFlight = engagements.filter(
    (e) => !['approved', 'closed'].includes(e.status)
  ).length

  return (
    <div className="dashboard-page engagements-page">
      <section className="engagements-hero">
        <div className="engagements-hero-copy">
          <p className="engagements-eyebrow">Workspace</p>
          <h1>Engagements</h1>
          <p className="engagements-lead">
            Each engagement is a scoped mission: purchase brief → supplier research →
            evidence → recommendations → customer review.
          </p>
          <div className="engagements-hero-actions">
            <Link to="/app/engagements/new" className="engagements-primary-btn">
              <Plus size={18} strokeWidth={2.5} />
              New engagement
            </Link>
            <span className="engagements-meta-pill">
              <BriefcaseBusiness size={14} />
              {inFlight} active
            </span>
          </div>
        </div>

        <div className="engagements-hero-panel" aria-label="Engagement summary">
          <div>
            <span className="engagements-panel-label">Total</span>
            <strong>{engagements.length}</strong>
          </div>
          <div>
            <span className="engagements-panel-label">Showing</span>
            <strong>{filtered.length}</strong>
          </div>
          <Link to="/app/engagements/new" className="engagements-panel-link">
            Start scoped brief
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      <div className="engagements-toolbar">
        <label htmlFor="engagement-search" className="visually-hidden">
          Search engagements
        </label>
        <input
          id="engagement-search"
          type="search"
          className="engagements-search"
          placeholder="Search by title, customer, status, or problem statement..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>

      {engagements.length === 0 ? (
        <section className="engagements-empty">
          <div className="engagements-empty-card">
            <div className="engagements-empty-icon">
              <BriefcaseBusiness size={28} />
            </div>
            <h2>No engagements yet</h2>
            <p>
              Create an engagement to capture the purchasing need and organize supplier
              research with traceable evidence.
            </p>
            <Link to="/app/engagements/new" className="engagements-primary-btn">
              <Plus size={18} strokeWidth={2.5} />
              Create first engagement
            </Link>
          </div>
        </section>
      ) : filtered.length === 0 ? (
        <section className="engagements-empty">
          <div className="engagements-empty-card">
            <h2>No matches</h2>
            <p>Try another keyword or clear the search filter.</p>
            <button
              type="button"
              className="engagements-text-btn"
              onClick={() => setQuery('')}
            >
              Clear search
            </button>
          </div>
        </section>
      ) : (
        <ul className="engagements-list-items">
          {filtered.map((engagement) => {
            const customer = getCustomerById(engagement.customerId)
            const pct = engagementProgressPercent(engagement.status)
            return (
              <li key={engagement.id}>
                <Link
                  to={`/app/engagements/${engagement.id}`}
                  className="engagement-card"
                >
                  <div className="engagement-card-top">
                    <div className="engagement-card-titles">
                      <strong>{engagement.title}</strong>
                      <span className="engagement-card-customer">
                        {customer?.name ?? 'Unknown customer'}
                        {customer?.department ? ` · ${customer.department}` : ''}
                      </span>
                    </div>
                    <StatusBadge status={engagement.status} />
                  </div>

                  <p className="engagement-card-problem">
                    {engagement.problemStatement
                      ? engagement.problemStatement.length > 160
                        ? `${engagement.problemStatement.slice(0, 160)}…`
                        : engagement.problemStatement
                      : 'No problem statement captured yet.'}
                  </p>

                  <div className="engagement-card-foot">
                    <span className="engagement-card-updated">
                      Updated{' '}
                      {new Date(engagement.updatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="engagement-card-progress">
                      <div className="progress-track" role="presentation">
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="progress-label">{pct}%</span>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
