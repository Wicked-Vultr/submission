import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Clock,
  LayoutGrid,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import '../dashboard/DashboardPage.css'
import './SolutionsHubPage.css'
import {
  ACTIVE_SOLUTION_IDS,
  FEATURED_SOLUTION_IDS,
  RECENTLY_USED_SOLUTION_IDS,
  SOLUTION_CATALOG,
  SOLUTION_CATEGORIES,
  type SolutionCategory,
} from './solutionCatalog'

const EMPTY_STATE_MESSAGE = 'No solutions match your search.'

export default function SolutionsHubPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const filteredSolutions = useMemo(() => {
    const queryValue = query.trim().toLowerCase()

    return SOLUTION_CATALOG.filter((solution) => {
      const matchesCategory =
        category === 'all' || solution.category.toLowerCase() === category.toLowerCase()
      const haystack = [
        solution.title,
        solution.category,
        solution.description,
        solution.shortDescription,
        ...solution.capabilities,
        ...solution.businessProblems,
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery = !queryValue || haystack.includes(queryValue)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const featured = SOLUTION_CATALOG.filter((solution) => FEATURED_SOLUTION_IDS.includes(solution.id))
  const active = SOLUTION_CATALOG.filter((solution) => ACTIVE_SOLUTION_IDS.includes(solution.id))
  const recent = SOLUTION_CATALOG.filter((solution) => RECENTLY_USED_SOLUTION_IDS.includes(solution.id))

  const clearFilters = () => {
    setQuery('')
    setCategory('all')
  }

  return (
    <div className="dashboard-page solutions-page">
      <section className="solutions-hero" aria-labelledby="solutions-hero-title">
        <div className="solutions-hero-copy">
          <p className="solutions-eyebrow">Solutions</p>
          <h1 id="solutions-hero-title">Solution Hub</h1>
          <p className="solutions-lead">
            Explore AI-powered solutions to solve business challenges and transform workflows.
          </p>
          <div className="solutions-hero-actions">
            <span className="solutions-meta-pill">
              <LayoutGrid size={14} aria-hidden />
              {SOLUTION_CATALOG.length} solution modules
            </span>
            <span className="solutions-meta-pill solutions-meta-pill--muted">
              <Sparkles size={14} aria-hidden />
              Shared CHRONICLE research engine
            </span>
          </div>
        </div>

        <div className="solutions-hero-aside" aria-label="Hub summary">
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Featured</span>
            <strong>{featured.length}</strong>
          </div>
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Active</span>
            <strong>{active.length}</strong>
          </div>
          <div className="solutions-mini-stat">
            <span className="solutions-mini-label">Recently used</span>
            <strong>{recent.length}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-panel solutions-search-panel">
        <div className="panel-heading solutions-panel-heading">
          <div>
            <h2>Explore solutions</h2>
            <p>Search by name, business department, capability, and keywords.</p>
          </div>
        </div>

        <div className="solutions-toolbar">
          <label className="solutions-search-field" aria-label="Search solutions">
            <Search size={16} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search solutions"
            />
          </label>

          <div className="solutions-category-filter" role="tablist" aria-label="Solution categories">
            {SOLUTION_CATEGORIES.map((item) => (
              <button
                key={item.value}
                type="button"
                className={item.value === category ? 'is-active' : ''}
                onClick={() => setCategory(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="solutions-section" aria-labelledby="featured-solutions-title">
        <div className="solutions-section-header">
          <h2 id="featured-solutions-title">Featured solutions</h2>
        </div>

        {featured.length > 0 ? (
          <div className="solution-tiles">
            {featured.map((solution) => {
              const Icon = solution.icon
              return (
                <Link
                  key={solution.id}
                  to={`/app/solutions/${solution.slug}`}
                  className={`solution-tile solution-tile--featured solution-tile--${solution.accent}`}
                >
                  <div className="solution-tile-icon">
                    <Icon size={22} aria-hidden />
                  </div>
                  <div className="solution-tile-body">
                    <h3>{solution.title}</h3>
                    <p>{solution.shortDescription}</p>
                  </div>
                  <span className="solution-tile-cta">
                    Explore Solution <ArrowUpRight size={16} aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="empty-state empty-state--compact">
            <h3>No featured solutions</h3>
            <p>Featured modules will appear here when configured.</p>
          </div>
        )}
      </section>

      <section className="solutions-section" aria-labelledby="active-solutions-title">
        <div className="solutions-section-header">
          <h2 id="active-solutions-title">My active solutions</h2>
        </div>

        {active.length > 0 ? (
          <div className="solution-tiles">
            {active.map((solution) => {
              const Icon = solution.icon
              return (
                <Link
                  key={solution.id}
                  to={`/app/solutions/${solution.slug}`}
                  className={`solution-tile solution-tile--${solution.accent}`}
                >
                  <div className="solution-tile-icon">
                    <Icon size={22} aria-hidden />
                  </div>
                  <div className="solution-tile-body">
                    <h3>{solution.title}</h3>
                    <p>{solution.shortDescription}</p>
                  </div>
                  <span className="solution-tile-cta">
                    Open {solution.title} <ArrowUpRight size={16} aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="empty-state empty-state--compact">
            <h3>No active solutions</h3>
            <p>Any modules tied to your current engagements will show here.</p>
          </div>
        )}
      </section>

      <section className="solutions-section" aria-labelledby="recent-solutions-title">
        <div className="solutions-section-header">
          <h2 id="recent-solutions-title">Recently used</h2>
        </div>

        {recent.length > 0 ? (
          <div className="solution-tiles">
            {recent.map((solution) => {
              const Icon = solution.icon
              return (
                <Link
                  key={solution.id}
                  to={`/app/solutions/${solution.slug}`}
                  className={`solution-tile solution-tile--${solution.accent}`}
                >
                  <div className="solution-tile-icon">
                    <Icon size={22} aria-hidden />
                  </div>
                  <div className="solution-tile-body">
                    <h3>{solution.title}</h3>
                    <p>{solution.shortDescription}</p>
                  </div>
                  <span className="solution-tile-cta">
                    Reopen <ArrowUpRight size={16} aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="empty-state empty-state--compact">
            <h3>No recent solutions</h3>
            <p>Recent module activity will appear here after you have opened a solution.</p>
          </div>
        )}
      </section>

      <section className="solutions-modules" aria-labelledby="solutions-modules-title">
        <div className="solutions-modules-head">
          <div>
            <h2 id="solutions-modules-title" className="solutions-modules-title">
              All solutions
            </h2>
            <p className="solutions-modules-sub">
              Explore the full catalogue of specialized modules and their business use cases.
            </p>
          </div>
        </div>

        {filteredSolutions.length === 0 ? (
          <div className="empty-state empty-state--compact solutions-empty-state">
            <h3>{EMPTY_STATE_MESSAGE}</h3>
            <button type="button" className="solutions-clear-btn" onClick={clearFilters}>
              <X size={14} aria-hidden />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="solutions-modules-grid">
            <div className="solution-tiles solutions-hub-tiles">
              {filteredSolutions.map((solution) => {
                const Icon = solution.icon
                return (
                  <Link
                    key={solution.id}
                    to={`/app/solutions/${solution.slug}`}
                    className={`solution-tile solution-tile--featured solution-tile--${solution.accent}`}
                  >
                    <div className="solution-tile-icon">
                      <Icon size={22} aria-hidden />
                    </div>
                    <div className="solution-tile-body">
                      <h3>{solution.title}</h3>
                      <p>{solution.shortDescription}</p>
                    </div>
                    <span className="solution-tile-cta">
                      Explore Solution <ArrowUpRight size={16} aria-hidden />
                    </span>
                  </Link>
                )
              })}
            </div>

            <aside className="solutions-roadmap-card" aria-label="Solution roadmap">
              <p className="solutions-roadmap-eyebrow">CHRONICLE</p>
              <h3 className="solutions-roadmap-title">Specialized workstreams</h3>
              <p className="solutions-roadmap-text">
                Each module builds on the same research, evidence, and customer approval flow rather than creating a separate engine.
              </p>
              <p className="solutions-roadmap-hint">
                Search and filter to find the right module, then start a new engagement from the solution detail page.
              </p>
            </aside>
          </div>
        )}
      </section>
    </div>
  )
}
