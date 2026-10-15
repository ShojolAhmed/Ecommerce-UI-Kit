import { cn } from '../../../utils/cn.js'
import { Badge, Button } from '../../../primitives/index.js'
import SidebarBody from '../shared/SidebarBody.jsx'
import { withSidebarLabels } from '../shared/labels.js'
import { useFilterSummary } from '../shared/useFilterSummary.js'

/**
 * Classic sidebar: a bordered panel with a "Filters" header (active count and
 * Clear all), the category list, then every filter group open and in view.
 * It fills the width of its container, so size the column yourself (e.g. `w-64`).
 *
 * @param {import('../types.js').SidebarProps} props
 */
export default function ClassicSidebar({
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
}) {
  const labels = withSidebarLabels(labelsProp)
  const { activeCount, clearAll } = useFilterSummary({ filterGroups, filters, onFiltersChange, onClearAll })
  const Title = `h${headingLevel}`

  return (
    <aside
      aria-label={ariaLabel ?? labels.filters}
      className={cn('w-full rounded-surface border border-border bg-surface text-foreground', className)}
    >
      <div className="flex min-h-14 items-center justify-between gap-2 border-b border-border px-4 py-2">
        <Title className="flex items-center gap-2 text-base font-semibold">
          {labels.filters}
          {activeCount > 0 && (
            <Badge variant="brand">
              <span aria-hidden="true">{activeCount}</span>
              <span className="sr-only">{labels.activeCount(activeCount)}</span>
            </Badge>
          )}
        </Title>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            {labels.clearAll}
          </Button>
        )}
      </div>

      <SidebarBody
        className="p-4"
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        filterGroups={filterGroups}
        filters={filters}
        onFiltersChange={onFiltersChange}
        labels={labels}
        headingLevel={headingLevel + 1}
      />
    </aside>
  )
}
