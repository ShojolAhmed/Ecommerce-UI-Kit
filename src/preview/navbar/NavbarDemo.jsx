import { useMemo, useState } from 'react'
import { Button, Navbar } from '../../library/index.js'
import { sampleNavbar } from '../sampleData.js'

/** Placeholder page content so sticky and fixed behaviour is visible while scrolling. */
function FakePage() {
  return (
    <div className="space-y-4 p-6 pb-20 md:pb-6" aria-hidden="true">
      <div className="h-8 w-1/3 rounded bg-surface-sunken" />
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-24 rounded-surface bg-surface-muted" />
      ))}
    </div>
  )
}

/**
 * Renders one navbar variant with working sample state: the current link
 * follows clicks, the cart count can be bumped, and the last interaction is
 * echoed underneath.
 *
 * The frame uses `transform` so the navbar's fixed layers (drawer, bottom tab
 * bar) stay inside it instead of covering the whole page.
 */
export default function NavbarDemo({ variant }) {
  const [currentId, setCurrentId] = useState('new')
  const [cartCount, setCartCount] = useState(2)
  const [lastEvent, setLastEvent] = useState('Interact with the navbar to see events here.')

  const links = useMemo(
    () => sampleNavbar.links.map((link) => ({ ...link, current: link.id === currentId })),
    [currentId],
  )

  const handleNavigate = (item, event) => {
    event.preventDefault() // demo only: keep the page from jumping to the sample #hrefs
    if (item.id && item.id !== 'brand') setCurrentId(item.id)
    setLastEvent(`Navigate: ${item.label}`)
  }

  return (
    <div className="overflow-hidden rounded-surface border border-border">
      <div className="relative h-[34rem] transform-gpu overflow-hidden bg-background">
        <div className="h-full overflow-y-auto">
          <Navbar
            variant={variant}
            sticky
            navLabel={`Main (${variant})`}
            brand={sampleNavbar.brand}
            links={links}
            onNavigate={handleNavigate}
            search={{
              placeholder: 'Search products',
              onSubmit: (query) => setLastEvent(`Search: "${query}"`),
            }}
            account={{ onClick: () => setLastEvent('Open account') }}
            wishlist={{ count: 3, onClick: () => setLastEvent('Open wishlist') }}
            cart={{ count: cartCount, onClick: () => setLastEvent('Open cart') }}
          />
          <FakePage />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface px-4 py-2">
        <p role="status" className="font-mono text-xs text-foreground-muted">
          {lastEvent}
        </p>
        <Button size="sm" variant="outline" onClick={() => setCartCount((count) => count + 1)}>
          Add to cart (+1)
        </Button>
      </div>
    </div>
  )
}
