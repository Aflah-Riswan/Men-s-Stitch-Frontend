

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardDesign from './pages/admin/Dashboard'
import { useSelector } from 'react-redux'
// import RequireAuth from './RequireAuth'
import Login from './pages/Login'
import Home from './Home'


function App() {
  const {role,accessToken}=useSelector((state)=>state.auth)
  return (
    <>
     <BrowserRouter>
     <Routes>
       <Route path='/login'  element={
        role  === "admin" ? <Navigate to ='/admin/dashboard'/>
        : role ==='user' ? <Navigate to ='/'/> : <Login/>
        }/>
        <Route path = '/' element={<Home/>}/>
        <Route path ='/admin/dashboard' element={role ? <DashboardDesign/> : <Navigate to ='/login' />}/>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
