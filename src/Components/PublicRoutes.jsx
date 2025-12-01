import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export default function PublicRoutes({ allowedRoles }) {

  const { accessToken, role } = useSelector((state) => state.auth)
  if (accessToken) {
    if (role === 'admin') return <Navigate to='/admin/dashboard' replace />
    if (role === 'user') return <Navigate to='/' replace />
  }
return <Outlet />
  
} 