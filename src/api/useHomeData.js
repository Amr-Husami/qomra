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
        setBanners(results[0].value)
      }

      // Categories
      if (results[1].status === 'fulfilled' && results[1].value?.length > 0) {
        setCategories(results[1].value)
      }

      // Age groups
      if (results[2].status === 'fulfilled' && results[2].value?.length > 0) {
        setAgeGroups(results[2].value)
      }

      // New products
      if (results[3].status === 'fulfilled') {
        const data = results[3].value
        // Backend might return { products: [...] } or just [...]
        setNewProducts(Array.isArray(data) ? data : data?.products || fakeProducts.slice(0,4))
      }

      // Best sellers
      if (results[4].status === 'fulfilled') {
        const data = results[4].value
        setBestSellers(Array.isArray(data) ? data : data?.products || fakeProducts.slice(0,4))
      }

      // Suggested
      if (results[5].status === 'fulfilled') {
        const data = results[5].value
        setSuggestedProducts(Array.isArray(data) ? data : data?.products || fakeProducts.slice(0,4))
      }

      // Brands
      if (results[6].status === 'fulfilled' && results[6].value?.length > 0) {
        setBrands(results[6].value)
      }

      setLoading(false)
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
