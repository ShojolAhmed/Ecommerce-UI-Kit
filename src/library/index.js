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
