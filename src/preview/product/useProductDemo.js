import { useEffect, useRef, useState } from 'react'

/**
 * Preview-only state for the product demos. It stands in for what a real
 * store would own (wishlist, cart, routing): the library components just
 * receive ids and callbacks. Nothing here is persisted or sent anywhere.
 */
export function useProductDemo({ initialWishlist = [] } = {}) {
  const [wishlistedIds, setWishlistedIds] = useState(() => new Set(initialWishlist))
  const [addingIds, setAddingIds] = useState(() => new Set())
  const [cartCount, setCartCount] = useState(0)
  const [lastEvent, setLastEvent] = useState('Interact with a product to see events here.')
  const timers = useRef(new Set())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const onAddToCart = (product) => {
    setLastEvent(`Add to cart: ${product.name}`)
    setAddingIds((current) => new Set(current).add(product.id))
    // Fake latency so the busy state is visible. A real store would await its cart API here.
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      setAddingIds((current) => {
        const next = new Set(current)
        next.delete(product.id)
        return next
      })
      setCartCount((count) => count + 1)
    }, 700)
    timers.current.add(timer)
  }

  const onToggleWishlist = (product) => {
    const adding = !wishlistedIds.has(product.id)
    setLastEvent(`${adding ? 'Add to' : 'Remove from'} wishlist: ${product.name}`)
    setWishlistedIds((current) => {
      const next = new Set(current)
      if (adding) next.add(product.id)
      else next.delete(product.id)
      return next
    })
  }

  const onProductClick = (product, event) => {
    event.preventDefault() // demo only: keep the page from jumping to the sample #hrefs
    setLastEvent(`Open product: ${product.name}`)
  }

  return {
    wishlistedIds,
    addingIds,
    cartCount,
    lastEvent,
    handlers: { onAddToCart, onToggleWishlist, onProductClick },
  }
}
