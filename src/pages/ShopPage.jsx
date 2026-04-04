/**
 * ShopPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *  1. PageHeader     → pink banner with baby decorations
 *  2. FilterSidebar  → desktop right-side filters
 *  3. FilterPopup    → mobile filter modal
 *  4. TopBar         → results count + sort dropdown
 *  5. ProductsGrid   → 3 col desktop, 1 col mobile
 *  6. EmptyState     → when no results found
 *  7. Pagination     → < 1 2 3 4 >
 *  8. MobileBottomNav→ fixed bottom bar on mobile
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  SlidersHorizontal, ChevronDown, X,
  Home, Search, ShoppingCart, User, Store,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import {
  allProducts, filterOptions,
  sortOptions, PRODUCTS_PER_PAGE
} from '../data/shopData'
import './ShopPage.css'

// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    pageTitle: 'المتجر',
    home: 'الرئيسية',
    shop: 'المتجر',
    showing: 'اظهار',
    of: 'من',
    results: 'نتيجة',
    filterBy: 'الفلترة حسب:',
    filter: 'الفلتر',
    sortBy: 'ترتيب حسب',
    close: 'إغلاق',
    categories: 'التصنيفات',
    byPrice: 'حسب السعر',
    byColor: 'حسب اللون',
    byBrand: 'حسب الماركة',
    emptyTitle: 'فارغ حالياً، لكن المفاجآت قادمة قريباً 🎁',
    emptyDesc: 'جرب تصفح أقسام أخرى لتجد ما تبحث عنه.',
    emptyBtn: 'تصفح تصنيفات أخرى',
    prev: 'السابق',
    next: 'التالي',
    // Mobile bottom nav
    navHome: 'الرئيسية',
    navSearch: 'البحث',
    navShop: 'المتجر',
    navCart: 'السلة',
    navAccount: 'حسابي',
  },
  en: {
    pageTitle: 'Shop',
    home: 'Home',
    shop: 'Store',
    showing: 'Showing',
    of: 'of',
    results: 'results',
    filterBy: 'Filter by:',
    filter: 'Filter',
    sortBy: 'Sort By',
    close: 'Close',
    categories: 'Categories',
    byPrice: 'By Price',
    byColor: 'By Color',
    byBrand: 'By Brand',
    emptyTitle: 'Empty for now, but surprises are coming soon 🎁',
    emptyDesc: 'Try browsing other categories to find what you\'re looking for.',
    emptyBtn: 'Browse Other Categories',
    prev: 'Prev',
    next: 'Next',
    navHome: 'Home',
    navSearch: 'Search',
    navShop: 'Shop',
    navCart: 'Cart',
    navAccount: 'Account',
  },
}

// ══════════════════════════════════════════════════════════════
// PAGE HEADER — pink banner with baby decorations
// ══════════════════════════════════════════════════════════════
function PageHeader({ t }) {
  return (
    <div className="shop-header">
      {/* Decorative baby items */}
      <span className="shop-header__deco shop-header__deco--moon">🌙</span>
      <span className="shop-header__deco shop-header__deco--bottle1">🍼</span>
      <span className="shop-header__deco shop-header__deco--ball">🎀</span>
      <span className="shop-header__deco shop-header__deco--rainbow1">🌈</span>
      <span className="shop-header__deco shop-header__deco--bottle2">🍼</span>
      <span className="shop-header__deco shop-header__deco--star">⭐</span>
      <span className="shop-header__deco shop-header__deco--rainbow2">🌈</span>
      <span className="shop-header__deco shop-header__deco--pacifier">🧸</span>

      <div className="shop-header__content">
        <h1 className="shop-header__title">{t.pageTitle}</h1>
        <nav className="shop-header__breadcrumb">
          <Link to="/">{t.home}</Link>
          <span>›</span>
          <span>{t.shop}</span>
        </nav>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// FILTER SECTIONS — shared between sidebar & popup
// ══════════════════════════════════════════════════════════════
function FilterSections({ filters, setFilters, t, language }) {
  const toggle = (key, value) => {
    // 🔌 API NOTE: When filters change → call GET /api/products with new params
    setFilters(prev => {
      const arr = prev[key] || []
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      }
    })
  }

  return (
    <div className="filter-sections">

      {/* ── CATEGORIES ─────────────────────── */}
      <div className="filter-group">
        <h3 className="filter-group__title">{t.categories}</h3>
        <div className="filter-group__body">
          {filterOptions.categories.map(cat => (
            <label key={cat.id} className="filter-checkbox">
              <input
                type="checkbox"
                checked={(filters.categories || []).includes(cat.id)}
                onChange={() => toggle('categories', cat.id)}
              />
              <span className="filter-checkbox__box" />
              <span className="filter-checkbox__label">
                {language === 'ar' ? cat.nameAr : cat.nameEn}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ── PRICE ──────────────────────────── */}
      <div className="filter-group">
        <h3 className="filter-group__title">{t.byPrice}</h3>
        <div className="filter-group__body">
          {filterOptions.prices.map(p => (
            <label key={p.id} className="filter-checkbox">
              <input
                type="checkbox"
                checked={(filters.prices || []).includes(p.id)}
                onChange={() => toggle('prices', p.id)}
              />
              <span className="filter-checkbox__box" />
              <span className="filter-checkbox__label">
                {language === 'ar' ? p.labelAr : p.labelEn}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ── COLOR ──────────────────────────── */}
      <div className="filter-group">
        <h3 className="filter-group__title">{t.byColor}</h3>
        <div className="filter-group__body filter-group__body--colors">
          {filterOptions.colors.map(color => (
            <button
              key={color.id}
              className={`filter-color ${(filters.colors || []).includes(color.id) ? 'filter-color--active' : ''}`}
              onClick={() => toggle('colors', color.id)}
              title={language === 'ar' ? color.nameAr : color.nameEn}
            >
              <span
                className="filter-color__dot"
                style={{ background: color.hex }}
              />
              <span className="filter-color__label">
                {color.nameEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── BRAND ──────────────────────────── */}
      <div className="filter-group">
        <h3 className="filter-group__title">{t.byBrand}</h3>
        <div className="filter-group__body">
          {filterOptions.brands.map(brand => (
            <label key={brand.id} className="filter-checkbox">
              <input
                type="checkbox"
                checked={(filters.brands || []).includes(brand.id)}
                onChange={() => toggle('brands', brand.id)}
              />
              <span className="filter-checkbox__box" />
              <span className="filter-checkbox__label">
                {language === 'ar' ? brand.nameAr : brand.nameEn}
              </span>
            </label>
          ))}
        </div>
      </div>

    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// FILTER SIDEBAR — desktop right side
// ══════════════════════════════════════════════════════════════
function FilterSidebar({ filters, setFilters, t, language }) {
  return (
    <aside className="shop-sidebar">
      <FilterSections
        filters={filters}
        setFilters={setFilters}
        t={t}
        language={language}
      />
    </aside>
  )
}

// ══════════════════════════════════════════════════════════════
// FILTER POPUP — mobile bottom sheet
// ══════════════════════════════════════════════════════════════
function FilterPopup({ filters, setFilters, t, language, onClose }) {
  return (
    <div className="filter-popup-overlay" onClick={onClose}>
      <div className="filter-popup" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="filter-popup__head">
          <span className="filter-popup__title">{t.filterBy}</span>
          <button className="filter-popup__close" onClick={onClose}>
            {t.close} <X size={14} />
          </button>
        </div>

        {/* Filter sections */}
        <div className="filter-popup__body">
          <FilterSections
            filters={filters}
            setFilters={setFilters}
            t={t}
            language={language}
          />
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TOP BAR — results count + sort dropdown
// ══════════════════════════════════════════════════════════════
function TopBar({ total, showing, sort, setSort, t, language, onFilterClick }) {
  const [open, setOpen] = useState(false)
  const currentSort = sortOptions.find(s => s.id === sort) || sortOptions[0]

  return (
    <div className="shop-topbar">
      {/* Sort dropdown */}
      <div className="sort-wrap">
        <button className="sort-btn" onClick={() => setOpen(v => !v)}>
          <span>{language === 'ar' ? currentSort.labelAr : currentSort.labelEn}</span>
          <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </button>
        {open && (
          <div className="sort-dropdown">
            {sortOptions.map(opt => (
              <button
                key={opt.id}
                className={`sort-opt ${sort === opt.id ? 'sort-opt--active' : ''}`}
                onClick={() => { setSort(opt.id); setOpen(false) }}
              >
                {language === 'ar' ? opt.labelAr : opt.labelEn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count — center */}
      <p className="shop-results-count">
        {t.showing} {showing} {t.of} {total} {t.results}
      </p>

      {/* Mobile filter button */}
      <button className="mobile-filter-btn" onClick={onFilterClick}>
        <SlidersHorizontal size={15} />
        <span>{t.filter}</span>
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// EMPTY STATE
// ══════════════════════════════════════════════════════════════
function EmptyState({ t }) {
  return (
    <div className="shop-empty">
      <div className="shop-empty__icon">
        {/* Box with X SVG matching Figma */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="15" y="30" width="50" height="38" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
          <path d="M15 38 Q40 28 65 38" stroke="#d1d5db" strokeWidth="2" fill="none"/>
          <circle cx="52" cy="22" r="12" fill="#fff" stroke="#e8607a" strokeWidth="2"/>
          <path d="M47 17 L57 27 M57 17 L47 27" stroke="#e8607a" strokeWidth="2" strokeLinecap="round"/>
          <rect x="28" y="44" width="10" height="8" rx="1" fill="#d1d5db"/>
        </svg>
      </div>
      <h3 className="shop-empty__title">{t.emptyTitle}</h3>
      <p className="shop-empty__desc">{t.emptyDesc}</p>
      <Link to="/shop" className="shop-empty__btn">{t.emptyBtn}</Link>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// PAGINATION
// ══════════════════════════════════════════════════════════════
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Show max 5 page numbers
  const getPages = () => {
    const pages = []
    let start = Math.max(1, currentPage - 2)
    let end   = Math.min(totalPages, start + 4)
    if (end - start < 4) start = Math.max(1, end - 4)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="pagination">
      {/* Prev arrow */}
      <button
        className="page-btn page-btn--arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {/* Page numbers */}
      {getPages().map(page => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? 'page-btn--active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Next arrow */}
      <button
        className="page-btn page-btn--arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MOBILE BOTTOM NAV
// ══════════════════════════════════════════════════════════════
function MobileBottomNav({ t }) {
  const { cartCount } = useApp()
  return (
    <nav className="mobile-bottom-nav">
      <Link to="/profile" className="mbn-item">
        <User size={20} />
        <span>{t.navAccount}</span>
      </Link>
      <Link to="/checkout" className="mbn-item">
        <div className="mbn-cart-wrap">
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="mbn-badge">{cartCount}</span>}
        </div>
        <span>{t.navCart}</span>
      </Link>
      <Link to="/shop" className="mbn-item mbn-item--active">
        <Store size={20} />
        <span>{t.navShop}</span>
      </Link>
      <Link to="/search" className="mbn-item">
        <Search size={20} />
        <span>{t.navSearch}</span>
      </Link>
      <Link to="/" className="mbn-item">
        <Home size={20} />
        <span>{t.navHome}</span>
      </Link>
    </nav>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN: ShopPage
// ══════════════════════════════════════════════════════════════
export default function ShopPage() {
  const { language } = useApp()
  const t = T[language]
  const [searchParams] = useSearchParams()

  // State
  const [filters,     setFilters]     = useState({
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    prices:     [],
    colors:     [],
    brands:     [],
  })
  const [sort,        setSort]        = useState('default')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilter,  setShowFilter]  = useState(false)

  // Reset to page 1 whenever filters or sort change
  useEffect(() => { setCurrentPage(1) }, [filters, sort])

  // ── FILTER LOGIC ─────────────────────────────────────────────
  // 🔌 In real app: send filters to API, get back filtered products
  // For now we filter the fake data locally
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category))
    }

    // Filter by price range
    if (filters.prices.length > 0) {
      result = result.filter(p => {
        return filters.prices.some(priceId => {
          const range = filterOptions.prices.find(pr => pr.id === priceId)
          return range && p.price >= range.min && p.price <= range.max
        })
      })
    }

    // Filter by color
    if (filters.colors.length > 0) {
      result = result.filter(p => filters.colors.includes(p.colors))
    }

    // Filter by brand
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand))
    }

    // Sort
    if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating)

    return result
  }, [filters, sort])

  // ── PAGINATION ───────────────────────────────────────────────
  const totalPages    = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const start         = (currentPage - 1) * PRODUCTS_PER_PAGE
  const pageProducts  = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)

  // Close filter popup when window resizes to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 767) setShowFilter(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className="shop-page">

      {/* 1. Page header */}
      <PageHeader t={t} />

      {/* 2. Main content */}
      <div className="shop-container">
        <div className="shop-layout">

          {/* ── LEFT: products area ──────────── */}
          <div className="shop-main">

            {/* Top bar */}
            <TopBar
              total={filteredProducts.length}
              showing={Math.min(PRODUCTS_PER_PAGE, pageProducts.length)}
              sort={sort}
              setSort={setSort}
              t={t}
              language={language}
              onFilterClick={() => setShowFilter(true)}
            />

            {/* Products grid OR empty state */}
            {pageProducts.length === 0 ? (
              <EmptyState t={t} />
            ) : (
              <>
                <div className="shop-grid">
                  {pageProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </>
            )}
          </div>

          {/* ── RIGHT: filter sidebar (desktop) ── */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            t={t}
            language={language}
          />

        </div>
      </div>

      {/* 3. Mobile filter popup */}
      {showFilter && (
        <FilterPopup
          filters={filters}
          setFilters={setFilters}
          t={t}
          language={language}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* 4. Mobile bottom navigation */}
      <MobileBottomNav t={t} />

    </main>
  )
}
