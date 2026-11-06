import { Bell, Search, UserCircle } from 'lucide-react'
import { getSession } from '../lib/authSession'
import './Topbar.css'

export default function Topbar() {
  const session = getSession()

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} aria-hidden />
        <input
          type="search"
          placeholder="Search engagements, solutions, customers..."
          aria-label="Search workspace"
        />
      </div>

      <div className="topbar-actions">
        <button className="notification-btn" aria-label="Notifications">
          <Bell size={19} />
        </button>

        <div className="topbar-user">
          <UserCircle size={30} />
          <div>
            <strong>{session?.displayName ?? 'Guest'}</strong>
            <span>Expert</span>
          </div>
        </div>
      </div>
    </header>
  )
}
