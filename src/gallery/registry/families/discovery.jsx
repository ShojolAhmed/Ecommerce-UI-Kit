import { ActiveFilters, FilterDrawer, SearchInput, Sidebar, SortDropdown, sidebarVariants } from '../../../library/index.js'
import { discoveryCategories, sampleActiveFilters, sampleFilterGroups, sampleSortOptions } from '../../data/index.js'
import { defineFamily, variantsFromRegistry } from '../define.js'
import { fn, node, ref, setter, state } from '../markers.js'
import { FilterDrawerStage, SidebarStage } from '../stages.jsx'

const CATEGORY = 'discovery'

const filterState = (initial = { brand: ['Northwind'], price: { min: 20 } }) => ({
  filterGroups: ref('filterGroups', sampleFilterGroups),
  filters: state('filters', initial),
  onFiltersChange: setter('filters'),
})

const categoryState = {
  categories: ref('categories', discoveryCategories),
  activeCategory: state('category', null),
  onCategoryChange: setter('category'),
}

const sidebarInfo = {
  classic: { label: 'Classic', description: 'Bordered panel: Filters header with active count and Clear all, category list, then every group open.' },
  collapsible: { label: 'Collapsible', description: 'Same content with accordion groups; the whole panel folds into a slim rail. Sizes itself with inline widths. Extra props: collapsed / defaultCollapsed, width, collapsedWidth.' },
  minimal: { label: 'Minimal', description: 'Category navigation only (filter props are ignored): quiet text and a rule on the active row.' },
}

export const sidebar = defineFamily({
  id: 'sidebar',
  name: 'Sidebar',
  category: CATEGORY,
  summary: 'Category list and filter groups for a listing page. Your page owns the category and filter state.',
  component: Sidebar,
  importName: 'Sidebar',
  source: 'src/library/components/Sidebar',
  variantProp: 'variant',
  baseProps: { ...categoryState, ...filterState(), onClearAll: setter('filters', { to: {} }) },
  variants: variantsFromRegistry(sidebarVariants, sidebarInfo),
  Stage: SidebarStage,
  frame: { desktop: 900, mobile: 1000 },
  docs: {
    sections: [
      { title: 'Props', file: 'components/Sidebar/types.js', typedef: 'SidebarProps' },
      { title: 'Extra props: collapsible variant', file: 'components/Sidebar/types.js', typedef: 'CollapsibleSidebarProps' },
    ],
    shapes: ['components/Sidebar/types.js'],
  },
})

const drawerPlacement = (placement, description) => ({
  id: placement,
  label: `${placement[0].toUpperCase()}${placement.slice(1)}`,
  description,
  props: { placement },
  setup: 'const triggerRef = useRef(null) // the FilterButton that opens the drawer',
})

export const filterDrawer = defineFamily({
  id: 'filter-drawer',
  name: 'Filter Drawer',
  category: CATEGORY,
  summary: 'Modal drawer with the same content as the sidebars, for small screens. Opened by a FilterButton; the page owns open.',
  component: FilterDrawer,
  importName: 'FilterDrawer',
  extraImports: ['FilterButton'],
  reactImports: ['useRef'],
  source: 'src/library/components/FilterDrawer',
  baseProps: {
    open: state('open', true),
    onClose: setter('open', { to: false }),
    triggerRef: node('triggerRef', undefined),
    resultCount: 12,
    ...categoryState,
    ...filterState(),
    onClearAll: setter('filters', { to: {} }),
    onApply: fn('handleApply'),
  },
  variants: [
    drawerPlacement('bottom', 'Bottom sheet (default). Starts open here; close it, then use the Filters button to reopen.'),
    drawerPlacement('left', 'Slides in from the left.'),
    drawerPlacement('right', 'Slides in from the right.'),
  ],
  Stage: FilterDrawerStage,
  frame: { desktop: 640, mobile: 760 },
  docs: {
    sections: [
      { title: 'Props', file: 'components/FilterDrawer/FilterDrawer.jsx' },
      { title: 'Inherited from Sidebar', file: 'components/Sidebar/types.js', typedef: 'SidebarProps' },
    ],
    shapes: ['components/Sidebar/types.js'],
  },
})

export const searchInput = defineFamily({
  id: 'search-input',
  name: 'Search Input',
  category: CATEGORY,
  summary: 'Controlled search field. It only reports what is typed: no requests and no debouncing.',
  component: SearchInput,
  importName: 'SearchInput',
  source: 'src/library/components/SearchInput',
  baseProps: { value: state('query', ''), onChange: setter('query'), onSubmit: fn('handleSubmit'), onClear: fn('handleClear') },
  variants: [
    { id: 'default', label: 'Default', description: 'Enter submits; Escape clears a non-empty field.' },
    { id: 'pill', label: 'Pill', description: 'shape="pill".', props: { shape: 'pill' } },
    { id: 'small', label: 'Small', description: 'size="sm".', props: { size: 'sm' } },
    { id: 'large', label: 'Large', description: 'size="lg".', props: { size: 'lg' } },
  ],
  frame: { desktop: 220, mobile: 220, stageClassName: 'max-w-md' },
  docs: { sections: [{ title: 'Props', file: 'components/SearchInput/SearchInput.jsx' }] },
})

export const sortDropdown = defineFamily({
  id: 'sort-dropdown',
  name: 'Sort Dropdown',
  category: CATEGORY,
  summary: 'Sort selector: a keyboard-friendly listbox, or a native select for phones.',
  component: SortDropdown,
  importName: 'SortDropdown',
  source: 'src/library/components/SortDropdown',
  baseProps: { options: ref('sortOptions', sampleSortOptions), value: state('sort', 'featured'), onChange: setter('sort') },
  variants: [
    { id: 'menu', label: 'Listbox', description: 'Select-only combobox: arrows, Home / End, type-ahead, Escape.' },
    { id: 'native', label: 'Native', description: 'native renders a styled <select>, so phones get the OS picker.', props: { native: true } },
  ],
  frame: { desktop: 320, mobile: 320 },
  docs: { sections: [{ title: 'Props', file: 'components/SortDropdown/SortDropdown.jsx' }] },
})

export const activeFilters = defineFamily({
  id: 'active-filters',
  name: 'Active Filters',
  category: CATEGORY,
  summary: 'Removable chips for the filters currently applied, built from the same groups and state as the sidebar.',
  component: ActiveFilters,
  importName: 'ActiveFilters',
  source: 'src/library/components/ActiveFilters',
  baseProps: filterState(sampleActiveFilters),
  variants: [
    { id: 'filters', label: 'Filters only', description: 'One chip per applied filter, plus Clear all.' },
    {
      id: 'with-search',
      label: 'With search chip',
      description: 'extraChips adds chips for anything else the page owns (search text, a category). Removal here is logged only.',
      props: { extraChips: [{ id: 'query', label: 'Search: “sweater”', onRemove: fn('removeSearch') }] },
    },
  ],
  frame: { desktop: 220, mobile: 260 },
  docs: { sections: [{ title: 'Props', file: 'components/ActiveFilters/ActiveFilters.jsx' }] },
})
