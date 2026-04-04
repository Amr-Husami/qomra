/**
 * FAQPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *  1. PageHeader → pink banner "الاسئلة المتكررة"
 *  2. FAQ Accordion → click + to expand, - to collapse
 *  3. Features Strip
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { Plus, Minus, Shield, Truck, ThumbsUp, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/PageHeader'
import './FAQPage.css'

// ─── FAQ DATA ─────────────────────────────────────────────────
const faqs = {
  ar: [
    {
      q: 'كيف أقدر أتتبع طلبيتي بعد الشراء؟',
      a: 'بعد إتمام طلبك ستصلك رسالة بريد إلكتروني تحتوي على رقم التتبع. يمكنك أيضاً متابعة طلبك من خلال صفحة "طلباتي" في حسابك.',
    },
    {
      q: 'ما هي طرق الدفع المتوفرة؟',
      a: 'نقبل الدفع عبر بطاقات Visa وMastercard والدفع عند الاستلام وعدد من تطبيقات الدفع المحلية.',
    },
    {
      q: 'هل أقدر أرجع أو أبدل المنتج؟',
      a: 'نعم، تقدر ترجع أو تبدل المنتج خلال 7 أيام من الاستلام بشرط يكون بحالته الأصلية وغير مستخدم.',
    },
    {
      q: 'كم يستغرق وقت التوصيل؟',
      a: 'يستغرق التوصيل عادةً من 2 إلى 5 أيام عمل حسب منطقتك. التوصيل السريع متاح خلال 24-48 ساعة.',
    },
    {
      q: 'هل المنتجات أصلية ومضمونة؟',
      a: 'نعم، جميع منتجاتنا أصلية 100% ومعتمدة من موردين موثوقين. كل منتج مرفق بضمان المورد الأصلي.',
    },
  ],
  en: [
    {
      q: 'How can I track my order after purchase?',
      a: 'After completing your order, you will receive an email with a tracking number. You can also track your order from the "My Orders" page in your account.',
    },
    {
      q: 'What payment methods are available?',
      a: 'We accept Visa, Mastercard, cash on delivery, and several local payment apps.',
    },
    {
      q: 'Can I return or exchange a product?',
      a: 'Yes, you can return or exchange the product within 7 days of receipt, provided it is in its original condition and unused.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Delivery usually takes 2 to 5 business days depending on your area. Express delivery is available within 24-48 hours.',
    },
    {
      q: 'Are the products original and guaranteed?',
      a: 'Yes, all our products are 100% original and certified from trusted suppliers. Every product comes with the original supplier warranty.',
    },
  ],
}

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

// ─── SINGLE FAQ ITEM (accordion) ──────────────────────────────
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      {/* Question row */}
      <button className="faq-question" onClick={onToggle}>
        {/* +/- toggle button */}
        <span className={`faq-toggle ${isOpen ? 'faq-toggle--open' : ''}`}>
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
        <span className="faq-q-text">{question}</span>
      </button>

      {/* Answer — shown when open */}
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN: FAQPage
// ══════════════════════════════════════════════════════════════
export default function FAQPage() {
  const { language } = useApp()
  const [openIndex, setOpenIndex] = useState(2) // 3rd item open by default (matching Figma)

  const currentFaqs = faqs[language]
  const features    = featuresData[language]

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <main className="faq-page">

      {/* 1. Page header */}
      <PageHeader
        titleAr="الاسئلة المتكررة"
        titleEn="FAQs"
        breadcrumbAr="الأسئلة المتكررة"
        breadcrumbEn="FAQs"
      />

      {/* 2. FAQ Accordion */}
      <section className="faq-section">
        <div className="faq-container">
          {currentFaqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </section>

      {/* 3. Features Strip */}
      <section className="faq-features">
        <div className="faq-container">
          <div className="faq-features-grid">
            {features.map((f, i) => (
              <div key={i} className="faq-feature">
                <div className="faq-feature-icon">{f.icon}</div>
                <div className="faq-feature-text">
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
