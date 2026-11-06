import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import '../dashboard/DashboardPage.css'
import './SolutionsHubPage.css'

const MODULES = [
  {
    id: 'procureiq',
    title: 'ProcureIQ',
    description:
      'Procurement workflow: purchase needs, vendor research, comparison, and RFQ drafts.',
    to: '/app/solutions/procureiq',
  },
]

export default function SolutionsHubPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">SOLUTIONS</p>
          <h1>Solutions hub</h1>
          <p>Focused modules that reuse workspace engagements, research, and approvals.</p>
        </div>
      </header>

      <section className="solutions-grid">
        {MODULES.map((module) => (
          <article key={module.id} className="solution-card">
            <div className="solution-icon">
              <ShoppingCart size={22} />
            </div>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <Link to={module.to} className="solution-link">
              Open module <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
