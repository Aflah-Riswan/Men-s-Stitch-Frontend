import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function PublicRoutes() {
  const { userAccessToken, adminAccessToken } = useSelector((state) => state.auth)
  
 
  
  // if (userAccessToken) {
  //   return <Navigate to='/' replace />
  // }
  
  //  if (adminAccessToken) {
  //   return <Navigate to='/admin/dashboard' replace />
  // }


  return <Outlet />
}