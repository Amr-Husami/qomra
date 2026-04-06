/**
 * useHomeData.js
 * ─────────────────────────────────────────────────────────────
 * 💡 WHAT IS A CUSTOM HOOK?
 * A custom hook is a function that starts with "use" and
 * contains logic you want to reuse across components.
 *
 * This hook fetches all the data the homepage needs:
 *   - Hero banners (from API)
 *   - Categories (from API)
 *   - Age groups (from API)
 *   - Best sellers (from API)
 *   - New products (from API)
 *   - Suggested products (from API)
 *   - Brand logos (from API)
 *
 * If the API fails or backend is not running,
 * it falls back to the fake data automatically! ✅
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react'
import { bannersApi, taxonomyApi, productsApi, brandsApi } from './api'

const BACKEND = 'https://qomra-t8pr.onrender.com'

// Prepend the backend base URL to relative image paths from the API
function fixImageUrl(url) {
  if (!url || typeof url !== 'string') return url
  if (url.startsWith('http')) return url
  return `${BACKEND}${url.startsWith('/') ? '' : '/'}${url}`
}

// Extract image URL string from either a string or an image object
function extractImageUrl(img) {
  if (!img) return null
  if (typeof img === 'string') return fixImageUrl(img)
  return fixImageUrl(img.imageUrl || img.url || img.image || null)
}

// Normalize image fields on a product object
function fixProductImages(product) {
  if (!product) return product

  // images[] is an array of objects { imageUrl, order, ... } — extract URL strings
  const imageObjects = Array.isArray(product.images) ? product.images : []
  const imageUrls = imageObjects.map(extractImageUrl).filter(Boolean)

  // Use first image as the main image; fall back to top-level imageUrl/image field
  const mainImage = imageUrls[0] || fixImageUrl(product.imageUrl || product.image) || ''

  return {
    ...product,
    image: mainImage,
    images: imageUrls,
  }
}
import {
  heroSlides as fakeSlides,
  categories as fakeCategories,
  ageGroups as fakeAgeGroups,
  products as fakeProducts,
  brands as fakeBrands,
} from '../data/homeData'

export function useHomeData() {
  // State for each data section
  const [banners,    setBanners]    = useState(fakeSlides)     // starts with fake
  const [categories, setCategories] = useState(fakeCategories) // starts with fake
  const [ageGroups,  setAgeGroups]  = useState(fakeAgeGroups)  // starts with fake
  const [newProducts,      setNewProducts]      = useState(fakeProducts.slice(0, 4))
  const [bestSellers,      setBestSellers]      = useState(fakeProducts.slice(0, 4))
  const [suggestedProducts,setSuggestedProducts]= useState(fakeProducts.slice(0, 4))
  const [brands,     setBrands]     = useState(fakeBrands)     // starts with fake
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    // Run all API calls at the same time using Promise.allSettled
    // "allSettled" means: try all of them, even if some fail
    // Unlike Promise.all which stops if ONE fails
    const fetchAll = async () => {
      setLoading(true)
      try {

      const results = await Promise.allSettled([
        bannersApi.getBanners(),               // [0]
        taxonomyApi.getCategories(),           // [1]
        taxonomyApi.getAgeGroups(),            // [2]
        productsApi.getNewProducts(7),         // [3]
        productsApi.getBestSellers(4),         // [4]
        productsApi.getSuggested(4),           // [5]
        brandsApi.getBrands(),                 // [6]
      ])

      // For each result: if "fulfilled" = success, use it
      // If "rejected" = failed, keep the fake data we started with

      // Banners
      if (results[0].status === 'fulfilled' && results[0].value?.length > 0) {
        setBanners(results[0].value.map(b => ({
          ...b,
          image: fixImageUrl(b.imageUrl || b.image),
          link: b.linkUrl || '/',
          overlayColor: 'rgba(15,20,40,0.55)',
          btnAr: 'تسوق الآن',
          btnEn: 'Shop Now',
          descAr: '',
          descEn: '',
        })))
      }

      // Categories
      if (results[1].status === 'fulfilled' && results[1].value?.length > 0) {
        setCategories(results[1].value.map(c => ({
          ...c,
          image: fixImageUrl(c.imageUrl || c.image),
          nameAr: c.titleAr || c.nameAr,
          nameEn: c.titleEn || c.nameEn,
        })))
      }

      // Age groups
      if (results[2].status === 'fulfilled' && results[2].value?.length > 0) {
        setAgeGroups(results[2].value.map(g => ({
          ...g,
          slug: g.slug || g.value?.toLowerCase() || g.id,
          labelAr: g.labelAr || g.labelLocalized?.ar || g.label,
          labelEn: g.labelEn || g.labelLocalized?.en || g.label,
          image: fixImageUrl(g.imageUrl || g.image),
        })))
      }

      // New products
      if (results[3].status === 'fulfilled') {
        const data = results[3].value
        const list = Array.isArray(data) ? data : data?.data || data?.products || fakeProducts.slice(0,4)
        setNewProducts(list.map(fixProductImages))
      }

      // Best sellers
      if (results[4].status === 'fulfilled') {
        const data = results[4].value
        const list = Array.isArray(data) ? data : data?.data || data?.products || fakeProducts.slice(0,4)
        setBestSellers(list.map(fixProductImages))
      }

      // Suggested
      if (results[5].status === 'fulfilled') {
        const data = results[5].value
        const list = Array.isArray(data) ? data : data?.data || data?.products || fakeProducts.slice(0,4)
        setSuggestedProducts(list.map(fixProductImages))
      }

      // Brands
      if (results[6].status === 'fulfilled' && results[6].value?.length > 0) {
        setBrands(results[6].value.map(b => ({ ...b, logo: fixImageUrl(b.logo) })))
      }

      } catch (e) {
        console.error('❌ useHomeData fetchAll error:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, []) // [] means: run once when the component first appears on screen

  return {
    banners,
    categories,
    ageGroups,
    newProducts,
    bestSellers,
    suggestedProducts,
    brands,
    loading,
  }
}
