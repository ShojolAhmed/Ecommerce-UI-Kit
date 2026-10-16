// Public entry point of the library. Everything consumers can import lives here.
export * from './primitives/index.js'
export * from './components/ProductCard/index.js'
export * from './components/ProductGrid/index.js'
export * from './components/Navbar/index.js'
export * from './components/Sidebar/index.js'
export * from './components/FilterDrawer/index.js'
export * from './components/SearchInput/index.js'
export * from './components/SortDropdown/index.js'
export * from './components/Breadcrumbs/index.js'
export * from './components/ActiveFilters/index.js'

// Footers and homepage sections. Each one stands alone: combine them in any order.
export * from './components/Footer/index.js'
export * from './components/AnnouncementBar/index.js'
export * from './components/HeroBanner/index.js'
export * from './components/FeaturedCategoryGrid/index.js'
export * from './components/FeaturedProducts/index.js'
export * from './components/PromoBanner/index.js'
export * from './components/Testimonials/index.js'
export * from './components/FaqAccordion/index.js'
export * from './components/NewsletterSignup/index.js'
export * from './components/NewsletterForm/index.js'
export * from './components/SectionHeader/index.js'

// Generic disclosure components. `FaqAccordion` is built on `Accordion`.
export * from './components/Accordion/index.js'
export * from './components/Tabs/index.js'

// Cart and overlays. UI only: your page owns the cart state (see the pure helpers below).
export * from './components/QuantitySelector/index.js'
export * from './components/CartItemRow/index.js'
export * from './components/CartSummary/index.js'
export * from './components/EmptyCartState/index.js'
export * from './components/CartDrawer/index.js'
export * from './components/ConfirmDialog/index.js'
export * from './components/Toast/index.js'

// Pure helpers for filter state and category trees (no React): use them in your own state logic.
export {
  countActiveFilters,
  getActiveFilterChips,
  removeFilterChip,
  setFilterValue,
  toggleFilterOption,
  clearFilterGroup,
  getFilterValue,
  getCategoryPath,
} from './utils/discovery.js'

// Pure helpers for cart quantities and totals (no React): use them in your own cart logic.
export {
  isValidCartItem,
  getMinQuantity,
  getMaxQuantity,
  clampQuantity,
  getLineTotal,
  getLineSavings,
  getItemCount,
  getCartTotals,
} from './utils/cart.js'
