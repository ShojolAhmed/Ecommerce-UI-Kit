import { useContext } from 'react'
import { StoreContext } from './StoreContext.js'

/**
 * Cart and wishlist state, shared by every page.
 *
 * @typedef {object} Store
 * @property {import('ecom-ui-kit').CartItem[]} cartItems   Cart lines in the kit's CartItem shape (`id` is the product id; one line per product in this phase).
 * @property {number} cartCount                              Total units in the cart.
 * @property {(product: import('../data/products.js').ProductRecord, quantity?: number) => void} addToCart  Adds units, capped at `site.maxCartQuantity`. Ignores out-of-stock products.
 * @property {(productId: string, quantity: number) => void} setCartQuantity   Sets a line's quantity; 0 or less removes it.
 * @property {(productId: string) => void} removeFromCart
 * @property {() => void} clearCart
 * @property {string[]} wishlistIds
 * @property {number} wishlistCount
 * @property {(productId: string) => boolean} isWishlisted
 * @property {(product: import('../data/products.js').ProductRecord) => boolean} toggleWishlist  Returns true when the product is now wishlisted.
 *
 * @returns {Store}
 */
export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside <StoreProvider>.')
  return store
}
