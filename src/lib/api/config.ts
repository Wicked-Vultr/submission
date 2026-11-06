/** Backend base URL; set VITE_API_BASE_URL in .env when the API is available. */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000'

export const apiV1 = (path: string) =>
  `${API_BASE_URL}/api/v1${path.startsWith('/') ? path : `/${path}`}`
