import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import '../dashboard/DashboardPage.css'

interface SolutionModulePageProps {
  title: string
  eyebrow: string
  description: string
  features: string[]
  primaryActionLabel: string
  primaryActionTo: string
  secondaryActionLabel?: string
  secondaryActionTo?: string
}

export default function SolutionModulePage({
  title,
  eyebrow,
  description,
  features,
  primaryActionLabel,
  primaryActionTo,
  secondaryActionLabel = 'Back to solutions hub',
  secondaryActionTo = '/app/solutions',
}: SolutionModulePageProps) {
  return (
    <div className="dashboard-page procureiq-page">
      <section className="procureiq-hero">
        <div className="procureiq-hero-badge">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="procureiq-lead">{description}</p>
        <div className="procureiq-hero-actions">
          <Link to={primaryActionTo} className="procureiq-primary-btn">
            {primaryActionLabel}
            <ArrowRight size={17} />
          </Link>
          <Link to={secondaryActionTo} className="procureiq-secondary-link">
            {secondaryActionLabel}
          </Link>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>What this module supports</h2>
            <p>Structured around ProcureIQ's evidence-first, expert-reviewed workflow.</p>
          </div>
        </div>

        <ul className="phase-list" style={{ marginTop: '18px' }}>
          {features.map((item) => (
            <li key={item} className="phase-item phase-item--done" style={{ padding: '14px 16px' }}>
              <span className="phase-indicator" aria-hidden />
              <div>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} aria-hidden />
                  {item}
                </strong>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
