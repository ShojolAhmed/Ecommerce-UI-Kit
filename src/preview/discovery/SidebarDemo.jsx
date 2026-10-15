import { Sidebar } from '../../library/index.js'
import { cn } from '../../library/utils/cn.js'
import { sampleCategories, sampleFilterGroups } from '../sampleDiscovery.js'
import EventLog from './EventLog.jsx'
import { useDiscoveryState } from './useDiscoveryState.js'

/**
 * One sidebar variant with sample data. The demo page owns the category and filter
 * state (see useDiscoveryState); the sidebar only renders it and reports changes.
 * Below `md` the layout stacks, so the sidebar is shown at full width.
 */
export default function SidebarDemo({ variant }) {
  const { category, filters, lastEvent, handlers, clearAll } = useDiscoveryState({
    initialFilters: { brand: ['Northwind'], price: { min: 20 } },
  })

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      {/* Collapsible sizes itself (inline width), so its column must not force one. */}
      <div className={cn('shrink-0', variant !== 'collapsible' && 'w-full md:w-64')}>
        <Sidebar
          variant={variant}
          ariaLabel={`Filters (${variant})`}
          categories={sampleCategories}
          activeCategory={category}
          onCategoryChange={handlers.onCategoryChange}
          filterGroups={sampleFilterGroups}
          filters={filters}
          onFiltersChange={handlers.onFiltersChange}
          onClearAll={clearAll}
        />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <EventLog lastEvent={lastEvent} state={{ category, filters }} />
        {variant === 'minimal' && (
          <p className="text-sm text-foreground-muted">
            The minimal sidebar is category-only: the filter props are ignored, so only the category changes.
          </p>
        )}
      </div>
    </div>
  )
}
