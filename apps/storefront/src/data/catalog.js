// The only module pages should use to read catalog data. Everything is synchronous and in-memory for now.
// Returned objects are shared references: treat them as read-only (copy before changing).
//
// When a real API replaces the mock data, keep these names and make them async (a breaking change for callers, on
// purpose: components should then load data in effects or a router loader).

import { categories as categoryRecords } from './categories.js'
import { products } from './products.js'

/** @typedef {import('./products.js').ProductRecord} ProductRecord */
/** @typedef {import('./categories.js').Category & { count: number }} CategoryWithCount */

const byId = new Map(products.map((product) => [product.id, product]))
const bySlug = new Map(products.map((product) => [product.slug, product]))

/** @type {CategoryWithCount[]} */
const categories = categoryRecords.map((category) => ({
  ...category,
  count: products.filter((product) => product.categoryId === category.id).length,
}))
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))
const categoryById = new Map(categories.map((category) => [category.id, category]))

const limitTo = (list, limit) => (typeof limit === 'number' ? list.slice(0, limit) : list)

/** All categories, with product counts. Shape-compatible with the kit's `Category` and FeaturedCategoryGrid. */
export const getCategories = () => categories

export const getCategoryBySlug = (slug) => categoryBySlug.get(slug) ?? null

export const getCategoryById = (id) => categoryById.get(id) ?? null

/**
 * Products in catalog order. No filtering or sorting beyond the optional category: the shop feature owns that.
 * @param {{ categorySlug?: string, limit?: number }} [options]
 * @returns {ProductRecord[]}
 */
export function getProducts({ categorySlug, limit } = {}) {
  if (!categorySlug) return limitTo(products, limit)
  const category = categoryBySlug.get(categorySlug)
  return category ? limitTo(products.filter((product) => product.categoryId === category.id), limit) : []
}

export const getProductById = (id) => byId.get(id) ?? null

export const getProductBySlug = (slug) => bySlug.get(slug) ?? null

/** Products for a list of ids, in the order of the ids; unknown ids are skipped. */
export const getProductsByIds = (ids = []) => ids.map((id) => byId.get(id)).filter(Boolean)

/** Hand-picked products (`featured: true`). */
export const getFeaturedProducts = (limit) => limitTo(products.filter((product) => product.featured), limit)

/** Most recently added first. */
export const getNewArrivals = (limit) =>
  limitTo([...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), limit)

/** Same-category products first, then the rest, never the product itself. */
export function getRelatedProducts(product, limit = 4) {
  if (!product) return []
  const others = products.filter((item) => item.id !== product.id)
  const same = others.filter((item) => item.categoryId === product.categoryId)
  return limitTo([...same, ...others.filter((item) => item.categoryId !== product.categoryId)], limit)
}

/**
 * Deliberately basic text search: every word of the query must appear in the product's name, brand, description,
 * tags or category label. Name matches rank first. No typo tolerance, facets or pagination.
 * @param {string} query
 * @returns {ProductRecord[]}
 */
export function searchProducts(query) {
  const words = String(query ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return []

  const scored = []
  for (const product of products) {
    const name = product.name.toLowerCase()
    const rest = [product.brand, product.description, categoryById.get(product.categoryId)?.label, ...product.tags]
      .join(' ')
      .toLowerCase()
    if (!words.every((word) => name.includes(word) || rest.includes(word))) continue
    scored.push({ product, score: words.filter((word) => name.includes(word)).length })
  }
  return scored.sort((a, b) => b.score - a.score).map(({ product }) => product)
}
