import { formatPrice } from '../ProductCard/shared/model.js'

/**
 * One price formatter for the cart components, so rows, summary and drawer always agree.
 * Uses `Intl.NumberFormat` through the same helper as the product cards, unless the page passes
 * its own `formatPrice(amount, context)`.
 *
 * @param {{ currency?: string, locale?: string, formatPrice?: (amount: number, context?: any) => string }} options
 * @returns {(amount: number, context?: any) => string}
 */
export function createMoneyFormatter({ currency = 'USD', locale, formatPrice: custom } = {}) {
  return (amount, context) => {
    if (typeof custom === 'function') return custom(amount, context)
    return formatPrice(amount, { currency, locale }) ?? ''
  }
}
