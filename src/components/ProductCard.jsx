/**
 * ProductCard.jsx
 * ─────────────────────────────────────────────────────────────
 * A reusable product card component.
 * Used in: New Arrivals, Best Sellers, Recommended sections.
 *
 * Props:
 *   product → the product object from homeData.js
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import './ProductCard.css'


export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist, language } = useApp()
  const [addedAnim, setAddedAnim] = useState(false)

  const inWishlist = isInWishlist(product.id)

  // Show a quick "added!" animation when item is added to cart
  const handleAddToCart = () => {
    // 🔌 API NOTE: POST /api/cart  { productId, qty: 1 }
    addToCart({
      id: product.id,
      name: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
      qty: 1,
    })
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 1200)
  }

  const handleWishlist = () => {
    // 🔌 API NOTE: POST /api/wishlist/toggle  { productId }
    toggleWishlist({
      id: product.id,
      name: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
    })
  }

  // Render 5 stars, fill based on rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={13}
        className={i < rating ? 'star star--filled' : 'star star--empty'}
      />
    ))
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  return (
    <Link to={`/product/${product.id}`} className="pcard" style={{ textDecoration: 'none' }}>
      {/* ── IMAGE AREA ──────────────────────────────── */}
      <div className="pcard__img-wrap">
        <img src={product.image} alt={product.nameAr} className="pcard__img" />

        {/* Discount badge — top corner */}
        {product.badge && (
          <span className="pcard__badge">
            {language === 'ar' ? product.badge : product.badgeEn}
          </span>
        )}

        {/* Discount % */}
        {discount > 0 && (
          <span className="pcard__discount">-{discount}%</span>
        )}

        {/* Action buttons — appear on hover */}
        <div className="pcard__actions">
          {/* Wishlist toggle */}
          <button
            className={`pcard__action-btn ${inWishlist ? 'pcard__action-btn--active' : ''}`}
            onClick={handleWishlist}
            title={inWishlist ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
          >
            <Heart size={16} fill={inWishlist ? 'var(--primary)' : 'none'} />
          </button>

          {/* Add to cart */}
          <button
            className={`pcard__action-btn ${addedAnim ? 'pcard__action-btn--added' : ''}`}
            onClick={handleAddToCart}
            title="أضف للسلة"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* ── INFO AREA ──────────────────────────────── */}
      <div className="pcard__info">
        {/* Product name */}
        <h3 className="pcard__name">
          {language === 'ar' ? product.nameAr : product.nameEn}
        </h3>

        {/* Price row: current price + original price */}
        <div className="pcard__price-row">
          <span className="pcard__price-original">
            {product.originalPrice}.00 $
          </span>
          <span className="pcard__price-current">
            {product.price}.00 $
          </span>
        </div>

        {/* Star rating */}
        <div className="pcard__stars">
          {renderStars(product.rating)}
        </div>
      </div>
    </Link>
  )
}
