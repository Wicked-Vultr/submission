import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../lib/authSession'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }

  return children
}
