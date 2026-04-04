/**
 * productData.js
 * ─────────────────────────────────────────────────────────────
 * 🧪 FAKE product detail data — replace with API later.
 *
 * 🔌 API PLAN (tell your backend guy):
 *   GET /api/products/:id         → single product detail
 *   GET /api/products/:id/reviews → product reviews
 *   POST /api/products/:id/reviews → submit a review
 *   GET /api/products/:id/related → related products
 * ─────────────────────────────────────────────────────────────
 */

export const productDetail = {
  id: 101,   // ← unique ID — different from homepage products (1-8)
  sku: 'BZO-YH9JU',

  nameAr: 'إيفن فلو - كرسي سيارة للأطفال دوار ريفولف 360 سليم 2 في 1 - أسود سالم',
  nameEn: 'Evenflo - Revolve 360 Slim 2-in-1 Rotating Baby Car Seat - Solid Black',

  descriptionAr: 'New Fashion Autumn Winter Girls Kids Pants Plus Velvet Children\'s Leggings Cotton Velvet Elastic Waist Warm Legging 3-8 Years',
  descriptionEn: 'New Fashion Autumn Winter Girls Kids Pants Plus Velvet Children\'s Leggings Cotton Velvet Elastic Waist Warm Legging 3-8 Years',

  price: 15,
  originalPrice: 25,
  rating: 4.9,
  reviewCount: 14,

  categoryAr: '0 - 6 أشهر، 6 - 24 شهراً',
  categoryEn: '0 - 6 Months, 6 - 24 Months',
  categorySlug: 'strollers',

  // All product images
  images: [
    'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=700&q=85',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&q=85',
    'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=700&q=85',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&q=85',
    'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=700&q=85',
  ],

  // Color options
  colors: [
    { id: 1, nameAr: 'أحمر',  nameEn: 'Red',   hex: '#e74c3c' },
    { id: 2, nameAr: 'أخضر',  nameEn: 'Green', hex: '#2ecc71' },
    { id: 3, nameAr: 'برتقالي', nameEn: 'Orange', hex: '#e67e22' },
    { id: 4, nameAr: 'أصفر',  nameEn: 'Yellow', hex: '#f1c40f' },
    { id: 5, nameAr: 'أزرق',  nameEn: 'Blue',  hex: '#3498db' },
    { id: 6, nameAr: 'رمادي', nameEn: 'Gray',  hex: '#bdc3c7' },
  ],
  defaultColor: 5, // Blue selected by default

  // Size options
  sizes: ['XS', 'S', 'M', 'XL', 'XXL'],
  defaultSize: 'S',

  // Product info tab — bullet points
  infoPointsAr: [
    { label: 'الفئة', value: 'عربية أطفال خفيفة وعملية.' },
    { label: 'المناسب للعمر', value: 'من الولادة حتى 3 سنوات (حتى وزن 15 كغ تقريباً).' },
    { label: 'الوزن', value: '6.5 كغ (خفيفة وسهلة الحمل).' },
    { label: 'آلية الطي', value: 'طي بيد واحدة، تنسكر بسرعة وتتحول لحجم صغير يناسب السيارة أو السفر.' },
    { label: 'المقعد', value: 'مبطن ومريح مع إمكانية تعديل الميلان من وضعية الجلوس إلى النوم الكامل.' },
    { label: 'الحماية', value: 'حزام أمان 5 نقاط + حاجب شمس كبير يحمي من أشعة الشمس.' },
    { label: 'العجلات', value: 'قوية مع نظام امتصاص الصدمات + فرامل خلفية للثبات.' },
    { label: 'التخزين', value: 'سلة واسعة أسفل المقعد لحمل مستلزمات الطفل أو المشتريات.' },
    { label: 'الألوان المتوفرة', value: 'رمادي، أسود، أزرق، سماوي.' },
    { label: 'الإكسسوارات المرفقة', value: 'غطاء مطر شفاف + حامل زجاجة.' },
  ],
  infoPointsEn: [
    { label: 'Category', value: 'Lightweight and practical baby stroller.' },
    { label: 'Suitable Age', value: 'From birth up to 3 years (up to ~15 kg).' },
    { label: 'Weight', value: '6.5 kg (lightweight and easy to carry).' },
    { label: 'Folding', value: 'One-handed fold, folds quickly into a compact size.' },
    { label: 'Seat', value: 'Padded and comfortable with reclining positions from sitting to fully flat.' },
    { label: 'Protection', value: '5-point safety harness + large sun canopy.' },
    { label: 'Wheels', value: 'Durable with shock absorption + rear brakes for stability.' },
    { label: 'Storage', value: 'Large basket under the seat for baby essentials.' },
    { label: 'Available Colors', value: 'Gray, Black, Blue, Sky Blue.' },
    { label: 'Included Accessories', value: 'Rain cover + bottle holder.' },
  ],

  shippingPointsAr: [
    'الطلبات بقيمة 100 دولار أو أكتر تحصل على توصيل قياسي مجاني.',
    'التوصيل القياسي: خلال 4 - 5 أيام عمل.',
    'التوصيل السريع: خلال 2 - 4 أيام عمل.',
    'تتم معالجة وتوصيل الطلبات من الاثنين إلى الجمعة (باستثناء العطل الرسمية).',
    '↩ الإرجاع',
    'الأعضاء يستفيدون من إرجاع مجاني.',
  ],
  shippingPointsEn: [
    'Orders of $100 or more get free standard shipping.',
    'Standard Delivery: within 4–5 business days.',
    'Express Delivery: within 2–4 business days.',
    'Orders are processed Monday to Friday (excluding public holidays).',
    '↩ Returns',
    'Members get free returns.',
  ],
}

// ─── REVIEWS ────────────────────────────────────────────────────
// 🔌 API: GET /api/products/:id/reviews
export const productReviews = [
  {
    id: 1,
    nameAr: 'هالة الدرويبي',
    nameEn: 'Hala Aldrouby',
    avatar: 'https://i.pravatar.cc/48?img=47',
    date: 'August 30, 2022',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=80&q=70',
    textAr: 'العربية فرحة جداً وخفيفة الوزن. أنقل فيها بالمول والوالدة وحدي وقت بدي أكون وحدي وفقرة بجانبهم سريع وما بحتاج وقت بالمول. المقعد مبطن وجميل ومريح وبتكون كبير حتى. الطفل كان مرتاح وبنام فيها أحياناً وحتى بالمشترك. أنصح فيها بشرط أن تلا أي إشكاليات في النقل وتحتسب كل الاكسسوارات غير المرفقة.',
    textEn: 'The stroller is great and lightweight. I carry it alone at the mall easily. The seat is padded and comfortable, and the baby was relaxed and even slept in it sometimes. Highly recommended!',
  },
  {
    id: 2,
    nameAr: 'مريم الحسن',
    nameEn: 'Maryam Alhassan',
    avatar: 'https://i.pravatar.cc/48?img=32',
    date: 'September 13, 2022',
    rating: 4,
    image: null,
    textAr: 'الكرسي عالي الجودة وبناسب المطلق. تصميم فريح مريح وسهولة الاستخدام ما يحقق الاستمتاع فيما بيتقل الانتقال بين الطرق. أحببت كيف يمكن ضبطه بسيطاً. أحب أنه صغير عند الطي ويمكن استخدامه بيسر والدخول إلى الأماكن العامة والوالد والبنات.',
    textEn: 'High quality seat that suits the child perfectly. Comfortable and easy to use, great for moving between different surfaces. I love how compact it folds.',
  },
  {
    id: 3,
    nameAr: 'نامي العلي',
    nameEn: 'Nami Alali',
    avatar: 'https://i.pravatar.cc/48?img=12',
    date: 'October 5, 2022',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=80&q=70',
    textAr: 'هذه الألعاب التعليمية تطوّر مهارات الأطفال، تحتوي على مجموعة من الألوان والأشكال التي تحفز التفكير النقدي. يجب أن يكون أمامهم الوقت الكافي للعب بها، وأن يستمتعوا بالتفاعل مع الأشكال والألوان. أنصح كل والد بشرائها لطفله ليتعلم بطريقة ممتعة.',
    textEn: 'These educational toys develop children\'s skills with colors and shapes that stimulate critical thinking. I recommend every parent buys this for their child.',
  },
]

// Rating breakdown
export const ratingBreakdown = [
  { stars: 5, percent: 90 },
  { stars: 4, percent: 72 },
  { stars: 3, percent: 25 },
  { stars: 2, percent: 10 },
  { stars: 1, percent: 4 },
]

// Related products
// 🔌 API: GET /api/products/:id/related
export const relatedProducts = [
  {
    id: 102,
    nameAr: 'يامبل & بيرد - حامل الأطفال المحمول',
    nameEn: 'Pramble & Bird - Portable Baby Carrier',
    price: 75, originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
    rating: 5, reviewCount: 24,
    badge: 'تخفيضات', badgeEn: 'Sale',
    tags: ['new'],
  },
  {
    id: 103,
    nameAr: 'يامبل & بيرد - عربة الأطفال التقليدية',
    nameEn: 'Pramble & Bird - Classic Baby Stroller',
    price: 75, originalPrice: 85,
    image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=400&q=80',
    rating: 5, reviewCount: 18,
    badge: 'تخفيضات', badgeEn: 'Sale',
    tags: ['new'],
  },
  {
    id: 104,
    nameAr: 'يامبل & بيرد - كرسي السيارة للأطفال',
    nameEn: 'Pramble & Bird - Baby Car Seat',
    price: 75, originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    rating: 4, reviewCount: 31,
    badge: 'تخفيضات', badgeEn: 'Sale',
    tags: ['new'],
  },
  {
    id: 105,
    nameAr: 'يامبل & بيرد - عربة الأطفال للسفر',
    nameEn: 'Pramble & Bird - Travel Baby Stroller',
    price: 75, originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&q=80',
    rating: 5, reviewCount: 15,
    badge: 'تخفيضات', badgeEn: 'Sale',
    tags: ['new'],
  },
]