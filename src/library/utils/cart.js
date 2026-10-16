/**
 * Pure cart helpers (no React, no state, no I/O). The cart components only display what you
 * pass in; use these in your own state logic to keep quantities valid and totals consistent.
 * Amounts are numbers in major units (`49.9` = $49.90), as everywhere else in the library.
 *
 * @typedef {object} CartItem
 * @property {string|number} id           Required. Unique per cart line (not per product, if one product can appear twice with different options).
 * @property {string} name                Required.
 * @property {number} price               Required. Unit price.
 * @property {number} quantity            Required. Current quantity.
 * @property {number} [originalPrice]     Unit price before a discount. Shown struck through when higher than `price`.
 * @property {string} [image]
 * @property {string} [imageAlt]          Images are decorative by default because the name sits beside them.
 * @property {string} [href]              Makes the name a link.
 * @property {{ label: string, value: string }[]} [options]   Chosen variant, e.g. `[{ label: 'Size', value: 'M' }]`.
 * @property {number} [minQuantity=1]
 * @property {number} [maxQuantity]       Stock or per-order limit. Omit for no limit.
 * @property {boolean} [inStock=true]     `false` locks the quantity and flags the line as unavailable.
 */

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value)

/** `true` for an entry the cart components can render (has an id, a name and a finite price). */
export function isValidCartItem(item) {
  return Boolean(item) && item.id != null && Boolean(item.name) && isFiniteNumber(item.price)
}

/** Lowest allowed quantity of a line (a whole number, default 1). */
export function getMinQuantity(item) {
  return isFiniteNumber(item?.minQuantity) ? Math.max(0, Math.floor(item.minQuantity)) : 1
}

/** Highest allowed quantity of a line, or `Infinity` when there is no limit. */
export function getMaxQuantity(item) {
  return isFiniteNumber(item?.maxQuantity) ? Math.max(0, Math.floor(item.maxQuantity)) : Infinity
}

/**
 * Forces a quantity into `[min, max]` as a whole number. Anything that is not a number falls
 * back to `min`. When `max` is lower than `min` (a sold-out line), `max` wins.
 */
export function clampQuantity(quantity, { min = 1, max = Infinity } = {}) {
  const number = typeof quantity === 'string' ? Number.parseInt(quantity, 10) : quantity
  const whole = isFiniteNumber(number) ? Math.floor(number) : min
  return Math.min(Math.max(whole, min), max)
}

/** Unit price times quantity. Quantities that are not finite count as 0. */
export function getLineTotal(item) {
  if (!isValidCartItem(item) || !isFiniteNumber(item.quantity)) return 0
  return roundMoney(item.price * item.quantity)
}

/** What the customer saves on a line through `originalPrice`, or 0. */
export function getLineSavings(item) {
  if (!isValidCartItem(item) || !isFiniteNumber(item.originalPrice) || !isFiniteNumber(item.quantity)) return 0
  return item.originalPrice > item.price ? roundMoney((item.originalPrice - item.price) * item.quantity) : 0
}

/** Total number of units in the cart. */
export function getItemCount(items = []) {
  return items.filter(isValidCartItem).reduce((sum, item) => sum + (isFiniteNumber(item.quantity) ? item.quantity : 0), 0)
}

/**
 * Totals for a list of lines. `discount`, `shipping` and `tax` are decided by your own rules and
 * passed in as plain numbers; this only adds them up (`total` never drops below 0).
 *
 * @param {{ items: CartItem[], discount?: number, shipping?: number, tax?: number }} input
 */
export function getCartTotals({ items = [], discount = 0, shipping = 0, tax = 0 } = {}) {
  const lines = items.filter(isValidCartItem)
  const subtotal = roundMoney(lines.reduce((sum, item) => sum + getLineTotal(item), 0))
  const savings = roundMoney(lines.reduce((sum, item) => sum + getLineSavings(item), 0))
  const safe = (amount) => (isFiniteNumber(amount) ? amount : 0)
  const total = Math.max(0, roundMoney(subtotal - safe(discount) + safe(shipping) + safe(tax)))
  return { itemCount: getItemCount(lines), subtotal, savings, discount: safe(discount), shipping: safe(shipping), tax: safe(tax), total }
}

/** Avoids 0.1 + 0.2 style drift when adding prices. */
function roundMoney(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}
