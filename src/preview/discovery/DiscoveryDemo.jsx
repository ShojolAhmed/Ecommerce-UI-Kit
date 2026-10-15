import { useMemo, useRef, useState } from 'react'
import {
  ActiveFilters,
  Breadcrumbs,
  Button,
  FilterButton,
  FilterDrawer,
  ProductGrid,
  SearchInput,
  Sidebar,
  SortDropdown,
  countActiveFilters,
  sidebarVariants,
} from '../../library/index.js'
import { cn } from '../../library/utils/cn.js'
import { sampleProducts } from '../sampleData.js'
import {
  applyDiscovery,
  sampleBreadcrumbs,
  sampleCategories,
  sampleFilterGroups,
  sampleSortOptions,
} from '../sampleDiscovery.js'
import EventLog from './EventLog.jsx'
import Switcher from './Switcher.jsx'
import { useDiscoveryState } from './useDiscoveryState.js'

/**
 * Every discovery component wired to one set of page-owned state, in front of a
 * ProductGrid. The in-memory filtering (`applyDiscovery`) is demo-only: the library
 * never filters, sorts or searches anything.
 *
 * Desktop (lg and up) shows the sidebar; below that the FilterButton opens the drawer.
 */
export default function DiscoveryDemo() {
  const [sidebarVariant, setSidebarVariant] = useState('classic')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const triggerRef = useRef(null)
  const state = useDiscoveryState({ initialFilters: { brand: ['Northwind'] } })
  const { category, filters, query, sort, handlers, setQuery, setLastEvent } = state

  const results = useMemo(
    () => applyDiscovery(sampleProducts, { category, filters, query, sort }),
    [category, filters, query, sort],
  )
  const breadcrumbs = useMemo(() => sampleBreadcrumbs(category), [category])
  const activeCount = useMemo(() => countActiveFilters(sampleFilterGroups, filters), [filters])

  const sidebarProps = {
    categories: sampleCategories,
    activeCategory: category,
    onCategoryChange: handlers.onCategoryChange,
    filterGroups: sampleFilterGroups,
    filters,
    onFiltersChange: handlers.onFiltersChange,
    onClearAll: state.clearAll,
  }

  const resetEverything = () => {
    handlers.onFiltersChange({})
    handlers.onCategoryChange(null, null)
    setQuery('')
  }

  return (
    <div className="space-y-4">
      <Switcher
        label="Sidebar variant"
        options={Object.keys(sidebarVariants)}
        value={sidebarVariant}
        onChange={setSidebarVariant}
      />

      <div className="space-y-4 rounded-surface border border-border bg-background p-4 sm:p-6">
        <Breadcrumbs
          items={breadcrumbs}
          onNavigate={(item, event) => {
            event.preventDefault() // demo only
            handlers.onCategoryChange(item.id === 'home' || item.id === 'shop' ? null : item.id, null)
          }}
        />

        <div className="flex items-start gap-6">
          <div className={cn('hidden shrink-0 lg:block', sidebarVariant !== 'collapsible' && 'w-64')}>
            <Sidebar variant={sidebarVariant} ariaLabel="Product filters" {...sidebarProps} />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <SearchInput
                label="Search the catalog"
                className="min-w-0 basis-full sm:basis-64 sm:flex-1"
                value={query}
                onChange={(next) => {
                  setQuery(next)
                  setLastEvent(`Search: "${next}"`)
                }}
                onSubmit={(text) => setLastEvent(`Submit search: "${text}"`)}
              />
              <FilterButton
                ref={triggerRef}
                open={drawerOpen}
                activeCount={activeCount}
                className="lg:hidden"
                onClick={() => setDrawerOpen(true)}
              />
              <SortDropdown options={sampleSortOptions} value={sort} onChange={handlers.onSortChange} />
            </div>

            <ActiveFilters
              filterGroups={sampleFilterGroups}
              filters={filters}
              onFiltersChange={handlers.onFiltersChange}
              extraChips={
                query ? [{ id: 'query', label: `Search: “${query}”`, onRemove: () => setQuery('') }] : []
              }
            />

            <p role="status" className="text-sm text-foreground-muted">
              {results.length} {results.length === 1 ? 'product' : 'products'}
            </p>

            <ProductGrid
              label="Results"
              products={results}
              variant="minimal"
              columns={3}
              emptyState={
                <div className="rounded-surface bg-surface-muted p-8 text-center">
                  <p className="font-medium">No products match your search</p>
                  <p className="mt-1 text-sm text-foreground-muted">Try a broader search or clear your filters.</p>
                  <Button className="mt-4" variant="outline" onClick={resetEverything}>
                    Clear everything
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        triggerRef={triggerRef}
        resultCount={results.length}
        {...sidebarProps}
      />

      <EventLog lastEvent={state.lastEvent} state={{ category, filters, query, sort }} />
    </div>
  )
}
