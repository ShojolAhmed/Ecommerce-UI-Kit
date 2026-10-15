import { useState } from 'react'
import {
  ActiveFilters,
  Breadcrumbs,
  Button,
  SearchInput,
  SortDropdown,
} from '../../library/index.js'
import { sampleFilterGroups, sampleSortOptions } from '../sampleDiscovery.js'
import EventLog from './EventLog.jsx'

const initialFilters = {
  brand: ['Northwind', 'Hearth & Co.'],
  price: { min: 20, max: 150 },
  rating: 4,
}

export function SearchInputDemo({ mode }) {
  const [value, setValue] = useState('')
  const [lastEvent, setLastEvent] = useState('Type, then press Enter. Escape clears.')

  const field = (props) => (
    <SearchInput
      value={value}
      onChange={(next) => setValue(next)}
      onSubmit={(query) => setLastEvent(`Submit: "${query}"`)}
      onClear={() => setLastEvent('Clear')}
      {...props}
    />
  )

  return (
    <div className="max-w-md space-y-3">
      {mode === 'sizes' ? (
        <div className="space-y-3">
          {field({ size: 'sm', label: 'Search (small)', placeholder: 'Small' })}
          {field({ size: 'md', label: 'Search (medium)', placeholder: 'Medium' })}
          {field({ size: 'lg', label: 'Search (large)', placeholder: 'Large' })}
        </div>
      ) : (
        field(mode === 'pill' ? { shape: 'pill', label: 'Search (pill)' } : {})
      )}
      <EventLog lastEvent={lastEvent} state={{ value }} />
    </div>
  )
}

export function SortDropdownDemo({ mode }) {
  const [value, setValue] = useState('featured')
  const [lastEvent, setLastEvent] = useState('Open it and use the arrow keys, Home / End, or type a letter.')

  return (
    <div className="space-y-3">
      <SortDropdown
        native={mode === 'native'}
        label={mode === 'native' ? 'Sort by (native)' : 'Sort by'}
        options={sampleSortOptions}
        value={value}
        onChange={(next) => {
          setValue(next)
          setLastEvent(`Sort: ${next}`)
        }}
      />
      <EventLog lastEvent={lastEvent} state={{ sort: value }} />
    </div>
  )
}

const trail = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'shop', label: 'Shop', href: '#shop' },
  { id: 'clothing', label: 'Clothing', href: '#clothing' },
  { id: 'knitwear', label: 'Knitwear', href: '#knitwear' },
  { id: 'sweaters', label: 'Sweaters', href: '#sweaters' },
  { id: 'merino', label: 'Merino Crewneck Sweater', href: '#merino' },
]

export function BreadcrumbsDemo({ mode }) {
  const [lastEvent, setLastEvent] = useState('Activate a breadcrumb to see events here.')
  const handleNavigate = (item, event) => {
    event.preventDefault() // demo only: keep the page from jumping to the sample #hrefs
    setLastEvent(`Navigate: ${item.label}`)
  }

  const props = {
    default: { items: trail.slice(0, 4) },
    collapsed: { items: trail, maxItems: 3 },
    'custom-separator': { items: trail.slice(0, 4), separator: '/' },
  }[mode]

  return (
    <div className="space-y-3">
      <Breadcrumbs {...props} label={`Breadcrumb (${mode})`} onNavigate={handleNavigate} />
      <EventLog lastEvent={lastEvent} />
    </div>
  )
}

export function ActiveFiltersDemo({ mode }) {
  const [filters, setFilters] = useState(initialFilters)
  const [query, setQuery] = useState('sweater')
  const [lastEvent, setLastEvent] = useState('Remove a chip, or clear all.')
  const withSearch = mode === 'with-search'

  const reset = () => {
    setFilters(initialFilters)
    setQuery('sweater')
    setLastEvent('Reset demo data')
  }

  return (
    <div className="space-y-3">
      <ActiveFilters
        filterGroups={sampleFilterGroups}
        filters={filters}
        onFiltersChange={(next) => {
          setFilters(next)
          setLastEvent(`Filters: ${JSON.stringify(next)}`)
        }}
        extraChips={
          withSearch && query
            ? [{ id: 'query', label: `Search: “${query}”`, onRemove: () => { setQuery(''); setLastEvent('Search cleared') } }]
            : []
        }
      />
      <div>
        <Button size="sm" variant="outline" onClick={reset}>
          Reset demo filters
        </Button>
      </div>
      <EventLog lastEvent={lastEvent} state={withSearch ? { filters, query } : { filters }} />
    </div>
  )
}
