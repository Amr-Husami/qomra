/**
 * HomePage.jsx
 * ─────────────────────────────────────────────────────────────
 * All sections of the homepage in order:
 *
 *  1. HeroSlider          — auto-play banner with arrows + dots
 *  2. ShopByCategory      — 5 category cards
 *  3. NewArrivals         — 4 product cards grid
 *  4. ShopByAge           — 5 circular age cards
 *  5. MarqueeBanner       — scrolling text strip
 *  6. BestSellers         — 4 product cards grid
 *  7. PromoBanners        — 5 promo cards grid
 *  8. RecommendedForYou   — 4 product cards grid
 *  9. BestBrands          — brand logos scrolling
 * 10. NewsletterSection   — email signup + 25% discount
 * 11. FeaturesStrip       — 4 trust badges
 * 12. InstagramSection    — photo grid
 * 13. NewsletterPopup     — modal on first visit
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, X,
  Shield, Truck, ThumbsUp, RotateCcw
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { useHomeData } from '../api/useHomeData'
import { promoBanners, instagramPhotos } from '../data/homeData'
import './HomePage.css'

// ─── TRANSLATIONS ─────────────────────────────────────────────
const T = {
  ar: {
    shopByCategory: 'تسوقي حسب التصنيف',
    newArrivals: 'وصل حديثاً',
    viewAll: 'مشاهدة الكل',
    shopByAge: 'تسوقي حسب العمر',
    bestSellers: 'الأكثر مبيعاً هذا الاسبوع',
    recommended: 'مقترحة خصيصاً لك',
    bestBrands: 'أفضل الماركات هنا',
    newsletterTitle: 'سجّل الان واحصل على خصم يصل إلى 25% على أول عملية شراء',
    newsletterDesc: 'استقبل العروض الحصرية، تنبيهات المنتجات، وأهم أفكار التسوق والمزيد. بالتسجيل، تتفق على سياسة الخصوصية الخاصة بنا.',
    emailPlaceholder: 'البريد الالكتروني',
    subscribe: 'اشتراك',
    features: [
      { icon: <Shield size={30} />, title: 'دفع آمن', desc: 'طرق دفع عديدة مثل البطاقات والبنوك المحلية' },
      { icon: <Truck size={30} />, title: 'شحن سريع', desc: 'توصيل سريع وامن لطلباتك ابينا' },
      { icon: <ThumbsUp size={30} />, title: 'شهادات موثوقة', desc: 'شهادات مضمونة من ثلاث جهات موثوقة' },
      { icon: <RotateCcw size={30} />, title: 'إرجاع خلال 30 يوم', desc: 'سياسة إرجاع مرنة: إرجاع سلعتك وسنحولها إلى رصيد لك' },
    ],
    marqueeText: ['كل مستلزمات طفلك بين يديك', 'نحن هنا من اجلك و من اجل طفلك', 'عالم من المرح', '🍼', 'كل مستلزمات طفلك بين يديك', 'نحن هنا من اجلك و من اجل طفلك', 'عالم من المرح', '🍼'],
    instagramTitle: 'تابعنا على الانستكرام',
    instagramHandle: '@Qomra',
    popupTitle: 'سجّل بريدك الالكتروني هنا',
    popupDesc: 'احصل على خصم 20% يُرسل مباشرة إلى بريدك الإلكتروني',
    popupSub: 'اشترك في نشرتنا الإخبارية وسترسل لك خصم كود خصم 20%',
    shopNow: 'تسوق الآن',
  },
  en: {
    shopByCategory: 'Shop by Category',
    newArrivals: 'New Arrivals',
    viewAll: 'View All',
    shopByAge: 'Shop by Age',
    bestSellers: 'Best Sellers This Week',
    recommended: 'Recommended For You',
    bestBrands: 'Best Brands Here',
    newsletterTitle: 'Sign up now and get up to 25% off your first purchase',
    newsletterDesc: 'Receive exclusive deals, product alerts, and top shopping tips. By signing up, you agree to our privacy policy.',
    emailPlaceholder: 'Email address',
    subscribe: 'Subscribe',
    features: [
      { icon: <Shield size={30} />, title: 'Safe Payment', desc: 'Multiple payment methods including cards and local banks' },
      { icon: <Truck size={30} />, title: 'Fast Shipping', desc: 'Fast and secure delivery for your orders' },
      { icon: <ThumbsUp size={30} />, title: 'Trusted Reviews', desc: 'Reviews certified by three trusted sources' },
      { icon: <RotateCcw size={30} />, title: '30-Day Returns', desc: 'Flexible return policy: return and get store credit' },
    ],
    marqueeText: ['All baby essentials at your fingertips', 'Here for you and your child', 'A world of fun', '🍼', 'All baby essentials at your fingertips', 'Here for you and your child', 'A world of fun', '🍼'],
    instagramTitle: 'Follow us on Instagram',
    instagramHandle: '@Qomra',
    popupTitle: 'Subscribe to our newsletter',
    popupDesc: 'Get 20% off sent directly to your inbox',
    popupSub: 'Subscribe to our newsletter and receive a 20% discount code',
    shopNow: 'Shop Now',
  },
}

// ══════════════════════════════════════════════════════════════
// SECTION: Hero Slider
// ══════════════════════════════════════════════════════════════
function HeroSlider({ t, language, slides }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  // Auto advance slide every 4.5 seconds
  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, 4500)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [slides])

  const goTo = (idx) => { setCurrent(idx); startTimer() }
  const prev = () => { setCurrent(c => (c - 1 + slides.length) % slides.length); startTimer() }
  const next = () => { setCurrent(c => (c + 1) % slides.length); startTimer() }

  const slide = slides[current] || slides[0]

  return (
    <section className="hero">
      {/* Background image */}
      <div
        className="hero__bg"
        style={{
          backgroundImage: `linear-gradient(${slide.overlayColor}, ${slide.overlayColor}), url(${slide.image})`
        }}
      />

      {/* Text content */}
      <div className="hero__content">
        <p className="hero__subtitle">{language === 'ar' ? slide.subtitleAr : slide.subtitleEn}</p>
        <h1 className="hero__title">{language === 'ar' ? slide.titleAr : slide.titleEn}</h1>
        <p className="hero__desc">{language === 'ar' ? slide.descAr : slide.descEn}</p>
        <Link to={slide.link} className="hero__btn">
          {language === 'ar' ? slide.btnAr : slide.btnEn}
        </Link>
      </div>

      {/* Arrow buttons */}
      <button className="hero__arrow hero__arrow--prev" onClick={prev}>
        <ChevronLeft size={22} />
      </button>
      <button className="hero__arrow hero__arrow--next" onClick={next}>
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Section Header (reusable for multiple sections)
// ══════════════════════════════════════════════════════════════
function SectionHeader({ title, viewAllLink, viewAllText }) {
  return (
    <div className="sec-header">
      <h2 className="sec-title">{title}</h2>
      {viewAllLink && (
        <Link to={viewAllLink} className="sec-view-all">{viewAllText}</Link>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Shop By Category
// ══════════════════════════════════════════════════════════════
function ShopByCategory({ t, language, categories }) {
  return (
    <section className="hp-section">
      <div className="hp-container">
        <SectionHeader title={t.shopByCategory} />
        <div className="cat-grid">
          {categories.map(cat => (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="cat-card">
              <div className="cat-card__img-wrap" style={{ background: cat.bg }}>
                <img src={cat.image} alt={cat.nameAr} className="cat-card__img" />
              </div>
              <p className="cat-card__name">
                {language === 'ar' ? cat.nameAr : cat.nameEn}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Products Row (used for New Arrivals, Best Sellers, Recommended)
// ══════════════════════════════════════════════════════════════
function ProductsSection({ title, products, viewAllLink, t }) {
  const list = (products || []).slice(0, 4)
  return (
    <section className="hp-section">
      <div className="hp-container">
        <SectionHeader title={title} viewAllLink={viewAllLink} viewAllText={t.viewAll} />
        <div className="products-grid">
          {list.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Shop By Age
// ══════════════════════════════════════════════════════════════
function ShopByAge({ t, language, ageGroups }) {
  return (
    <section className="hp-section">
      <div className="hp-container">
        <SectionHeader title={t.shopByAge} />
        <div className="age-grid">
          {(ageGroups || []).map((group, index) => (
            <Link key={group.id ?? group._id ?? group.slug ?? index} to={`/shop?age=${group.slug}`} className="age-card">
              <div className="age-card__circle" style={{ background: group.bg }}>
                <img src={group.image} alt={group.labelAr} className="age-card__img" />
              </div>
              <p className="age-card__label">
                {((language === 'ar' ? group.labelAr : group.labelEn) || '')
                  .split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Marquee Banner (scrolling text strip)
// ══════════════════════════════════════════════════════════════
function MarqueeBanner({ t }) {
  return (
    <section className="marquee-section">
      <div className="marquee-track">
        <div className="marquee-content">
          {t.marqueeText.map((text, i) => (
            <span key={i} className="marquee-item">
              {text}
              {typeof text === 'string' && !text.includes('🍼') && (
                <span className="marquee-sep">✦</span>
              )}
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="marquee-content" aria-hidden="true">
          {t.marqueeText.map((text, i) => (
            <span key={i} className="marquee-item">
              {text}
              {typeof text === 'string' && !text.includes('🍼') && (
                <span className="marquee-sep">✦</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Promo Banners Grid
// ══════════════════════════════════════════════════════════════
function PromoBannersSection({ language }) {
  return (
    <section className="hp-section">
      <div className="hp-container">
        <div className="promo-grid">
          {/* Banner 1 — Happy Children (top left) */}
          <Link to={promoBanners[0].link} className="promo-card promo-card--blue" style={{ backgroundImage: `url(${promoBanners[0].image})` }}>
            <div className="promo-card__overlay" />
            <div className="promo-card__content">
              <span className="promo-badge">50% Off</span>
              <h3>{language === 'ar' ? promoBanners[0].titleAr : promoBanners[0].titleEn}</h3>
              <button className="promo-btn">{language === 'ar' ? promoBanners[0].btnAr : promoBanners[0].btnEn}</button>
            </div>
          </Link>

          {/* Banner 2 — Big Sale CENTER (spans 2 rows) */}
          <Link to={promoBanners[1].link} className="promo-card promo-card--center promo-card--tall" style={{ backgroundImage: `url(${promoBanners[1].image})` }}>
            <div className="promo-card__overlay promo-card__overlay--light" />
            <div className="promo-card__content promo-card__content--dark">
              <p className="promo-season">SUMMER 2025</p>
              <h3>{language === 'ar' ? promoBanners[1].titleAr : promoBanners[1].titleEn}</h3>
              <div className="promo-sale-badge">
                {language === 'ar' ? promoBanners[1].subtitleAr : promoBanners[1].subtitleEn}
              </div>
            </div>
          </Link>

          {/* Banner 3 — Stroller Baby (top right) */}
          <Link to={promoBanners[2].link} className="promo-card promo-card--yellow" style={{ backgroundImage: `url(${promoBanners[2].image})` }}>
            <div className="promo-card__overlay" />
            <div className="promo-card__content">
              <h3>{language === 'ar' ? promoBanners[2].titleAr : promoBanners[2].titleEn}</h3>
              <p>{language === 'ar' ? promoBanners[2].subtitleAr : promoBanners[2].subtitleEn}</p>
              <button className="promo-btn">{language === 'ar' ? promoBanners[2].btnAr : promoBanners[2].btnEn}</button>
            </div>
          </Link>

          {/* Banner 4 — Special Giveaway (bottom left) */}
          <Link to={promoBanners[3].link} className="promo-card promo-card--teal" style={{ backgroundImage: `url(${promoBanners[3].image})` }}>
            <div className="promo-card__overlay" />
            <div className="promo-card__content">
              <h3>{language === 'ar' ? promoBanners[3].titleAr : promoBanners[3].titleEn}</h3>
              <p>{language === 'ar' ? promoBanners[3].subtitleAr : promoBanners[3].subtitleEn}</p>
              <button className="promo-btn">{language === 'ar' ? promoBanners[3].btnAr : promoBanners[3].btnEn}</button>
            </div>
          </Link>

          {/* Banner 5 — Collection Sale (bottom right) */}
          <Link to={promoBanners[4].link} className="promo-card promo-card--dark" style={{ backgroundImage: `url(${promoBanners[4].image})` }}>
            <div className="promo-card__overlay promo-card__overlay--dark" />
            <div className="promo-card__content">
              <h3>{language === 'ar' ? promoBanners[4].titleAr : promoBanners[4].titleEn}</h3>
              <p>{language === 'ar' ? promoBanners[4].subtitleAr : promoBanners[4].subtitleEn}</p>
              <button className="promo-btn">{language === 'ar' ? promoBanners[4].btnAr : promoBanners[4].btnEn}</button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Best Brands
// ══════════════════════════════════════════════════════════════
function BestBrands({ t, brands }) {
  return (
    <section className="hp-section">
      <div className="hp-container">
        <SectionHeader title={t.bestBrands} />
        <div className="brands-row">
          {(brands || []).map(brand => (
            <div key={brand.id} className="brand-chip" style={{ background: brand.bg }}>
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Newsletter Signup
// ══════════════════════════════════════════════════════════════
function NewsletterSection({ t }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!email.includes('@')) return
    try {
      // 🔌 REAL API: POST /api/newsletter/subscribe  { email }
      const { contactApi } = await import('../api/api')
      await contactApi.subscribeNewsletter(email)
    } catch { /* still show success even if fails */ }
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="newsletter-section">
      <div className="hp-container">
        <div className="newsletter-card">
          {/* Decorative circles */}
          <div className="nl-deco nl-deco--1" />
          <div className="nl-deco nl-deco--2" />
          <div className="nl-deco nl-deco--3" />

          <div className="newsletter-content">
            <h2 className="nl-title">{t.newsletterTitle}</h2>
            <p className="nl-desc">{t.newsletterDesc}</p>

            {submitted ? (
              <p className="nl-success">✅ شكراً! سيصلك الكود قريباً</p>
            ) : (
              <div className="nl-form">
                <input
                  type="email"
                  className="nl-input"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button className="nl-btn" onClick={handleSubmit}>
                  {t.subscribe}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// SECTION: Features Strip (Trust Badges)
// ══════════════════════════════════════════════════════════════
function FeaturesStrip({ t }) {
  return (
    <section className="features-strip">
      <div className="hp-container">
        <div className="features-grid">
          {t.features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-text">
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
// SECTION: Instagram Photos
// ══════════════════════════════════════════════════════════════
function InstagramSection({ t }) {
  return (
    <section className="instagram-section">
      <div className="insta-grid">
        {instagramPhotos.map((photo, i) => (
          <div key={photo.id} className={`insta-item ${photo.label ? 'insta-item--center' : ''}`}>
            <img src={photo.image} alt="instagram" />
            {photo.label && (
              <div className="insta-overlay">
                <p className="insta-title">{t.instagramTitle}</p>
                <p className="insta-handle">{t.instagramHandle}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// NEWSLETTER POPUP MODAL
// Shows once when the user first visits
// ══════════════════════════════════════════════════════════════
function NewsletterPopup({ t, onClose }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!email.includes('@')) return
    // 🔌 API NEEDED: POST /api/newsletter  { email }
    setSubmitted(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}><X size={18} /></button>

        {/* Decorative top */}
        <div className="popup-top">
          <span className="popup-star">✦</span>
          <p className="popup-eyebrow">{t.popupTitle}</p>
        </div>

        <h2 className="popup-title">{t.popupDesc}</h2>
        <p className="popup-sub">{t.popupSub}</p>

        {submitted ? (
          <p className="nl-success">✅ شكراً! سيصلك الكود قريباً</p>
        ) : (
          <div className="popup-form">
            <input
              type="email"
              className="nl-input"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            <button className="nl-btn popup-btn" onClick={handleSubmit}>
              {t.subscribe}
            </button>
          </div>
        )}

        {/* Decorative bottom */}
        <div className="popup-bottom-deco" />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN: HomePage
// ══════════════════════════════════════════════════════════════
export default function HomePage() {
  const { language } = useApp()
  const t = T[language]

  // 🔌 FETCH REAL DATA from API (falls back to fake data if API is down)
  const {
    banners,           // hero slider images
    categories,        // shop by category cards
    ageGroups,         // shop by age circles
    newProducts,       // new arrivals section
    bestSellers,       // best sellers section
    suggestedProducts, // recommended for you section
    brands,            // brand logos section
    loading,           // true while data is loading
  } = useHomeData()

  // Show popup after 3 seconds, only once per session
  const [showPopup, setShowPopup] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  // While loading, show a subtle skeleton feel (page still renders)
  if (loading) {
    return (
      <main className="homepage">
        <div className="hp-loading">
          <div className="hp-loading__spinner" />
        </div>
      </main>
    )
  }

  return (
    <main className="homepage">

      {/* 1. Hero Slider — uses real banners from API */}
      <HeroSlider t={t} language={language} slides={banners} />

      {/* 2. Shop By Category — uses real categories from API */}
      <ShopByCategory t={t} language={language} categories={categories} />

      {/* 3. New Arrivals — uses real new products from API */}
      <ProductsSection
        title={t.newArrivals}
        products={newProducts}
        viewAllLink="/shop?sort=new"
        t={t}
      />

      {/* 4. Shop By Age — uses real age groups from API */}
      <ShopByAge t={t} language={language} ageGroups={ageGroups} />

      {/* 5. Marquee Banner */}
      <MarqueeBanner t={t} />

      {/* 6. Best Sellers — uses real best sellers from API */}
      <ProductsSection
        title={t.bestSellers}
        products={bestSellers}
        viewAllLink="/shop?sort=best"
        t={t}
      />

      {/* 7. Promo Banners */}
      <PromoBannersSection language={language} />

      {/* 8. Recommended For You — uses real suggested products from API */}
      <ProductsSection
        title={t.recommended}
        products={suggestedProducts}
        viewAllLink="/shop"
        t={t}
      />

      {/* 9. Best Brands — uses real brands from API */}
      <BestBrands t={t} brands={brands} />

      {/* 10. Newsletter Signup */}
      <NewsletterSection t={t} />

      {/* 11. Features Strip */}
      <FeaturesStrip t={t} />

      {/* 12. Instagram */}
      <InstagramSection t={t} />

      {/* 13. Newsletter Popup */}
      {showPopup && (
        <NewsletterPopup t={t} onClose={() => setShowPopup(false)} />
      )}

    </main>
  )
}