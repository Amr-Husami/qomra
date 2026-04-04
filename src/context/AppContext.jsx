import Cookies from 'js-cookie'
import { authApi } from '../api/api'
import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [theme, setTheme]     = useState('light')
  const [language, setLanguage] = useState('ar')
  const [cart, setCart]       = useState([])
  const [wishlist, setWishlist] = useState([])
  const [authReady, setAuthReady] = useState(false) // true once we've tried to restore session

  // ── AUTH STATE ────────────────────────────────────────────────
  // null = not logged in | object = logged in user
  const [user, setUser] = useState(null)

  // On every page load: if there's a token cookie, fetch the profile
  // and restore the user object so the session survives refresh.
  useEffect(() => {
    const token = Cookies.get('qomra_token')
    if (!token) { setAuthReady(true); return }

    authApi.getProfile()
      .then(data => {
        // Profile returns: { id, firstName, lastName, email, role, ... }
        const profile = data.user ?? data
        setUser({
          id:        profile.id,
          firstName: profile.firstName,
          lastName:  profile.lastName,
          email:     profile.email,
          role:      profile.role ?? profile.userRole ?? null,
        })
      })
      .catch(() => {
        // Token is invalid or expired — clear it
        Cookies.remove('qomra_token')
      })
      .finally(() => setAuthReady(true))
  }, [])

  const login = (userData) => setUser(userData)
  const logout = () => {
    authApi.logout()  // removes cookie
    setUser(null)
    setCart([])
  }

  const isLoggedIn = !!user
  // isAdmin = true if the user has ADMIN role
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin'

  // ── THEME & LANGUAGE ─────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', language)
  }, [language])

  const toggleTheme    = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const toggleLanguage = () => setLanguage(l => l === 'ar' ? 'en' : 'ar')

  // ── CART ─────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.cartKey === product.cartKey)
      if (exists) {
        return prev.map(item =>
          item.cartKey === product.cartKey
            ? { ...item, qty: item.qty + product.qty }
            : item
        )
      }
      return [...prev, product]
    })
  }

  const removeFromCart = (cartKey) =>
    setCart(prev => prev.filter(item => item.cartKey !== cartKey))

  const updateQty = (cartKey, newQty) => {
    if (newQty < 1) return
    setCart(prev =>
      prev.map(item =>
        item.cartKey === cartKey ? { ...item, qty: newQty } : item
      )
    )
  }

  // ── WISHLIST ─────────────────────────────────────────────────
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) return prev.filter(item => item.id !== product.id)
      return [...prev, product]
    })
  }

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId)

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  // Don't render anything until we know if the user is logged in.
  // This prevents a flash of "not logged in" before the profile loads.
  if (!authReady) return null

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      language, toggleLanguage,
      cart, addToCart, removeFromCart, updateQty, cartTotal, cartCount,
      wishlist, toggleWishlist, isInWishlist,
      user, login, logout, isLoggedIn, isAdmin,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
