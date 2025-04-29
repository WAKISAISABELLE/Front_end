

import { Navigate } from "react-router-dom"
import { useAuth } from "./auth/AuthContext"

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === "ceo") {
      return <Navigate to="/ceo-dashboard" replace />
    } else if (user.role === "manager") {
      return <Navigate to={`/manager-dashboard/${user.branch.id}`} replace />
    } else if (user.role === "sales_agent") {
      return <Navigate to={`/sales-agent/${user.branch.id}/dashboard`} replace />
    }

    // Fallback
    return <Navigate to="/login" replace />
  }

  return children
}
