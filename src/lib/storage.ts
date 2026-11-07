export function storageAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const storage = window.localStorage
    const key = '__eia_storage_probe__'
    storage.setItem(key, key)
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readStorage<T>(key: string): T | null {
  const storage = getStorage()
  if (!storage) return null

  try {
    const raw = storage.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  const storage = getStorage()
  if (!storage) return false

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key: string): boolean {
  const storage = getStorage()
  if (!storage) return false

  try {
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}
