import { cn } from '../../../utils/cn.js'
import CategoryList from './CategoryList.jsx'
import FilterGroups from './FilterGroups.jsx'

/**
 * Categories followed by filter groups. Shared by the classic and collapsible
 * sidebars and by the mobile drawer, so they always behave the same.
 *
 * `headingLevel` is the level of the section headings (Categories, each filter group).
 */
export default function SidebarBody({
  categories = [],
  activeCategory,
  onCategoryChange,
  filterGroups = [],
  filters,
  onFiltersChange,
  labels,
  accordion = false,
  size = 'md',
  headingLevel = 3,
  id,
  className,
}) {
  const hasCategories = categories.length > 0
  const hasGroups = filterGroups.length > 0

  return (
    <div id={id} className={cn('space-y-4', className)}>
      {hasCategories && (
        <CategoryList
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          labels={labels}
          size={size}
          headingLevel={headingLevel}
        />
      )}
      {hasGroups && (
        <div className={cn(hasCategories && 'border-t border-border pt-2')}>
          <FilterGroups
            groups={filterGroups}
            filters={filters}
            onFiltersChange={onFiltersChange}
            accordion={accordion}
            size={size}
            headingLevel={headingLevel}
            labels={labels}
          />
        </div>
      )}
    </div>
  )
}
