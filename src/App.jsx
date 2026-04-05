import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import AboutPage from './pages/AboutPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import ProfilePage from './pages/ProfilePage'
import { LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, VerifyPage } from './pages/AuthPages'

// ── Admin ─────────────────────────────────────────────────────
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBanners from './pages/admin/AdminBanners'
import AdminCategories from './pages/admin/AdminCategories'
import AdminBrands from './pages/admin/AdminBrands'

import './index.css'

function NotFoundPage() {
  return <div style={{ padding: '80px 20px', textAlign: 'center' }}><h1 style={{ fontSize: '72px', color: 'var(--primary)' }}>404</h1></div>
}

// Customer store — has Navbar + Footer
function StoreApp() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/shop"          element={<ShopPage />} />
        <Route path="/product/:id"   element={<ProductDetailPage />} />
        <Route path="/contact"       element={<ContactPage />} />
        <Route path="/about"         element={<AboutPage />} />
        <Route path="/faq"           element={<FAQPage />} />
        <Route path="/profile"       element={<ProfilePage />} />
        <Route path="/cart"          element={<CartPage />} />
        <Route path="/checkout"      element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/signup"          element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />
        <Route path="/verify"          element={<VerifyPage />} />
        <Route path="*"              element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin panel — no Navbar/Footer, own sidebar layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index             element={<AdminDashboard />} />
            <Route path="products"   element={<AdminProducts />} />
            <Route path="orders"     element={<AdminOrders />} />
            <Route path="users"      element={<AdminUsers />} />
            <Route path="banners"    element={<AdminBanners />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="brands"     element={<AdminBrands />} />
          </Route>

          {/* Customer store */}
          <Route path="/*" element={<StoreApp />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}