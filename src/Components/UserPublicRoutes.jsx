import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function UserPublicRoutes({children}) {
  const { userAccessToken } = useSelector((state) => state.auth)
  
  if (userAccessToken) {
    return <Navigate to='/' replace />
  }
  
  return children
}