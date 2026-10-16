import { useCallback, useReducer } from 'react'
import { clampQuantity, getCartTotals, getMaxQuantity, getMinQuantity } from '../../library/index.js'
import { toCartItem } from './sampleCart.js'

/**
 * Preview-only cart logic. This is the "business logic" the UI components deliberately do not
 * contain: how quantities change, what shipping costs, when checkout is blocked. A real store
 * would replace it with its own state and API calls; the components would not change.
 */

export function cartReducer(items, action) {
  switch (action.type) {
    case 'set-quantity':
      return items.map((item) =>
        item.id === action.id
          ? { ...item, quantity: clampQuantity(action.quantity, { min: getMinQuantity(item), max: getMaxQuantity(item) }) }
          : item,
      )
    case 'remove':
      return items.filter((item) => item.id !== action.id)
    case 'restore': {
      if (items.some((item) => item.id === action.item.id)) return items
      const next = [...items]
      next.splice(Math.min(action.index, next.length), 0, action.item)
      return next
    }
    case 'add': {
      const line = toCartItem(action.product)
      return items.some((item) => item.id === line.id)
        ? items.map((item) =>
            item.id === line.id ? { ...item, quantity: clampQuantity(item.quantity + 1, { min: 1, max: getMaxQuantity(item) }) } : item,
          )
        : [...items, line]
    }
    case 'clear':
      return []
    default:
      return items
  }
}

export function useCartDemo(initialItems) {
  const [items, dispatch] = useReducer(cartReducer, initialItems)
  return {
    items,
    setQuantity: useCallback((id, quantity) => dispatch({ type: 'set-quantity', id, quantity }), []),
    remove: useCallback((id) => dispatch({ type: 'remove', id }), []),
    restore: useCallback((item, index) => dispatch({ type: 'restore', item, index }), []),
    add: useCallback((product) => dispatch({ type: 'add', product }), []),
    clear: useCallback(() => dispatch({ type: 'clear' }), []),
  }
}

const FREE_SHIPPING_FROM = 100
const FLAT_SHIPPING = 8

/** Demo pricing rules: flat shipping under 100, free from 100, tax left for checkout. */
export function getDemoSummary(items) {
  const { subtotal, itemCount } = getCartTotals({ items })
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : FLAT_SHIPPING

  const unavailable = items.filter((item) => item.inStock === false)
  const overStock = items.filter((item) => item.inStock !== false && item.quantity > getMaxQuantity(item))
  let checkoutDisabledReason
  if (unavailable.length > 0) checkoutDisabledReason = 'Remove the unavailable item to check out.'
  else if (overStock.length > 0) checkoutDisabledReason = 'Lower the quantity of the highlighted item to check out.'

  return {
    subtotal,
    itemCount,
    shipping,
    tax: null,
    checkoutDisabled: Boolean(checkoutDisabledReason),
    checkoutDisabledReason,
    freeShippingRemaining: Math.max(0, FREE_SHIPPING_FROM - subtotal),
  }
}
