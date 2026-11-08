import { Link } from 'react-router-dom'
import { BookOpen, FileText, FolderOpen, Search, Sparkles, ArrowUpRight } from 'lucide-react'
import '../dashboard/DashboardPage.css'

const RESOURCES = [
  {
    title: 'Research history',
    description: 'Track completed research, evidence sets, and source-backed decisions across procurement requests.',
    meta: '12 items',
    icon: BookOpen,
  },
  {
    title: 'Saved reports',
    description: 'Store reusable summaries, recommendation drafts, and customer-ready briefs for recurring work.',
    meta: '6 drafts',
    icon: FileText,
  },
  {
    title: 'Evidence library',
    description: 'Keep source links, benchmark notes, and findings grouped by domain, vendor, or initiative.',
    meta: '24 sources',
    icon: FolderOpen,
  },
  {
    title: 'Decision playbooks',
    description: 'Document standards, review templates, and expert guidance for repeated consulting patterns.',
    meta: '4 playbooks',
    icon: Sparkles,
  },
] as const

export default function KnowledgeHubPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">KNOWLEDGE</p>
          <h1>Knowledge hub</h1>
          <p>Find research history, evidence, reusable guidance, and saved outputs.</p>
        </div>
      </header>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Explore the workspace library</h2>
            <p>Demo-ready repository for research assets and reusable guidance.</p>
          </div>
          <div className="topbar-search" style={{ width: 'min(100%, 310px)' }}>
            <Search size={18} aria-hidden />
            <input type="search" placeholder="Search library" aria-label="Search knowledge library" />
          </div>
        </div>

        <div className="solution-tiles" style={{ marginTop: '18px' }}>
          {RESOURCES.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="solution-tile solution-tile--featured">
                <div className="solution-tile-icon">
                  <Icon size={22} aria-hidden />
                </div>
                <div className="solution-tile-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="solution-tile-cta">
                  {item.meta} <ArrowUpRight size={16} aria-hidden />
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Quick links</h2>
            <p>Jump back into active product workflows.</p>
          </div>
        </div>
        <div className="dashboard-hero-actions" style={{ justifyContent: 'flex-start', marginTop: '16px' }}>
          <Link to="/app/engagements" className="dashboard-hero-cta">
            Open engagements
          </Link>
          <Link to="/app/solutions" className="dashboard-hero-link">
            Solutions hub
          </Link>
        </div>
      </section>
    </div>
  )
}
