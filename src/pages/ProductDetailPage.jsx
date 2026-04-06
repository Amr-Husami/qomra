/**
 * ProductDetailPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *  1. Breadcrumb
 *  2. Product Top   → images gallery + product info (name, price,
 *                     color, size, qty, add to cart, wishlist, share)
 *  3. Tabs          → "معلومات المنتج" | "التقييمات و الاراء"
 *  4. Info Tab      → product details bullets + shipping bullets
 *  5. Reviews Tab   → rating overview + review list + add review form
 *  6. Related Products
 *  7. Features Strip
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Star, Heart, ShoppingCart, Minus, Plus,
  ChevronLeft, ChevronRight, Maximize2,
  Shield, Truck, ThumbsUp, RotateCcw, X
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import {
  productDetail, productReviews,
  ratingBreakdown, relatedProducts
} from '../data/productData'
import './ProductDetailPage.css'

// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    home: 'الرئيسية', store: 'المتجر', productName: 'اسم المنتج',
    reviews: 'تقييم', sku: 'SKU:', category: 'Category:',
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
    addReview: 'أضف تقييم',
    yourName: 'اسمك',
    yourReview: 'اكتب تقييمك هنا...',
    submitReview: 'إرسال التقييم',
    yourRating: 'تقييمك:',
    relatedTitle: 'منتجات نوصي بها لك',
    viewAll: 'مشاهدة الكل',
    discount: 'خصم',
    addedToCart: '✓ تمت الإضافة!',
    features: [
      { icon: <Shield size={26} />, title: 'دفع آمن', desc: 'طرق دفع مثل البطاقات والبنوك المحلية' },
      { icon: <Truck size={26} />, title: 'شحن سريع', desc: 'توصيل سريع وامن لطلباتك ابينا' },
      { icon: <ThumbsUp size={26} />, title: 'شهادات موثوقة', desc: 'شهادات مضمونة من جهات موثوقة' },
      { icon: <RotateCcw size={26} />, title: 'إرجاع خلال 30 يوم', desc: 'سياسة إرجاع مرنة وسهلة' },
    ],
    cancelReview: 'إلغاء',
  },
  en: {
    home: 'Home', store: 'Store', productName: 'Product Name',
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
    addReview: 'Add Review',
    yourName: 'Your Name',
    yourReview: 'Write your review here...',
    submitReview: 'Submit Review',
    yourRating: 'Your Rating:',
    relatedTitle: 'Products We Recommend',
    viewAll: 'View All',
    discount: 'Off',
    addedToCart: '✓ Added!',
    features: [
      { icon: <Shield size={26} />, title: 'Safe Payment', desc: 'Multiple payment methods available' },
      { icon: <Truck size={26} />, title: 'Fast Shipping', desc: 'Fast and secure delivery for your orders' },
      { icon: <ThumbsUp size={26} />, title: 'Trusted Reviews', desc: 'Certified reviews from trusted sources' },
      { icon: <RotateCcw size={26} />, title: '30-Day Returns', desc: 'Flexible and easy return policy' },
    ],
    cancelReview: 'Cancel',
  },
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
        {/* Thumbnails — vertical strip on the right (RTL) */}
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

        {/* Main image */}
        <div className="gallery__main">
          <img
            src={images[activeIdx]}
            alt="product"
            className="gallery__main-img"
          />

          {/* Expand button */}
          <button className="gallery__expand" onClick={() => setLightbox(true)}>
            <Maximize2 size={16} />
          </button>

          {/* Arrows */}
          <button className="gallery__arrow gallery__arrow--prev" onClick={prev}>
            <ChevronLeft size={18} />
          </button>
          <button className="gallery__arrow gallery__arrow--next" onClick={next}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Lightbox — fullscreen image viewer */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lightbox__close"><X size={22} /></button>
          <img
            src={images[activeIdx]}
            alt="product"
            onClick={e => e.stopPropagation()}
          />
          <button className="lightbox__arrow lightbox__arrow--prev" onClick={e => { e.stopPropagation(); prev() }}>
            <ChevronLeft size={24} />
          </button>
          <button className="lightbox__arrow lightbox__arrow--next" onClick={e => { e.stopPropagation(); next() }}>
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  )
}

// ─── PRODUCT INFO PANEL ─────────────────────────────────────────
function ProductInfo({ product, productId, t, language }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp()
  const [selectedColor, setSelectedColor] = useState(product.defaultColor)
  const [selectedSize, setSelectedSize] = useState(product.defaultSize)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const inWishlist = isInWishlist(productId)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const currentColorName = product.colors.find(c => c.id === selectedColor)

  const handleAddToCart = () => {
    // 🔌 API NEEDED: POST /api/cart  { productId, qty, color, size }
    addToCart({
      id: productId,
      cartKey: `${productId}-${selectedColor || 'default'}-${selectedSize || 'default'}`,
      name: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
      qty,
      color: currentColorName?.nameEn,
      colorAr: currentColorName?.nameAr,
      colorHex: product.colors.find(c => c.id === selectedColor)?.hex,
      size: selectedSize,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = () => {
    // 🔌 API NEEDED: POST /api/wishlist/toggle  { productId }
    toggleWishlist({
      id: productId,
      name: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
    })
  }

  return (
    <div className="pd-info">
      {/* Discount badge */}
      <div className="pd-discount-badge">
        <span>⚡ {t.discount} {discount}%</span>
      </div>

      {/* Product name */}
      <h1 className="pd-name">
        {language === 'ar' ? product.nameAr : product.nameEn}
      </h1>

      {/* Rating row */}
      <div className="pd-rating-row">
        <Stars rating={Math.round(product.rating)} size={15} />
        <span className="pd-rating-num">{product.rating}</span>
        <span className="pd-rating-count">({product.reviewCount} {t.reviews})</span>
      </div>

      {/* Price */}
      <div className="pd-price-row">
        <span className="pd-price-current">${product.price}.00</span>
        <span className="pd-price-original">${product.originalPrice}.00</span>
      </div>

      <div className="pd-divider" />

      {/* SKU + Category */}
      <div className="pd-meta">
        <p><span>{t.sku}</span> {product.sku}</p>
        <p><span>{t.category}</span> {language === 'ar' ? product.categoryAr : product.categoryEn}</p>
      </div>

      <div className="pd-divider" />

      {/* Color selector */}
      <div className="pd-option-row">
        <label className="pd-option-label">
          {t.color}:&nbsp;
          <strong>{language === 'ar' ? currentColorName?.nameAr : currentColorName?.nameEn}</strong>
        </label>
        <div className="pd-colors">
          {product.colors.map(color => (
            <button
              key={color.id}
              className={`pd-color-dot ${selectedColor === color.id ? 'pd-color-dot--active' : ''}`}
              style={{ background: color.hex }}
              onClick={() => setSelectedColor(color.id)}
              title={language === 'ar' ? color.nameAr : color.nameEn}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div className="pd-option-row">
        <label className="pd-option-label">
          {t.size}: <strong>{selectedSize}</strong>
        </label>
        <div className="pd-sizes">
          {product.sizes.map(size => (
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

      {/* Quantity + Add to Cart + Wishlist */}
      <div className="pd-option-label">{t.qty}</div>
      <div className="pd-actions-row">
        {/* Wishlist button */}
        <button className={`pd-wishlist-btn ${inWishlist ? 'pd-wishlist-btn--active' : ''}`} onClick={handleWishlist}>
          <Heart size={15} fill={inWishlist ? 'var(--primary)' : 'none'} />
          <span>{inWishlist ? t.removeWishlist : t.addToWishlist}</span>
        </button>

        {/* Add to cart */}
        <button
          className={`pd-cart-btn ${added ? 'pd-cart-btn--added' : ''}`}
          onClick={handleAddToCart}
        >
          {added ? t.addedToCart : t.addToCart}
        </button>

        {/* Qty controls */}
        <div className="pd-qty">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
          <span>{qty}</span>
          <button onClick={() => setQty(q => q + 1)}><Plus size={14} /></button>
        </div>
      </div>

      {/* Share */}
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

// ─── PRODUCT INFO TAB ──────────────────────────────────────────
function InfoTab({ product, t, language }) {
  const infoPoints = language === 'ar' ? product.infoPointsAr : product.infoPointsEn
  const shippingPoints = language === 'ar' ? product.shippingPointsAr : product.shippingPointsEn

  return (
    <div className="tab-content">
      {/* Product description */}
      <p className="pd-desc">
        {language === 'ar' ? product.descriptionAr : product.descriptionEn}
      </p>

      {/* Details bullets */}
      <h3 className="tab-section-title">{t.productDetails}</h3>
      <ul className="pd-bullets">
        {infoPoints.map((point, i) => (
          <li key={i}>
            <strong>{point.label}:</strong> {point.value}
          </li>
        ))}
      </ul>

      {/* Shipping bullets */}
      <h3 className="tab-section-title">{t.shippingDetails}</h3>
      <ul className="pd-bullets">
        {shippingPoints.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  )
}

// ─── REVIEWS TAB ───────────────────────────────────────────────
function ReviewsTab({ product, reviews, breakdown, t, language }) {
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formText, setFormText] = useState('')
  const [formRating, setFormRating] = useState(0)
  const [localReviews, setLocalReviews] = useState(reviews)

  const handleSubmit = () => {
    if (!formName.trim() || !formText.trim() || formRating === 0) return

    // 🔌 API NEEDED: POST /api/products/:id/reviews  { name, text, rating }
    const newReview = {
      id: Date.now(),
      nameAr: formName, nameEn: formName,
      avatar: `https://i.pravatar.cc/48?u=${formName}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      rating: formRating,
      image: null,
      textAr: formText, textEn: formText,
    }

    setLocalReviews(prev => [newReview, ...prev])
    setShowForm(false)
    setFormName(''); setFormText(''); setFormRating(0)
  }

  return (
    <div className="tab-content">
      <div className="reviews-layout">

        {/* LEFT: Rating overview */}
        <div className="reviews-overview">
          <div className="reviews-score">
            <span className="reviews-score__num">{product.rating}</span>
            <span className="reviews-score__out">{t.outOf}5</span>
          </div>
          <Stars rating={Math.round(product.rating)} size={20} />
          <p className="reviews-score__count">
            {t.basedOn} {product.reviewCount} {t.reviewsLabel}
          </p>

          {/* Star breakdown bars */}
          <div className="reviews-breakdown">
            {breakdown.map(row => (
              <div key={row.stars} className="rb-row">
                <span className="rb-label">{row.stars} Stars</span>
                <div className="rb-bar">
                  <div className="rb-bar__fill" style={{ width: `${row.percent}%` }} />
                </div>
                <span className="rb-pct">{row.percent}%</span>
              </div>
            ))}
          </div>

          {/* Add review button */}
          <button className="add-review-btn" onClick={() => setShowForm(v => !v)}>
            {showForm ? t.cancelReview : t.addReview}
          </button>
        </div>

        {/* RIGHT: Review list */}
        <div className="reviews-list">
          {/* Add review form */}
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

          {/* Review cards */}
          {localReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-card__head">
                <div className="review-card__author">
                  <img src={review.avatar} alt={review.nameAr} className="review-card__avatar" />
                  <div>
                    <p className="review-card__name">
                      {language === 'ar' ? review.nameAr : review.nameEn}
                    </p>
                    <p className="review-card__date">{review.date}</p>
                  </div>
                </div>
                <Stars rating={review.rating} size={13} />
              </div>
              <p className="review-card__text">
                {language === 'ar' ? review.textAr : review.textEn}
              </p>
              {review.image && (
                <img src={review.image} alt="review" className="review-card__img" />
              )}
            </div>
          ))}
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

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════
export default function ProductDetailPage() {
  const { language } = useApp()
  const t = T[language]
  const [activeTab, setActiveTab] = useState('reviews') // 'info' | 'reviews'
  const { id } = useParams()

  // Use URL param id (UUID string) if available, otherwise fall back to static data id
  const productId = id || productDetail.id
  const product = productDetail

  return (
    <main className="pd-page">
      <div className="pd-container">

        {/* ── BREADCRUMB ──────────────────────────── */}
        <nav className="pd-breadcrumb">
          <Link to="/">{t.home}</Link>
          <span>›</span>
          <Link to="/shop">{t.store}</Link>
          <span>›</span>
          <span className="pd-breadcrumb__current">
            {language === 'ar' ? product.nameAr : product.nameEn}
          </span>
        </nav>

        {/* ── TOP SECTION: Images + Info ────────── */}
        {/*
         * Layout (RTL):  [Info Panel]  [Gallery]
         * Layout (LTR):  [Gallery]  [Info Panel]
         * On mobile: gallery first (order), then info
         */}
        <div className="pd-top">
          <ProductInfo product={product} productId={productId} t={t} language={language} />
          <ImageGallery images={product.images} />
        </div>

        {/* ── TABS ─────────────────────────────── */}
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

          {/* Tab content */}
          {activeTab === 'info'
            ? <InfoTab product={product} t={t} language={language} />
            : <ReviewsTab
                product={product}
                reviews={productReviews}
                breakdown={ratingBreakdown}
                t={t}
                language={language}
              />
          }
        </div>

        {/* ── RELATED PRODUCTS ─────────────────── */}
        <section className="pd-related">
          <div className="sec-header">
            <h2 className="sec-title">{t.relatedTitle}</h2>
            <Link to="/shop" className="sec-view-all">{t.viewAll}</Link>
          </div>
          <div className="pd-related__grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

      </div>

      {/* ── FEATURES STRIP ───────────────────── */}
      <FeaturesStrip t={t} />
    </main>
  )
}
