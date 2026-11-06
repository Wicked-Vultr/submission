import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import '../dashboard/DashboardPage.css'
import './ProcureIQPage.css'

export default function ProcureIQPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">SOLUTIONS</p>
          <h1>ProcureIQ</h1>
          <p>
            Procurement module reusing engagements, CHRONICLE research, evidence,
            and approvals.
          </p>
        </div>
        <Link to="/app/engagements/new" className="new-engagement-btn">
          Start procurement engagement
        </Link>
      </header>

      <section className="dashboard-panel procureiq-panel">
        <ShoppingCart size={28} className="procureiq-icon" />
        <h2>Demo workflow</h2>
        <ol className="procureiq-steps">
          <li>Customer submits a purchase need (qty, budget, specs, delivery).</li>
          <li>Expert scopes requirements on a standard engagement.</li>
          <li>CHRONICLE researches vendors; findings feed comparison weights.</li>
          <li>Expert reviews RFQ draft; approver confirms external submission.</li>
        </ol>
        <Link to="/app/engagements" className="view-all-btn procureiq-link">
          Open engagements <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
