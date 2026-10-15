import { withSidebarLabels } from '../shared/labels.js'
import CategoryList from '../shared/CategoryList.jsx'

/**
 * Minimal sidebar: category navigation only, as quiet text with a rule on the
 * active row. It renders no filters, so `filterGroups`, `filters`,
 * `onFiltersChange` and `onClearAll` are ignored and it needs no clear-all.
 * Its landmark is the category <nav> itself (named by the "Categories" heading).
 *
 * @param {import('../types.js').SidebarProps} props
 */
export default function MinimalSidebar({
  categories = [],
  activeCategory,
  onCategoryChange,
  labels: labelsProp,
  headingLevel = 2,
  className,
}) {
  const labels = withSidebarLabels(labelsProp)

  return (
    <CategoryList
      categories={categories}
      activeCategory={activeCategory}
      onCategoryChange={onCategoryChange}
      labels={labels}
      appearance="plain"
      headingLevel={headingLevel}
      className={className}
    />
  )
}
