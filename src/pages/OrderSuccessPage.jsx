/**
 * OrderSuccessPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Shows after a successful order:
 *  1. Thank you header (🍼 شكراً لطلبك!)
 *  2. Order summary bar (order#, date, phone, total, payment)
 *  3. Order details table (products + prices)
 *  4. Delivery address
 *  5. Features strip
 * ─────────────────────────────────────────────────────────────
 */

import { useLocation, Link } from 'react-router-dom'
import { Shield, Truck, ThumbsUp, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './OrderSuccessPage.css'

const T = {
  ar: {
    thanks: '🍼 شكراً لطلبك!',
    subtitle: 'اختيارك يعني راحة وسعادة لطفل صغير 💗',
    confirm: 'تم استلام طلبك بنجاح !',
    orderNum: 'رقم الطلب',
    orderDate: 'تاريخ الطلب',
    phone: 'رقم الهاتف',
    totalLabel: 'الاجمالي',
    payMethod: 'طريقة الدفع',
    detailsTitle: 'تفاصيل الطلب :',
    products: 'المنتجات',
    prices: 'الاسعار',
    priceLabel: 'السعر :',
    shippingLabel: 'التوصيل :',
    payMethodLabel: 'طريقة الدفع :',
    totalRow: 'الإجمالي :',
    addressTitle: 'عنوان التوصيل :',
    backToShop: 'متابعة التسوق',
    features: [
      { icon: <Shield size={26} />,   title: 'دفع آمن',            desc: 'طرق دفع محمية عبر التطبيقات والبنوك المحلية' },
      { icon: <ThumbsUp size={26} />, title: 'شهادات موثوقة',     desc: 'منتجات معتمدة من جهات موثوقة' },
      { icon: <Truck size={26} />,    title: 'شحن سريع',           desc: 'توصيل سريع وآمن لطلبك أينما كنت' },
      { icon: <RotateCcw size={26} />,title: 'إرجاع خلال 30 يوم', desc: 'سياسة إرجاع سهلة' },
    ],
  },
  en: {
    thanks: '🍼 Thank You for Your Order!',
    subtitle: 'Your choice means comfort and happiness for a little one 💗',
    confirm: 'Your order has been received successfully!',
    orderNum: 'Order Number',
    orderDate: 'Order Date',
    phone: 'Phone',
    totalLabel: 'Total',
    payMethod: 'Payment Method',
    detailsTitle: 'Order Details:',
    products: 'Products',
    prices: 'Prices',
    priceLabel: 'Price:',
    shippingLabel: 'Shipping:',
    payMethodLabel: 'Payment Method:',
    totalRow: 'Total:',
    addressTitle: 'Delivery Address:',
    backToShop: 'Continue Shopping',
    features: [
      { icon: <Shield size={26} />,   title: 'Safe Payment',    desc: 'Secure payment via apps and local banks' },
      { icon: <ThumbsUp size={26} />, title: 'Trusted Reviews', desc: 'Certified products' },
      { icon: <Truck size={26} />,    title: 'Fast Shipping',   desc: 'Fast and safe delivery' },
      { icon: <RotateCcw size={26} />,title: '30-Day Returns',  desc: 'Easy return policy' },
    ],
  },
}

export default function OrderSuccessPage() {
  const { language } = useApp()
  const t = T[language]
  const location = useLocation()

  // Get order data passed from CheckoutPage via navigate state
  const state = location.state || {}
  const {
    orderNumber = Math.floor(Math.random() * 9000) + 1000,
    total = '200.00',
    payMethod = language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery',
    form = {},
    items = [],
  } = state

  // Format today's date in Arabic style
  const today = new Date()
  const dateAr = today.toLocaleDateString('ar-SY', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const dateEn = today.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const dateStr = language === 'ar' ? dateAr : dateEn

  const shippingCost = parseFloat(total) >= 1000000 ? 0 : 50
  const productTotal = parseFloat(total)

  return (
    <main className="success-page">
      <div className="success-container">

        {/* 1. Thank You Header */}
        <div className="success-hero">
          <h1 className="success-hero__title">{t.thanks}</h1>
          <p className="success-hero__subtitle">{t.subtitle}</p>
          <p className="success-hero__confirm">{t.confirm}</p>
        </div>

        {/* 2. Order Summary Bar */}
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
            <span className="ssb-value">{form.phone || '+963994240911'}</span>
          </div>
          <div className="ssb-item">
            <span className="ssb-label">{t.totalLabel} :</span>
            <span className="ssb-value">{total} ل.س.</span>
          </div>
          <div className="ssb-item">
            <span className="ssb-label">{t.payMethod} :</span>
            <span className="ssb-value">{payMethod}</span>
          </div>
        </div>

        {/* 3. Order Details Table */}
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
              {/* Product rows */}
              {items.length > 0 ? (
                items.map(item => (
                  <tr key={item.cartKey}>
                    <td>
                      {language === 'ar' ? item.nameAr : item.name}
                      {item.colorAr && ` - ${language === 'ar' ? item.colorAr : item.color}`}
                      {` (${item.qty}x)`}
                    </td>
                    <td>{(item.price * item.qty).toFixed(2)} ل.س.</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>يامبل & بيرد - كرسي السيارة للأطفال - أحمر (1x)</td>
                  <td>1,200.00 ل.س.</td>
                </tr>
              )}

              {/* Price breakdown rows */}
              <tr className="success-table__subtotal">
                <td>{t.priceLabel}</td>
                <td>{productTotal.toFixed(2)} ل.س.</td>
              </tr>
              <tr>
                <td>{t.shippingLabel}</td>
                <td>{shippingCost === 0 ? '0' : `${shippingCost}.000`} ل.س.</td>
              </tr>
              <tr>
                <td>{t.payMethodLabel}</td>
                <td>{payMethod}</td>
              </tr>
              <tr className="success-table__total">
                <td>{t.totalRow}</td>
                <td>{(productTotal + shippingCost).toFixed(2)} ل.س.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. Delivery Address */}
        <div className="success-address">
          <h2 className="success-section-title">{t.addressTitle}</h2>
          <div className="success-address__rows">
            {form.neighborhood && <p>{form.neighborhood}</p>}
            {form.district     && <p>{form.district}</p>}
            {form.governorate  && <p>{form.governorate}</p>}
            {form.country      && <p>{form.country}</p>}
            {form.phone        && <p>{form.phone}</p>}
            {form.email        && <p>{form.email}</p>}

            {/* Fallback if no form data */}
            {!form.governorate && (
              <>
                <p>حلا الدروبي</p>
                <p>الانبعاثات</p>
                <p>حمص</p>
                <p>حمص</p>
                <p>سوريا</p>
                <p>0994240911</p>
                <p>Hdroubie0@gmail.com</p>
              </>
            )}
          </div>
        </div>

        {/* Back to shop button */}
        <div className="success-actions">
          <Link to="/shop" className="success-back-btn">{t.backToShop}</Link>
        </div>

        {/* 5. Features Strip */}
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
