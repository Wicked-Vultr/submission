import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Settings,
  ShoppingCart,
  LayoutGrid,
  BookOpen,
} from 'lucide-react'
import './Sidebar.css'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon brand-icon--gradient">∞</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-title">Expert Intelligence</span>
          <span className="sidebar-brand-sub">Assistant</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">Workspace</p>

        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link--active' : 'nav-link'
          }
        >
          <LayoutDashboard size={19} strokeWidth={2} />
          Home
        </NavLink>

        <NavLink
          to="/app/engagements"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link--active' : 'nav-link'
          }
        >
          <BriefcaseBusiness size={19} strokeWidth={2} />
          My Engagements
        </NavLink>

        <NavLink
          to="/app/customers"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link--active' : 'nav-link'
          }
        >
          <Users size={19} strokeWidth={2} />
          Customers
        </NavLink>

        <p className="nav-label">Solutions</p>

        <NavLink
          to="/app/solutions"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link--active' : 'nav-link'
          }
        >
          <LayoutGrid size={19} strokeWidth={2} />
          Solutions hub
        </NavLink>

        <NavLink
          to="/app/solutions/procureiq"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link--active' : 'nav-link'
          }
        >
          <ShoppingCart size={19} strokeWidth={2} />
          ProcureIQ
        </NavLink>

        <p className="nav-label">Resources</p>

        <a className="nav-link nav-link--muted" href="#knowledge">
          <BookOpen size={19} strokeWidth={2} />
          Knowledge Hub
        </a>

        <p className="nav-label">Preferences</p>

        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link--active' : 'nav-link'
          }
        >
          <Settings size={19} strokeWidth={2} />
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-chronicle">
        <p className="sidebar-chronicle-label">Powered by CHRONICLE</p>
        <p className="sidebar-chronicle-sub">Research · Discover · Recommend</p>
      </div>
    </aside>
  )
}
