/**
 * Footer.jsx
 * ─────────────────────────────────────────────────────────────
 * The footer — appears on EVERY page, at the bottom.
 * It has 4 sections:
 *   1. Brand info (logo + description + contact)
 *   2. Quick links (روابط سريعة)
 *   3. Support links (الدعم)
 *   4. Social media (التواصل الاجتماعي)
 *
 * Below that: payment icons + copyright text
 * ─────────────────────────────────────────────────────────────
 */

import { Link } from 'react-router-dom'
import { Phone, Mail, ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './Footer.css'

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────
const T = {
  ar: {
    description: 'منذ البداية وضعنا نصب أعيننا هدفاً واحداً: أن نوفر للأمهات والآباء مستلزمات آمنة، عملية. وبأسعار مناسبة. هنا ستجدون كل ما يلزم صغيركم من منتجات النوم واللعب وحتى التنقل. لنرافقكم في كل مراحل النمو.',
    contactTitle: 'للتواصل',
    phone: '+963994240911 - +963994240911',
    email: 'contact@Qomra.com',
    quickLinks: 'روابط سريعة',
    support: 'الدعم',
    social: 'التواصل الاجتماعي',
    copyright: '© 2025 قمرة. جميع الحقوق محفوظة.',
    links: {
      quick: [
        { label: 'من نحن', to: '/about' },
        { label: 'المنتجات', to: '/shop' },
        { label: 'مركز المساعدة و الدعم', to: '/support' },
      ],
      support: [
        { label: 'معلومات التوصيل', to: '/delivery' },
        { label: 'الاسترجاع', to: '/returns' },
        { label: 'كيفية الطلب', to: '/how-to-order' },
        { label: 'كيفية التوصيل', to: '/shipping' },
      ],
    },
  },
  en: {
    description: 'From the beginning, our goal was clear: to provide parents with safe, practical baby essentials at fair prices. Here you\'ll find everything your little one needs — from sleep to play to travel. We grow with you.',
    contactTitle: 'Contact Us',
    phone: '+963994240911 - +963994240911',
    email: 'contact@Qomra.com',
    quickLinks: 'Quick Links',
    support: 'Support',
    social: 'Follow Us',
    copyright: '© 2025 Qomra. All rights reserved.',
    links: {
      quick: [
        { label: 'About Us', to: '/about' },
        { label: 'Products', to: '/shop' },
        { label: 'Help Center', to: '/support' },
      ],
      support: [
        { label: 'Delivery Info', to: '/delivery' },
        { label: 'Returns', to: '/returns' },
        { label: 'How to Order', to: '/how-to-order' },
        { label: 'Shipping Info', to: '/shipping' },
      ],
    },
  },
}

// ─── SOCIAL LINKS ────────────────────────────────────────────────────────
// Update these URLs with the real social media links
const SOCIALS = [
  { icon: '📘', label: 'Facebook',  url: 'https://facebook.com' },
  { icon: '🐦', label: 'Twitter',   url: 'https://twitter.com' },
  { icon: '📸', label: 'Instagram', url: 'https://instagram.com' },
  { icon: '📌', label: 'Pinterest', url: 'https://pinterest.com' },
  { icon: '▶️', label: 'Youtube',   url: 'https://youtube.com' },
]

// ─── PAYMENT METHODS (text-based for now, replace with real logos later) ──
const PAYMENTS = ['Mastercard', 'Google Pay', 'Payoneer', 'Apple Pay', 'PayPal']

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
export default function Footer() {
  const { language } = useApp()
  const t = T[language]

  return (
    <footer className="footer">

      {/* ══════════════════════════════════
          MAIN FOOTER CONTENT
          4 columns on desktop, stacked on mobile
          ══════════════════════════════════ */}
      <div className="ft-container">
        <div className="footer__grid">

          {/* COLUMN 1: Brand + Description + Contact */}
          <div className="ft-col ft-col--brand">
            {/* Logo */}
            <Link to="/" className="ft-logo">
              <span className="ft-logo__ar">قمرة</span>
              <span className="ft-logo__en">Qomra</span>
            </Link>

            {/* Brand description */}
            <p className="ft-description">{t.description}</p>

            {/* Contact info */}
            <div className="ft-contact">
              <p className="ft-contact__title">{t.contactTitle}</p>

              <a href={`tel:${t.phone}`} className="ft-contact__row">
                <span>{t.phone}</span>
                <Phone size={15} />
              </a>

              <a href={`mailto:${t.email}`} className="ft-contact__row">
                <span>{t.email}</span>
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div className="ft-col">
            <h4 className="ft-col__title">{t.quickLinks}</h4>
            <ul className="ft-links">
              {t.links.quick.map((link) => (
                <li key={link.to}>
                  {/* 🔌 API NOTE: These are static pages, no API needed */}
                  <Link to={link.to} className="ft-link">
                    <span>›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Support */}
          <div className="ft-col">
            <h4 className="ft-col__title">{t.support}</h4>
            <ul className="ft-links">
              {t.links.support.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="ft-link">
                    <span>›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: Social Media */}
          <div className="ft-col">
            <h4 className="ft-col__title">{t.social}</h4>
            <ul className="ft-socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ft-social-link"
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════
          FOOTER BOTTOM BAR
          Payment methods + copyright
          ══════════════════════════════════ */}
      <div className="footer__bottom">
        <div className="ft-container footer__bottom__inner">

          {/* Copyright */}
          <p className="ft-copyright">{t.copyright}</p>

          {/* Payment icons */}
          <div className="ft-payments">
            {PAYMENTS.map((p) => (
              <span key={p} className="ft-payment-badge">{p}</span>
            ))}
          </div>

        </div>
      </div>

    </footer>
  )
}
