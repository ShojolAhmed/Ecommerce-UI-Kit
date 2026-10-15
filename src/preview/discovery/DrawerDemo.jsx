import { useRef, useState } from 'react'
import { FilterButton, FilterDrawer, SearchInput, countActiveFilters } from '../../library/index.js'
import { applyDiscovery, sampleCategories, sampleFilterGroups } from '../sampleDiscovery.js'
import { sampleProducts } from '../sampleData.js'
import EventLog from './EventLog.jsx'
import { useDiscoveryState } from './useDiscoveryState.js'

/**
 * FilterButton + FilterDrawer. The drawer is a fixed overlay like the Navbar's mobile menu,
 * so it covers the viewport while open. The page owns `open`; changes apply live and the
 * footer button reports the matching result count.
 */
export default function DrawerDemo({ placement }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const { category, filters, query, setQuery, lastEvent, setLastEvent, handlers, clearAll } = useDiscoveryState()

  const results = applyDiscovery(sampleProducts, { category, filters, query, sort: 'featured' })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <FilterButton
          ref={triggerRef}
          open={open}
          activeCount={countActiveFilters(sampleFilterGroups, filters)}
          onClick={() => {
            setOpen(true)
            setLastEvent('Open filter drawer')
          }}
        />
        <p role="status" className="text-sm text-foreground-muted">
          {results.length} {results.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <FilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        placement={placement}
        resultCount={results.length}
        onApply={() => setLastEvent('Apply: drawer closed')}
        categories={sampleCategories}
        activeCategory={category}
        onCategoryChange={handlers.onCategoryChange}
        filterGroups={sampleFilterGroups}
        filters={filters}
        onFiltersChange={handlers.onFiltersChange}
        onClearAll={clearAll}
      >
        {/* The optional children slot sits above the filters: handy for search or sort on small screens. */}
        <SearchInput
          label={`Search products (${placement} drawer)`}
          value={query}
          onChange={setQuery}
          onSubmit={(text) => setLastEvent(`Search: "${text}"`)}
        />
      </FilterDrawer>

      <EventLog lastEvent={lastEvent} state={{ category, filters, query }} />
    </div>
  )
}
