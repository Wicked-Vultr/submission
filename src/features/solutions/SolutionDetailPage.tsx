import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getSolutionBySlug } from './solutionCatalog'
import './SolutionsHubPage.css'

export default function SolutionDetailPage() {
  const { slug } = useParams()
  const solution = getSolutionBySlug(slug)

  if (!solution) {
    return (
      <div className="dashboard-page solutions-page">
        <section className="solutions-hero solutions-hero--detail">
          <div className="solutions-hero-copy">
            <p className="solutions-eyebrow">Solution not found</p>
            <h1>That solution is not available in this workspace.</h1>
            <Link to="/app/solutions" className="dashboard-hero-link">
              <ArrowLeft size={16} /> Back to Solutions hub
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const Icon = solution.icon
  const PrimaryButton = (
    <Link
      to={`/app/engagements/new?solution=${solution.slug}`}
      className="procureiq-primary-btn"
    >
      {solution.primaryActionLabel}
      <ArrowRight size={17} />
    </Link>
  )

  return (
    <div className="dashboard-page solutions-page solutions-detail-page">
      <section className="solutions-hero solutions-hero--detail">
        <div className="solutions-hero-copy">
          <p className="solutions-eyebrow">{solution.category}</p>
          <h1>{solution.title}</h1>
          <p className="solutions-lead">{solution.description}</p>
          <div className="solutions-hero-actions">
            {PrimaryButton}
            <Link to="/app/solutions" className="procureiq-secondary-link">
              Back to solutions hub
            </Link>
          </div>
        </div>

        <div className="solutions-hero-aside" aria-label="Solution summary">
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Category</span>
            <strong>{solution.category}</strong>
          </div>
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Focus</span>
            <strong>{solution.capabilities[0]}</strong>
          </div>
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Engine</span>
            <strong>ProcureIQ</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading" style={{ marginBottom: '18px' }}>
          <div>
            <h2>Overview</h2>
            <p>Built around procurement requests, supplier evidence, comparisons, and expert approvals.</p>
          </div>
        </div>

        <div className="solution-detail-overview">
          <div className="solution-detail-card solution-detail-card--summary">
            <div className={`solution-tile-icon solution-tile-icon--${solution.accent}`}>
              <Icon size={22} aria-hidden />
            </div>
            <div>
              <h3>{solution.title}</h3>
              <p>{solution.shortDescription}</p>
            </div>
          </div>

          <div className="solution-detail-card">
            <h3>Main purpose</h3>
            <p>{solution.description}</p>
          </div>

          <div className="solution-detail-card">
            <h3>Business problems it addresses</h3>
            <ul className="solution-detail-list">
              {solution.businessProblems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading" style={{ marginBottom: '20px' }}>
          <div>
            <h2>Key capabilities</h2>
            <p>Functionality implemented or clearly labeled as part of the module vision.</p>
          </div>
        </div>

        <div className="solution-grid capability-grid">
          {solution.capabilities.map((capability) => (
            <article key={capability} className="solution-card-grid-item">
              <div className="capability-pill">
                <CheckCircle2 size={14} />
                {capability}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading" style={{ marginBottom: '20px' }}>
          <div>
            <h2>Workflow overview</h2>
            <p>Each solution follows the same engagement-first path with evidence-backed review.</p>
          </div>
        </div>

        <ol className="procureiq-step-list">
          {solution.workflow.map((step, index) => (
            <li key={step.title}>
              <div className="procureiq-step-index">{index + 1}</div>
              <div className="procureiq-step-body">
                <div className="procureiq-step-head">
                  <h3>{step.title}</h3>
                </div>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading" style={{ marginBottom: '20px' }}>
          <div>
            <h2>Research capabilities</h2>
            <p>The shared research and synthesis engine behind the specialized workflow.</p>
          </div>
        </div>

        <div className="solution-grid capability-grid">
          {solution.researchCapabilities.map(({ name, description, icon: Icon }) => (
            <article key={name} className="solution-card-grid-item">
              <div className="solution-detail-icon-wrap">
                <Icon size={18} />
              </div>
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading" style={{ marginBottom: '20px' }}>
          <div>
            <h2>Requirements before kickoff</h2>
            <p>These details help the expert scope the engagement accurately.</p>
          </div>
        </div>

        <ul className="solution-detail-list">
          {solution.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading" style={{ marginBottom: '20px' }}>
          <div>
            <h2>Example use cases</h2>
            <p>Concrete scenarios where the module adds the most value.</p>
          </div>
        </div>

        <div className="solution-grid capability-grid">
          {solution.useCases.map((useCase) => (
            <article key={useCase} className="solution-card-grid-item">
              <p>{useCase}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="solutions-bottom-cta">
        {PrimaryButton}
      </section>
    </div>
  )
}
