import { useId } from 'react'
import { cn } from '../../../utils/cn.js'
import { Badge, Button, IconButton } from '../../../primitives/index.js'
import { ChevronLeftIcon, FilterIcon } from '../../../icons/index.jsx'
import { useControllableState } from '../../../hooks/useControllableState.js'
import SidebarBody from '../shared/SidebarBody.jsx'
import { withSidebarLabels } from '../shared/labels.js'
import { useFilterSummary } from '../shared/useFilterSummary.js'

/**
 * Collapsible sidebar. Two levels of collapsing:
 *  - the whole panel folds into a slim rail (one toggle button with the active-filter count);
 *  - while open, every filter group is an accordion (`defaultOpen` per group).
 *
 * `collapsed` is optional UI state: control it with `collapsed` + `onCollapsedChange`,
 * or leave it alone and use `defaultCollapsed`. Filters stay applied while collapsed.
 * The sidebar sizes itself with inline widths (`width` / `collapsedWidth`) because
 * collapsing changes the page layout.
 *
 * @param {import('../types.js').CollapsibleSidebarProps} props
 */
export default function CollapsibleSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  filterGroups = [],
  filters = {},
  onFiltersChange,
  onClearAll,
  labels: labelsProp,
  ariaLabel,
  headingLevel = 2,
  className,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  width = '16rem',
  collapsedWidth = '3.5rem',
}) {
  const labels = withSidebarLabels(labelsProp)
  const { activeCount, clearAll } = useFilterSummary({ filterGroups, filters, onFiltersChange, onClearAll })
  const [collapsed, setCollapsed] = useControllableState({
    value: collapsedProp,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  })
  const panelId = useId()
  const Title = `h${headingLevel}`

  const toggleLabel = collapsed
    ? activeCount > 0
      ? `${labels.expandFilters}, ${labels.activeCount(activeCount)}`
      : labels.expandFilters
    : labels.collapseFilters

  return (
    <aside
      aria-label={ariaLabel ?? labels.filters}
      style={{ width: collapsed ? collapsedWidth : width }}
      className={cn('shrink-0 rounded-surface border border-border bg-surface text-foreground', className)}
    >
      <div
        className={cn(
          'flex min-h-14 items-center gap-2 px-2 py-2',
          collapsed ? 'justify-center' : 'justify-between border-b border-border pl-4',
        )}
      >
        {!collapsed && (
          <Title className="flex min-w-0 flex-1 items-center gap-2 text-base font-semibold">
            {labels.filters}
            {activeCount > 0 && (
              <Badge variant="brand">
                <span aria-hidden="true">{activeCount}</span>
                <span className="sr-only">{labels.activeCount(activeCount)}</span>
              </Badge>
            )}
          </Title>
        )}
        {!collapsed && activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            {labels.clearAll}
          </Button>
        )}
        {/* One toggle element in both states, so keyboard focus stays on it while the panel folds. */}
        <span className="relative inline-flex">
          <IconButton
            label={toggleLabel}
            aria-expanded={!collapsed}
            aria-controls={collapsed ? undefined : panelId}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FilterIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {collapsed && activeCount > 0 && (
            <Badge variant="brand" aria-hidden="true" className="pointer-events-none absolute -right-1 -top-1">
              {activeCount}
            </Badge>
          )}
        </span>
      </div>

      {!collapsed && (
        <SidebarBody
          className="p-4 pt-2"
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          filterGroups={filterGroups}
          filters={filters}
          onFiltersChange={onFiltersChange}
          labels={labels}
          accordion
          headingLevel={headingLevel + 1}
          id={panelId}
        />
      )}
    </aside>
  )
}
