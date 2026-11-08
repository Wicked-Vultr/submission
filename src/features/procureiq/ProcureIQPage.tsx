import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  ArrowRight,
  ClipboardList,
  Microscope,
  Scale,
  FileCheck,
  FileText,
} from 'lucide-react'
import '../dashboard/DashboardPage.css'
import './ProcureIQPage.css'

const STEPS = [
  {
    title: 'Request',
    body: 'Customer captures quantity, budget, specifications, and delivery window.',
    icon: ClipboardList,
  },
  {
    title: 'Scope',
    body: 'Expert locks objectives, constraints, and success criteria in an engagement.',
    icon: FileText,
  },
  {
    title: 'Research',
    body: 'ProcureIQ organizes vendor and product research with source-backed evidence.',
    icon: Microscope,
  },
  {
    title: 'Compare & RFQ',
    body: 'Weighted comparison highlights gaps; RFQ drafts stay in review until approval.',
    icon: Scale,
  },
  {
    title: 'Approve',
    body: 'Human gate before any external submission—aligned with blueprint policies.',
    icon: FileCheck,
  },
]

export default function ProcureIQPage() {
  return (
    <div className="dashboard-page procureiq-page">
      <section className="procureiq-hero">
        <div className="procureiq-hero-badge">
          <ShoppingCart size={18} strokeWidth={2.5} aria-hidden />
          Specialized module
        </div>
        <h1>ProcureIQ</h1>
        <p className="procureiq-lead">
          Procurement workspace for purchase requests, supplier research, evidence-based
          comparisons, RFQ drafts, and approvals—without inventing purchase completions.
        </p>
        <div className="procureiq-hero-actions">
          <Link to="/app/engagements/new" className="procureiq-primary-btn">
            Start procurement engagement
            <ArrowRight size={17} />
          </Link>
          <Link to="/app/solutions" className="procureiq-secondary-link">
            Back to solutions hub
          </Link>
        </div>
      </section>

      <section className="procureiq-how">
        <h2>How the demo flows</h2>
        <p className="procureiq-how-sub">
          Follow the numbered path in the UI; external RFQs stay drafts until a real integration
          exists.
        </p>
        <ol className="procureiq-step-list">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <li key={step.title}>
                <div className="procureiq-step-index">{index + 1}</div>
                <div className="procureiq-step-body">
                  <div className="procureiq-step-head">
                    <Icon size={18} aria-hidden />
                    <h3>{step.title}</h3>
                  </div>
                  <p>{step.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="procureiq-cta-panel">
        <div>
          <h2>Ready to run a scenario?</h2>
          <p>
            Create an engagement, run research, and open <strong>Findings</strong> to see vendor
            options with transparent weights—then move to recommendations and customer review.
          </p>
        </div>
        <Link to="/app/engagements" className="procureiq-primary-btn procureiq-primary-btn--ghost">
          Open engagements
          <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  )
}
