import { readStorage, removeStorage, writeStorage } from './storage'

const SESSION_KEY = 'eia_session'

export interface AuthSession {
  email: string
  displayName: string
  signedInAt: string
}

export function getSession(): AuthSession | null {
  const session = readStorage<AuthSession>(SESSION_KEY)
  if (!session) {
    removeStorage(SESSION_KEY)
    return null
  }

  return session
}

export function signIn(email: string, displayName?: string): void {
  const session: AuthSession = {
    email: email.trim().toLowerCase(),
    displayName: displayName?.trim() || email.split('@')[0] || 'Expert',
    signedInAt: new Date().toISOString(),
  }
  writeStorage(SESSION_KEY, session)
}

export function signOut(): void {
  removeStorage(SESSION_KEY)
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}
