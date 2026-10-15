import { useMemo } from 'react'
import { countActiveFilters } from '../../../utils/discovery.js'

/**
 * Active-filter count and the clear-all action shared by the sidebars and the drawer.
 * Without `onClearAll`, "clear all" asks the page for an empty filter object.
 */
export function useFilterSummary({ filterGroups, filters, onFiltersChange, onClearAll }) {
  const activeCount = useMemo(() => countActiveFilters(filterGroups, filters), [filterGroups, filters])

  const clearAll = () => {
    if (onClearAll) onClearAll()
    else onFiltersChange?.({})
  }

  return { activeCount, clearAll }
}
