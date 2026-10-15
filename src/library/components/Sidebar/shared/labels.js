/**
 * Every visible or announced string of the sidebars and the filter drawer, so
 * stores can localise them. Override any of them through the `labels` prop.
 */
export const defaultSidebarLabels = {
  filters: 'Filters',
  categories: 'Categories',
  /** Text of the "everything" row at the top of the category list. Set to `null` to hide the row. */
  allCategories: 'All products',
  clearAll: 'Clear all',
  clear: 'Clear',
  clearGroup: (groupLabel) => `Clear ${groupLabel} filter`,
  min: 'Min',
  max: 'Max',
  showMore: 'Show more',
  showLess: 'Show less',
  /** Screen-reader text after a product count, e.g. "Knitwear, 12 items". */
  itemCount: (count) => `${count} ${count === 1 ? 'item' : 'items'}`,
  expandFilters: 'Expand filters',
  collapseFilters: 'Collapse filters',
  activeCount: (count) => `${count} active`,
}

export const withSidebarLabels = (labels) => ({ ...defaultSidebarLabels, ...labels })
