/**
 * ProfilePage.jsx
 * ─────────────────────────────────────────────────────────────
 * 5 Tabs:
 *  1. بيانات شخصية   → Personal Info form
 *  2. طلباتي         → My Orders list + order detail view
 *  3. رصيد نقاطي     → Points + daily check-in + coupons
 *  4. بيانات عنواني  → Addresses list + add/edit/delete
 *  5. تغيير كلمة المرور → Change Password
 *
 * Plus: Logout button
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Package, Star, MapPin, Lock, LogOut,
  ChevronDown, X, Trash2, Pencil, MoreHorizontal,
  Search, Copy, Check, ShoppingBag, CheckCircle2, Clock
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/PageHeader'
import { authApi, ordersApi } from '../api/api'
import './ProfilePage.css'


// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    myAccount: 'حسابي الشخصي',
    personalInfo: 'بيانات شخصية',
    myOrders: 'طلباتي',
    myPoints: 'رصيد نقاطي',
    myAddresses: 'بيانات عنواني',
    changePassword: 'تغيير كلمة المرور',
    logout: 'تسجيل الخروج',
    points: 'نقطة',

    // Personal Info
    personalTitle: 'البيانات الشخصية',
    verifyEmail: 'يرجى تأكيد البريد الاكتروني الخاص بك',
    verify: 'تأكيد',
    firstName: 'الاسم الأول',
    lastName: 'الاسم الأخير',
    email: 'البريد الالكتروني',
    phone: 'رقم الهاتف',
    birthDate: 'تاريخ الميلاد',
    gender: 'الجنس',
    female: 'انثى',
    male: 'ذكر',
    saveChanges: 'حفظ التحديث',
    day: 'اليوم', month: 'الشهر', year: 'السنة',
    required: '*',

    // Orders
    searchOrders: 'ابحث عن طلبك باسم المنتح.......',
    allOrders: 'جميع الطلبات',
    processing: 'قيد التنفيذ',
    shipped: 'تم الشحن',
    cancelled: 'ملغى',
    emptyOrdersTitle: 'ليس لديك اي طلبات حتى الان',
    startShopping: 'تبدأ التسوق',
    orderNum: 'رقم الطلب',
    orderDate: 'تاريخ الطلب',
    orderPhone: 'رقم الهاتف',
    orderTotal: 'الاجمالي',
    orderStatus: 'الحالة',
    orderAction: 'التفاصيل',
    viewDetails: 'تفاصيل',
    backToOrders: '← العودة للطلبات',
    orderStatusLabel: 'حالة الطلب :',
    statusShipping: 'يتم الشحن',
    statusOrdered: 'تم الطلب',
    statusShipped: 'تم الشحن',
    statusArriving: 'الوقت المتوقع للوصول',
    products: 'المنتجات',
    prices: 'الاسعار',
    priceRow: 'السعر :',
    shippingRow: 'التوصيل :',
    payRow: 'طريقة الدفع :',
    totalRow: 'الإجمالي :',
    addressTitle: 'عنوان التوصيل :',
    payMethodLabel: 'طريقة الدفع :',

    // Points
    myBalance: 'رصيد نقاطي',
    dailyCheckin: 'تسجيل الحضور اليومي',
    dailyCheckinDesc: 'سجل حضورك يومياً و احصل على 280 نقطة',
    checkinBtn: 'تسجيل الحضور اليومي',
    redeemTitle: 'استبدال نقاطي',
    copyCode: 'نسخ الرابط',
    copied: 'تم النسخ!',
    days: ['اليوم 1', 'اليوم 2', 'اليوم 3', 'اليوم 4', 'اليوم 5', 'اليوم 6', 'اليوم 7'],

    // Addresses
    addAddress: 'إضافة عنوان جديد',
    edit: 'تعديل',
    delete: 'حذف',
    deleteConfirm: 'هل انت متأكد من حذف العنوان',
    yes: 'نعم',
    no: 'لا',
    editAddressTitle: 'تعديل العنوان',
    addAddressTitle: 'إضافة عنوان جديد',
    saveEdits: 'حفظ التعديلات',
    governorate: 'المحافظة',
    district: 'المنطقة',
    neighborhood: 'الحي',
    street: 'الشارع',
    addressLabel: 'العنوان',
    addressPlaceholder: 'عنوان التوصيل باختصار هنا تكون اضافته',

    // Change Password
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة',
    savePassword: 'حفظ',
    passwordSuccess: '✅ تم تغيير كلمة المرور بنجاح!',
    passwordError: '❌ كلمتا المرور غير متطابقتين',
  },
  en: {
    myAccount: 'My Account',
    personalInfo: 'Personal Info',
    myOrders: 'My Orders',
    myPoints: 'My Points',
    myAddresses: 'My Addresses',
    changePassword: 'Change Password',
    logout: 'Logout',
    points: 'Points',
    personalTitle: 'Personal Information',
    verifyEmail: 'Please verify your email address',
    verify: 'Verify',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    birthDate: 'Birth Date',
    gender: 'Gender',
    female: 'Female',
    male: 'Male',
    saveChanges: 'Save Changes',
    day: 'Day', month: 'Month', year: 'Year',
    required: '*',
    searchOrders: 'Search your orders by product name...',
    allOrders: 'All Orders',
    processing: 'Processing',
    shipped: 'Shipped',
    cancelled: 'Cancelled',
    emptyOrdersTitle: "You don't have any orders yet",
    startShopping: 'Start Shopping',
    orderNum: 'Order #',
    orderDate: 'Date',
    orderPhone: 'Phone',
    orderTotal: 'Total',
    orderStatus: 'Status',
    orderAction: 'Details',
    viewDetails: 'Details',
    backToOrders: '← Back to Orders',
    orderStatusLabel: 'Order Status:',
    statusShipping: 'Shipping',
    statusOrdered: 'Ordered',
    statusShipped: 'Shipped',
    statusArriving: 'Expected Arrival',
    products: 'Products',
    prices: 'Prices',
    priceRow: 'Price:',
    shippingRow: 'Shipping:',
    payRow: 'Payment:',
    totalRow: 'Total:',
    addressTitle: 'Delivery Address:',
    payMethodLabel: 'Payment Method:',
    myBalance: 'My Points Balance',
    dailyCheckin: 'Daily Check-In',
    dailyCheckinDesc: 'Check in daily and earn 280 points',
    checkinBtn: 'Check In Today',
    redeemTitle: 'Redeem My Points',
    copyCode: 'Copy Code',
    copied: 'Copied!',
    days: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    addAddress: 'Add New Address',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this address?',
    yes: 'Yes',
    no: 'No',
    editAddressTitle: 'Edit Address',
    addAddressTitle: 'Add New Address',
    saveEdits: 'Save Changes',
    governorate: 'Governorate',
    district: 'District',
    neighborhood: 'Neighborhood',
    street: 'Street',
    addressLabel: 'Address',
    addressPlaceholder: 'Short delivery address description',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    savePassword: 'Save',
    passwordSuccess: '✅ Password changed successfully!',
    passwordError: '❌ Passwords do not match',
  },
}

// ─── FAKE ORDERS DATA ──────────────────────────────────────────
const FAKE_ORDERS = [
  {
    id: '#5090', date: 'شباط، 13 2025', dateEn: 'Feb 13, 2025',
    phone: '0994240911', total: '1,200,000 ل.س', pay: 'الدفع عند الاستلام',
    status: 'shipped', statusAr: 'تم الشحن', statusEn: 'Shipped',
    items: [{ name: 'يامبل & بيرد - كرسي السيارة للأطفال - أحمر (1x)', nameEn: 'Car Seat - Red (1x)', price: '1,200.00 ل.س' }],
    shipping: '50.000', grandTotal: '1,250.00',
    address: ['حلا الدروبي', 'الانشاءات', 'حمص', 'حمص', 'سوريا', '0994240911', 'Hdroubie0@gmail.com'],
  },
  {
    id: '#5080', date: 'شباط، 10 2025', dateEn: 'Feb 10, 2025',
    phone: '0994240911', total: '800,000 ل.س', pay: 'سيريانتل كاش',
    status: 'processing', statusAr: 'قيد التنفيذ', statusEn: 'Processing',
    items: [{ name: 'لعبة تعليمية للأطفال (2x)', nameEn: 'Educational Toy (2x)', price: '800.00 ل.س' }],
    shipping: '50.000', grandTotal: '850.00',
    address: ['أحمد المحمد', 'الانشاءات', 'حمص', 'حمص', 'سوريا', '0994240911'],
  },
  {
    id: '#5070', date: 'شباط، 5 2025', dateEn: 'Feb 5, 2025',
    phone: '0994240911', total: '1,500,000 ل.س', pay: 'الدفع عند الاستلام',
    status: 'cancelled', statusAr: 'ملغى', statusEn: 'Cancelled',
    items: [{ name: 'عربية أطفال - أسود (1x)', nameEn: 'Baby Stroller - Black (1x)', price: '1,500.00 ل.س' }],
    shipping: '0', grandTotal: '1,500.00',
    address: ['محمود الحمصي', 'الانشاءات', 'حمص', 'حمص', 'سوريا'],
  },
]


// ─── FAKE COUPONS ──────────────────────────────────────────────
const COUPONS = [
  { code: 'KIDSSAVE15', discount: '15%', points: 300, unlocked: true,  color: 'pink' },
  { code: 'FAMILY20',   discount: '20%', points: 500, unlocked: true,  color: 'peach' },
  { code: 'FREESHIPS',  discount: '15%', points: 300, unlocked: false, color: 'gray' },
  { code: 'KIDSSAVE15', discount: '15%', points: 300, unlocked: false, color: 'gray' },
  { code: 'FAMILY20',   discount: '20%', points: 500, unlocked: false, color: 'gray' },
  { code: 'KIDSSAVE15', discount: '15%', points: 300, unlocked: false, color: 'gray' },
  { code: 'KIDSSAVE15', discount: '15%', points: 300, unlocked: false, color: 'gray' },
  { code: 'FAMILY20',   discount: '20%', points: 500, unlocked: false, color: 'gray' },
  { code: 'FREESHIP',   discount: '15%', points: 300, unlocked: false, color: 'gray' },
]

// Check-in streak days
const CHECKIN_DAYS = [
  { day: 1, pts: '+5',  done: true  },
  { day: 2, pts: '+3',  done: true  },
  { day: 3, pts: '+8',  done: true  },
  { day: 4, pts: '+2',  done: false },
  { day: 5, pts: '+7',  done: false },
  { day: 6, pts: '+6',  done: false },
  { day: 7, pts: '+4',  done: false, isGift: true },
]

// ══════════════════════════════════════════════════════════════
// TAB: Personal Info
// ══════════════════════════════════════════════════════════════
function PersonalInfoTab({ t, user }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     '',
    birthDay: '', birthMonth: '', birthYear: '',
    gender: 'female',
  })
  const [saved,    setSaved]   = useState(false)
  const [loading,  setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const set = f => v => setForm(p => ({ ...p, [f]: v }))

  // Load real profile on mount
  useEffect(() => {
    authApi.getProfile()
      .then(data => {
        const p = data?.user ?? data
        if (!p) return
        setForm(prev => ({
          ...prev,
          firstName: p.firstName || prev.firstName,
          lastName:  p.lastName  || prev.lastName,
          email:     p.email     || prev.email,
          phone:     p.phone     || '',
          gender:    p.gender?.toLowerCase() || 'female',
        }))
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setErrorMsg('')
    setLoading(true)
    try {
      await authApi.updateProfile({
        firstName: form.firstName,
        lastName:  form.lastName,
        phone:     form.phone,
        gender:    form.gender?.toUpperCase(),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ')
    }
    setLoading(false)
  }

  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
  const days   = Array.from({ length: 31 }, (_, i) => i + 1)
  const years  = Array.from({ length: 50 }, (_, i) => 2024 - i)

  return (
    <div className="pf-tab">
      <h2 className="pf-tab__title">{t.personalTitle}</h2>

      {/* Email verify banner */}
      <div className="pf-verify-banner">
        <Check size={16} className="pf-verify-banner__icon" />
        <span>{t.verifyEmail}</span>
        <button className="pf-verify-btn">{t.verify}</button>
      </div>

      {/* Name row */}
      <div className="pf-row-2">
        <div className="pf-field">
          <label className="pf-label">{t.lastName} <span className="pf-req">{t.required}</span></label>
          <input className="pf-input" value={form.lastName} onChange={e => set('lastName')(e.target.value)} />
        </div>
        <div className="pf-field">
          <label className="pf-label">{t.firstName} <span className="pf-req">{t.required}</span></label>
          <input className="pf-input" value={form.firstName} onChange={e => set('firstName')(e.target.value)} />
        </div>
      </div>

      {/* Email */}
      <div className="pf-field">
        <label className="pf-label">{t.email} <span className="pf-req">{t.required}</span></label>
        <input className="pf-input" type="email" value={form.email} onChange={e => set('email')(e.target.value)} />
      </div>

      {/* Phone */}
      <div className="pf-field">
        <label className="pf-label">{t.phone} <span className="pf-req">{t.required}</span></label>
        <input className="pf-input" type="tel" value={form.phone} onChange={e => set('phone')(e.target.value)} placeholder="user@gmail.kd" />
      </div>

      {/* Birth date - 3 dropdowns */}
      <div className="pf-field">
        <label className="pf-label">{t.birthDate}</label>
        <div className="pf-row-3">
          <div className="pf-select-wrap">
            <select className="pf-input pf-select" value={form.birthYear} onChange={e => set('birthYear')(e.target.value)}>
              <option value="">{t.year}</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown size={13} className="pf-select-arrow" />
          </div>
          <div className="pf-select-wrap">
            <select className="pf-input pf-select" value={form.birthMonth} onChange={e => set('birthMonth')(e.target.value)}>
              <option value="">{t.month}</option>
              {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
            <ChevronDown size={13} className="pf-select-arrow" />
          </div>
          <div className="pf-select-wrap">
            <select className="pf-input pf-select" value={form.birthDay} onChange={e => set('birthDay')(e.target.value)}>
              <option value="">{t.day}</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={13} className="pf-select-arrow" />
          </div>
        </div>
      </div>

      {/* Gender radio */}
      <div className="pf-field">
        <label className="pf-label">{t.gender}</label>
        <div className="pf-gender-row">
          <label className="pf-radio">
            <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={() => set('gender')('male')} />
            <span className="pf-radio__circle" />
            <span>{t.male}</span>
          </label>
          <label className="pf-radio pf-radio--active">
            <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={() => set('gender')('female')} />
            <span className="pf-radio__circle" />
            <span>{t.female}</span>
          </label>
        </div>
      </div>

      {saved    && <div className="pf-success">✅ {t.saveChanges === 'Save Changes' ? 'Changes saved!' : 'تم حفظ التغييرات!'}</div>}
      {errorMsg && <div className="pf-error">❌ {errorMsg}</div>}

      <button className="pf-save-btn" onClick={handleSave} disabled={loading}>
        {loading ? '...' : t.saveChanges}
      </button>
    </div>
  )
}

// ── normalize an order from API ───────────────────────────────
function normalizeOrder(o) {
  const statusRaw = (o.status || 'PENDING').toUpperCase()
  const statusMap = {
    PENDING:    { en: 'Processing', ar: 'قيد التنفيذ', key: 'processing' },
    PROCESSING: { en: 'Processing', ar: 'قيد التنفيذ', key: 'processing' },
    SHIPPED:    { en: 'Shipped',    ar: 'تم الشحن',    key: 'shipped'    },
    DELIVERED:  { en: 'Delivered',  ar: 'تم التسليم',   key: 'delivered'  },
    CANCELLED:  { en: 'Cancelled',  ar: 'ملغى',        key: 'cancelled'  },
  }
  const s = statusMap[statusRaw] || statusMap.PENDING
  const dateObj = o.createdAt ? new Date(o.createdAt) : new Date()
  return {
    id:       `#${(o.orderNumber || o.id?.slice(0,8) || '—').toString().toUpperCase()}`,
    rawId:    o.id,
    date:     dateObj.toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' }),
    dateEn:   dateObj.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
    phone:    o.phone || o.address?.phone || '—',
    total:    `${o.total ?? o.totalPrice ?? 0} EGP`,
    pay:      o.paymentMethod || '—',
    status:   s.key,
    statusAr: s.ar,
    statusEn: s.en,
    items:    (o.items || o.orderItems || []).map(it => ({
      name:    it.product?.nameAr || it.nameAr || it.name || '—',
      nameEn:  it.product?.nameEn || it.nameEn || it.name || '—',
      price:   `${it.price ?? 0} EGP`,
      qty:     it.quantity || it.qty || 1,
    })),
    shipping:   o.shippingCost ?? 50,
    grandTotal: `${(o.total ?? o.totalPrice ?? 0)} EGP`,
    address:    o.address
      ? [o.address.street, o.address.district, o.address.governorate, o.address.country].filter(Boolean)
      : [],
  }
}

// ══════════════════════════════════════════════════════════════
// TAB: My Orders
// ══════════════════════════════════════════════════════════════
function OrdersTab({ t, language }) {
  const [filter,        setFilter]        = useState('all')
  const [search,        setSearch]        = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders,        setOrders]        = useState([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    ordersApi.getMyOrders()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.orders || data?.data || [])
        setOrders(list.map(normalizeOrder))
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const statusFilterMap = { all: null, processing: 'processing', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' }

  const filtered = orders.filter(o => {
    const matchStatus = !statusFilterMap[filter] || o.status === statusFilterMap[filter]
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(it => it.name.includes(search) || it.nameEn.toLowerCase().includes(search.toLowerCase()))
    return matchStatus && matchSearch
  })

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} t={t} language={language} onBack={() => setSelectedOrder(null)} />
  }

  if (loading) {
    return (
      <div className="pf-tab" style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
        <div style={{ width:36, height:36, border:'4px solid var(--border)', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return (
    <div className="pf-tab">
      {/* Search */}
      <div className="orders-search">
        <Search size={15} className="orders-search__icon" />
        <input
          className="orders-search__input"
          placeholder={t.searchOrders}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter tabs */}
      <div className="orders-filters">
        {[['all', t.allOrders], ['processing', t.processing], ['shipped', t.shipped], ['cancelled', t.cancelled]].map(([key, label]) => (
          <button
            key={key}
            className={`orders-filter-btn ${filter === key ? 'orders-filter-btn--active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty__icon">
            <ShoppingBag size={52} strokeWidth={1} />
            <div className="orders-empty__x">🚫</div>
          </div>
          <h3>{t.emptyOrdersTitle}</h3>
          <Link to="/shop" className="orders-empty__btn">
            {t.startShopping}
          </Link>
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>{t.orderNum}</th>
                <th>{t.orderDate}</th>
                <th>{t.orderTotal}</th>
                <th>{t.orderStatus}</th>
                <th>{t.orderAction}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td className="orders-table__id" data-label={t.orderNum}>{order.id}</td>
                  <td data-label={t.orderDate}>{language === 'ar' ? order.date : order.dateEn}</td>
                  <td className="orders-table__total" data-label={t.orderTotal}>{order.total}</td>
                  <td data-label={t.orderStatus}>
                    <span className={`order-status-badge order-status-badge--${order.status}`}>
                      {language === 'ar' ? order.statusAr : order.statusEn}
                    </span>
                  </td>
                  <td data-label="">
                    <button className="orders-detail-btn" onClick={() => setSelectedOrder(order)}>
                      {t.viewDetails}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function OrderDetail({ order, t, language, onBack }) {
  const STEP_ORDER = ['processing', 'shipped', 'delivered']
  const currentIdx = STEP_ORDER.indexOf(order.status)
  const steps = [
    { label: t.statusOrdered,  date: order.date, done: true },
    { label: t.statusShipped,  date: currentIdx >= 1 ? order.date : '', done: currentIdx >= 1 },
    { label: t.statusArriving, date: currentIdx >= 2 ? order.date : '', done: currentIdx >= 2 },
  ]
  return (
    <div className="pf-tab">
      <button className="orders-back-btn" onClick={onBack}>{t.backToOrders}</button>

      {/* Status badge */}
      <div className="order-detail-status">
        <span className="pf-label">{t.orderStatusLabel}</span>
        <span className={`order-status-badge order-status-badge--${order.status}`}>
          {language === 'ar' ? order.statusAr : order.statusEn}
        </span>
      </div>

      {/* Steps */}
      <div className="order-steps">
        {steps.map((step, i) => (
          <div key={i} className="order-step">
            <div className={`order-step__circle ${step.done ? 'order-step__circle--done' : ''}`}>
              {step.done ? <CheckCircle2 size={20} /> : <Clock size={18} />}
            </div>
            <p className={`order-step__label ${!step.done ? 'order-step__label--muted' : ''}`}>{step.label}</p>
            <p className="order-step__date">{step.date}</p>
            {i < steps.length - 1 && <div className={`order-step__line ${steps[i+1].done ? 'order-step__line--done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Order meta bar */}
      <div className="order-meta-bar">
        {[
          [t.orderNum, order.id],
          [t.orderDate, language === 'ar' ? order.date : order.dateEn],
          [t.orderPhone, order.phone],
          [t.orderTotal, order.total],
          [t.payMethodLabel, order.pay],
        ].map(([label, val]) => (
          <div key={label} className="order-meta-item">
            <span className="order-meta-item__label">{label} :</span>
            <span className="order-meta-item__val">{val}</span>
          </div>
        ))}
      </div>

      {/* Products table */}
      <table className="success-table" style={{ marginTop: 24 }}>
        <thead><tr><th>{t.products}</th><th>{t.prices}</th></tr></thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}><td>{language === 'ar' ? item.name : item.nameEn}</td><td>{item.price}</td></tr>
          ))}
          <tr className="success-table__subtotal"><td>{t.priceRow}</td><td>{order.grandTotal} ل.س</td></tr>
          <tr><td>{t.shippingRow}</td><td>{order.shipping} ل.س</td></tr>
          <tr><td>{t.payRow}</td><td>{order.pay}</td></tr>
          <tr className="success-table__total"><td>{t.totalRow}</td><td>{order.grandTotal} ل.س</td></tr>
        </tbody>
      </table>

      {/* Delivery address */}
      {order.address.length > 0 && (
        <>
          <h3 className="pf-section-title">{t.addressTitle}</h3>
          <div className="order-address">
            {order.address.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        </>
      )}

      {/* WhatsApp contact */}
      <div style={{ marginTop: 28, display:'flex', justifyContent:'center' }}>
        <a
          href={`https://wa.me/201000000000?text=${encodeURIComponent(
            (language === 'ar' ? 'مرحباً، لدي استفسار عن طلبي رقم ' : 'Hello, I have a question about my order #') + order.id
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="order-whatsapp-btn"
        >
          💬 {language === 'ar' ? 'تواصل معنا واتساب بخصوص هذا الطلب' : 'Contact Us on WhatsApp About This Order'}
        </a>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TAB: Points
// ══════════════════════════════════════════════════════════════
function PointsTab({ t, language }) {
  const { coins, addCoins } = useApp()
  const coinValueEGP = (coins * 0.05).toFixed(2)   // 1 coin = 0.05 EGP
  const [checkedIn, setCheckedIn] = useState(false)
  const [copied,    setCopied]    = useState(null)
  const [checkinDays, setCheckinDays] = useState(CHECKIN_DAYS)

  const handleCheckin = async () => {
    if (checkedIn) return
    setCheckedIn(true)
    addCoins(5)
    setCheckinDays(prev => prev.map((d, i) => i === 0 ? { ...d, done: true } : d))
  }

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="pf-tab">
      {/* Points hero — baby decorations */}
      <div className="points-hero">
        <div className="points-decos">
          <span className="pd-1">🧸</span><span className="pd-2">🧦</span>
          <span className="pd-3">🎀</span><span className="pd-4">🍼</span>
          <span className="pd-5">⭐</span><span className="pd-6">❤️</span>
        </div>
        <div className="points-balance">
          <p className="points-balance__label">{t.myBalance}</p>
          <div className="points-balance__amount">
            <span className="points-coin">🪙</span>
            <span className="points-num">{coins.toLocaleString()}</span>
            <span className="points-label">{t.points}</span>
          </div>
          <p className="points-egp-value">
            ≈ {coinValueEGP} EGP {language === 'ar' ? '(يمكن استخدامها عند الدفع)' : '(usable at checkout)'}
          </p>
        </div>
      </div>

      {/* Daily check-in */}
      <div className="checkin-card">
        <div className="checkin-card__head">
          <h3 className="checkin-card__title">ℹ️ {t.dailyCheckin}</h3>
          <p className="checkin-card__desc">{t.dailyCheckinDesc}</p>
        </div>

        {/* 7-day streak */}
        <div className="checkin-streak">
          {[...checkinDays].reverse().map((day, i) => (
            <div key={day.day} className={`streak-day ${day.done ? 'streak-day--done' : ''} ${i === checkinDays.length - 1 - checkinDays.filter(d=>d.done).length + (checkedIn ? 1 : 0) ? 'streak-day--today' : ''}`}>
              {day.isGift ? <span className="streak-day__icon">🏠</span> : <span className="streak-day__icon">⭐</span>}
              <span className="streak-day__pts">{day.pts}</span>
              <span className="streak-day__label">{t.days[day.day - 1]}</span>
            </div>
          ))}
        </div>

        <button
          className={`checkin-btn ${checkedIn ? 'checkin-btn--done' : ''}`}
          onClick={handleCheckin}
        >
          {checkedIn ? '✅ تم التسجيل اليوم!' : t.checkinBtn}
        </button>
      </div>

      {/* Redeem coupons */}
      <div className="redeem-section">
        <h3 className="pf-section-title">ℹ️ {t.redeemTitle}</h3>
        <div className="coupons-grid">
          {COUPONS.map((coupon, i) => (
            <div key={i} className={`coupon-card ${coupon.unlocked ? `coupon-card--${coupon.color}` : 'coupon-card--locked'}`}>
              {/* Lock icon for locked coupons */}
              {!coupon.unlocked && (
                <div className="coupon-lock"><Lock size={18} /></div>
              )}

              {/* Decorative emojis for unlocked */}
              {coupon.unlocked && (
                <div className="coupon-decos">🍼 🧸 ⭐</div>
              )}

              <div className="coupon-discount">{coupon.discount} خصم</div>
              <div className="coupon-code">{coupon.code}</div>
              <p className="coupon-desc">
                🪙 استبدل {coupon.points} نقطة للحصول على خصم {coupon.discount} على طلبك !
              </p>
              <button
                className={`coupon-copy-btn ${!coupon.unlocked ? 'coupon-copy-btn--disabled' : ''}`}
                disabled={!coupon.unlocked}
                onClick={() => coupon.unlocked && handleCopy(coupon.code)}
              >
                {copied === coupon.code ? t.copied : t.copyCode}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TAB: Addresses
// ══════════════════════════════════════════════════════════════
function AddressesTab({ t, language }) {
  const [addresses,    setAddresses]    = useState([])
  const [openMenu,     setOpenMenu]     = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget,   setEditTarget]   = useState(null)
  const [showAddForm,  setShowAddForm]  = useState(false)

  const emptyForm = { name: '', lastName: '', phone: '', governorate: '', district: '', neighborhood: '', street: '', address: '' }
  const [form, setForm] = useState(emptyForm)
  const set = f => v => setForm(p => ({ ...p, [f]: v }))

  useEffect(() => {
    authApi.getAddresses()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.addresses || data?.data || [])
        setAddresses(list.map(a => ({
          id:           a.id,
          name:         `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.name || '—',
          nameEn:       `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.nameEn || '—',
          governorate:  a.governorate || '',
          district:     a.district    || '',
          neighborhood: a.neighborhood || '',
          street:       a.street      || '',
          building:     a.address     || a.building || '',
        })))
      })
      .catch(() => setAddresses([]))
  }, [])

  const openEdit = (addr) => {
    setEditTarget(addr)
    setForm({ name: addr.name, lastName: '', phone: '', governorate: addr.governorate, district: addr.district, neighborhood: addr.neighborhood, street: addr.street, address: addr.building })
    setOpenMenu(null)
  }

  const saveEdit = async () => {
    try {
      await authApi.updateAddress(editTarget.id, {
        firstName: form.name, lastName: form.lastName, phone: form.phone,
        governorate: form.governorate, district: form.district,
        neighborhood: form.neighborhood, street: form.street, address: form.address,
      })
    } catch {}
    setAddresses(prev => prev.map(a => a.id === editTarget.id ? { ...a, name: form.name, governorate: form.governorate, district: form.district, neighborhood: form.neighborhood, street: form.street, building: form.address } : a))
    setEditTarget(null)
  }

  const handleDelete = async () => {
    try { await authApi.deleteAddress(deleteTarget.id) } catch {}
    setAddresses(prev => prev.filter(a => a.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleAdd = async () => {
    let newAddr = { id: Date.now(), name: form.name, nameEn: form.name, governorate: form.governorate, district: form.district, neighborhood: form.neighborhood, street: form.street, building: form.address }
    try {
      const res = await authApi.addAddress({
        firstName: form.name, lastName: form.lastName, phone: form.phone,
        governorate: form.governorate, district: form.district,
        neighborhood: form.neighborhood, street: form.street, address: form.address,
      })
      if (res?.id) newAddr.id = res.id
    } catch {}
    setAddresses(prev => [...prev, newAddr])
    setShowAddForm(false)
    setForm(emptyForm)
  }

  return (
    <div className="pf-tab">
      {/* Add button */}
      <button className="addr-add-btn" onClick={() => setShowAddForm(true)}>
        {t.addAddress}
      </button>

      {/* Address cards */}
      <div className="addr-list">
        {addresses.map(addr => (
          <div key={addr.id} className="addr-card">
            <div className="addr-card__head">
              <button className="addr-menu-btn" onClick={() => setOpenMenu(openMenu === addr.id ? null : addr.id)}>
                <MoreHorizontal size={18} />
              </button>
              <h4 className="addr-card__name">{language === 'ar' ? addr.name : addr.nameEn}</h4>

              {/* Dropdown menu */}
              {openMenu === addr.id && (
                <div className="addr-dropdown">
                  <button onClick={() => openEdit(addr)}>
                    <Pencil size={14} /> {t.edit}
                  </button>
                  <button onClick={() => { setDeleteTarget(addr); setOpenMenu(null) }} className="addr-dropdown__delete">
                    <Trash2 size={14} /> {t.delete}
                  </button>
                </div>
              )}
            </div>
            <p className="addr-card__detail">
              {[addr.district, addr.neighborhood, addr.governorate, addr.street, addr.building].filter(Boolean).join('، ')}
            </p>
          </div>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="pf-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="delete-dialog" onClick={e => e.stopPropagation()}>
            <div className="delete-dialog__icon"><Trash2 size={28} /></div>
            <p className="delete-dialog__text">{t.deleteConfirm}</p>
            <div className="delete-dialog__actions">
              <button className="delete-dialog__no"  onClick={() => setDeleteTarget(null)}>{t.no}</button>
              <button className="delete-dialog__yes" onClick={handleDelete}>{t.yes}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add modal */}
      {(editTarget || showAddForm) && (
        <div className="pf-overlay" onClick={() => { setEditTarget(null); setShowAddForm(false) }}>
          <div className="addr-modal" onClick={e => e.stopPropagation()}>
            <div className="addr-modal__head">
              <h3>{editTarget ? t.editAddressTitle : t.addAddressTitle}</h3>
              <button onClick={() => { setEditTarget(null); setShowAddForm(false) }}><X size={18} /></button>
            </div>

            <div className="addr-modal__body">
              <div className="pf-row-2">
                <div className="pf-field">
                  <label className="pf-label">{t.lastName} <span className="pf-req">*</span></label>
                  <input className="pf-input" value={form.lastName} onChange={e => set('lastName')(e.target.value)} placeholder="الحمصي" />
                </div>
                <div className="pf-field">
                  <label className="pf-label">{t.firstName} <span className="pf-req">*</span></label>
                  <input className="pf-input" value={form.name} onChange={e => set('name')(e.target.value)} placeholder="محمود" />
                </div>
              </div>

              <div className="pf-field">
                <label className="pf-label">{t.phone} <span className="pf-req">*</span></label>
                <input className="pf-input" value={form.phone} onChange={e => set('phone')(e.target.value)} placeholder="+963994240911" />
              </div>

              <div className="pf-row-2">
                <div className="pf-field">
                  <label className="pf-label">{t.district} <span className="pf-req">*</span></label>
                  <div className="pf-select-wrap">
                    <select className="pf-input pf-select" value={form.district} onChange={e => set('district')(e.target.value)}>
                      {['الانشاءات', 'المركز', 'عكرمة', 'الزهراء', 'الوعر'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={13} className="pf-select-arrow" />
                  </div>
                </div>
                <div className="pf-field">
                  <label className="pf-label">{t.governorate} <span className="pf-req">*</span></label>
                  <div className="pf-select-wrap">
                    <select className="pf-input pf-select" value={form.governorate} onChange={e => set('governorate')(e.target.value)}>
                      {['حمص', 'دمشق', 'حلب', 'اللاذقية', 'طرطوس'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={13} className="pf-select-arrow" />
                  </div>
                </div>
              </div>

              <div className="pf-row-2">
                <div className="pf-field">
                  <label className="pf-label">{t.street} <span className="pf-req">*</span></label>
                  <input className="pf-input" value={form.street} onChange={e => set('street')(e.target.value)} placeholder="غسان كنفاني" />
                </div>
                <div className="pf-field">
                  <label className="pf-label">{t.neighborhood} <span className="pf-req">*</span></label>
                  <div className="pf-select-wrap">
                    <select className="pf-input pf-select" value={form.neighborhood} onChange={e => set('neighborhood')(e.target.value)}>
                      {['الانشاءات', 'الحي 1', 'الحي 2'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={13} className="pf-select-arrow" />
                  </div>
                </div>
              </div>

              <div className="pf-field">
                <label className="pf-label">{t.addressLabel} <span className="pf-req">*</span></label>
                <textarea className="pf-input pf-textarea" rows={3} value={form.address} onChange={e => set('address')(e.target.value)} placeholder={t.addressPlaceholder} />
              </div>

              <button className="pf-save-btn" onClick={editTarget ? saveEdit : handleAdd}>
                {editTarget ? t.saveEdits : t.addAddress}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TAB: Change Password
// ══════════════════════════════════════════════════════════════
function ChangePasswordTab({ t }) {
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' })
  const [status,  setStatus]  = useState(null)
  const [loading, setLoading] = useState(false)
  const set = f => v => setForm(p => ({ ...p, [f]: v }))

  const handleSave = async () => {
    if (form.newPwd !== form.confirm) { setStatus('error'); return }
    setLoading(true)
    try {
      await authApi.changePassword(form.current, form.newPwd)
      setStatus('success')
      setForm({ current: '', newPwd: '', confirm: '' })
      setTimeout(() => setStatus(null), 3000)
    } catch {
      setStatus('error')
    }
    setLoading(false)
  }

  return (
    <div className="pf-tab">
      <h2 className="pf-tab__title">{t.changePassword}</h2>

      {status === 'success' && <div className="pf-success">{t.passwordSuccess}</div>}
      {status === 'error'   && <div className="pf-error">{t.passwordError}</div>}

      <div className="pf-field">
        <label className="pf-label">{t.currentPassword} <span className="pf-req">*</span></label>
        <input className="pf-input" type="password" value={form.current} onChange={e => set('current')(e.target.value)} />
      </div>
      <div className="pf-field">
        <label className="pf-label">{t.newPassword} <span className="pf-req">*</span></label>
        <input className="pf-input" type="password" value={form.newPwd} onChange={e => set('newPwd')(e.target.value)} />
      </div>
      <div className="pf-field">
        <label className="pf-label">{t.confirmPassword} <span className="pf-req">*</span></label>
        <input className="pf-input" type="password" value={form.confirm} onChange={e => set('confirm')(e.target.value)} />
      </div>

      <button className="pf-save-btn" onClick={handleSave} disabled={loading}>
        {loading ? '...' : t.savePassword}
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN: ProfilePage
// ══════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const { language, user, logout, isLoggedIn, coins } = useApp()
  const t = T[language]
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')

  // Redirect if not logged in
  if (!isLoggedIn) {
    return (
      <main>
        <PageHeader titleAr="حسابي" titleEn="My Account" breadcrumbAr="حسابي" breadcrumbEn="Account" />
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: 16 }}>
            {language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first'}
          </h2>
          <Link to="/login" style={{ background: 'var(--primary)', color: '#fff', padding: '12px 32px', borderRadius: '40px', fontWeight: 700 }}>
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </div>
      </main>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const TABS = [
    { key: 'personal',  label: t.personalInfo,   icon: <User size={17} /> },
    { key: 'orders',    label: t.myOrders,        icon: <Package size={17} /> },
    { key: 'points',    label: t.myPoints,        icon: <Star size={17} />, badge: String(coins) },
    { key: 'addresses', label: t.myAddresses,     icon: <MapPin size={17} /> },
    { key: 'password',  label: t.changePassword,  icon: <Lock size={17} /> },
  ]

  return (
    <main className="profile-page">
      <PageHeader titleAr="حسابي" titleEn="My Account" breadcrumbAr="حسابي" breadcrumbEn="Account" />

      <div className="profile-container">
        <div className="profile-layout">

          {/* ── SIDEBAR ──────────────────────────── */}
          <aside className="profile-sidebar">
            <h2 className="profile-sidebar__title">{t.myAccount}</h2>

            <nav className="profile-nav">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`profile-nav-item ${activeTab === tab.key ? 'profile-nav-item--active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span className="profile-nav-item__icon">{tab.icon}</span>
                  <span className="profile-nav-item__label">{tab.label}</span>
                  {tab.badge && (
                    <span className="profile-nav-item__badge">
                      🪙 {tab.badge} {t.points}
                    </span>
                  )}
                </button>
              ))}

              {/* Logout */}
              <button className="profile-nav-item profile-nav-item--logout" onClick={handleLogout}>
                <span className="profile-nav-item__icon"><LogOut size={17} /></span>
                <span className="profile-nav-item__label">{t.logout}</span>
              </button>
            </nav>
          </aside>

          {/* ── MAIN CONTENT ─────────────────────── */}
          <div className="profile-content">
            {activeTab === 'personal'  && <PersonalInfoTab  t={t} user={user} />}
            {activeTab === 'orders'    && <OrdersTab        t={t} language={language} />}
            {activeTab === 'points'    && <PointsTab        t={t} language={language} />}
            {activeTab === 'addresses' && <AddressesTab     t={t} language={language} />}
            {activeTab === 'password'  && <ChangePasswordTab t={t} />}
          </div>

        </div>
      </div>
    </main>
  )
}
