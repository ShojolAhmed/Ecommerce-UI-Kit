import { sampleProducts } from './sampleData.js'

/**
 * Demo data for the product discovery components. Nothing here is built into the
 * library: a real store would load categories, filter options and sort options
 * from its own catalog. The product -> category mapping lives here (not on the
 * products) so `sampleData.js` stays untouched.
 */

/** Leaf category of each sample product. */
const productCategory = {
  1001: 'knitwear',
  1002: 'bags',
  'sku-pour-over': 'kitchen',
  1004: 'wallets',
  1005: 'living',
  1006: 'electronics',
  1007: 'living',
  1008: 'scarves',
  1009: 'outerwear',
  1010: 'living',
  1011: 'living',
  1012: 'bedding',
}

/** Category tree without counts: id, label and children only. */
const categoryTree = [
  { id: 'clothing', label: 'Clothing', children: [{ id: 'knitwear', label: 'Knitwear' }, { id: 'outerwear', label: 'Outerwear' }] },
  { id: 'accessories', label: 'Accessories', children: [{ id: 'bags', label: 'Bags' }, { id: 'scarves', label: 'Scarves' }, { id: 'wallets', label: 'Wallets' }] },
  {
    id: 'home',
    label: 'Home',
    children: [{ id: 'living', label: 'Living' }, { id: 'kitchen', label: 'Kitchen' }, { id: 'bedding', label: 'Bedding' }],
  },
  { id: 'electronics', label: 'Electronics' },
]

/** Every leaf id at or below a category (used by the demo's in-memory filtering). */
function leafIds(category) {
  return category.children ? category.children.flatMap(leafIds) : [category.id]
}

const findCategory = (tree, id) => {
  for (const category of tree) {
    if (category.id === id) return category
    const found = category.children && findCategory(category.children, id)
    if (found) return found
  }
  return undefined
}

const countFor = (category) =>
  sampleProducts.filter((product) => leafIds(category).includes(productCategory[product.id])).length

const withCounts = (tree) =>
  tree.map((category) => ({
    ...category,
    count: countFor(category),
    ...(category.children && { children: withCounts(category.children) }),
  }))

export const sampleCategories = withCounts(categoryTree)

const brands = [...new Set(sampleProducts.map((product) => product.brand))].sort()

export const sampleFilterGroups = [
  {
    id: 'brand',
    label: 'Brand',
    type: 'checkbox',
    visibleOptions: 3, // five brands, so "Show more" is visible in the demo
    options: brands.map((brand) => ({
      value: brand,
      label: brand,
      count: sampleProducts.filter((product) => product.brand === brand).length,
    })),
  },
  { id: 'price', label: 'Price', type: 'range', min: 0, max: 300, step: 1, currency: 'USD' },
  {
    id: 'rating',
    label: 'Rating',
    type: 'radio',
    options: [
      { value: 4.5, label: '4.5 stars & up' },
      { value: 4, label: '4 stars & up' },
      { value: 3, label: '3 stars & up' },
    ],
  },
  {
    id: 'offers',
    label: 'Availability',
    type: 'checkbox',
    defaultOpen: false, // starts closed when the sidebar uses accordions
    options: [
      { value: 'in-stock', label: 'In stock' },
      { value: 'on-sale', label: 'On sale' },
    ],
  },
]

export const sampleSortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]

/** Breadcrumb trail for a category id (or the catalog root). */
export function sampleBreadcrumbs(activeCategory) {
  const trail = [{ id: 'home', label: 'Home', href: '#home' }, { id: 'shop', label: 'Shop', href: '#shop' }]
  const walk = (tree, id, path = []) => {
    for (const category of tree) {
      const next = [...path, category]
      if (category.id === id) return next
      const found = category.children && walk(category.children, id, next)
      if (found) return found
    }
    return undefined
  }
  const path = activeCategory ? walk(sampleCategories, activeCategory) ?? [] : []
  return [
    ...trail,
    ...path.map((category) => ({ id: category.id, label: category.label, href: `#${category.id}` })),
  ]
}

/**
 * Filters + sorts the sample products in memory so the demo has something to
 * show. This stands in for the page's own catalog logic: it is NOT part of the
 * library and does no real search.
 */
export function applyDiscovery(products, { category, filters, query, sort }) {
  const scope = category ? leafIds(findCategory(sampleCategories, category)) : null
  const needle = query.trim().toLowerCase()
  const { brand = [], price, rating, offers = [] } = filters

  const matched = products.filter((product) => {
    if (scope && !scope.includes(productCategory[product.id])) return false
    if (needle && !`${product.name} ${product.brand}`.toLowerCase().includes(needle)) return false
    if (brand.length > 0 && !brand.includes(product.brand)) return false
    if (price?.min !== undefined && product.price < price.min) return false
    if (price?.max !== undefined && product.price > price.max) return false
    if (rating !== undefined && (product.rating ?? 0) < rating) return false
    if (offers.includes('in-stock') && product.inStock === false) return false
    if (offers.includes('on-sale') && !(product.originalPrice > product.price)) return false
    return true
  })

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  }
  return sorters[sort] ? [...matched].sort(sorters[sort]) : matched
}
