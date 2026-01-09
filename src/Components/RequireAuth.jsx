import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function RequireAuth({ allowedRoles }) {
  const { userAccessToken, adminAccessToken, userRole, adminRole } = useSelector((state) => state.auth)
  const location = useLocation()

  // 1. Determine which token/role we need to check based on the route requirements
  // If the route allows 'admin', check admin token. If 'user', check user token.
  
  const requireAdmin = allowedRoles?.includes('admin');
  const requireUser = allowedRoles?.includes('user');

  // 2. CHECK ADMIN ACCESS
  if (requireAdmin) {
    if (!adminAccessToken || adminRole !== 'admin') {
       return <Navigate to="/login" state={{ from: location }} replace />
    }
  }

  // 3. CHECK USER ACCESS
  if (requireUser) {
    if (!userAccessToken || userRole !== 'user') {
       return <Navigate to="/login" state={{ from: location }} replace />
    }
  }

  // 4. Authorized
  return <Outlet />
}