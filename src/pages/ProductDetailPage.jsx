/**
 * ProductDetailPage.jsx — fully connected to real API
 */

import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Star, Heart, ShoppingCart, Minus, Plus,
  ChevronLeft, ChevronRight, Maximize2,
  Shield, Truck, ThumbsUp, RotateCcw, X
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { productsApi } from '../api/api'
import './ProductDetailPage.css'

// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    home: 'الرئيسية', store: 'المتجر',
    reviews: 'تقييم', sku: 'الرقم التعريفي:', category: 'الفئة:',
    color: 'اللون', size: 'الحجم', qty: 'الكمية',
    addToCart: 'أضف الى السلة',
    addToWishlist: 'أضف الى المفضلة',
    removeWishlist: 'إزالة من المفضلة',
    share: 'مشاركة:',
    tabInfo: 'معلومات المنتج', tabReviews: 'التقييمات و الاراء',
    productDetails: 'تفاصيل عن المنتج',
    shippingDetails: 'تفاصيل الشحن و الارجاع',
    outOf: '/5', basedOn: 'تم الحساب من اجمالي',
    reviewsLabel: 'تعليق',
    noReviews: 'لا توجد تقييمات بعد، كن أول من يقيّم هذا المنتج!',
    addReview: 'أضف تقييم',
    yourName: 'اسمك',
    yourReview: 'اكتب تقييمك هنا...',
    submitReview: 'إرسال التقييم',
    yourRating: 'تقييمك:',
    relatedTitle: 'منتجات نوصي بها لك',
    viewAll: 'مشاهدة الكل',
    discount: 'خصم',
    addedToCart: '✓ تمت الإضافة!',
    loading: 'جاري التحميل...',
    notFound: 'المنتج غير موجود',
    backToShop: 'العودة للمتجر',
    cancelReview: 'إلغاء',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    shippingPoints: [
      'التوصيل خلال 2-5 أيام عمل',
      'شحن مجاني على الطلبات فوق 300 جنيه',
      'إرجاع مجاني خلال 30 يوم',
    ],
    features: [
      { icon: <Shield size={26} />, title: 'دفع آمن', desc: 'طرق دفع مثل البطاقات والبنوك المحلية' },
      { icon: <Truck size={26} />, title: 'شحن سريع', desc: 'توصيل سريع وامن لطلباتك' },
      { icon: <ThumbsUp size={26} />, title: 'شهادات موثوقة', desc: 'شهادات مضمونة من جهات موثوقة' },
      { icon: <RotateCcw size={26} />, title: 'إرجاع خلال 30 يوم', desc: 'سياسة إرجاع مرنة وسهلة' },
    ],
  },
  en: {
    home: 'Home', store: 'Store',
    reviews: 'Reviews', sku: 'SKU:', category: 'Category:',
    color: 'Color', size: 'Size', qty: 'Quantity',
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    removeWishlist: 'Remove from Wishlist',
    share: 'Share:',
    tabInfo: 'Product Info', tabReviews: 'Reviews & Opinions',
    productDetails: 'Product Details',
    shippingDetails: 'Shipping & Returns',
    outOf: '/5', basedOn: 'Based on',
    reviewsLabel: 'reviews',
    noReviews: 'No reviews yet. Be the first to review this product!',
    addReview: 'Add Review',
    yourName: 'Your Name',
    yourReview: 'Write your review here...',
    submitReview: 'Submit Review',
    yourRating: 'Your Rating:',
    relatedTitle: 'Products We Recommend',
    viewAll: 'View All',
    discount: 'Off',
    addedToCart: '✓ Added!',
    loading: 'Loading...',
    notFound: 'Product not found',
    backToShop: 'Back to Shop',
    cancelReview: 'Cancel',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    shippingPoints: [
      'Delivery within 2–5 business days',
      'Free shipping on orders over 300 EGP',
      'Free returns within 30 days',
    ],
    features: [
      { icon: <Shield size={26} />, title: 'Safe Payment', desc: 'Multiple payment methods available' },
      { icon: <Truck size={26} />, title: 'Fast Shipping', desc: 'Fast and secure delivery for your orders' },
      { icon: <ThumbsUp size={26} />, title: 'Trusted Reviews', desc: 'Certified reviews from trusted sources' },
      { icon: <RotateCcw size={26} />, title: '30-Day Returns', desc: 'Flexible and easy return policy' },
    ],
  },
}

// ─── IMAGE NORMALIZER ─────────────────────────────────────────
const BASE = 'https://qomra-t8pr.onrender.com'
function fixImg(url) {
  if (!url || typeof url !== 'string') return '/placeholder.jpg'
  if (url.startsWith('http')) return url
  return `${BASE}${url.startsWith('/') ? '' : '/'}${url}`
}

function extractImages(images) {
  if (!images || !images.length) return ['/placeholder.jpg']
  return images.map(img => {
    if (typeof img === 'string') return fixImg(img)
    return fixImg(img.imageUrl || img.url || img.image || '')
  }).filter(Boolean)
}

// ─── PRODUCT NORMALIZER ──────────────────────────────────────
function normalizeProduct(raw) {
  if (!raw) return null
  return {
    id:            raw.id,
    nameAr:        raw.nameAr || raw.name || 'منتج',
    nameEn:        raw.nameEn || raw.name || 'Product',
    descriptionAr: raw.descriptionAr || raw.description || '',
    descriptionEn: raw.descriptionEn || raw.description || '',
    images:        extractImages(raw.images),
    price:         raw.finalPrice ?? raw.price ?? 0,
    originalPrice: raw.originalPrice ?? raw.price ?? 0,
    discountPercent: raw.discountPercent ?? 0,
    rating:        raw.rating ?? 0,
    reviewCount:   raw.reviewCount ?? raw._count?.reviews ?? 0,
    sku:           raw.sku || raw.id?.slice(0, 8).toUpperCase() || '—',
    categoryAr:    raw.category?.nameAr || raw.categoryAr || '',
    categoryEn:    raw.category?.nameEn || raw.categoryEn || '',
    stock:         raw.stock ?? 99,
    ageGroup:      raw.ageGroup || '',
    brand:         raw.brand?.nameEn || raw.brandEn || '',
  }
}

// ─── NORMALIZE REVIEWS ────────────────────────────────────────
function normalizeReview(r) {
  return {
    id:     r.id,
    name:   r.user?.firstName
              ? `${r.user.firstName} ${r.user.lastName || ''}`.trim()
              : (r.userName || r.name || 'مجهول'),
    avatar: r.user?.avatar || `https://i.pravatar.cc/48?u=${r.id}`,
    date:   r.createdAt
              ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : '',
    rating: r.rating ?? 0,
    text:   r.comment || r.text || r.body || '',
  }
}

// ─── STAR RENDERER ─────────────────────────────────────────────
function Stars({ rating, size = 14, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="stars-row">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={
            (interactive ? (hovered || rating) >= i : rating >= i)
              ? 'star star--filled' : 'star star--empty'
          }
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate && onRate(i)}
        />
      ))}
    </div>
  )
}

// ─── IMAGE GALLERY ─────────────────────────────────────────────
function ImageGallery({ images }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = () => setActiveIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setActiveIdx(i => (i + 1) % images.length)

  return (
    <>
      <div className="gallery">
        <div className="gallery__thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`gallery__thumb ${i === activeIdx ? 'gallery__thumb--active' : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              <img src={img} alt={`thumb-${i}`} />
            </button>
          ))}
        </div>

        <div className="gallery__main">
          <img src={images[activeIdx]} alt="product" className="gallery__main-img" />
          <button className="gallery__expand" onClick={() => setLightbox(true)}>
            <Maximize2 size={16} />
          </button>
          {images.length > 1 && (
            <>
              <button className="gallery__arrow gallery__arrow--prev" onClick={prev}>
                <ChevronLeft size={18} />
              </button>
              <button className="gallery__arrow gallery__arrow--next" onClick={next}>
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lightbox__close"><X size={22} /></button>
          <img src={images[activeIdx]} alt="product" onClick={e => e.stopPropagation()} />
          {images.length > 1 && (
            <>
              <button className="lightbox__arrow lightbox__arrow--prev" onClick={e => { e.stopPropagation(); prev() }}>
                <ChevronLeft size={24} />
              </button>
              <button className="lightbox__arrow lightbox__arrow--next" onClick={e => { e.stopPropagation(); next() }}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

// ─── PRODUCT INFO PANEL ─────────────────────────────────────────
function ProductInfo({ product, variants, t, language }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp()

  // Extract unique colors and sizes from variants
  const colors = []
  const sizes  = []
  const colorMap = {}
  variants.forEach(v => {
    if (v.color && !colorMap[v.color]) {
      colorMap[v.color] = true
      colors.push({ id: v.color, name: v.color, hex: v.colorHex || '#ccc' })
    }
    if (v.size && !sizes.includes(v.size)) sizes.push(v.size)
  })

  const [selectedColor, setSelectedColor] = useState(colors[0]?.id || null)
  const [selectedSize,  setSelectedSize]  = useState(sizes[0]  || null)
  const [qty,    setQty]    = useState(1)
  const [added,  setAdded]  = useState(false)

  const inWishlist = isInWishlist(product.id)
  const discount = product.discountPercent
    || (product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0)

  // Find the variant that matches selected color+size to get the right variantId
  const matchedVariant = variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  ) || variants[0]

  const handleAddToCart = () => {
    addToCart({
      id:       product.id,
      cartKey:  `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`,
      name:     product.nameEn,
      nameAr:   product.nameAr,
      price:    product.price,
      image:    product.images[0],
      qty,
      color:    selectedColor,
      size:     selectedSize,
      variantId: matchedVariant?.id,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = () => {
    toggleWishlist({
      id:     product.id,
      name:   product.nameEn,
      nameAr: product.nameAr,
      price:  product.price,
      image:  product.images[0],
    })
  }

  return (
    <div className="pd-info">
      {discount > 0 && (
        <div className="pd-discount-badge">
          <span>⚡ {t.discount} {discount}%</span>
        </div>
      )}

      <h1 className="pd-name">
        {language === 'ar' ? product.nameAr : product.nameEn}
      </h1>

      <div className="pd-rating-row">
        <Stars rating={Math.round(product.rating)} size={15} />
        <span className="pd-rating-num">{Number(product.rating).toFixed(1)}</span>
        <span className="pd-rating-count">({product.reviewCount} {t.reviews})</span>
      </div>

      <div className="pd-price-row">
        <span className="pd-price-current">{product.price} EGP</span>
        {product.originalPrice > product.price && (
          <span className="pd-price-original">{product.originalPrice} EGP</span>
        )}
      </div>

      <div className="pd-divider" />

      <div className="pd-meta">
        {product.sku && <p><span>{t.sku}</span> {product.sku}</p>}
        {(product.categoryAr || product.categoryEn) && (
          <p>
            <span>{t.category}</span>{' '}
            {language === 'ar' ? product.categoryAr : product.categoryEn}
          </p>
        )}
        <p>
          <span
            style={{ color: product.stock > 0 ? '#27ae60' : '#e74c3c', fontWeight: 700 }}
          >
            {product.stock > 0 ? t.inStock : t.outOfStock}
          </span>
        </p>
      </div>

      <div className="pd-divider" />

      {/* Color selector */}
      {colors.length > 0 && (
        <div className="pd-option-row">
          <label className="pd-option-label">
            {t.color}: <strong>{selectedColor}</strong>
          </label>
          <div className="pd-colors">
            {colors.map(c => (
              <button
                key={c.id}
                className={`pd-color-dot ${selectedColor === c.id ? 'pd-color-dot--active' : ''}`}
                style={{ background: c.hex }}
                onClick={() => setSelectedColor(c.id)}
                title={c.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {sizes.length > 0 && (
        <div className="pd-option-row">
          <label className="pd-option-label">
            {t.size}: <strong>{selectedSize}</strong>
          </label>
          <div className="pd-sizes">
            {sizes.map(size => (
              <button
                key={size}
                className={`pd-size-btn ${selectedSize === size ? 'pd-size-btn--active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pd-option-label">{t.qty}</div>
      <div className="pd-actions-row">
        <button
          className={`pd-wishlist-btn ${inWishlist ? 'pd-wishlist-btn--active' : ''}`}
          onClick={handleWishlist}
        >
          <Heart size={15} fill={inWishlist ? 'var(--primary)' : 'none'} />
          <span>{inWishlist ? t.removeWishlist : t.addToWishlist}</span>
        </button>

        <button
          className={`pd-cart-btn ${added ? 'pd-cart-btn--added' : ''}`}
          onClick={handleAddToCart}
        >
          {added ? t.addedToCart : <><ShoppingCart size={16} style={{ marginInlineEnd: 8 }} />{t.addToCart}</>}
        </button>

        <div className="pd-qty">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
          <span>{qty}</span>
          <button onClick={() => setQty(q => q + 1)}><Plus size={14} /></button>
        </div>
      </div>

      <div className="pd-share">
        <span>{t.share}</span>
        <div className="pd-share-icons">
          <a href="#" className="pd-share-icon pd-share-icon--fb">f</a>
          <a href="#" className="pd-share-icon pd-share-icon--tw">𝕏</a>
          <a href="#" className="pd-share-icon pd-share-icon--pin">𝕡</a>
          <a href="#" className="pd-share-icon pd-share-icon--ig">◎</a>
        </div>
      </div>
    </div>
  )
}

// ─── INFO TAB ─────────────────────────────────────────────────
function InfoTab({ product, t, language }) {
  const desc = language === 'ar' ? product.descriptionAr : product.descriptionEn

  return (
    <div className="tab-content">
      {desc && <p className="pd-desc">{desc}</p>}

      <h3 className="tab-section-title">{t.productDetails}</h3>
      <ul className="pd-bullets">
        {product.brand && (
          <li><strong>{language === 'ar' ? 'الماركة' : 'Brand'}:</strong> {product.brand}</li>
        )}
        {product.ageGroup && (
          <li><strong>{language === 'ar' ? 'الفئة العمرية' : 'Age Group'}:</strong> {product.ageGroup}</li>
        )}
        {product.sku && (
          <li><strong>SKU:</strong> {product.sku}</li>
        )}
        {(product.categoryAr || product.categoryEn) && (
          <li>
            <strong>{language === 'ar' ? 'الفئة' : 'Category'}:</strong>{' '}
            {language === 'ar' ? product.categoryAr : product.categoryEn}
          </li>
        )}
      </ul>

      <h3 className="tab-section-title">{t.shippingDetails}</h3>
      <ul className="pd-bullets">
        {t.shippingPoints.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  )
}

// ─── REVIEWS TAB ───────────────────────────────────────────────
function ReviewsTab({ productId, product, t, language }) {
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formText, setFormText] = useState('')
  const [formRating, setFormRating] = useState(0)

  useEffect(() => {
    productsApi.getReviews(productId)
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.reviews || data?.data || [])
        setReviews(arr.map(normalizeReview))
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [productId])

  // Compute breakdown from actual reviews
  const breakdown = [5, 4, 3, 2, 1].map(stars => {
    const count   = reviews.filter(r => Math.round(r.rating) === stars).length
    const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0
    return { stars, percent }
  })

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating

  const handleSubmit = async () => {
    if (!formText.trim() || formRating === 0) return
    try {
      await productsApi.addReview(productId, formRating, formText)
    } catch {}
    const newReview = {
      id:     Date.now(),
      name:   formName || (language === 'ar' ? 'مجهول' : 'Anonymous'),
      avatar: `https://i.pravatar.cc/48?u=${Date.now()}`,
      date:   new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      rating: formRating,
      text:   formText,
    }
    setReviews(prev => [newReview, ...prev])
    setShowForm(false)
    setFormName(''); setFormText(''); setFormRating(0)
  }

  return (
    <div className="tab-content">
      <div className="reviews-layout">

        {/* Rating overview */}
        <div className="reviews-overview">
          <div className="reviews-score">
            <span className="reviews-score__num">{avgRating}</span>
            <span className="reviews-score__out">/5</span>
          </div>
          <Stars rating={Math.round(avgRating)} size={20} />
          <p className="reviews-score__count">
            {t.basedOn} {reviews.length} {t.reviewsLabel}
          </p>

          <div className="reviews-breakdown">
            {breakdown.map(row => (
              <div key={row.stars} className="rb-row">
                <span className="rb-label">{row.stars} ★</span>
                <div className="rb-bar">
                  <div className="rb-bar__fill" style={{ width: `${row.percent}%` }} />
                </div>
                <span className="rb-pct">{row.percent}%</span>
              </div>
            ))}
          </div>

          <button className="add-review-btn" onClick={() => setShowForm(v => !v)}>
            {showForm ? t.cancelReview : t.addReview}
          </button>
        </div>

        {/* Review list */}
        <div className="reviews-list">
          {showForm && (
            <div className="review-form">
              <div className="rf-rating-row">
                <span>{t.yourRating}</span>
                <Stars rating={formRating} size={22} interactive onRate={setFormRating} />
              </div>
              <input
                className="rf-input"
                placeholder={t.yourName}
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
              <textarea
                className="rf-textarea"
                placeholder={t.yourReview}
                rows={4}
                value={formText}
                onChange={e => setFormText(e.target.value)}
              />
              <button className="rf-submit" onClick={handleSubmit}>
                {t.submitReview}
              </button>
            </div>
          )}

          {loading ? (
            <div className="pd-loading"><div className="pd-spinner" /></div>
          ) : reviews.length === 0 ? (
            <p className="pd-no-reviews">{t.noReviews}</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-card__head">
                  <div className="review-card__author">
                    <img src={review.avatar} alt={review.name} className="review-card__avatar" />
                    <div>
                      <p className="review-card__name">{review.name}</p>
                      <p className="review-card__date">{review.date}</p>
                    </div>
                  </div>
                  <Stars rating={review.rating} size={13} />
                </div>
                <p className="review-card__text">{review.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── FEATURES STRIP ───────────────────────────────────────────
function FeaturesStrip({ t }) {
  return (
    <section className="pd-features">
      <div className="pd-container">
        <div className="pd-features__grid">
          {t.features.map((f, i) => (
            <div key={i} className="pd-feature">
              <div className="pd-feature__icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════
export default function ProductDetailPage() {
  const { language } = useApp()
  const t = T[language]
  const { id } = useParams()

  const [product,  setProduct]  = useState(null)
  const [variants, setVariants] = useState([])
  const [related,  setRelated]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return }

    setLoading(true)
    setError(false)
    setProduct(null)

    Promise.allSettled([
      productsApi.getProductById(id),
      productsApi.getVariants(id),
      productsApi.getSuggested(4),
    ]).then(([prodRes, varRes, relRes]) => {
      if (prodRes.status === 'fulfilled' && prodRes.value) {
        const raw = prodRes.value?.product || prodRes.value?.data || prodRes.value
        setProduct(normalizeProduct(raw))
      } else {
        setError(true)
      }

      if (varRes.status === 'fulfilled') {
        const arr = Array.isArray(varRes.value) ? varRes.value
          : (varRes.value?.variants || varRes.value?.data || [])
        setVariants(arr)
      }

      if (relRes.status === 'fulfilled') {
        const arr = Array.isArray(relRes.value) ? relRes.value
          : (relRes.value?.products || relRes.value?.data || [])
        setRelated(arr.slice(0, 4).map(p => ({
          id:           p.id,
          nameAr:       p.nameAr || p.name,
          nameEn:       p.nameEn || p.name,
          price:        p.finalPrice ?? p.price ?? 0,
          originalPrice: p.originalPrice ?? p.price ?? 0,
          image:        extractImages(p.images)[0],
          rating:       p.rating ?? 0,
          reviewCount:  p.reviewCount ?? 0,
          discountPercent: p.discountPercent ?? 0,
        })))
      }
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="pd-page">
        <div className="pd-container" style={{ padding: '100px 28px', textAlign: 'center' }}>
          <div className="pd-spinner" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: 20, color: 'var(--text-secondary)' }}>{t.loading}</p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="pd-page">
        <div className="pd-container" style={{ padding: '100px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 64 }}>😕</div>
          <h2 style={{ marginTop: 20, color: 'var(--text)' }}>{t.notFound}</h2>
          <Link to="/shop" className="pd-back-btn">{t.backToShop}</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pd-page">
      <div className="pd-container">

        {/* BREADCRUMB */}
        <nav className="pd-breadcrumb">
          <Link to="/">{t.home}</Link>
          <span>›</span>
          <Link to="/shop">{t.store}</Link>
          <span>›</span>
          <span className="pd-breadcrumb__current">
            {language === 'ar' ? product.nameAr : product.nameEn}
          </span>
        </nav>

        {/* TOP: Gallery + Info */}
        <div className="pd-top">
          <ProductInfo product={product} variants={variants} t={t} language={language} />
          <ImageGallery images={product.images} />
        </div>

        {/* TABS */}
        <div className="pd-tabs">
          <div className="pd-tabs__bar">
            <button
              className={`pd-tab-btn ${activeTab === 'info' ? 'pd-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              {t.tabInfo}
            </button>
            <button
              className={`pd-tab-btn ${activeTab === 'reviews' ? 'pd-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              {t.tabReviews}
            </button>
          </div>

          {activeTab === 'info'
            ? <InfoTab product={product} t={t} language={language} />
            : <ReviewsTab productId={id} product={product} t={t} language={language} />
          }
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <section className="pd-related">
            <div className="sec-header">
              <h2 className="sec-title">{t.relatedTitle}</h2>
              <Link to="/shop" className="sec-view-all">{t.viewAll}</Link>
            </div>
            <div className="pd-related__grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>

      <FeaturesStrip t={t} />
    </main>
  )
}
