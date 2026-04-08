/**
 * CheckoutPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *  1. PageHeader       → pink banner
 *  2. Left Column:     → cart items summary + coupon + price breakdown
 *  3. Right Column:    → login alert + contact form + delivery form
 *                         + payment methods + terms + pay button
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ChevronDown, X, Truck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/PageHeader'
import { ordersApi, couponsApi, cartApi } from '../api/api'
import './CheckoutPage.css'

// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    breadcrumb: 'الدفع',
    freeShipping: 'استمتع بالشحن المجاني!',
    freeShippingDesc: 'لقد حصلت على شحن مجاني! الآن فاتورتك تجاوزت 1.000.000 ل.س.',
    couponPlaceholder: 'ادخل كود الخصم',
    applyBtn: 'تطبيق',
    subtotal: 'السعر الجزئي',
    shipping: 'التوصيل',
    freeLabel: 'مجاني',
    toBeCalc: 'يرجى تحديد عنوان التوصيل',
    discount: 'الخسم',
    totalLabel: 'الإجمالي',
    loginAlert: 'هل لديك حساب بالفعل؟',
    loginLink: 'تسجيل الدخول',
    contactTitle: 'معلومات التواصل',
    firstName: 'الاسم الأول',
    lastName: 'الاسم الأخير',
    email: 'البريد الالكتروني',
    phone: 'رقم الهاتف',
    deliveryTitle: 'التوصيل',
    country: 'اختر البلد',
    governorate: 'المحافظة',
    district: 'المنطقة',
    neighborhood: 'الحي',
    street: 'الشارع',
    building: 'الشقة، رقم الطابق، تفاصيل أخرى',
    address: 'العنوان',
    saveInfo: 'حفظ المعلومات من اجل عملية الشراء الثانية',
    paymentTitle: 'طرق الدفع',
    paymentDesc: 'كل طرق الدفع المتاحة هي طرق آمنة و لن يتم مشاركة معلوماتك مع أي جهة أخرى',
    payMethods: [
      { id: 'syriatel', label: 'سيريانتل كاش',    emoji: '📱' },
      { id: 'mtn',      label: 'ام تي ان كاش',    emoji: '📲' },
      { id: 'baraka',   label: 'بنك البركة',       emoji: '🏦' },
      { id: 'cod',      label: 'الدفع عند الاستلام', emoji: '💵' },
    ],
    terms: 'بمجرد الضغط على زر الدفع أنت توافق على ',
    termsLink: 'شروط الاستخدام و سياسة الخصوصية',
    payBtn: 'ادفع',
    processing: 'جاري المعالجة...',
    required: '*',
    countries: ['سوريا', 'لبنان', 'الأردن', 'العراق', 'السعودية'],
    governorates: ['دمشق', 'حمص', 'حلب', 'اللاذقية', 'طرطوس', 'درعا'],
    districts: ['المركز', 'الانبعاث', 'عكرمة', 'الزهراء', 'الوعر'],
  },
  en: {
    breadcrumb: 'Checkout',
    freeShipping: 'Enjoy Free Shipping!',
    freeShippingDesc: 'You got free shipping! Your order exceeded 1,000,000 SYP.',
    couponPlaceholder: 'Enter coupon code',
    applyBtn: 'Apply',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    freeLabel: 'Free',
    toBeCalc: 'Enter delivery address',
    discount: 'Discount',
    totalLabel: 'Total',
    loginAlert: 'Already have an account?',
    loginLink: 'Sign in',
    contactTitle: 'Contact Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    deliveryTitle: 'Delivery',
    country: 'Select Country',
    governorate: 'Governorate',
    district: 'District',
    neighborhood: 'Neighborhood',
    street: 'Street',
    building: 'Apartment, floor number, other details',
    address: 'Address',
    saveInfo: 'Save information for next purchase',
    paymentTitle: 'Payment Methods',
    paymentDesc: 'All available payment methods are secure and your info will not be shared',
    payMethods: [
      { id: 'syriatel', label: 'Syriatel Cash',   emoji: '📱' },
      { id: 'mtn',      label: 'MTN Cash',         emoji: '📲' },
      { id: 'baraka',   label: 'Al Baraka Bank',   emoji: '🏦' },
      { id: 'cod',      label: 'Cash on Delivery', emoji: '💵' },
    ],
    terms: 'By clicking Pay you agree to our ',
    termsLink: 'Terms of Service and Privacy Policy',
    payBtn: 'Pay',
    processing: 'Processing...',
    required: '*',
    countries: ['Syria', 'Lebanon', 'Jordan', 'Iraq', 'Saudi Arabia'],
    governorates: ['Damascus', 'Homs', 'Aleppo', 'Latakia', 'Tartus', 'Daraa'],
    districts: ['Center', 'Al Inbiath', 'Akrama', 'Al Zahraa', 'Al Waer'],
  },
}

// ─── SELECT FIELD COMPONENT ────────────────────────────────────
function SelectField({ label, value, onChange, options, placeholder, required }) {
  return (
    <div className="co-field">
      {label && (
        <label className="co-label">
          {label} {required && <span className="co-required">*</span>}
        </label>
      )}
      <div className="co-select-wrap">
        <select
          className="co-input co-select"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={14} className="co-select-arrow" />
      </div>
    </div>
  )
}

// ─── INPUT FIELD COMPONENT ─────────────────────────────────────
function InputField({ label, type = 'text', value, onChange, required, placeholder }) {
  return (
    <div className="co-field">
      {label && (
        <label className="co-label">
          {label} {required && <span className="co-required">*</span>}
        </label>
      )}
      <input
        type={type}
        className="co-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ''}
      />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN: CheckoutPage
// ══════════════════════════════════════════════════════════════
export default function CheckoutPage() {
  const { language, cart, removeFromCart, cartTotal, isLoggedIn, user, coins, addCoins, redeemCoins, COINS_TO_EGP } = useApp()
  const t = T[language]
  const navigate = useNavigate()

  // Form state
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     '',
    country:   '',
    governorate: '',
    district:  '',
    neighborhood: '',
    street:    '',
    building:  '',
    address:   '',
  })
  const [saveInfo,      setSaveInfo]      = useState(false)
  const [payMethod,     setPayMethod]     = useState('syriatel')
  const [agreeTerms,    setAgreeTerms]    = useState(false)
  const [couponCode,    setCouponCode]    = useState('')
  const [discount,      setDiscount]      = useState(0)
  const [couponError,   setCouponError]   = useState('')
  const [showLoginAlert,setShowLoginAlert]= useState(!isLoggedIn)
  const [loading,       setLoading]       = useState(false)
  const [useCoins,      setUseCoins]      = useState(false)

  // Coins discount value
  const coinsDiscount = useCoins ? Math.floor(coins * COINS_TO_EGP * 100) / 100 : 0

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

  // Apply coupon
  const handleCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponError('')
    try {
      // 🔌 REAL API: POST /api/coupons/redeem  { couponCode }
      // const result = await couponsApi.redeemCoupon(couponCode)
      // setDiscount(result.discountAmount || 0)

      // Fake coupon for now: SAVE10 = 10% off
      if (couponCode.toUpperCase() === 'SAVE10') {
        setDiscount(cartTotal * 0.1)
      } else {
        setCouponError(language === 'ar' ? 'كود غير صحيح' : 'Invalid coupon code')
      }
    } catch {
      setCouponError(language === 'ar' ? 'كود غير صحيح' : 'Invalid coupon code')
    }
  }

  // Place order
  const handlePay = async () => {
    if (!agreeTerms) return
    if (!form.firstName || !form.phone) return
    setLoading(true)

    try {
      let orderId     = null
      let orderNumber = Math.floor(Math.random() * 9000) + 1000

      try {
        // Step 1: clear server cart to avoid stale items
        await cartApi.clearCart().catch(() => {})

        // Step 2: sync local cart to server — send items one by one (sequentially
        // to avoid race conditions), skip any that fail individually
        for (const item of cart) {
          try {
            // item.id = productId (UUID string), item.variantId only if selected
            await cartApi.addToCart(
              item.id,
              item.variantId || undefined,  // undefined means key won't be sent
              item.qty
            )
          } catch (cartErr) {
            console.warn('Cart item sync failed:', item.id, cartErr.message)
          }
        }

        // Step 3: create the order — send address + payment so backend has everything
        // Award coins for this order BEFORE navigate
        addCoins(coinsToEarn)
        // Deduct redeemed coins
        if (useCoins && coins > 0) redeemCoins(coins)

        const orderRes = await ordersApi.createOrder({
          paymentMethod: payMethod,
          address: {
            firstName:    form.firstName,
            lastName:     form.lastName,
            phone:        form.phone,
            email:        form.email,
            country:      form.country,
            governorate:  form.governorate,
            district:     form.district,
            neighborhood: form.neighborhood,
            street:       form.street,
            building:     form.building,
            address:      form.address,
          },
        })
        orderId        = orderRes?.id ?? orderRes?.order?.id ?? null
        const rawNum   = orderRes?.orderNumber ?? orderRes?.order?.orderNumber ?? orderRes?.id?.slice(0, 8)
        if (rawNum) orderNumber = rawNum
      } catch (err) {
        console.warn('Order creation failed:', err.message)
        // Still navigate to success so UX is not broken
      }

      navigate('/order-success', {
        state: {
          orderId,
          orderNumber,
          total:      finalTotal.toFixed(2),
          payMethod:  t.payMethods.find(p => p.id === payMethod)?.label,
          form,
          items:      cart,
          coinsEarned: coinsToEarn,
        },
      })
    } catch {
      setLoading(false)
    }
  }

  const shipping = cartTotal >= 1000000 ? 0 : null
  const finalTotal = Math.max(0, cartTotal - discount - coinsDiscount)
  // Coins earned on this order: 1 coin per 10 EGP
  const coinsToEarn = Math.floor(finalTotal / 10)

  return (
    <main className="checkout-page">

      {/* 1. Page Header */}
      <PageHeader
        titleAr="السلة و الدفع"
        titleEn="Cart & Checkout"
        breadcrumbAr="الدفع"
        breadcrumbEn="Checkout"
      />

      <div className="co-container">

        {/* Free shipping banner */}
        {shipping === 0 && (
          <div className="co-free-ship">
            <Truck size={16} />
            <div>
              <strong>{t.freeShipping}</strong>
              <span>{t.freeShippingDesc}</span>
            </div>
          </div>
        )}

        <div className="co-layout">

          {/* ── LEFT: Cart summary ─────────────────── */}
          <div className="co-left">

            {/* Cart items */}
            <div className="co-cart-items">
              {cart.map(item => (
                <div key={item.cartKey} className="co-item">
                  <img src={item.image} alt={item.nameAr} className="co-item__img" />
                  <div className="co-item__info">
                    <p className="co-item__name">
                      {language === 'ar' ? item.nameAr : item.name}
                      {item.colorAr && ` - ${language === 'ar' ? item.colorAr : item.color}`}
                      {item.size && ` (${item.qty})`}
                    </p>
                    <span className="co-item__price">{(item.price * item.qty)}$</span>
                  </div>
                  <button className="co-item__del" onClick={() => removeFromCart(item.cartKey)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Coupon code */}
            <div className="co-coupon">
              <button className="co-coupon__apply" onClick={handleCoupon}>
                {t.applyBtn}
              </button>
              <input
                type="text"
                className="co-coupon__input"
                placeholder={t.couponPlaceholder}
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCoupon()}
              />
            </div>
            {couponError && <p className="co-coupon__error">{couponError}</p>}

            {/* Coins redemption box */}
            {isLoggedIn && coins > 0 && (
              <div className="co-coins-box">
                <label className="co-coins-label">
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={e => setUseCoins(e.target.checked)}
                    style={{ marginInlineEnd: 8 }}
                  />
                  <span>🪙</span>
                  <span>
                    {language === 'ar'
                      ? `استخدم ${coins} نقطة (خصم ${coinsDiscount.toFixed(2)} EGP)`
                      : `Use ${coins} coins (${coinsDiscount.toFixed(2)} EGP discount)`}
                  </span>
                </label>
              </div>
            )}

            {/* Price breakdown */}
            <div className="co-summary">
              <div className="co-summary__row">
                <span className="co-summary__amount">{cartTotal.toFixed(2)} EGP</span>
                <span className="co-summary__label">{t.subtotal}</span>
              </div>
              <div className="co-summary__row">
                <span className="co-summary__amount co-summary__amount--green">
                  {shipping === 0 ? t.freeLabel : t.toBeCalc}
                </span>
                <span className="co-summary__label">{t.shipping}</span>
              </div>
              {discount > 0 && (
                <div className="co-summary__row">
                  <span className="co-summary__amount co-summary__amount--red">-{discount.toFixed(2)} EGP</span>
                  <span className="co-summary__label">{t.discount}</span>
                </div>
              )}
              {coinsDiscount > 0 && (
                <div className="co-summary__row">
                  <span className="co-summary__amount co-summary__amount--red">-{coinsDiscount.toFixed(2)} EGP</span>
                  <span className="co-summary__label">🪙 {language === 'ar' ? 'خصم النقاط' : 'Coins Discount'}</span>
                </div>
              )}
              <div className="co-summary__row co-summary__row--total">
                <span className="co-summary__total-num">{finalTotal.toFixed(2)} EGP</span>
                <span className="co-summary__total-label">{t.totalLabel}</span>
              </div>
              {coinsToEarn > 0 && (
                <p className="co-coins-earn">
                  🪙 {language === 'ar' ? `ستكسب ${coinsToEarn} نقطة من هذا الطلب` : `You'll earn ${coinsToEarn} coins from this order`}
                </p>
              )}
            </div>

          </div>

          {/* ── RIGHT: Forms ───────────────────────── */}
          <div className="co-right">

            {/* Login alert — dismissible */}
            {showLoginAlert && (
              <div className="co-login-alert">
                <button className="co-login-alert__close" onClick={() => setShowLoginAlert(false)}>
                  <X size={14} />
                </button>
                <span>🔔 {t.loginAlert}</span>
                <Link to="/login" className="co-login-alert__link">{t.loginLink}</Link>
              </div>
            )}

            {/* Contact Information */}
            <div className="co-section">
              <h3 className="co-section__title">{t.contactTitle}</h3>

              <div className="co-row-2">
                <InputField label={t.lastName}  value={form.lastName}  onChange={set('lastName')}  required />
                <InputField label={t.firstName} value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div className="co-row-2">
                <InputField label={t.email} type="email" value={form.email} onChange={set('email')} />
                <InputField label={t.phone} type="tel"   value={form.phone} onChange={set('phone')} required />
              </div>
            </div>

            {/* Delivery */}
            <div className="co-section">
              <h3 className="co-section__title">{t.deliveryTitle}</h3>

              <SelectField
                placeholder={t.country}
                value={form.country}
                onChange={set('country')}
                options={t.countries}
              />

              <div className="co-row-2">
                <SelectField
                  label={t.district}
                  placeholder={t.district}
                  value={form.district}
                  onChange={set('district')}
                  options={t.districts}
                  required
                />
                <SelectField
                  label={t.governorate}
                  placeholder={t.governorate}
                  value={form.governorate}
                  onChange={set('governorate')}
                  options={t.governorates}
                  required
                />
              </div>

              <div className="co-row-2">
                <InputField label={t.street}       value={form.street}       onChange={set('street')}       required />
                <SelectField
                  label={t.neighborhood}
                  placeholder={t.neighborhood}
                  value={form.neighborhood}
                  onChange={set('neighborhood')}
                  options={['الحي 1', 'الحي 2', 'الحي 3']}
                  required
                />
              </div>

              <InputField
                label={t.building}
                placeholder={t.building}
                value={form.building}
                onChange={set('building')}
              />

              <InputField
                label={t.address}
                value={form.address}
                onChange={set('address')}
              />

              {/* Save info checkbox */}
              <label className="co-checkbox">
                <span className="co-checkbox__label">{t.saveInfo}</span>
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={e => setSaveInfo(e.target.checked)}
                />
                <span className="co-checkbox__box" />
              </label>
            </div>

            {/* Payment Methods */}
            <div className="co-section">
              <h3 className="co-section__title">{t.paymentTitle}</h3>
              <p className="co-payment-desc">{t.paymentDesc}</p>

              <div className="co-pay-methods">
                {t.payMethods.map(method => (
                  <button
                    key={method.id}
                    className={`co-pay-btn ${payMethod === method.id ? 'co-pay-btn--active' : ''}`}
                    onClick={() => setPayMethod(method.id)}
                  >
                    <span className="co-pay-btn__emoji">{method.emoji}</span>
                    <span className="co-pay-btn__label">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms + Pay button */}
            <div className="co-pay-section">
              <label className="co-checkbox co-terms">
                <span className="co-checkbox__label">
                  {t.terms}
                  <Link to="/terms" className="co-terms-link">{t.termsLink}</Link>
                </span>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                />
                <span className="co-checkbox__box" />
              </label>

              <button
                className={`co-pay-final-btn ${loading ? 'co-pay-final-btn--loading' : ''} ${!agreeTerms ? 'co-pay-final-btn--disabled' : ''}`}
                onClick={handlePay}
                disabled={loading || !agreeTerms}
              >
                {loading ? t.processing : `${t.payBtn} $${finalTotal.toFixed(2)}`}
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
