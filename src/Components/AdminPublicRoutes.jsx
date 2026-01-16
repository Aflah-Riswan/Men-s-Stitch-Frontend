
import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function AdminPublicRoutes({children}) {
  const { adminAccessToken } = useSelector((state) => state.auth)
  
 
  
  if (adminAccessToken) {
    return <Navigate to='/admin/dashboard' replace />
  }
  
  return children
}