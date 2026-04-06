/**
 * Navbar.jsx
 * ─────────────────────────────────────────────────────────────
 * The main navigation bar — appears on EVERY page.
 * It has 3 parts on desktop:
 *   1. Top bar    → promo text + language switcher
 *   2. Middle bar → logo + search + icons
 *   3. Bottom nav → categories + page links + deals
 *
 * On mobile: simplified bar with logo + cart + hamburger menu
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, User, Sun, Moon,
  Menu, X, Trash2, ChevronDown, Flame, Tag, Globe, Search,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import './Navbar.css'

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────
// All text in the navbar — Arabic and English versions
const T = {
  ar: {
    promo: 'احصل على خصم 20% عند أول طلبة 🎉',
    promoLink: 'تسوق الان',
    searchPlaceholder: 'ابحث عن منتج .....',
    searchBtn: 'بحث',
    allCategories: 'كل التصنيفات',
    home: 'الرئيسية',
    store: 'المتجر',
    contact: 'تواصل معنا',
    more: 'المزيد',
    deals: 'عروض مميزة',
    hotDeals: 'خصومات عالية',
    specialOffers: 'عروض خاصة',
    cartTitle: 'المنتجات في السلة',
    close: 'إغلاق',
    total: 'الإجمالي',
    checkout: 'الانتقال الى الدفع',
    wishlistTitle: 'المفضلة',
    emptyCart: 'السلة فارغة',
    emptyWishlist: 'لا توجد منتجات في المفضلة',
    profile: 'الملف الشخصي',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    switchLang: 'English',
    categories: [
      { name: 'عربيات الأطفال', slug: 'strollers' },
      { name: 'ألعاب تعليمية', slug: 'toys' },
      { name: 'مستلزمات النوم', slug: 'sleeping' },
      { name: 'مستلزمات الطفل', slug: 'essentials' },
      { name: 'الطعام', slug: 'food' },
    ],
  },
  en: {
    promo: 'Get 20% off on your first order 🎉',
    promoLink: 'Shop now',
    searchPlaceholder: 'Search for a product.....',
    searchBtn: 'Search',
    allCategories: 'All Categories',
    home: 'Home',
    store: 'Store',
    contact: 'Contact Us',
    more: 'More',
    deals: 'Special Deals',
    hotDeals: 'Hot Deals',
    specialOffers: 'Special Offers',
    cartTitle: 'Cart Items',
    close: 'Close',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    wishlistTitle: 'Wishlist',
    emptyCart: 'Your cart is empty',
    emptyWishlist: 'Your wishlist is empty',
    profile: 'Profile',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    switchLang: 'العربية',
    categories: [
      { name: 'Baby Strollers', slug: 'strollers' },
      { name: 'Educational Toys', slug: 'toys' },
      { name: 'Sleeping Essentials', slug: 'sleeping' },
      { name: 'Baby Essentials', slug: 'essentials' },
      { name: 'Food', slug: 'food' },
    ],
  },
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function Navbar() {
  // Pull everything we need from the global context
  const {
    theme, toggleTheme,
    language, toggleLanguage,
    cart, removeFromCart, cartTotal, cartCount,
    wishlist, toggleWishlist,
    user, isLoggedIn, logout,
  } = useApp()

  // Local state — things only the navbar needs to know
  const [showCart, setShowCart] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navigate = useNavigate()
  const t = T[language] // current language translations

  // Close the categories dropdown when user clicks anywhere else
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.categories-wrapper')) {
        setShowCategories(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent background scrolling when a sidebar or menu is open
  useEffect(() => {
    document.body.style.overflow =
      showCart || showWishlist || showMobileMenu ? 'hidden' : ''
  }, [showCart, showWishlist, showMobileMenu])

  // Search handler
  const handleSearch = () => {
    if (!searchQuery.trim()) return
    // 🔌 API NEEDED: GET /api/products?search={searchQuery}
    // When you get results back, navigate to the shop page with the query
    navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
    setSearchQuery('')
    setShowMobileSearch(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    // sticky → stays at top when you scroll
    <header className="navbar-wrapper">

      {/* ══════════════════════════════════════
          PART 1: TOP BAR
          Promo text + language switcher
          ══════════════════════════════════════ */}
      <div className="top-bar">
        <div className="nb-container top-bar__inner">
          {/* Language button — clicking this toggles Arabic ↔ English */}
          <button className="lang-btn" onClick={toggleLanguage}>
            <Globe size={13} />
            <span>{t.switchLang}</span>
            <ChevronDown size={11} />
          </button>

          {/* Promo text in the center */}
          <p className="promo-text">
            {t.promo}&nbsp;
            <Link to="/shop" className="promo-link">{t.promoLink}</Link>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PART 2: MIDDLE BAR
          Logo + Search + Icons
          ══════════════════════════════════════ */}
      <div className="middle-bar">
        <div className="nb-container middle-bar__inner">

          {/* LOGO — clicking takes you home */}
          <Link to="/" className="logo">
            <span className="logo-ar">قمرة</span>
            <span className="logo-en">Qomra</span>
          </Link>

          {/* SEARCH BAR */}
          <div className="search-bar">
            {/* Input first (appears on right in RTL) */}
            <input
              type="text"
              className="search-input"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {/* Button (appears on left in RTL) */}
            <button className="search-btn" onClick={handleSearch}>
              {t.searchBtn}
            </button>
          </div>

          {/* ICONS GROUP */}
          <div className="icon-group">
            {/* Dark / Light mode toggle */}
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? t.darkMode : t.lightMode}
            >
              {theme === 'light' ? <Moon size={21} /> : <Sun size={21} />}
            </button>

            {/* Profile — /login if not logged in, /profile if logged in */}
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="icon-btn"
              title={t.profile}
            >
              <User size={21} />
              {isLoggedIn && <span className="badge badge--green">✓</span>}
            </Link>

            {/* Wishlist */}
            <button
              className="icon-btn"
              title={t.wishlistTitle}
              onClick={() => { setShowWishlist(true); setShowCart(false) }}
            >
              <Heart size={21} />
              {wishlist.length > 0 && (
                <span className="badge">{wishlist.length}</span>
              )}
            </button>

            {/* Cart */}
            <button
              className="icon-btn"
              title={t.cartTitle}
              onClick={() => { setShowCart(true); setShowWishlist(false) }}
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════
          PART 3: BOTTOM NAV
          Categories + Page links + Deals
          ══════════════════════════════════════ */}
      <nav className="bottom-nav">
        <div className="nb-container bottom-nav__inner">

          {/* ALL CATEGORIES — dropdown on click */}
          <div className="categories-wrapper">
            <button
              className="categories-btn"
              onClick={() => setShowCategories(!showCategories)}
            >
              <Menu size={15} />
              <span>{t.allCategories}</span>
              <ChevronDown
                size={13}
                style={{ transition: '0.2s', transform: showCategories ? 'rotate(180deg)' : 'none' }}
              />
            </button>

            {/* CATEGORIES DROPDOWN PANEL */}
            {showCategories && (
              <div className="cat-dropdown">
                {/* Header of dropdown */}
                <div className="cat-dropdown__head">
                  <Menu size={16} />
                  <span>{t.allCategories}</span>
                  <button onClick={() => setShowCategories(false)}>
                    <ChevronDown size={16} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                </div>

                {/* Regular categories */}
                {t.categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/shop?category=${cat.slug}`}
                    className="cat-item"
                    onClick={() => setShowCategories(false)}
                  >
                    {cat.name}
                  </Link>
                ))}

                {/* Special items at bottom */}
                <Link
                  to="/shop?category=hot-deals"
                  className="cat-item cat-item--hot"
                  onClick={() => setShowCategories(false)}
                >
                  <Flame size={15} />
                  {t.hotDeals}
                </Link>
                <Link
                  to="/shop?category=special-offers"
                  className="cat-item cat-item--special"
                  onClick={() => setShowCategories(false)}
                >
                  <Tag size={15} />
                  {t.specialOffers}
                </Link>
              </div>
            )}
          </div>

          {/* PAGE LINKS */}
          <div className="nav-links">
            <Link to="/" className="nav-link nav-link--active">{t.home}</Link>
            <Link to="/shop" className="nav-link">{t.store}</Link>
            <Link to="/contact" className="nav-link">{t.contact}</Link>
            <Link to="/about" className="nav-link">{t.more}</Link>
          </div>

          {/* DEALS — far end of nav */}
          <Link to="/deals" className="deals-link">{t.deals}</Link>

        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE NAV — only shows on small screens
          ══════════════════════════════════════ */}
      <div className="mobile-nav">
        <div className="mobile-nav__inner">
          {/* Hamburger → opens mobile menu */}
          <button className="icon-btn" onClick={() => setShowMobileMenu(true)}>
            <Menu size={24} />
          </button>

          {/* Logo center */}
          <Link to="/" className="logo logo--mobile">
            <span className="logo-ar">قمرة</span>
          </Link>

          {/* Right side: profile + search + cart */}
          <div className="mobile-right">
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="icon-btn"
              title={t.profile}
            >
              <User size={22} />
              {isLoggedIn && <span className="badge badge--green">✓</span>}
            </Link>
            <button className="icon-btn" onClick={() => setShowMobileSearch(v => !v)}>
              <Search size={22} />
            </button>
            <button className="icon-btn" onClick={() => setShowCart(true)}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Expandable search bar on mobile */}
        {showMobileSearch && (
          <div className="mobile-search">
            <input
              autoFocus
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>
              <Search size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          MOBILE MENU OVERLAY
          Full slide-in panel from the side
          ══════════════════════════════════════ */}
      {showMobileMenu && (
        <div
          className="overlay overlay--menu"
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {/* Menu header */}
            <div className="mob-menu__head">
              <Link to="/" className="logo" onClick={() => setShowMobileMenu(false)}>
                <span className="logo-ar">قمرة</span>
              </Link>
              <button className="icon-btn" onClick={() => setShowMobileMenu(false)}>
                <X size={22} />
              </button>
            </div>

            {/* Page links */}
            <nav className="mob-menu__links">
              <Link className="mob-link" to="/" onClick={() => setShowMobileMenu(false)}>{t.home}</Link>
              <Link className="mob-link" to="/shop" onClick={() => setShowMobileMenu(false)}>{t.store}</Link>
              <Link className="mob-link" to="/contact" onClick={() => setShowMobileMenu(false)}>{t.contact}</Link>
              <Link className="mob-link mob-link--deals" to="/deals" onClick={() => setShowMobileMenu(false)}>{t.deals}</Link>
              <Link
                className="mob-link mob-link--profile"
                to={isLoggedIn ? "/profile" : "/login"}
                onClick={() => setShowMobileMenu(false)}
              >
                <User size={16} />
                <span>{isLoggedIn ? t.profile : (language === 'ar' ? 'تسجيل الدخول' : 'Login')}</span>
              </Link>

              <div className="mob-divider" />
              <p className="mob-section-label">{t.allCategories}</p>

              {t.categories.map((cat) => (
                <Link
                  key={cat.slug}
                  className="mob-link"
                  to={`/shop?category=${cat.slug}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="mob-divider" />

              {/* Theme and language toggles */}
              <div className="mob-actions">
                <button onClick={toggleTheme}>
                  {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
                  <span>{theme === 'light' ? t.darkMode : t.lightMode}</span>
                </button>
                <button onClick={toggleLanguage}>
                  <Globe size={17} />
                  <span>{t.switchLang}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          CART SIDEBAR
          Slides in from the right
          ══════════════════════════════════════ */}
      {showCart && (
        <div className="overlay overlay--sidebar" onClick={() => setShowCart(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>

            {/* Sidebar header */}
            <div className="sidebar__head">
              <h3>{t.cartTitle}</h3>
              <button className="close-btn" onClick={() => setShowCart(false)}>
                {t.close} <X size={14} />
              </button>
            </div>

            {/* Sidebar items */}
            <div className="sidebar__body">
              {cart.length === 0 ? (
                <div className="empty-state">
                  <ShoppingCart size={52} strokeWidth={1} />
                  <p>{t.emptyCart}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartKey} className="s-item">
                    <img src={item.image} alt={item.name} />
                    <div className="s-item__info">
                      {/* Product name */}
                      <p className="s-item__name">
                        {language === 'ar' ? item.nameAr : item.name}
                      </p>
                      {/* Color + Size tags — only show if they exist */}
                      {(item.color || item.size) && (
                        <div className="s-item__tags">
                          {item.color && (
                            <span className="s-item__tag">
                              <span
                                className="s-item__color-dot"
                                style={{ background: item.colorHex }}
                              />
                              {language === 'ar' ? item.colorAr : item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="s-item__tag">{item.size}</span>
                          )}
                          {/* Quantity */}
                          <span className="s-item__tag">x{item.qty}</span>
                        </div>
                      )}
                      <span className="s-item__price">
                        {(item.price * item.qty).toFixed(2)}$
                      </span>
                    </div>
                    <button
                      className="s-item__del"
                      onClick={() => removeFromCart(item.cartKey)}
                      title="حذف"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer with total and checkout */}
            {cart.length > 0 && (
              <div className="sidebar__foot">
                <div className="total-row">
                  <span className="total-num">{cartTotal.toFixed(2)}$</span>
                  <span className="total-label">{t.total}</span>
                </div>
                <Link
                  to="/checkout"
                  className="checkout-btn"
                  onClick={() => setShowCart(false)}
                >
                  {t.checkout}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          WISHLIST SIDEBAR
          Same layout as cart
          ══════════════════════════════════════ */}
      {showWishlist && (
        <div className="overlay overlay--sidebar" onClick={() => setShowWishlist(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>

            <div className="sidebar__head">
              <h3>{t.wishlistTitle}</h3>
              <button className="close-btn" onClick={() => setShowWishlist(false)}>
                {t.close} <X size={14} />
              </button>
            </div>

            <div className="sidebar__body">
              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <Heart size={52} strokeWidth={1} />
                  <p>{t.emptyWishlist}</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="s-item">
                    <img src={item.image} alt={item.name} />
                    <div className="s-item__info">
                      <p className="s-item__name">
                        {language === 'ar' ? item.nameAr : item.name}
                      </p>
                      <span className="s-item__price">{item.price}$</span>
                    </div>
                    <button
                      className="s-item__del"
                      onClick={() => toggleWishlist(item)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </header>
  )
}