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
import UserInfo from './pages/shop/user-account/UserInfo'
import Wishlist from './pages/shop/user-account/WishList'
import Address from './pages/shop/user-account/Address'
import AddNewAddress from './pages/shop/user-account/AddNewAddress'
import { EditAddress } from './pages/shop/user-account/EditAddress'
import CartPage from './pages/shop/CartPage'
import Checkout from './pages/shop/Checkout'
import Payment from './pages/shop/Payment'
import OrderSuccess from './pages/shop/OrderSuccess'
import OrderHistory from './pages/shop/OrderHistory'
import OrderDetails from './pages/shop/OrderDetails'
import OrderDetailsAdmin from './pages/admin/orders/OrderDetails'
import OrderList from './pages/admin/orders/OrdersList'
import AccountSettings from './pages/shop/user-account/AccountSettings'
import PhoneVerificationModal from './Components/PhoneVerifyModal'
import Wallet from './pages/shop/user-account/Wallet'
import SalesReport from './pages/admin/SalesReport'
import MyCoupons from './pages/shop/MyCoupons'
import PaymentFailed from './Components/PaymentFailed'
import TransactionList from './pages/admin/transaction/TransactionList'
import AdminPublicRoutes from './Components/AdminPublicRoutes'
import UserPublicRoutes from './Components/UserPublicRoutes'


function App() {
  const myTestVariable = "hello";
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>


        <Route element={<PublicRoutes />}>

          <Route path='/login' element={
            <UserPublicRoutes>
              <Login role='user'/>
            </UserPublicRoutes>
          } />

          <Route path='/signup' element={
            <UserPublicRoutes>
              <Signup />
            </UserPublicRoutes>
          } />
          <Route path='/admin/login' element={
            <AdminPublicRoutes>
              <Login role='admin' />
            </AdminPublicRoutes>
          } />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-otp' element={<OtpVerification />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/phone' element={<PhoneVerificationModal />} />
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
            <Route path="coupons/add" element={<AddCoupon />} />
            <Route path='coupons/:id/edit' element={<EditCoupon />} />
            <Route path='coupons' element={<Coupon />} />
            <Route path='orders' element={<OrderList />} />
            <Route path='orders/:orderId' element={<OrderDetailsAdmin />} />
            <Route path='sales-report' element={<SalesReport />} />
            <Route path='transactions' element={<TransactionList />} />
          </Route>
        </Route>



        <Route path='/' element={<UserLayout />}>

          <Route index element={<Home />} />

          <Route element={<RequireAuth allowedRoles={['user']} />}>
            <Route path='product/:id/details' element={<ProductDetails />} />
            <Route path='profile' element={<UserInfo />} />
            <Route path='orders' element={<OrderHistory />} />
            <Route path='orders/:orderId' element={<OrderDetails />} />
            <Route path='wishlist' element={<Wishlist />} />
            <Route path='addresses' element={<Address />} />
            <Route path='coupons' element={<MyCoupons />} />
            <Route path='wallet' element={<Wallet />} />
            <Route path='addresses/add' element={<AddNewAddress />} />
            <Route path='address/:addressId/edit' element={<EditAddress />} />
            <Route path='category/:slug' element={<CategoryPage />} />
            <Route path="/products/:slug" element={<CategoryPage />} />
            <Route path='cart' element={<CartPage />} />
            <Route path='checkout' element={<Checkout />} />

            <Route path='payment' element={<Payment />} />
            <Route path='order-success' element={<OrderSuccess />} />
            <Route path='settings' element={<AccountSettings />} />
            <Route path='payment-failed' element={<PaymentFailed />} />

          </Route>

        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App