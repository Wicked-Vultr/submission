import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Settings,
  ShoppingCart,
  LayoutGrid,
} from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">E</div>
        <span>Expert Intelligence</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">WORKSPACE</p>

        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        <NavLink
          to="/app/customers"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          <Users size={19} />
          Customers
        </NavLink>

        <NavLink
          to="/app/engagements"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          <BriefcaseBusiness size={19} />
          Engagements
        </NavLink>

        <p className="nav-label">SOLUTIONS</p>

        <NavLink
          to="/app/solutions"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          <LayoutGrid size={19} />
          Solutions hub
        </NavLink>

        <NavLink
          to="/app/solutions/procureiq"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          <ShoppingCart size={19} />
          ProcureIQ
        </NavLink>

        <p className="nav-label">PREFERENCES</p>

        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          <Settings size={19} />
          Settings
        </NavLink>
      </nav>
    </aside>
  )
}
