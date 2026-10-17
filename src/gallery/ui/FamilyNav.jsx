import { useState } from 'react'
import { cn } from '../../library/utils/cn.js'
import { categories, families } from '../registry/index.js'
import { galleryHash } from '../route.js'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring'

/** Browse by category, jump to a family, or filter the list by typing. */
export default function FamilyNav({ location }) {
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const matches = (family) =>
    !needle || [family.name, family.id, family.summary].some((text) => text.toLowerCase().includes(needle))

  const groups = categories
    .map((category) => ({ ...category, families: families.filter((family) => family.category === category.id && matches(family)) }))
    .filter((group) => group.families.length > 0)

  return (
    <nav aria-label="Components" className="space-y-5">
      <div>
        <label htmlFor="gallery-filter" className="sr-only">Filter components</label>
        <input
          id="gallery-filter"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter components"
          className={cn('w-full rounded-control border border-border bg-surface px-3 py-2 text-sm placeholder:text-foreground-subtle', focus)}
        />
      </div>

      {groups.length === 0 && <p role="status" className="text-sm text-foreground-muted">No component matches “{query}”.</p>}

      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`nav-${group.id}`}>
          <h2 id={`nav-${group.id}`} className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            {group.name}
          </h2>
          <ul className="space-y-0.5">
            {group.families.map((family) => {
              const current = family.id === location.familyId
              return (
                <li key={family.id}>
                  <a
                    href={galleryHash({ familyId: family.id, view: location.view, theme: location.theme })}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-control px-2 py-1.5 text-sm',
                      focus,
                      current ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-surface-muted',
                    )}
                  >
                    <span className="truncate">{family.name}</span>
                    <span className={cn('shrink-0 font-mono text-xs', current ? 'opacity-80' : 'text-foreground-muted')}>
                      {family.variants.length}
                      <span className="sr-only"> variants</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}
