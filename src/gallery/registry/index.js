import { activeFilters, filterDrawer, searchInput, sidebar, sortDropdown } from './families/discovery.jsx'
import { announcementBar, breadcrumbs, footer, navbar } from './families/chrome.jsx'
import { productCard, productGrid } from './families/products.jsx'
import {
  faqAccordion,
  featuredCategoryGrid,
  featuredProducts,
  heroBanner,
  newsletterSignup,
  promoBanner,
  testimonials,
} from './families/sections.jsx'
import {
  cartDrawer,
  cartItemRow,
  cartSummary,
  confirmDialog,
  emptyCartState,
  quantitySelector,
  toast,
} from './families/shopping.jsx'

/** Browse order of the categories in the gallery navigation. */
export const categories = [
  { id: 'chrome', name: 'Navigation & site chrome', description: 'Headers, footers and wayfinding.' },
  { id: 'products', name: 'Products', description: 'Product cards and grids.' },
  { id: 'discovery', name: 'Search & filtering', description: 'Sidebars, filters, search and sorting for listing pages.' },
  { id: 'sections', name: 'Homepage sections', description: 'Standalone sections you can combine in any order.' },
  { id: 'shopping', name: 'Cart & overlays', description: 'Cart lines, totals, the drawer, dialogs and toasts.' },
]

/** Every family the gallery shows. Add a family here (and to its category) to list it. */
export const families = [
  navbar,
  footer,
  breadcrumbs,
  announcementBar,
  productCard,
  productGrid,
  sidebar,
  filterDrawer,
  searchInput,
  sortDropdown,
  activeFilters,
  heroBanner,
  featuredCategoryGrid,
  featuredProducts,
  promoBanner,
  testimonials,
  faqAccordion,
  newsletterSignup,
  quantitySelector,
  cartItemRow,
  cartSummary,
  emptyCartState,
  cartDrawer,
  confirmDialog,
  toast,
]

export const getFamily = (id) => families.find((family) => family.id === id)
export const getVariant = (family, id) => family?.variants.find((variant) => variant.id === id)
export const familiesIn = (categoryId) => families.filter((family) => family.category === categoryId)
