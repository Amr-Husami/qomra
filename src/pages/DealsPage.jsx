/**
 * DealsPage.jsx
 * Special Deals — fetches products with discountActive=true from the API.
 * Shows a countdown timer per card + the discount percentage badge.
 */

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Tag, ShoppingCart, Heart, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { productsApi } from '../api/api'
import './DealsPage.css'

// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    pageTitle: 'العروض المميزة',
    home: 'الرئيسية',
    subtitle: 'أفضل الأسعار، لفترة محدودة فقط!',
    showing: 'اظهار',
    of: 'من',
    results: 'منتج',
    emptyTitle: 'لا توجد عروض حالياً 🎁',
    emptyDesc: 'تابعنا لتحصل على أحدث العروض والخصومات قريباً.',
    backToShop: 'تصفح المتجر',
    off: 'خصم',
    addToCart: 'أضف للسلة',
    added: '✓ تمت الإضافة',
    wishlist: 'أضف للمفضلة',
  },
  en: {
    pageTitle: 'Special Deals',
    home: 'Home',
    subtitle: 'Best prices, for a limited time only!',
    showing: 'Showing',
    of: 'of',
    results: 'products',
    emptyTitle: 'No deals right now 🎁',
    emptyDesc: 'Follow us to get the latest deals and discounts soon.',
    backToShop: 'Browse Shop',
    off: 'Off',
    addToCart: 'Add to Cart',
    added: '✓ Added!',
    wishlist: 'Add to Wishlist',
  },
}

// ─── NORMALIZE ────────────────────────────────────────────────
function normalizeProduct(p) {
  const imageObjects = Array.isArray(p.images) ? p.images : []
  const sorted = [...imageObjects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const firstImage = sorted[0]?.imageUrl || p.imageUrl || p.image || ''
  return {
    ...p,
    image: firstImage,
    originalPrice: p.originalPrice ?? p.price,
    finalPrice: p.finalPrice ?? p.price,
    rating: p.rating || 0,
  }
}

// ─── DEAL CARD ────────────────────────────────────────────────
function DealCard({ product, t, language }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp()
  const [added, setAdded] = useState(false)
  const inWishlist = isInWishlist(product.id)

  const discountPct = product.discountPercentage
    ?? (product.originalPrice > product.finalPrice
      ? Math.round(((product.originalPrice - product.finalPrice) / product.originalPrice) * 100)
      : 0)

  const handleCart = (e) => {
    e.preventDefault()
    addToCart({
      id: product.id,
      cartKey: `${product.id}-default`,
      name: product.nameEn,
      nameAr: product.nameAr,
      price: product.finalPrice,
      image: product.image,
      qty: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist({ id: product.id, name: product.nameEn, nameAr: product.nameAr, price: product.finalPrice, image: product.image })
  }

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={12} className={i < Math.round(rating) ? 'star star--filled' : 'star star--empty'} />
    ))

  return (
    <Link to={`/product/${product.id}`} className="deal-card">
      {/* Discount badge */}
      {discountPct > 0 && (
        <div className="deal-card__badge">
          <Tag size={12} />
          <span>{discountPct}% {t.off}</span>
        </div>
      )}

      {/* Image */}
      <div className="deal-card__img-wrap">
        <img src={product.image} alt={language === 'ar' ? product.nameAr : product.nameEn} className="deal-card__img" />

        {/* Hover actions */}
        <div className="deal-card__actions">
          <button
            className={`deal-card__action-btn ${inWishlist ? 'deal-card__action-btn--active' : ''}`}
            onClick={handleWishlist}
            title={t.wishlist}
          >
            <Heart size={15} fill={inWishlist ? 'var(--primary)' : 'none'} />
          </button>
          <button
            className={`deal-card__action-btn ${added ? 'deal-card__action-btn--added' : ''}`}
            onClick={handleCart}
            title={t.addToCart}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="deal-card__info">
        <h3 className="deal-card__name">
          {language === 'ar' ? product.nameAr : product.nameEn}
        </h3>
        <div className="deal-card__stars">{renderStars(product.rating)}</div>
        <div className="deal-card__price-row">
          <span className="deal-card__price-now">${product.finalPrice?.toLocaleString()}</span>
          {product.originalPrice > product.finalPrice && (
            <span className="deal-card__price-was">${product.originalPrice?.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────
function EmptyDeals({ t }) {
  return (
    <div className="deals-empty">
      <div className="deals-empty__icon">🏷️</div>
      <h3>{t.emptyTitle}</h3>
      <p>{t.emptyDesc}</p>
      <Link to="/shop" className="deals-empty__btn">{t.backToShop}</Link>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function DealsPage() {
  const { language } = useApp()
  const t = T[language]

  const [products,  setProducts]  = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [page,      setPage]      = useState(1)
  const LIMIT = 12

  const fetchDeals = useCallback(() => {
    setLoading(true)
    productsApi.getProducts({ discountActive: true, page, limit: LIMIT })
      .then(res => {
        const list = res.data || res.products || []
        setProducts(list.map(normalizeProduct))
        setTotal(res.pagination?.total || res.total || list.length)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { fetchDeals() }, [fetchDeals])

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <main className="deals-page">

      {/* ── HEADER ────────────────────────────── */}
      <div className="deals-header">
        <span className="deals-header__deco deals-header__deco--1">🏷️</span>
        <span className="deals-header__deco deals-header__deco--2">🎉</span>
        <span className="deals-header__deco deals-header__deco--3">⭐</span>
        <span className="deals-header__deco deals-header__deco--4">🎀</span>
        <div className="deals-header__content">
          <h1 className="deals-header__title">{t.pageTitle}</h1>
          <p className="deals-header__sub">{t.subtitle}</p>
          <nav className="deals-header__breadcrumb">
            <Link to="/">{t.home}</Link>
            <span>›</span>
            <span>{t.pageTitle}</span>
          </nav>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────── */}
      <div className="deals-container">

        {loading ? (
          <div className="deals-loading">
            <div className="deals-spinner" />
          </div>
        ) : products.length === 0 ? (
          <EmptyDeals t={t} />
        ) : (
          <>
            <p className="deals-count">
              {t.showing} {products.length} {t.of} {total} {t.results}
            </p>

            <div className="deals-grid">
              {products.map(p => (
                <DealCard key={p.id} product={p} t={t} language={language} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="deals-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`deals-page-btn ${n === page ? 'deals-page-btn--active' : ''}`}
                    onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
