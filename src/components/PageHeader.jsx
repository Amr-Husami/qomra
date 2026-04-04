/**
 * PageHeader.jsx
 * ─────────────────────────────────────────────────────────────
 * Reusable pink pastel banner with baby decorations.
 * Used on: Contact, About, FAQ, Shop pages.
 *
 * Props:
 *   titleAr   → Arabic title
 *   titleEn   → English title
 *   breadcrumbAr → breadcrumb label in Arabic
 *   breadcrumbEn → breadcrumb label in English
 * ─────────────────────────────────────────────────────────────
 */

import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './PageHeader.css'

export default function PageHeader({ titleAr, titleEn, breadcrumbAr, breadcrumbEn }) {
  const { language } = useApp()

  return (
    <div className="page-header">
      {/* Decorative elements matching Figma */}
      <span className="ph-deco ph-deco--star">⭐</span>
      <span className="ph-deco ph-deco--circle1" />
      <span className="ph-deco ph-deco--circle2" />
      <span className="ph-deco ph-deco--pacifier">🧸</span>
      <span className="ph-deco ph-deco--diaper">🧷</span>
      <span className="ph-deco ph-deco--moon">🌙</span>

      <div className="ph-content">
        <h1 className="ph-title">
          {language === 'ar' ? titleAr : titleEn}
        </h1>
        <nav className="ph-breadcrumb">
          <Link to="/">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>›</span>
          <span>{language === 'ar' ? breadcrumbAr : breadcrumbEn}</span>
        </nav>
      </div>
    </div>
  )
}
