import { Link, useParams } from 'react-router-dom'
import { Construction } from 'lucide-react'
import '../dashboard/DashboardPage.css'
import './ComingSoonPage.css'

const TITLES: Record<string, string> = {
  hr: 'HR Solutions',
  finance: 'Finance Solutions',
  support: 'Support Solutions',
}

export default function ComingSoonPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const title = (moduleId && TITLES[moduleId]) || 'Solution'

  return (
    <div className="dashboard-page coming-soon-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">SOLUTIONS</p>
          <h1>{title}</h1>
          <p>
            This module reuses the same engagement, research, and approvals
            foundation. Coming soon for the hackathon stretch track.
          </p>
        </div>
        <Link to="/app/solutions" className="view-all-btn">
          ← Solutions hub
        </Link>
      </header>

      <section className="dashboard-panel coming-soon-panel">
        <Construction size={36} className="coming-soon-icon" aria-hidden />
        <h2>Under construction</h2>
        <p>
          Start with <strong>ProcureIQ</strong> or create a standard engagement from
          the dashboard while we finalize this workflow.
        </p>
        <Link to="/app/engagements/new" className="new-engagement-btn">
          New engagement
        </Link>
      </section>
    </div>
  )
}
