import { NavLink, useParams } from 'react-router-dom'
import './EngagementTabs.css'

const TABS = [
  { suffix: '', label: 'Overview' },
  { suffix: '/research', label: 'Research' },
  { suffix: '/findings', label: 'Findings' },
  { suffix: '/recommendations', label: 'Recommendations' },
  { suffix: '/roadmap', label: 'Roadmap' },
  { suffix: '/review', label: 'Customer review' },
] as const

export default function EngagementTabs() {
  const { id } = useParams<{ id: string }>()

  if (!id) return null

  const base = `/app/engagements/${id}`

  return (
    <nav className="engagement-tabs" aria-label="Engagement sections">
      {TABS.map((tab) => (
        <NavLink
          key={tab.label}
          to={`${base}${tab.suffix}`}
          end={tab.suffix === ''}
          className={({ isActive }) =>
            isActive ? 'engagement-tab engagement-tab--active' : 'engagement-tab'
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
