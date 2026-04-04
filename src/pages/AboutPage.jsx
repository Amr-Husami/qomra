/**
 * AboutPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *  1. PageHeader → pink banner "من نحن"
 *  2. About content (placeholder — fill with real content later)
 *  3. Features Strip
 * ─────────────────────────────────────────────────────────────
 */

import { Shield, Truck, ThumbsUp, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/PageHeader'
import './AboutPage.css'

const featuresData = {
  ar: [
    { icon: <Shield size={28} />,   title: 'دفع آمن',            desc: 'طرق دفع محمية عبر التطبيقات والبنوك المحلية' },
    { icon: <Truck size={28} />,    title: 'شحن سريع',           desc: 'توصيل سريع وآمن لطلبك أينما كنت' },
    { icon: <ThumbsUp size={28} />, title: 'شهادات موثوقة',     desc: 'منتجات معتمدة من جهات موثوقة عالمياً' },
    { icon: <RotateCcw size={28} />,title: 'إرجاع خلال 30 يوم', desc: 'سياسة إرجاع سهلة إذا لم تكن راضياً عن المنتج' },
  ],
  en: [
    { icon: <Shield size={28} />,   title: 'Safe Payment',    desc: 'Secure payment via apps and local banks' },
    { icon: <Truck size={28} />,    title: 'Fast Shipping',   desc: 'Fast and safe delivery wherever you are' },
    { icon: <ThumbsUp size={28} />, title: 'Trusted Reviews', desc: 'Products certified by globally trusted sources' },
    { icon: <RotateCcw size={28} />,title: '30-Day Returns',  desc: 'Easy return policy if not satisfied' },
  ],
}

export default function AboutPage() {
  const { language } = useApp()
  const features = featuresData[language]

  return (
    <main className="about-page">

      {/* 1. Page header */}
      <PageHeader
        titleAr="من نحن"
        titleEn="About Us"
        breadcrumbAr="من نحن"
        breadcrumbEn="About Us"
      />

      {/* 2. About content placeholder */}
      {/* 🔌 Fill this section with real about content later */}
      <section className="about-content">
        <div className="about-container">
          <div className="about-placeholder">
            <p className="about-placeholder__text">
              {language === 'ar'
                ? 'محتوى صفحة من نحن — يمكن إضافته لاحقاً 🌙'
                : 'About Us content — can be added later 🌙'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Features Strip */}
      <section className="about-features">
        <div className="about-container">
          <div className="about-features-grid">
            {features.map((f, i) => (
              <div key={i} className="about-feature">
                <div className="about-feature-icon">{f.icon}</div>
                <div className="about-feature-text">
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
