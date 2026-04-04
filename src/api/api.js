/**
 * api.js
 * ─────────────────────────────────────────────────────────────
 * 🌉 THE BRIDGE BETWEEN FRONTEND AND BACKEND
 *
 * 💡 SIMPLE ANALOGY:
 *   Think of this file as a WAITER in a restaurant.
 *
 *   You (component) → tell the waiter what you want
 *   Waiter (api.js) → goes to the kitchen (backend)
 *   Kitchen (backend) → prepares the data
 *   Waiter (api.js) → brings it back to you
 *
 * 🔌 BASE URL: http://localhost:10000
 * 🔒 = needs the user to be logged in (sends token)
 * ─────────────────────────────────────────────────────────────
 */

import Cookies from 'js-cookie'

const BASE_URL = 'https://qomra-t8pr.onrender.com'

// ─── TOKEN HELPERS ─────────────────────────────────────────────
// Stored in a cookie so it's available on every request automatically
const COOKIE_KEY  = 'qomra_token'
const getToken    = ()      => Cookies.get(COOKIE_KEY)
const saveToken   = (token) => Cookies.set(COOKIE_KEY, token, { expires: 7, sameSite: 'Lax' })
const removeToken = ()      => Cookies.remove(COOKIE_KEY)

// ─── CORE FUNCTION ─────────────────────────────────────────────
async function request(endpoint, method = 'GET', body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || `Error ${response.status}`)
    return data
  } catch (error) {
    console.error(`❌ API [${method} ${endpoint}]:`, error.message)
    throw error
  }
}

// ══════════════════════════════════════════════════════════════
// 1. AUTH
// ══════════════════════════════════════════════════════════════
export const authApi = {

  // Register → POST /api/auth/register
  // Body: { firstName, lastName, email, password }
  register: async (firstName, lastName, email, password) => {
    const data = await request('/api/auth/register', 'POST', {
      firstName, lastName, email, password,
    })
    if (data.token) saveToken(data.token)
    return data
  },

  // Login → POST /api/auth/login
  // Body: { email, password }
  login: async (email, password) => {
    const data = await request('/api/auth/login', 'POST', { email, password })
    if (data.token) saveToken(data.token)
    return data
  },

  // Logout → just remove token from browser
  logout: () => removeToken(),

  // 🆕 NEW! Get profile → GET /api/auth/profile 🔒
  // Returns: { id, firstName, lastName, email, phone, birthDate, gender }
  getProfile: () =>
    request('/api/auth/profile', 'GET', null, true),

  // Update profile → POST /api/auth/profile 🔒
  // Body: { firstName, lastName, phone, birthDate, gender }
  // gender = "MALE" or "FEMALE"
  updateProfile: (profileData) =>
    request('/api/auth/profile', 'POST', profileData, true),

  // 🆕 NEW! Change password (user knows current password) → PATCH /api/auth/change-password 🔒
  // Body: { currentPassword, newPassword }
  // Different from forgot-password: this needs the OLD password
  changePassword: (currentPassword, newPassword) =>
    request('/api/auth/change-password', 'PATCH', { currentPassword, newPassword }, true),

  // Forgot password step 1 → POST /api/auth/reset-password
  // Body: { email } — sends reset link to email
  requestPasswordReset: (email) =>
    request('/api/auth/reset-password', 'POST', { email }),

  // Forgot password step 2 → POST /api/auth/reset-password/verify
  // Body: { token } — verify the token from email
  verifyResetToken: (token) =>
    request('/api/auth/reset-password/verify', 'POST', { token }),

  // Forgot password step 3 → POST /api/auth/reset-password/confirm
  // Body: { token, newPassword }
  confirmPasswordReset: (token, newPassword) =>
    request('/api/auth/reset-password/confirm', 'POST', { token, newPassword }),

  // 🆕 NEW! Get all addresses → GET /api/auth/addresses 🔒
  // Returns: [{ id, firstName, lastName, governorate, street, ... }]
  getAddresses: () =>
    request('/api/auth/addresses', 'GET', null, true),

  // Add address → POST /api/auth/addresses 🔒
  // Body: { firstName, lastName, phone, governorate, district, neighborhood, street, address }
  addAddress: (addressData) =>
    request('/api/auth/addresses', 'POST', addressData, true),

  // Update address → PATCH /api/auth/addresses/:id 🔒
  updateAddress: (addressId, addressData) =>
    request(`/api/auth/addresses/${addressId}`, 'PATCH', addressData, true),

  // Delete address → DELETE /api/auth/addresses/:id 🔒
  deleteAddress: (addressId) =>
    request(`/api/auth/addresses/${addressId}`, 'DELETE', null, true),

  isLoggedIn: () => !!getToken(),
  getToken,
}

// ══════════════════════════════════════════════════════════════
// 2. PRODUCTS
// ══════════════════════════════════════════════════════════════
export const productsApi = {

  // Get products with filters → GET /api/products?page=1&limit=9&search=...
  // 🆕 NEW! search param now works: { search: 'stroller' }
  // Other params: page, limit, category, brand, sort
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/products?${query}`)
    // Returns: { products: [...], total, page, totalPages }
  },

  // Get one product → GET /api/products/:id
  // 🆕 NEW format: { nameAr, nameEn, descriptionAr, descriptionEn, ageGroup, ... }
  getProductById: (productId) =>
    request(`/api/products/${productId}`),

  // Get filter options → GET /api/products/filters
  getFilters: () =>
    request('/api/products/filters'),

  // Get best sellers → GET /api/products/best-sellers?limit=4
  getBestSellers: (limit = 4) =>
    request(`/api/products/best-sellers?limit=${limit}`),

  // Get suggested products → GET /api/products/suggested?limit=4
  getSuggested: (limit = 4) =>
    request(`/api/products/suggested?limit=${limit}`),

  // Get new products → GET /api/products/new?days=7
  getNewProducts: (days = 7) =>
    request(`/api/products/new?days=${days}`),

  // Get variants (color+size options) → GET /api/products/:id/variants
  // Returns: [{ id, color, size, stock, priceDiff }]
  getVariants: (productId) =>
    request(`/api/products/${productId}/variants`),

  // Get reviews → GET /api/products/:id/reviews
  getReviews: (productId) =>
    request(`/api/products/${productId}/reviews`),

  // Submit review → POST /api/products/:id/reviews 🔒
  // Body: { rating, comment }
  addReview: (productId, rating, comment) =>
    request(`/api/products/${productId}/reviews`, 'POST', { rating, comment }, true),

  // Get comments → GET /api/products/:id/comments
  getComments: (productId) =>
    request(`/api/products/${productId}/comments`),

  // Submit comment → POST /api/products/:id/comments 🔒
  // Body: { content }
  addComment: (productId, content) =>
    request(`/api/products/${productId}/comments`, 'POST', { content }, true),
}

// ══════════════════════════════════════════════════════════════
// 3. TAXONOMY — Categories & Age Groups
// ══════════════════════════════════════════════════════════════
export const taxonomyApi = {

  // Get categories → GET /api/categories
  // Used in: Shop filters, Homepage "Shop by Category"
  getCategories: () => request('/api/categories'),

  // Get age groups → GET /api/age-groups
  // Used in: Homepage "Shop by Age"
  getAgeGroups: () => request('/api/age-groups'),
}

// ══════════════════════════════════════════════════════════════
// 4. BANNERS — Hero slider
// ══════════════════════════════════════════════════════════════
export const bannersApi = {

  // Get homepage hero banners → GET /api/banners
  // Returns: [{ id, image, titleAr, titleEn, descriptionAr, descriptionEn, link }]
  getBanners: () => request('/api/banners'),
}

// ══════════════════════════════════════════════════════════════
// 5. BRANDS — Brand logos carousel
// ══════════════════════════════════════════════════════════════
export const brandsApi = {

  // Get brand logos → GET /api/brand-carousel
  // Returns: [{ id, brandName, logo, order, isActive }]
  getBrands: () => request('/api/brand-carousel'),
}

// ══════════════════════════════════════════════════════════════
// 6. CART 🔒
// ══════════════════════════════════════════════════════════════
export const cartApi = {

  // Get cart → GET /api/cart 🔒
  getCart: () => request('/api/cart', 'GET', null, true),

  // Add to cart → POST /api/cart 🔒
  // Body: { productId, variantId, quantity }
  // ⚠️ variantId = the specific color+size ID from getVariants()
  addToCart: (productId, variantId, quantity = 1) =>
    request('/api/cart', 'POST', { productId, variantId, quantity }, true),

  // Update qty → PATCH /api/cart/:cartItemId 🔒
  // Body: { quantity }
  updateCartItem: (cartItemId, quantity) =>
    request(`/api/cart/${cartItemId}`, 'PATCH', { quantity }, true),

  // Remove one item → DELETE /api/cart/:cartItemId 🔒
  removeFromCart: (cartItemId) =>
    request(`/api/cart/${cartItemId}`, 'DELETE', null, true),

  // Clear all items → DELETE /api/cart 🔒
  clearCart: () => request('/api/cart', 'DELETE', null, true),
}

// ══════════════════════════════════════════════════════════════
// 7. ORDERS 🔒
// ══════════════════════════════════════════════════════════════
export const ordersApi = {

  // Create order from cart → POST /api/orders 🔒
  // No body — backend reads from cart automatically
  createOrder: () => request('/api/orders', 'POST', null, true),

  // Get my orders → GET /api/orders/my 🔒
  // Returns: [{ id, status, total, items, createdAt }]
  getMyOrders: () => request('/api/orders/my', 'GET', null, true),
}

// ══════════════════════════════════════════════════════════════
// 8. CONTACT & NEWSLETTER
// ══════════════════════════════════════════════════════════════
export const contactApi = {

  // Send contact message → POST /api/contact
  // Body: { name, email, phone, message }
  sendMessage: (name, email, phone, message) =>
    request('/api/contact', 'POST', { name, email, phone, message }),

  // Subscribe newsletter → POST /api/newsletter/subscribe
  // Body: { email }
  subscribeNewsletter: (email) =>
    request('/api/newsletter/subscribe', 'POST', { email }),
}

// ══════════════════════════════════════════════════════════════
// 9. COUPONS 🔒
// ══════════════════════════════════════════════════════════════
export const couponsApi = {

  // Redeem coupon → POST /api/coupons/redeem 🔒
  // Body: { couponCode }  e.g. "WELCOME25"
  redeemCoupon: (couponCode) =>
    request('/api/coupons/redeem', 'POST', { couponCode }, true),
}

// ══════════════════════════════════════════════════════════════
// 10. CHECK-IN 🔒
// ══════════════════════════════════════════════════════════════
export const checkInApi = {

  // Daily check-in for loyalty points → POST /api/checkin 🔒
  checkIn: () => request('/api/checkin', 'POST', null, true),
}

// ══════════════════════════════════════════════════════════════
// ❌ STILL MISSING — Tell backend guy!
// ══════════════════════════════════════════════════════════════
/**
 * 1. WISHLIST — users expect this feature!
 *    POST /api/wishlist/toggle  { productId }
 *    GET  /api/wishlist
 *
 * 2. SINGLE ORDER DETAIL
 *    GET /api/orders/:id
 *
 * 3. PAYMENT GATEWAY
 *    POST /api/payments/create  { orderId, method }
 */