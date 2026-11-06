const SESSION_KEY = 'eia_session'

export interface AuthSession {
  email: string
  displayName: string
  signedInAt: string
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function signIn(email: string, displayName?: string): void {
  const session: AuthSession = {
    email: email.trim().toLowerCase(),
    displayName: displayName?.trim() || email.split('@')[0] || 'Expert',
    signedInAt: new Date().toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}
