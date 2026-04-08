/**
 * OrderSuccessPage.jsx
 *  1. Thank you header
 *  2. Order status tracker (stepper)
 *  3. Order summary bar
 *  4. Order details table
 *  5. Delivery address
 *  6. WhatsApp + Continue shopping buttons
 *  7. Features strip
 */

import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Shield, Truck, ThumbsUp, RotateCcw, CheckCircle2, Clock, MessageCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ordersApi } from '../api/api'
import './OrderSuccessPage.css'

// ── Store WhatsApp number (change to real number) ─────────────
const STORE_WHATSAPP = '201000000000' // e.g. Egypt: 20 + number without leading 0

const T = {
  ar: {
    thanks:   '🍼 شكراً لطلبك!',
    subtitle: 'اختيارك يعني راحة وسعادة لطفل صغير 💗',
    confirm:  'تم استلام طلبك بنجاح!',
    orderNum:  'رقم الطلب',
    orderDate: 'تاريخ الطلب',
    phone:     'رقم الهاتف',
    totalLabel:'الاجمالي',
    payMethod: 'طريقة الدفع',
    detailsTitle: 'تفاصيل الطلب :',
    products:  'المنتجات',
    prices:    'الاسعار',
    priceLabel:'السعر :',
    shippingLabel: 'التوصيل :',
    payMethodLabel: 'طريقة الدفع :',
    totalRow:  'الإجمالي :',
    addressTitle: 'عنوان التوصيل :',
    backToShop: 'متابعة التسوق',
    whatsapp:  'تواصل معنا واتساب',
    whatsappMsg: 'مرحباً، لدي استفسار عن طلبي رقم #',
    trackTitle: 'تتبع طلبك',
    stepOrdered:   'تم الطلب',
    stepProcessing:'قيد التنفيذ',
    stepShipped:   'تم الشحن',
    stepDelivered: 'تم التسليم',
    features: [
      { icon: <Shield size={26} />,    title: 'دفع آمن',            desc: 'طرق دفع محمية عبر التطبيقات والبنوك المحلية' },
      { icon: <ThumbsUp size={26} />,  title: 'شهادات موثوقة',     desc: 'منتجات معتمدة من جهات موثوقة' },
      { icon: <Truck size={26} />,     title: 'شحن سريع',           desc: 'توصيل سريع وآمن لطلبك أينما كنت' },
      { icon: <RotateCcw size={26} />, title: 'إرجاع خلال 30 يوم', desc: 'سياسة إرجاع سهلة' },
    ],
  },
  en: {
    thanks:   '🍼 Thank You for Your Order!',
    subtitle: 'Your choice means comfort and happiness for a little one 💗',
    confirm:  'Your order has been received successfully!',
    orderNum:  'Order Number',
    orderDate: 'Order Date',
    phone:     'Phone',
    totalLabel:'Total',
    payMethod: 'Payment Method',
    detailsTitle: 'Order Details:',
    products:  'Products',
    prices:    'Prices',
    priceLabel:'Price:',
    shippingLabel: 'Shipping:',
    payMethodLabel: 'Payment Method:',
    totalRow:  'Total:',
    addressTitle: 'Delivery Address:',
    backToShop: 'Continue Shopping',
    whatsapp:  'Contact Us on WhatsApp',
    whatsappMsg: 'Hello, I have a question about my order #',
    trackTitle: 'Track Your Order',
    stepOrdered:   'Order Placed',
    stepProcessing:'Processing',
    stepShipped:   'Shipped',
    stepDelivered: 'Delivered',
    features: [
      { icon: <Shield size={26} />,    title: 'Safe Payment',    desc: 'Secure payment via apps and local banks' },
      { icon: <ThumbsUp size={26} />,  title: 'Trusted Reviews', desc: 'Certified products' },
      { icon: <Truck size={26} />,     title: 'Fast Shipping',   desc: 'Fast and safe delivery' },
      { icon: <RotateCcw size={26} />, title: '30-Day Returns',  desc: 'Easy return policy' },
    ],
  },
}

// ── Status → step index ───────────────────────────────────────
const STATUS_STEP = {
  PENDING:    0,
  PROCESSING: 1,
  SHIPPED:    2,
  DELIVERED:  3,
}

function OrderTracker({ status, t }) {
  const steps = [t.stepOrdered, t.stepProcessing, t.stepShipped, t.stepDelivered]
  const activeStep = STATUS_STEP[(status || 'PENDING').toUpperCase()] ?? 0

  return (
    <div className="order-tracker">
      <h2 className="success-section-title">{t.trackTitle}</h2>
      <div className="tracker-steps">
        {steps.map((label, i) => {
          const done    = i <= activeStep
          const current = i === activeStep
          return (
            <div key={i} className="tracker-step">
              <div className={`tracker-step__circle ${done ? 'tracker-step__circle--done' : ''} ${current ? 'tracker-step__circle--current' : ''}`}>
                {done ? <CheckCircle2 size={18} /> : <Clock size={16} />}
              </div>
              <p className={`tracker-step__label ${!done ? 'tracker-step__label--muted' : ''}`}>{label}</p>
              {i < steps.length - 1 && (
                <div className={`tracker-step__line ${i < activeStep ? 'tracker-step__line--done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  const { language } = useApp()
  const t = T[language]
  const location = useLocation()

  const state = location.state || {}
  const {
    orderId,
    orderNumber: stateOrderNumber,
    total    = '0.00',
    payMethod = language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery',
    form     = {},
    items    = [],
  } = state

  const [orderStatus, setOrderStatus] = useState('PENDING')
  const [orderNumber, setOrderNumber] = useState(stateOrderNumber || '—')

  // Fetch real order status if we have an orderId
  useEffect(() => {
    if (!orderId) return
    ordersApi.getMyOrders()
      .then(data => {
        const list  = Array.isArray(data) ? data : (data?.orders || data?.data || [])
        const found = list.find(o => o.id === orderId)
        if (found) {
          setOrderStatus(found.status || 'PENDING')
          if (found.orderNumber) setOrderNumber(found.orderNumber)
        }
      })
      .catch(() => {})
  }, [orderId])

  const today   = new Date()
  const dateStr = today.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  const productTotal  = parseFloat(total) || 0
  const shippingCost  = productTotal >= 1000000 ? 0 : 50
  const grandTotal    = productTotal + shippingCost

  // WhatsApp link
  const waMsg = encodeURIComponent(`${t.whatsappMsg}${orderNumber}`)
  const waLink = `https://wa.me/${STORE_WHATSAPP}?text=${waMsg}`

  return (
    <main className="success-page">
      <div className="success-container">

        {/* 1. Thank You Header */}
        <div className="success-hero">
          <h1 className="success-hero__title">{t.thanks}</h1>
          <p className="success-hero__subtitle">{t.subtitle}</p>
          <p className="success-hero__confirm">{t.confirm}</p>
        </div>

        {/* 2. Order Status Tracker */}
        <OrderTracker status={orderStatus} t={t} />

        {/* 3. Order Summary Bar */}
        <div className="success-summary-bar">
          <div className="ssb-item">
            <span className="ssb-label">{t.orderNum} :</span>
            <span className="ssb-value">#{orderNumber}</span>
          </div>
          <div className="ssb-item">
            <span className="ssb-label">{t.orderDate} :</span>
            <span className="ssb-value">{dateStr}</span>
          </div>
          <div className="ssb-item">
            <span className="ssb-label">{t.phone} :</span>
            <span className="ssb-value">{form.phone || '—'}</span>
          </div>
          <div className="ssb-item">
            <span className="ssb-label">{t.totalLabel} :</span>
            <span className="ssb-value">{grandTotal.toFixed(2)} EGP</span>
          </div>
          <div className="ssb-item">
            <span className="ssb-label">{t.payMethod} :</span>
            <span className="ssb-value">{payMethod}</span>
          </div>
        </div>

        {/* 4. Order Details Table */}
        <div className="success-details">
          <h2 className="success-section-title">{t.detailsTitle}</h2>
          <table className="success-table">
            <thead>
              <tr>
                <th>{t.products}</th>
                <th>{t.prices}</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map(item => (
                <tr key={item.cartKey || item.id}>
                  <td>
                    {language === 'ar' ? (item.nameAr || item.name) : (item.name || item.nameAr)}
                    {item.color && ` - ${item.color}`}
                    {` (${item.qty}x)`}
                  </td>
                  <td>{(item.price * item.qty).toFixed(2)} EGP</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>—</td>
                </tr>
              )}

              <tr className="success-table__subtotal">
                <td>{t.priceLabel}</td>
                <td>{productTotal.toFixed(2)} EGP</td>
              </tr>
              <tr>
                <td>{t.shippingLabel}</td>
                <td>{shippingCost === 0 ? '0' : shippingCost} EGP</td>
              </tr>
              <tr>
                <td>{t.payMethodLabel}</td>
                <td>{payMethod}</td>
              </tr>
              <tr className="success-table__total">
                <td>{t.totalRow}</td>
                <td>{grandTotal.toFixed(2)} EGP</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Delivery Address */}
        {(form.governorate || form.street) && (
          <div className="success-address">
            <h2 className="success-section-title">{t.addressTitle}</h2>
            <div className="success-address__rows">
              {form.firstName && <p>{form.firstName} {form.lastName}</p>}
              {form.street      && <p>{form.street}</p>}
              {form.neighborhood && <p>{form.neighborhood}</p>}
              {form.district    && <p>{form.district}</p>}
              {form.governorate && <p>{form.governorate}</p>}
              {form.country     && <p>{form.country}</p>}
              {form.phone       && <p>{form.phone}</p>}
              {form.email       && <p>{form.email}</p>}
            </div>
          </div>
        )}

        {/* 6. Action Buttons */}
        <div className="success-actions">
          {/* WhatsApp Button */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="success-whatsapp-btn"
          >
            <MessageCircle size={18} />
            {t.whatsapp}
          </a>
          <Link to="/shop" className="success-back-btn">{t.backToShop}</Link>
        </div>

        {/* 7. Features Strip */}
        <section className="success-features">
          <div className="success-features__grid">
            {t.features.map((f, i) => (
              <div key={i} className="success-feature">
                <div className="success-feature__icon">{f.icon}</div>
                <div className="success-feature__text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
