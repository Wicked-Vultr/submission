import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  ArrowUpRight,
  LayoutGrid,
  Sparkles,
  Clock,
} from 'lucide-react'
import '../dashboard/DashboardPage.css'
import './SolutionsHubPage.css'

const MODULES = [
  {
    id: 'procureiq',
    title: 'ProcureIQ',
    description:
      'Vendor research, weighted comparison, and RFQ-style drafts on top of the same engagements and CHRONICLE pipeline.',
    to: '/app/solutions/procureiq',
  },
  {
    id: 'hr',
    title: 'HR Solutions',
    description:
      'Workforce planning, hiring, and organization design decisions aligned to evidence and human review.',
    to: '/app/solutions/hr',
  },
  {
    id: 'finance',
    title: 'Finance Solutions',
    description:
      'Cost models, scenario comparisons, and ROI analyses for business planning and operational decisions.',
    to: '/app/solutions/finance',
  },
  {
    id: 'support',
    title: 'Support Solutions',
    description:
      'Support operations, staffing, and service experience decisions grounded in evidence and approval workflows.',
    to: '/app/solutions/support',
  },
] as const

export default function SolutionsHubPage() {
  return (
    <div className="dashboard-page solutions-page">
      <section className="solutions-hero" aria-labelledby="solutions-hero-title">
        <div className="solutions-hero-copy">
          <p className="solutions-eyebrow">Solutions</p>
          <h1 id="solutions-hero-title">Solutions hub</h1>
          <p className="solutions-lead">
            Plug-in modules that sit on top of your engagements—shared research,
            evidence, and approvals so procurement and specialist workflows stay
            consistent.
          </p>
          <div className="solutions-hero-actions">
            <span className="solutions-meta-pill">
              <LayoutGrid size={14} aria-hidden />
              {MODULES.length} module live
            </span>
            <span className="solutions-meta-pill solutions-meta-pill--muted">
              <Sparkles size={14} aria-hidden />
              Same workspace rails as Dashboard
            </span>
          </div>
        </div>
        <div className="solutions-hero-aside" aria-label="Hub summary">
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Active modules</span>
            <strong>{MODULES.length}</strong>
          </div>
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Featured</span>
            <strong>ProcureIQ</strong>
          </div>
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Roadmap</span>
            <strong className="solutions-mini-roadmap">
              <Clock size={16} aria-hidden />
              Post-MVP
            </strong>
          </div>
        </div>
      </section>

      <section className="solutions-modules" aria-labelledby="solutions-modules-title">
        <div className="solutions-modules-head">
          <div>
            <h2 id="solutions-modules-title" className="solutions-modules-title">
              Available modules
            </h2>
            <p className="solutions-modules-sub">
              Open a module to work in a focused flow; context stays tied to
              engagements and customer review.
            </p>
          </div>
        </div>

        <div className="solutions-modules-grid">
          <div className="solution-tiles solutions-hub-tiles">
            {MODULES.map((module) => (
              <Link
                key={module.id}
                to={module.to}
                className="solution-tile solution-tile--featured solution-tile--blue"
              >
                <div className="solution-tile-icon">
                  <ShoppingCart size={22} aria-hidden />
                </div>
                <div className="solution-tile-body">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
                <span className="solution-tile-cta">
                  Open {module.title} <ArrowUpRight size={16} aria-hidden />
                </span>
              </Link>
            ))}
          </div>

          <aside className="solutions-roadmap-card" aria-label="Solution roadmap">
            <p className="solutions-roadmap-eyebrow">Blueprint</p>
            <h3 className="solutions-roadmap-title">Specialized workstreams</h3>
            <p className="solutions-roadmap-text">
              HR, Finance, and Support modules now follow the same engagement-first
              workflow and evidence model as the core product.
            </p>
            <p className="solutions-roadmap-hint">
              Use <strong>ProcureIQ</strong> for procurement readiness and the other
              modules for domain-specific decision support.
            </p>
          </aside>
        </div>
      </section>
    </div>
  )
}
