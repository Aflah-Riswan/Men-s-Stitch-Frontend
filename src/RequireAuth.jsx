// import { useSelector } from "react-redux"
// import { useNavigate, Outlet } from "react-router-dom"


// const RequireAuth = ({allowedRoles})=>{
//  const navigate = useNavigate()
// const {accessToken ,role} = useSelector((state)=>state.auth)
//  if(!accessToken) return navigate('/login')
//   if(allowedRoles && allowedRoles.includes(role)){
//     return navigate('/login')
//   }

//   return <Outlet/>

// }
// export default RequireAuth