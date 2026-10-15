import { useState } from 'react'

/**
 * Preview-only state for the discovery demos. It stands in for what a real
 * store would own (usually its router / URL query): the library components just
 * receive these values and callbacks. Nothing is persisted or sent anywhere.
 */
export function useDiscoveryState({ initialFilters = {} } = {}) {
  const [category, setCategory] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [lastEvent, setLastEvent] = useState('Interact with a control to see events here.')

  const clearAll = () => {
    setFilters({})
    setLastEvent('Clear all filters')
  }

  return {
    category,
    filters,
    query,
    sort,
    lastEvent,
    setLastEvent,
    setQuery,
    clearAll,
    handlers: {
      onCategoryChange: (id, _category, event) => {
        event?.preventDefault() // demo only: keep the page from jumping to the sample #hrefs
        setCategory(id)
        setLastEvent(`Category: ${id ?? 'all'}`)
      },
      onFiltersChange: (next) => {
        setFilters(next)
        setLastEvent(`Filters: ${JSON.stringify(next)}`)
      },
      onClearAll: clearAll,
      onSortChange: (value) => {
        setSort(value)
        setLastEvent(`Sort: ${value}`)
      },
    },
  }
}
