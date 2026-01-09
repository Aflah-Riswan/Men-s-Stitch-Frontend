import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function PublicRoutes() {
  const { userAccessToken, adminAccessToken } = useSelector((state) => state.auth)
  
  // LOGIC CHANGE:
  // Only redirect if we are trying to access a page that we don't need to see.
  // But since '/login' is used for both, we have to decide.
  
  // If you strictly want to allow an Admin to see the login page (to login as user):
  // You would simply REMOVE the admin check here.
  
  if (userAccessToken) {
    return <Navigate to='/' replace />
  }
  
  // REMOVE THIS BLOCK if you want Admins to be able to see the Login page
  /* if (adminAccessToken) {
    return <Navigate to='/admin/dashboard' replace />
  }
  */

  return <Outlet />
}