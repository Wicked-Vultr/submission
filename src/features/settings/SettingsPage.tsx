import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { signOut, getSession } from '../../lib/authSession'
import { API_BASE_URL } from '../../lib/api/config'
import '../dashboard/DashboardPage.css'
import './SettingsPage.css'

export default function SettingsPage() {
  const navigate = useNavigate()
  const session = getSession()

  function handleSignOut() {
    signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">PREFERENCES</p>
          <h1>Settings</h1>
          <p>Workspace and session (demo until auth API is connected).</p>
        </div>
      </header>

      <section className="dashboard-panel settings-panel">
        <h2>Account</h2>
        <dl className="settings-dl">
          <dt>Signed in as</dt>
          <dd>{session?.email ?? '—'}</dd>
          <dt>Display name</dt>
          <dd>{session?.displayName ?? '—'}</dd>
          <dt>API base URL</dt>
          <dd>
            <code>{API_BASE_URL}</code>
          </dd>
        </dl>
        <button type="button" className="signout-btn" onClick={handleSignOut}>
          <LogOut size={16} />
          Sign out
        </button>
      </section>
    </div>
  )
}
