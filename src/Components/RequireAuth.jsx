import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


export default function RequireAuth ({allowedRoles}) {

 const {accessToken , role} = useSelector((state)=>state.auth)
   if(!accessToken) return <Navigate to ='/login'/>
   if(allowedRoles && !allowedRoles.includes(role)) return <Navigate to ='/login' />
   return <Outlet/>
}