/**
 * homeData.js
 * ─────────────────────────────────────────────────────────────
 * 🧪 ALL FAKE DATA LIVES HERE.
 *
 * When your backend is ready, you ONLY change this file.
 * Instead of static arrays, you'll fetch from the API.
 * Everything else in the project stays the same!
 *
 * 🔌 API PLAN (tell your backend guy):
 *   GET /api/banners          → heroSlides
 *   GET /api/categories       → categories
 *   GET /api/products/new     → newArrivals
 *   GET /api/products/best    → bestSellers
 *   GET /api/products/recommended → recommended
 *   GET /api/age-groups       → ageGroups
 *   GET /api/brands           → brands
 * ─────────────────────────────────────────────────────────────
 */

// ─── 1. HERO SLIDER ────────────────────────────────────────────
// 🔌 API: GET /api/banners
export const heroSlides = [
  {
    id: 1,
    subtitleAr: 'مجموعة جديدة كلياً',
    subtitleEn: 'Brand New Collection',
    titleAr: 'إكسسوارات الأطفال',
    titleEn: 'Baby Accessories',
    descAr: 'خصم يصل إلى 50%',
    descEn: 'Up to 50% Off',
    btnAr: 'اكتشف المزيد',
    btnEn: 'Explore More',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1400&q=80',
    link: '/shop',
    overlayColor: 'rgba(0,0,0,0.25)',
  },
  {
    id: 2,
    subtitleAr: 'أفضل العروض',
    subtitleEn: 'Best Deals',
    titleAr: 'عربيات الأطفال',
    titleEn: 'Baby Strollers',
    descAr: 'تصاميم آمنة وعملية لرحلاتك',
    descEn: 'Safe & practical designs for your journeys',
    btnAr: 'تسوق الآن',
    btnEn: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1400&q=80',
    link: '/shop?category=strollers',
    overlayColor: 'rgba(0,0,0,0.3)',
  },
  {
    id: 3,
    subtitleAr: 'ألعاب ممتعة',
    subtitleEn: 'Fun & Educational',
    titleAr: 'ألعاب تعليمية',
    titleEn: 'Educational Toys',
    descAr: 'اكتشف عالم التعلم والمرح',
    descEn: 'Discover the world of learning & fun',
    btnAr: 'اكتشف المزيد',
    btnEn: 'Explore More',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1400&q=80',
    link: '/shop?category=toys',
    overlayColor: 'rgba(0,0,0,0.2)',
  },
]

// ─── 2. SHOP BY CATEGORY ───────────────────────────────────────
// 🔌 API: GET /api/categories
export const categories = [
  {
    id: 1,
    nameAr: 'عربيات الأطفال',
    nameEn: 'Baby Strollers',
    slug: 'strollers',
    image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=300&q=80',
    bg: '#FFF3E0',
  },
  {
    id: 2,
    nameAr: 'ألعاب تعليمية',
    nameEn: 'Educational Toys',
    slug: 'toys',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
    bg: '#E8F5E9',
  },
  {
    id: 3,
    nameAr: 'الأسرة',
    nameEn: 'Baby Beds',
    slug: 'beds',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&q=80',
    bg: '#F3E5F5',
  },
  {
    id: 4,
    nameAr: 'مستلزمات اطفال',
    nameEn: 'Baby Essentials',
    slug: 'essentials',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80',
    bg: '#E3F2FD',
  },
  {
    id: 5,
    nameAr: 'الطعام',
    nameEn: 'Baby Food',
    slug: 'food',
    image: 'https://images.unsplash.com/photo-1569924696-d1a2c1a61beb?w=300&q=80',
    bg: '#FCE4EC',
  },
]

// ─── 3. PRODUCTS ───────────────────────────────────────────────
// 🔌 API: GET /api/products?type=new | best | recommended
// One shared list — filtered by "tags" in real API
export const products = [
  {
    id: 1,
    nameAr: 'يامبل & بيرد - حامل الأطفال المحمول',
    nameEn: 'Pramble & Bird - Portable Baby Carrier',
    price: 75,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=400&q=80',
    rating: 5,
    reviewCount: 24,
    badge: 'تخفيضات',
    badgeEn: 'Sale',
    category: 'strollers',
    tags: ['new', 'best'],
  },
  {
    id: 2,
    nameAr: 'يامبل & بيرد - عربة الأطفال التقليدية',
    nameEn: 'Pramble & Bird - Classic Baby Stroller',
    price: 75,
    originalPrice: 85,
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
    rating: 5,
    reviewCount: 18,
    badge: 'تخفيضات',
    badgeEn: 'Sale',
    category: 'strollers',
    tags: ['new', 'recommended'],
  },
  {
    id: 3,
    nameAr: 'يامبل & بيرد - كرسي السيارة للأطفال',
    nameEn: 'Pramble & Bird - Baby Car Seat',
    price: 75,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    rating: 4,
    reviewCount: 31,
    badge: 'تخفيضات',
    badgeEn: 'Sale',
    category: 'essentials',
    tags: ['new', 'best', 'recommended'],
  },
  {
    id: 4,
    nameAr: 'يامبل & بيرد - عربة الأطفال للسفر',
    nameEn: 'Pramble & Bird - Travel Baby Stroller',
    price: 75,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    rating: 5,
    reviewCount: 15,
    badge: 'تخفيضات',
    badgeEn: 'Sale',
    category: 'strollers',
    tags: ['new', 'best', 'recommended'],
  },
  {
    id: 5,
    nameAr: 'مجموعة ألعاب تعليمية للأطفال',
    nameEn: 'Educational Toys Set for Kids',
    price: 45,
    originalPrice: 65,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80',
    rating: 4,
    reviewCount: 42,
    badge: 'جديد',
    badgeEn: 'New',
    category: 'toys',
    tags: ['best', 'recommended'],
  },
  {
    id: 6,
    nameAr: 'سرير أطفال متعدد الاستخدامات',
    nameEn: 'Multi-use Baby Crib',
    price: 120,
    originalPrice: 160,
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80',
    rating: 5,
    reviewCount: 8,
    badge: 'تخفيضات',
    badgeEn: 'Sale',
    category: 'beds',
    tags: ['best'],
  },
  {
    id: 7,
    nameAr: 'حقيبة حفاضات - متعددة الجيوب',
    nameEn: 'Multi-pocket Diaper Bag',
    price: 55,
    originalPrice: 75,
    image: 'https://images.unsplash.com/photo-1561543914-a5e75e8d89b5?w=400&q=80',
    rating: 4,
    reviewCount: 29,
    badge: 'الأكثر مبيعاً',
    badgeEn: 'Best Seller',
    category: 'essentials',
    tags: ['recommended'],
  },
  {
    id: 8,
    nameAr: 'مجموعة العناية بالطفل الكاملة',
    nameEn: 'Complete Baby Care Set',
    price: 85,
    originalPrice: 110,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80',
    rating: 5,
    reviewCount: 53,
    badge: 'تخفيضات',
    badgeEn: 'Sale',
    category: 'essentials',
    tags: ['new', 'recommended'],
  },
]

// Helper to filter products by tag
export const getProductsByTag = (tag) => products.filter(p => p.tags.includes(tag))

// ─── 4. SHOP BY AGE ────────────────────────────────────────────
// 🔌 API: GET /api/age-groups
export const ageGroups = [
  {
    id: 1,
    labelAr: '0 - 2\nسنوات',
    labelEn: '0 - 2\nYears',
    slug: '0-2',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=200&q=80',
    bg: '#d4edda',
  },
  {
    id: 2,
    labelAr: '3 - 4\nسنوات',
    labelEn: '3 - 4\nYears',
    slug: '3-4',
    image: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=200&q=80',
    bg: '#cce5ff',
  },
  {
    id: 3,
    labelAr: '5 - 7\nسنوات',
    labelEn: '5 - 7\nYears',
    slug: '5-7',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&q=80',
    bg: '#f8d7da',
  },
  {
    id: 4,
    labelAr: '8 - 12\nسنوات',
    labelEn: '8 - 12\nYears',
    slug: '8-12',
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=200&q=80',
    bg: '#fff3cd',
  },
  {
    id: 5,
    labelAr: 'للأمهات',
    labelEn: 'For Mamas',
    slug: 'mamas',
    image: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=200&q=80',
    bg: '#e2d9f3',
  },
]

// ─── 5. PROMO BANNERS ──────────────────────────────────────────
// 🔌 API: GET /api/promo-banners
export const promoBanners = [
  {
    id: 1,
    titleEn: 'Happy Children',
    subtitleEn: '50% Off',
    titleAr: 'أطفال سعداء',
    subtitleAr: 'خصم 50%',
    btnEn: 'Shop Now',
    btnAr: 'تسوق الآن',
    image: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&q=80',
    bg: '#1a7fba',
    link: '/shop',
    span: 1,
  },
  {
    id: 2,
    titleEn: 'NEW BRAND',
    subtitleEn: 'BIG SALE %',
    titleAr: 'ماركة جديدة',
    subtitleAr: 'تخفيضات كبرى %',
    btnEn: '',
    btnAr: '',
    image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=400&q=80',
    bg: '#f8f9fa',
    link: '/shop',
    span: 2, // spans 2 rows
    dark: true,
  },
  {
    id: 3,
    titleEn: 'Stroller Baby',
    subtitleEn: 'New Arrivals',
    titleAr: 'عربات الأطفال',
    subtitleAr: 'وصل حديثاً',
    btnEn: 'Shop Now',
    btnAr: 'تسوق الآن',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
    bg: '#f5c842',
    link: '/shop?category=strollers',
    span: 1,
  },
  {
    id: 4,
    titleEn: 'Special Giveaway',
    subtitleEn: 'Win Amazing Prizes',
    titleAr: 'هدايا خاصة',
    subtitleAr: 'فرصتك للفوز',
    btnEn: 'Shop Now',
    btnAr: 'اشترك الآن',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    bg: '#4db8e8',
    link: '/shop',
    span: 1,
  },
  {
    id: 5,
    titleEn: 'Collection Sale',
    subtitleEn: 'Limited Time Offer',
    titleAr: 'تصفية المجموعة',
    subtitleAr: 'عرض لفترة محدودة',
    btnEn: 'Shop Now',
    btnAr: 'تسوق الآن',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    bg: '#1a1a2e',
    link: '/shop',
    span: 1,
    light: true,
  },
]

// ─── 6. BRANDS ─────────────────────────────────────────────────
// 🔌 API: GET /api/brands
export const brands = [
  { id: 1, name: 'velOna',           bg: '#fff8e1' },
  { id: 2, name: "Johnson's baby",   bg: '#e8f5e9' },
  { id: 3, name: 'Baby Cheramy',     bg: '#fce4ec' },
  { id: 4, name: 'KIDS JOY',         bg: '#fff9c4' },
  { id: 5, name: 'Pampers',          bg: '#e3f2fd' },
  { id: 6, name: 'Aveeno Baby',      bg: '#f3e5f5' },
  { id: 7, name: 'Chicco',           bg: '#e0f7fa' },
  { id: 8, name: 'Fisher-Price',     bg: '#fff3e0' },
]

// ─── 7. INSTAGRAM PHOTOS ───────────────────────────────────────
// 🔌 API: GET /api/instagram-feed  (or from Instagram API)
export const instagramPhotos = [
  { id: 1, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&q=80' },
  { id: 2, image: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=300&q=80' },
  { id: 3, image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&q=80', label: 'تابعنا على الانستكرام\n@Qomra' },
  { id: 4, image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=300&q=80' },
  { id: 5, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80' },
]
