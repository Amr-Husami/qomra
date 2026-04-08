import Cookies from 'js-cookie'
import { authApi } from '../api/api'
import { createContext, useContext, useState, useEffect } from 'react'

// ── Coins helpers (localStorage) ─────────────────────────────
const COINS_KEY = 'qomra_coins'
const loadCoins = () => { try { return parseInt(localStorage.getItem(COINS_KEY) || '0', 10) } catch { return 0 } }
const saveCoinsLS = (n) => { try { localStorage.setItem(COINS_KEY, String(n)) } catch {} }

const AppContext = createContext()

export function AppProvider({ children }) {
  const [theme, setTheme]     = useState('light')
  const [language, setLanguage] = useState('ar')
  const [cart, setCart]       = useState([])
  const [wishlist, setWishlist] = useState([])
  const [coins, setCoins]     = useState(loadCoins)
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
    authApi.logout()
    setUser(null)
    setCart([])
  }

  // ── COINS ─────────────────────────────────────────────────
  // Earn coins: 1 coin per 10 EGP spent (called after order placed)
  const addCoins = (amount) => {
    setCoins(prev => {
      const next = prev + amount
      saveCoinsLS(next)
      return next
    })
  }
  // Redeem coins: deduct from balance (called at checkout)
  const redeemCoins = (amount) => {
    setCoins(prev => {
      const next = Math.max(0, prev - amount)
      saveCoinsLS(next)
      return next
    })
  }
  // How much money is a coin worth: 100 coins = 5 EGP
  const COINS_TO_EGP = 0.05  // 1 coin = 0.05 EGP, so 100 coins = 5 EGP

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
      coins, addCoins, redeemCoins, COINS_TO_EGP,
      user, login, logout, isLoggedIn, isAdmin,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
