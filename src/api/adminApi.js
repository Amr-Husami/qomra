/**
 * adminApi.js
 * ─────────────────────────────────────────────────────────────
 * Admin API — endpoints match the Postman collection exactly.
 * BASE_URL: https://qomra-t8pr.onrender.com
 *
 * Two request helpers:
 *  adminRequest()     → JSON body  (Content-Type: application/json)
 *  adminFormRequest() → FormData   (file uploads — browser sets boundary)
 * ─────────────────────────────────────────────────────────────
 */

import Cookies from 'js-cookie'

const BASE_URL   = 'https://qomra-t8pr.onrender.com'
const getToken   = () => Cookies.get('qomra_token')

// ── JSON requests ─────────────────────────────────────────────
async function adminRequest(endpoint, method = 'GET', body = null) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || `Error ${response.status}`)
  return data
}

// ── FormData requests (file uploads) ─────────────────────────
async function adminFormRequest(endpoint, method = 'POST', formData = null) {
  const token = getToken()
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
  // Do NOT set Content-Type — browser adds it with the correct multipart boundary
  const options = { method, headers }
  if (formData) options.body = formData

  const response = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || `Error ${response.status}`)
  return data
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS  — POST/PATCH/DELETE /api/products
// ══════════════════════════════════════════════════════════════
export const adminProductsApi = {
  // GET /api/products?page=1&limit=20&search=...
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return adminRequest(`/api/products?${query}`)
  },

  // GET /api/products/:id
  getById: (id) => adminRequest(`/api/products/${id}`),

  // POST /api/products   FormData with optional image file
  create: (formData) => adminFormRequest('/api/products', 'POST', formData),

  // PATCH /api/products/:id   FormData with optional image file
  update: (id, formData) => adminFormRequest(`/api/products/${id}`, 'PATCH', formData),

  // DELETE /api/products/:id
  delete: (id) => adminRequest(`/api/products/${id}`, 'DELETE'),

  // PATCH /api/products/:id/best-seller   Body: { isBestSeller }
  setBestSeller: (id, value) =>
    adminRequest(`/api/products/${id}/best-seller`, 'PATCH', { isBestSeller: value }),

  // PATCH /api/products/:id/suggested    Body: { isSuggestedProduct }
  setSuggested: (id, value) =>
    adminRequest(`/api/products/${id}/suggested`, 'PATCH', { isSuggestedProduct: value }),
}

// ══════════════════════════════════════════════════════════════
// CATEGORIES  — FormData (image file upload)
// ══════════════════════════════════════════════════════════════
export const adminCategoriesApi = {
  // GET /api/categories
  getAll: () => adminRequest('/api/categories'),

  // POST /api/categories  FormData: titleAr, titleEn, slug, order, isActive, image(file)
  create: (formData) => adminFormRequest('/api/categories', 'POST', formData),

  // PATCH /api/categories/:id  FormData: same fields
  update: (id, formData) => adminFormRequest(`/api/categories/${id}`, 'PATCH', formData),

  // DELETE /api/categories/:id
  delete: (id) => adminRequest(`/api/categories/${id}`, 'DELETE'),
}

// ══════════════════════════════════════════════════════════════
// BRANDS  — FormData (logo file upload)
// ══════════════════════════════════════════════════════════════
export const adminBrandsApi = {
  // GET /api/brands
  getAll: () => adminRequest('/api/brands'),

  // POST /api/brands  FormData: nameAr, nameEn, slug, order, isActive, logo(file)
  create: (formData) => adminFormRequest('/api/brands', 'POST', formData),

  // PATCH /api/brands/:id
  update: (id, formData) => adminFormRequest(`/api/brands/${id}`, 'PATCH', formData),

  // DELETE /api/brands/:id
  delete: (id) => adminRequest(`/api/brands/${id}`, 'DELETE'),
}

// ══════════════════════════════════════════════════════════════
// BANNERS  — FormData (image file upload)
// ══════════════════════════════════════════════════════════════
export const adminBannersApi = {
  // GET /api/banners
  getAll: () => adminRequest('/api/banners'),

  // POST /api/banners  FormData: titleAr, titleEn, subtitleAr, subtitleEn,
  //                              linkUrl, order, isActive, image(file)
  create: (formData) => adminFormRequest('/api/banners', 'POST', formData),

  // PATCH /api/banners/:id
  update: (id, formData) => adminFormRequest(`/api/banners/${id}`, 'PATCH', formData),

  // DELETE /api/banners/:id
  delete: (id) => adminRequest(`/api/banners/${id}`, 'DELETE'),
}

// ══════════════════════════════════════════════════════════════
// USERS  — GET /users  (requires auth token)
// ══════════════════════════════════════════════════════════════
export const adminUsersApi = {
  getAll: () => adminRequest('/users'),
}

// ══════════════════════════════════════════════════════════════
// ORDERS  — GET /api/orders/my  (current user's orders)
// ══════════════════════════════════════════════════════════════
export const adminOrdersApi = {
  getAll: () => adminRequest('/api/orders/my'),
}
