import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import PublicRoutes from './Components/PublicRoutes'
import UserLayout from './Components/layout/userLayout'
import AdminLayout from './Components/layout/adminLayout'
import DashboardDesign from './pages/admin/Dashboard'
import Login from './Login'
import RequireAuth from './Components/RequireAuth'
import Home from './Home'
import ProductList from './pages/admin/products/ProductList'
import AddProducts from './pages/admin/products/AddProducts'
import EditProduct from './pages/admin/products/EditProduct'
import Category from './pages/admin/category/Category'
import EditCategory from './pages/admin/category/EditCategory'
import AddCategoryPage from './pages/admin/category/AddCategory'
import Signup from './pages/account/Signup'
import ForgotPassword from './pages/account/ForgotPassword'
import OtpVerification from './pages/account/OtpVerification'
import ResetPassword from './pages/account/ResetPassword'
import Customers from './pages/admin/customers/Customers'
import ProductDetails from './pages/shop/productDetails'
import CategoryPage from './pages/shop/CategoryPage'
import Bomb from './Components/Bomb'
import { Toaster } from 'react-hot-toast'
import NotFound from './Components/NotFound'
import AddCoupon from './pages/admin/coupon/AddCoupon'
import Coupon from './pages/admin/coupon/Coupon'
import EditCoupon from './pages/admin/coupon/EditCoupon'

function App() {
  const myTestVariable = "hello";
  return (
    <BrowserRouter>

      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>


        <Route element={<PublicRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-otp' element={<OtpVerification />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>


        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='dashboard' element={<DashboardDesign />} />
            <Route path='products' element={<ProductList />} />
            <Route path='products/add' element={<AddProducts />} />
            <Route path='products/edit/:id' element={<EditProduct />} />
            <Route path='categories' element={<Category />} />
            <Route path='categories/add' element={<AddCategoryPage />} />
            <Route path='categories/edit/:slug' element={<EditCategory />} />
            <Route path='customers' element={<Customers />} />
            <Route path="coupons/add" element={<AddCoupon/>} />
            <Route path ='coupons/:id/edit' element={<EditCoupon/>} />
            <Route path = 'coupons' element={<Coupon/>} />
          </Route>
        </Route>



        <Route path='/' element={<UserLayout />}>

          <Route index element={<Home />} />

          <Route element={<RequireAuth allowedRoles={['user', 'admin']} />}>
            <Route path='product/:id/details' element={<ProductDetails />} />
            <Route path='profile' element={<h1>user profile</h1>} />
            <Route path='orders' element={<h1>My Orders</h1>} />
            <Route path='category/:slug' element={<CategoryPage />} />
            <Route path="/products/:slug" element={<CategoryPage />} />
            
          </Route>

        </Route>

      
      <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App