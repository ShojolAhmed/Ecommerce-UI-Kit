import { site } from '../config/site.js'

const formatter = new Intl.NumberFormat(site.locale, { style: 'currency', currency: site.currency })

/** Formats a major-unit amount (49.9) with the store's currency and locale. */
export const formatPrice = (amount) => formatter.format(amount)

/** Props every kit component that prints prices should receive, so formatting stays consistent. */
export const priceProps = { currency: site.currency, locale: site.locale }
