import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ── Floating baby background decorations (shown on all pages) ──
function FloatingBabyDecor() {
  const items = [
    { emoji: '🍼', x: 4,  y: 12, size: 24, delay: 0,   dur: 7   },
    { emoji: '⭐', x: 14, y: 68, size: 20, delay: 1.5, dur: 10  },
    { emoji: '🎀', x: 89, y: 22, size: 22, delay: 2,   dur: 8   },
    { emoji: '🐥', x: 93, y: 58, size: 26, delay: 0.5, dur: 11  },
    { emoji: '🎈', x: 2,  y: 42, size: 28, delay: 3,   dur: 7.5 },
    { emoji: '🌙', x: 80, y: 83, size: 22, delay: 1,   dur: 12  },
    { emoji: '💕', x: 48, y: 4,  size: 20, delay: 2.5, dur: 9   },
    { emoji: '🧸', x: 24, y: 88, size: 24, delay: 4,   dur: 8.5 },
    { emoji: '🌟', x: 72, y: 8,  size: 18, delay: 0.8, dur: 10  },
    { emoji: '🍭', x: 38, y: 78, size: 22, delay: 3.5, dur: 9.5 },
    { emoji: '🦋', x: 60, y: 92, size: 20, delay: 1.2, dur: 11  },
    { emoji: '🌈', x: 55, y: 48, size: 26, delay: 5,   dur: 14  },
  ]
  return (
    <div className="baby-bg-decor" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className="baby-bg-item"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.dur}s`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  )
}
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
      <FloatingBabyDecor />
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