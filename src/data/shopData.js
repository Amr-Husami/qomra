/**
 * shopData.js
 * ─────────────────────────────────────────────────────────────
 * 🧪 ALL FAKE SHOP DATA — replace with API later
 *
 * 🔌 API PLAN (tell your backend guy):
 *   GET /api/products?page=1&limit=9&category=&price=&color=&brand=&sort=
 *   GET /api/shop/filters   → returns categories, colors, brands
 * ─────────────────────────────────────────────────────────────
 */

// ─── ALL PRODUCTS (71 fake products, we show 9 per page) ──────
const makeProduct = (id, nameAr, nameEn, price, originalPrice, img, rating, badge) => ({
  id,
  nameAr, nameEn,
  price, originalPrice,
  image: img,
  rating,
  reviewCount: Math.floor(Math.random() * 40) + 5,
  badge: badge || null,
  badgeEn: badge ? 'Sale' : null,
  category: ['strollers','toys','essentials','beds','food'][id % 5],
  colors: ['red','blue','green','yellow','gray'][id % 5],
  brand: ['velOna',"Johnson's",'Pampers','Chicco','Fisher-Price'][id % 5],
  tags: ['new','best','recommended'],
})

const IMAGES = [
  'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=400&q=80',
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&q=80',
  'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80',
  'https://images.unsplash.com/photo-1561543914-a5e75e8d89b5?w=400&q=80',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80',
]

const NAMES_AR = [
  'يامبل & بيرد - كرسي السيارة للأطفال',
  'يامبل & بيرد - عربية الأطفال للسفر وا...',
  'يامبل & بيرد - عربة الأطفال التقليدية -...',
  'يامبل & بيرد - حامل الأطفال المحمول',
  'مجموعة ألعاب تعليمية للأطفال',
  'سرير أطفال متعدد الاستخدامات',
  'حقيبة حفاضات - متعددة الجيوب',
  'مجموعة العناية بالطفل الكاملة',
]

const NAMES_EN = [
  'Pramble & Bird - Baby Car Seat',
  'Pramble & Bird - Travel Baby Stroller',
  'Pramble & Bird - Classic Baby Stroller',
  'Pramble & Bird - Portable Baby Carrier',
  'Educational Toys Set for Kids',
  'Multi-use Baby Crib',
  'Multi-pocket Diaper Bag',
  'Complete Baby Care Set',
]

const PRICES = [120, 75, 85, 95, 45, 120, 55, 85]
const ORIG   = [150, 95, 110, 120, 65, 160, 75, 110]
const BADGES = ['تخفيضات', 'تخفيضات', null, 'تخفيضات', null, 'تخفيضات', null, 'تخفيضات']

export const allProducts = Array.from({ length: 71 }, (_, i) => {
  const idx = i % 8
  return makeProduct(
    i + 1,
    NAMES_AR[idx],
    NAMES_EN[idx],
    PRICES[idx],
    ORIG[idx],
    IMAGES[idx],
    [5, 5, 4, 3, 5, 4, 4, 5][idx],
    BADGES[idx],
  )
})

// ─── FILTER OPTIONS ────────────────────────────────────────────
// 🔌 API: GET /api/shop/filters
export const filterOptions = {
  categories: [
    { id: 'strollers',  nameAr: 'عربيات الأطفال',     nameEn: 'Baby Strollers' },
    { id: 'toys',       nameAr: 'ألعاب تعليمية',       nameEn: 'Educational Toys' },
    { id: 'essentials', nameAr: 'مستلزمات الطفل',     nameEn: 'Baby Essentials' },
    { id: 'beds',       nameAr: 'الأسرة',             nameEn: 'Baby Beds' },
    { id: 'food',       nameAr: 'الطعام',             nameEn: 'Food' },
    { id: 'sleeping',   nameAr: 'مستلزمات النوم',     nameEn: 'Sleeping Essentials' },
  ],
  prices: [
    { id: '0-99',    labelAr: '0-99$',       labelEn: '0-99$',       min: 0,   max: 99 },
    { id: '100-199', labelAr: '100-199$',    labelEn: '100-199$',    min: 100, max: 199 },
    { id: '200-299', labelAr: '200-299$',    labelEn: '200-299$',    min: 200, max: 299 },
    { id: '300-399', labelAr: '300-399$',    labelEn: '300-399$',    min: 300, max: 399 },
    { id: '400+',    labelAr: 'Above 400$',  labelEn: 'Above 400$',  min: 400, max: 99999 },
  ],
  colors: [
    { id: 'red',    nameEn: 'Red',    nameAr: 'أحمر',   hex: '#e74c3c' },
    { id: 'green',  nameEn: 'Green',  nameAr: 'أخضر',   hex: '#2ecc71' },
    { id: 'orange', nameEn: 'Orange', nameAr: 'برتقالي',hex: '#e67e22' },
    { id: 'yellow', nameEn: 'Yellow', nameAr: 'أصفر',   hex: '#f1c40f' },
    { id: 'blue',   nameEn: 'Blue',   nameAr: 'أزرق',   hex: '#3498db' },
    { id: 'gray',   nameEn: 'Gray',   nameAr: 'رمادي',  hex: '#bdc3c7' },
    { id: 'brown',  nameEn: 'Brown',  nameAr: 'بني',    hex: '#c8a98a' },
    { id: 'cyan',   nameEn: 'Cyan',   nameAr: 'سماوي',  hex: '#74c0d8' },
    { id: 'cyan2',  nameEn: 'Cyan 2', nameAr: 'سماوي 2',hex: '#a8d8e8' },
    { id: 'purple', nameEn: 'Purple', nameAr: 'بنفسجي', hex: '#c9a0dc' },
  ],
  brands: [
    { id: 'velona',   nameAr: 'velOna',        nameEn: 'velOna' },
    { id: 'johnsons', nameAr: "Johnson's Baby", nameEn: "Johnson's Baby" },
    { id: 'pampers',  nameAr: 'Pampers',        nameEn: 'Pampers' },
    { id: 'chicco',   nameAr: 'Chicco',         nameEn: 'Chicco' },
    { id: 'fisher',   nameAr: 'Fisher-Price',   nameEn: 'Fisher-Price' },
  ],
}

// ─── SORT OPTIONS ──────────────────────────────────────────────
export const sortOptions = [
  { id: 'default',   labelAr: 'ترتيب حسب',     labelEn: 'Sort By' },
  { id: 'price-asc', labelAr: 'السعر: الأقل',  labelEn: 'Price: Low to High' },
  { id: 'price-desc',labelAr: 'السعر: الأعلى', labelEn: 'Price: High to Low' },
  { id: 'rating',    labelAr: 'الأعلى تقييماً',labelEn: 'Top Rated' },
  { id: 'newest',    labelAr: 'الأحدث',        labelEn: 'Newest' },
]

export const PRODUCTS_PER_PAGE = 9
