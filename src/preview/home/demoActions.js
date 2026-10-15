import { useCallback, useState } from 'react'

/** Preview-only: stands in for an email service. Addresses starting with "fail" are rejected. */
export function fakeSubscribe({ email }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.toLowerCase().startsWith('fail')) reject(new Error('We could not reach the mailing list. Try again in a moment.'))
      else resolve()
    }, 700)
  })
}

/** Preview-only: last callback message for a status line. */
export function useDemoLog(initial = 'Interact with the component to see callbacks here.') {
  const [message, setMessage] = useState(initial)
  const log = useCallback((text) => setMessage(text), [])
  return [message, log]
}

/** Preview-only: fake wishlist and cart state for the product sections. */
export function useFakeShop() {
  const [wishlist, setWishlist] = useState([1001])
  const [adding, setAdding] = useState([])
  const [cartCount, setCartCount] = useState(0)

  const toggleWishlist = useCallback(
    (product) => setWishlist((ids) => (ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id])),
    [],
  )
  const addToCart = useCallback((product) => {
    setAdding((ids) => [...ids, product.id])
    setTimeout(() => {
      setAdding((ids) => ids.filter((id) => id !== product.id))
      setCartCount((count) => count + 1)
    }, 700)
  }, [])

  return { wishlist, adding, cartCount, toggleWishlist, addToCart }
}
