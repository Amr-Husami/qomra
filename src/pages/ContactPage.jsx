/**
 * ContactPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *  1. PageHeader   → pink banner "تواصل معنا"
 *  2. Contact Form → name, email, phone, message + send button
 *  3. Contact Info → address, email, phone, working hours
 *  4. Features Strip → 4 trust badges
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { MapPin, Mail, Phone, Clock, Shield, Truck, ThumbsUp, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/PageHeader'
import { contactApi } from '../api/api'
import './ContactPage.css'

// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    formTitle:    'هل لديك استفسار؟',
    formSubtitle: 'لن يتم نشر البريد الاللكتروني الخاص بك',
    nameLabel:    'اسم المستخدم',
    emailLabel:   'البريد الالكتروني',
    phoneLabel:   'رقم الهاتف',
    messageLabel: 'الرسالة',
    sendBtn:      'ارسل رسالة',
    sending:      'جاري الإرسال...',
    successMsg:   '✅ تم إرسال رسالتك بنجاح! سنرد عليك قريباً.',
    errorMsg:     '❌ حدث خطأ، حاول مرة أخرى.',
    required:     '*',

    infoTitle:    'ابق على اتصال معنا',
    infoSubtitle: 'تفاصيل عن الموقع و بعض الوصف للجمل يمكن ان تضيفها هنا',
    address:      'سوريا - حمص - بعض تفاصيل الموقع',
    email:        'hdroubie0@gmail.com',
    phone:        '+963994240911',
    hours1:       'الاثنين - الاربعاء: 9:00 AM-18:00 PM',
    hours2:       'الاحد: 10:00 PM-17:30 AM',

    features: [
      { icon: <Shield size={28} />, title: 'دفع آمن',            desc: 'طرق دفع محمية عبر التطبيقات والبنوك المحلية' },
      { icon: <Truck size={28} />,  title: 'شحن سريع',           desc: 'توصيل سريع وآمن لطلبك أينما كنت' },
      { icon: <ThumbsUp size={28} />,title: 'شهادات موثوقة',    desc: 'منتجات معتمدة من جهات موثوقة عالمياً' },
      { icon: <RotateCcw size={28} />,title: 'إرجاع خلال 30 يوم',desc: 'سياسة إرجاع سهلة إذا لم تكن راضياً عن المنتج' },
    ],
  },
  en: {
    formTitle:    'Do you have a question?',
    formSubtitle: 'Your email address will not be published',
    nameLabel:    'Username',
    emailLabel:   'Email Address',
    phoneLabel:   'Phone Number',
    messageLabel: 'Message',
    sendBtn:      'Send Message',
    sending:      'Sending...',
    successMsg:   '✅ Your message has been sent successfully! We\'ll reply soon.',
    errorMsg:     '❌ Something went wrong, please try again.',
    required:     '*',

    infoTitle:    'Stay in Touch',
    infoSubtitle: 'Details about the website and some description you can add here',
    address:      'Syria - Homs - Some location details',
    email:        'hdroubie0@gmail.com',
    phone:        '+963994240911',
    hours1:       'Mon - Wed: 9:00 AM - 6:00 PM',
    hours2:       'Sunday: 10:00 AM - 5:30 PM',

    features: [
      { icon: <Shield size={28} />,  title: 'Safe Payment',    desc: 'Secure payment via apps and local banks' },
      { icon: <Truck size={28} />,   title: 'Fast Shipping',   desc: 'Fast and safe delivery wherever you are' },
      { icon: <ThumbsUp size={28} />,title: 'Trusted Reviews', desc: 'Products certified by globally trusted sources' },
      { icon: <RotateCcw size={28} />,title: '30-Day Returns', desc: 'Easy return policy if you\'re not satisfied' },
    ],
  },
}

// ─── FEATURES STRIP ───────────────────────────────────────────
function FeaturesStrip({ features }) {
  return (
    <section className="contact-features">
      <div className="contact-container">
        <div className="cf-grid">
          {features.map((f, i) => (
            <div key={i} className="cf-card">
              <div className="cf-icon">{f.icon}</div>
              <div className="cf-text">
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
// MAIN: ContactPage
// ══════════════════════════════════════════════════════════════
export default function ContactPage() {
  const { language } = useApp()
  const t = T[language]

  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus]   = useState(null)   // null | 'success' | 'error'
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.message) return
    setLoading(true)
    setStatus(null)

    try {
      // 🔌 REAL API: POST /api/contact  { name, email, phone, message }
      await contactApi.sendMessage(form.name, form.email, form.phone, form.message)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    }
    setLoading(false)
  }

  return (
    <main className="contact-page">

      {/* 1. Page header */}
      <PageHeader
        titleAr="تواصل معنا"
        titleEn="Contact Us"
        breadcrumbAr="تواصل معنا"
        breadcrumbEn="Contact Us"
      />

      {/* 2. Main content: Form + Info */}
      <div className="contact-container contact-main">
        <div className="contact-layout">

          {/* ── LEFT: Contact Form ─────────────── */}
          <div className="contact-form-wrap">
            <h2 className="contact-form-title">{t.formTitle}</h2>
            <p className="contact-form-subtitle">{t.formSubtitle}</p>

            {/* Status messages */}
            {status === 'success' && (
              <div className="contact-alert contact-alert--success">{t.successMsg}</div>
            )}
            {status === 'error' && (
              <div className="contact-alert contact-alert--error">{t.errorMsg}</div>
            )}

            {/* Name + Email row */}
            <div className="cf-row-2">
              <div className="cf-field">
                <label className="cf-label">
                  {t.nameLabel} <span className="cf-required">{t.required}</span>
                </label>
                <input
                  className="cf-input"
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                />
              </div>
              <div className="cf-field">
                <label className="cf-label">{t.emailLabel}</label>
                <input
                  className="cf-input"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="cf-field">
              <label className="cf-label">
                {t.phoneLabel} <span className="cf-required">{t.required}</span>
              </label>
              <input
                className="cf-input"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>

            {/* Message */}
            <div className="cf-field">
              <label className="cf-label">
                {t.messageLabel} <span className="cf-required">{t.required}</span>
              </label>
              <textarea
                className="cf-input cf-textarea"
                rows={5}
                value={form.message}
                onChange={set('message')}
              />
            </div>

            {/* Submit button */}
            <button
              className={`cf-submit ${loading ? 'cf-submit--loading' : ''}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t.sending : t.sendBtn}
            </button>
          </div>

          {/* ── RIGHT: Contact Info ────────────── */}
          <div className="contact-info-wrap">
            <h2 className="ci-title">{t.infoTitle}</h2>
            <p className="ci-subtitle">{t.infoSubtitle}</p>

            <div className="ci-items">
              {/* Address */}
              <div className="ci-item">
                <div className="ci-icon"><MapPin size={18} /></div>
                <span>{t.address}</span>
              </div>

              {/* Email */}
              <div className="ci-item">
                <div className="ci-icon"><Mail size={18} /></div>
                <a href={`mailto:${t.email}`}>{t.email}</a>
              </div>

              {/* Phone */}
              <div className="ci-item">
                <div className="ci-icon"><Phone size={18} /></div>
                <a href={`tel:${t.phone}`}>{t.phone}</a>
              </div>

              {/* Working hours */}
              <div className="ci-item ci-item--hours">
                <div className="ci-icon"><Clock size={18} /></div>
                <div>
                  <p>{t.hours1}</p>
                  <p>{t.hours2}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Features strip */}
      <FeaturesStrip features={t.features} />

    </main>
  )
}
