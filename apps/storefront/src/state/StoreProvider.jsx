import { useCallback, useEffect, useMemo, useState } from 'react'
import { getItemCount } from 'ecom-ui-kit'
import { site } from '../config/site.js'
import { getProductById } from '../data/catalog.js'
import { StoreContext } from './StoreContext.js'

// Bump the version when the stored shape changes; old data is then ignored instead of misread.
const STORAGE_KEY = 'fieldhouse.store.v1'

const isLine = (line) =>
  Boolean(line) && typeof line.productId === 'string' && Number.isInteger(line.quantity) && line.quantity > 0

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    return {
      cart: Array.isArray(saved?.cart) ? saved.cart.filter(isLine) : [],
      wishlist: Array.isArray(saved?.wishlist) ? saved.wishlist.filter((id) => typeof id === 'string') : [],
    }
  } catch {
    return { cart: [], wishlist: [] } // storage blocked or corrupt: start empty
  }
}

const clamp = (quantity) => Math.min(Math.max(Math.floor(quantity), 0), site.maxCartQuantity)

/** Holds the cart (productId + quantity) and the wishlist (product ids) and saves them to localStorage. */
export default function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage full or blocked: the in-memory state keeps working.
    }
  }, [state])

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || product.inStock === false) return
    setState((current) => {
      const existing = current.cart.find((line) => line.productId === product.id)
      const next = clamp((existing?.quantity ?? 0) + quantity)
      const cart = existing
        ? current.cart.map((line) => (line.productId === product.id ? { ...line, quantity: next } : line))
        : [...current.cart, { productId: product.id, quantity: next }]
      return { ...current, cart }
    })
  }, [])

  const setCartQuantity = useCallback((productId, quantity) => {
    setState((current) => {
      const next = clamp(quantity)
      const cart =
        next === 0
          ? current.cart.filter((line) => line.productId !== productId)
          : current.cart.map((line) => (line.productId === productId ? { ...line, quantity: next } : line))
      return { ...current, cart }
    })
  }, [])

  const removeFromCart = useCallback((productId) => setCartQuantity(productId, 0), [setCartQuantity])
  const clearCart = useCallback(() => setState((current) => ({ ...current, cart: [] })), [])

  const toggleWishlist = useCallback(
    (product) => {
      const adding = !state.wishlist.includes(product.id)
      setState((current) => ({
        ...current,
        wishlist: current.wishlist.includes(product.id)
          ? current.wishlist.filter((id) => id !== product.id)
          : [...current.wishlist, product.id],
      }))
      return adding
    },
    [state.wishlist],
  )

  const value = useMemo(() => {
    // Lines whose product no longer exists in the catalog are dropped from the derived view.
    const cartItems = state.cart.flatMap(({ productId, quantity }) => {
      const product = getProductById(productId)
      if (!product) return []
      return [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          href: product.href,
          quantity,
          maxQuantity: site.maxCartQuantity,
          inStock: product.inStock,
        },
      ]
    })
    return {
      cartItems,
      cartCount: getItemCount(cartItems),
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
      wishlistIds: state.wishlist,
      wishlistCount: state.wishlist.length,
      isWishlisted: (productId) => state.wishlist.includes(productId),
      toggleWishlist,
    }
  }, [state, addToCart, setCartQuantity, removeFromCart, clearCart, toggleWishlist])

  return <StoreContext value={value}>{children}</StoreContext>
}
