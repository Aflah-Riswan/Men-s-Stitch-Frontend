import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import PublicRoutes from './Components/PublicRoutes'
import UserLayout from './Components/layout/userLayout'
import  Category from './pages/admin/Category'
import AdminLayout from './Components/layout/adminLayout'
import DashboardDesign from './pages/admin/Dashboard'
import Login from './Login'
import RequireAuth from './Components/RequireAuth'
import Home from './Home'
import AddCategoryPage from './pages/admin/AddCategory'
import EditCategory from './pages/admin/EditCategory'
import ProductList from './pages/admin/products/ProductList'
import AddProducts from './pages/admin/products/AddProducts'
import EditProduct from './pages/admin/products/EditProduct'

function App() {
  return (
    <BrowserRouter>
      <Routes>

           
            <Route element={<PublicRoutes/>}>
                <Route path='/login' element={<Login/>} />
            </Route>


            <Route element={<RequireAuth allowedRoles={['admin']} />}>
                <Route path='/admin' element={<AdminLayout/>}>
                    <Route path='dashboard' element={<DashboardDesign/>} />
                    <Route path='products' element={<ProductList/>} />
                    <Route path ='products/add' element={<AddProducts/>} />
                    <Route path ='products/edit/:id' element={<EditProduct/>} />
                    <Route path ='categories' element={<Category/>}/>
                    <Route path ='categories/add' element={<AddCategoryPage/>}/>
                    <Route path ='categories/edit/:id' element ={<EditCategory/>}/>
                </Route>
            </Route>


  
            <Route path='/' element={<UserLayout/>}>
                
                <Route index element={<Home/>} />
               
                <Route element={<RequireAuth allowedRoles={['user', 'admin']} />}>
                    <Route path='profile' element={<h1>user profile</h1>} />
                    <Route path='orders' element={<h1>My Orders</h1>} />
                </Route>

            </Route>

       

      </Routes>
    </BrowserRouter>
  )
}

export default App