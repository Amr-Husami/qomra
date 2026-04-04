/**
 * CartPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *  1. PageHeader    → pink banner "السلة و الدفع"
 *  2. Free Shipping Banner
 *  3. Cart Table    → product | price | qty | total
 *  4. Empty State   → when cart is empty
 *  5. Cart Footer   → total + two action buttons
 *  6. Features Strip
 * ─────────────────────────────────────────────────────────────
 */

import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, Truck, Shield, ThumbsUp, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/PageHeader'
import './CartPage.css'

// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    product: 'المنتج',
    unitPrice: 'سعر القطعة',
    qty: 'عدد القطع',
    total: 'الإجمالي',
    totalLabel: 'الإجمالي',
    taxNote: 'يتم احتساب الضريبة و التوصيل عند الدفع',
    continueShopping: 'متابعة التسوق',
    proceedCheckout: 'المتابعة الى الدفع',
    emptyTitle: 'سلتك فارغة حالياً 🛒',
    emptyDesc: 'ابدأ التسوق الآن لتكتشف أفضل المنتجات لطفلك',
    shopNow: 'تسوق الآن',
    freeShipping: 'استمتع بالشحن المجاني!',
    freeShippingDesc: 'لقد حصلت على شحن مجاني ! الآن فاتورتك تجاوزت 1.000.000 ل.س. استمتع بتجربة رائعة معنا',
    features: [
      { icon: <Shield size={26} />,   title: 'دفع آمن',            desc: 'طرق دفع محمية عبر التطبيقات والبنوك المحلية' },
      { icon: <ThumbsUp size={26} />, title: 'شهادات موثوقة',     desc: 'منتجات معتمدة من جهات موثوقة عالمياً' },
      { icon: <Truck size={26} />,    title: 'شحن سريع',           desc: 'توصيل سريع وآمن لطلبك أينما كنت' },
      { icon: <RotateCcw size={26} />,title: 'إرجاع خلال 30 يوم', desc: 'سياسة إرجاع سهلة إذا لم تكن راضياً عن المنتج' },
    ],
  },
  en: {
    product: 'Product',
    unitPrice: 'Unit Price',
    qty: 'Quantity',
    total: 'Total',
    totalLabel: 'Total',
    taxNote: 'Tax and shipping calculated at checkout',
    continueShopping: 'Continue Shopping',
    proceedCheckout: 'Proceed to Checkout',
    emptyTitle: 'Your cart is empty 🛒',
    emptyDesc: 'Start shopping now to find the best products for your child',
    shopNow: 'Shop Now',
    freeShipping: 'Enjoy Free Shipping!',
    freeShippingDesc: 'You got free shipping! Your order exceeded 1,000,000 SYP. Enjoy a great experience with us',
    features: [
      { icon: <Shield size={26} />,   title: 'Safe Payment',    desc: 'Secure payment via apps and local banks' },
      { icon: <ThumbsUp size={26} />, title: 'Trusted Reviews', desc: 'Products certified by trusted sources' },
      { icon: <Truck size={26} />,    title: 'Fast Shipping',   desc: 'Fast and safe delivery wherever you are' },
      { icon: <RotateCcw size={26} />,title: '30-Day Returns',  desc: 'Easy return policy if not satisfied' },
    ],
  },
}

export default function CartPage() {
  const { language, cart, removeFromCart, updateQty, cartTotal } = useApp()
  const t = T[language]
  const navigate = useNavigate()

  // Free shipping threshold (just for UI display)
  const FREE_SHIPPING_THRESHOLD = 1000000
  const hasFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD

  return (
    <main className="cart-page">

      {/* 1. Page Header */}
      <PageHeader
        titleAr="السلة و الدفع"
        titleEn="Cart & Checkout"
        breadcrumbAr="السلة"
        breadcrumbEn="Cart"
      />

      <div className="cart-container">

        {/* 2. Free Shipping Banner — only shows when threshold met */}
        {hasFreeShipping && (
          <div className="free-shipping-banner">
            <Truck size={20} className="fsb-icon" />
            <div className="fsb-text">
              <strong>{t.freeShipping}</strong>
              <span>{t.freeShippingDesc}</span>
            </div>
            <span className="fsb-badge">FREE</span>
          </div>
        )}

        {/* 3. Cart Table Header */}
        <div className="cart-table-header">
          <span>{t.product}</span>
          <span>{t.unitPrice}</span>
          <span>{t.qty}</span>
          <span>{t.total}</span>
        </div>

        {/* 4. Cart Items or Empty State */}
        {cart.length === 0 ? (
          <div className="cart-empty">
            {/* Empty cart illustration */}
            <div className="cart-empty__icon">
              <ShoppingCart size={64} strokeWidth={1} />
              <div className="cart-empty__x">✕</div>
            </div>
            <h3 className="cart-empty__title">{t.emptyTitle}</h3>
            <p className="cart-empty__desc">{t.emptyDesc}</p>
            <Link to="/shop" className="cart-empty__btn">{t.shopNow}</Link>
          </div>
        ) : (
          <>
            {/* Cart items list */}
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.cartKey} className="cart-item">

                  {/* Remove button (X) */}
                  <button
                    className="ci-remove"
                    onClick={() => removeFromCart(item.cartKey)}
                    title={language === 'ar' ? 'حذف' : 'Remove'}
                  >
                    ✕
                  </button>

                  {/* Product info */}
                  <div className="ci-product">
                    <img src={item.image} alt={item.nameAr} className="ci-img" />
                    <div className="ci-info">
                      <p className="ci-name">
                        {language === 'ar' ? item.nameAr : item.name}
                      </p>
                      {/* Show color + size if they exist */}
                      {(item.colorAr || item.size) && (
                        <p className="ci-variant">
                          {item.colorAr && (
                            <span>
                              <span className="ci-color-dot" style={{ background: item.colorHex }} />
                              {language === 'ar' ? item.colorAr : item.color}
                            </span>
                          )}
                          {item.size && <span>({item.size})</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="ci-price">
                    <span className="ci-price__label">{language === 'ar' ? 'السعر' : 'Price'}: </span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>

                  {/* Qty controls — — N + */}
                  <div className="ci-qty">
                    <button
                      className="ci-qty__btn"
                      onClick={() => updateQty(item.cartKey, item.qty - 1)}
                      disabled={item.qty <= 1}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="ci-qty__num">{item.qty}</span>
                    <button
                      className="ci-qty__btn"
                      onClick={() => updateQty(item.cartKey, item.qty + 1)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="ci-total">
                    ${(item.price * item.qty).toFixed(1)}
                  </div>

                </div>
              ))}
            </div>

            {/* 5. Cart Footer */}
            <div className="cart-footer">
              {/* Total + tax note */}
              <div className="cart-footer__total">
                <div className="cft-row">
                  <span className="cft-amount">${cartTotal.toFixed(2)}</span>
                  <span className="cft-label">{t.totalLabel}</span>
                </div>
                <p className="cft-note">{t.taxNote}</p>
              </div>

              {/* Action buttons */}
              <div className="cart-footer__actions">
                <Link to="/shop" className="cfa-btn cfa-btn--outline">
                  {t.continueShopping}
                </Link>
                <button
                  className="cfa-btn cfa-btn--primary"
                  onClick={() => navigate('/checkout')}
                >
                  {t.proceedCheckout}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 6. Features Strip */}
      <section className="cart-features">
        <div className="cart-container">
          <div className="cart-features__grid">
            {t.features.map((f, i) => (
              <div key={i} className="cart-feature">
                <div className="cart-feature__icon">{f.icon}</div>
                <div className="cart-feature__text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
