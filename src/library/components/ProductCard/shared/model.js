/**
 * Pure helpers that turn the public props into the structure every variant
 * renders. All data validation and formatting lives here (not in the JSX), so
 * a missing price, rating or image behaves the same in every design.
 */

export const DEFAULT_LABELS = {
  addToCart: 'Add to cart',
  outOfStock: 'Out of stock',
  wishlist: 'Add to wishlist',
  currentPrice: 'Current price',
  originalPrice: 'Original price',
  off: (percent) => `${percent}% off`,
  save: (amountText) => `Save ${amountText}`,
  rating: (rating) => `Rated ${rating} out of 5`,
  reviews: (count) => (count === 1 ? '1 review' : `${count.toLocaleString()} reviews`),
}

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value)

/* ------------------------------------------------------------------ */
/* Price                                                               */
/* ------------------------------------------------------------------ */

// Intl formatters are comparatively expensive to build; a grid would build one per card.
const formatterCache = new Map()

function getCurrencyFormatter(locale, currency) {
  const key = `${locale ?? ''}|${currency}`
  if (!formatterCache.has(key)) {
    let formatter = null
    try {
      formatter = new Intl.NumberFormat(locale, { style: 'currency', currency })
    } catch {
      formatter = null // unknown currency code or locale tag
    }
    formatterCache.set(key, formatter)
  }
  return formatterCache.get(key)
}

/** Formats an amount as currency. Returns null when the amount is not a finite number. */
export function formatPrice(amount, { currency = 'USD', locale } = {}) {
  if (!isFiniteNumber(amount)) return null
  const formatter = getCurrencyFormatter(locale, currency)
  return formatter ? formatter.format(amount) : `${currency} ${amount.toFixed(2)}`
}

/**
 * Discount between the original and the current price, or null when there is
 * no real discount (no original price, not higher than the price, or under 1%).
 */
export function getDiscount(price, originalPrice) {
  if (!isFiniteNumber(price) || !isFiniteNumber(originalPrice)) return null
  if (price < 0 || originalPrice <= price) return null
  const percent = Math.round((1 - price / originalPrice) * 100)
  if (percent < 1) return null
  return { percent, amount: originalPrice - price }
}

/* ------------------------------------------------------------------ */
/* Rating, reviews, badges                                             */
/* ------------------------------------------------------------------ */

/** Clamps to 0–5. Anything that is not a finite number is treated as "no rating". */
export function normalizeRating(rating) {
  if (!isFiniteNumber(rating)) return null
  return Math.min(5, Math.max(0, rating))
}

/** A whole, non-negative review count, or null. */
export function normalizeReviewCount(count) {
  if (!isFiniteNumber(count) || count < 0) return null
  return Math.floor(count)
}

/** Compact visible count: 312, 1.2K, 4.5K. The exact number is announced by `labels.reviews`. */
export function formatReviewCount(count, locale) {
  if (count < 1000) return String(count)
  try {
    return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(count)
  } catch {
    return String(count)
  }
}

/** Accepts strings or `{ label, variant }`; drops empty ones. */
export function normalizeBadges(badges) {
  if (!Array.isArray(badges)) return []
  return badges.flatMap((badge) => {
    const item = typeof badge === 'string' ? { label: badge } : badge
    const label = typeof item?.label === 'string' ? item.label.trim() : ''
    return label ? [{ label, variant: item.variant ?? 'neutral' }] : []
  })
}

/** Stars are drawn to the nearest half; returns the filled share of the row (0–100). */
export function ratingFillPercent(rating) {
  return (Math.round(rating * 2) / 2 / 5) * 100
}

/* ------------------------------------------------------------------ */
/* Whole-card model                                                    */
/* ------------------------------------------------------------------ */

function resolveHeadingLevel(level) {
  return Number.isInteger(level) && level >= 1 && level <= 6 ? level : 3
}

/**
 * Everything a variant needs to render, derived from `ProductCardProps`.
 * Event handlers are pre-bound to the product, or null when the matching
 * callback was not provided (the control is then not rendered at all).
 *
 * @param {import('../types.js').ProductCardProps} props
 */
export function buildProductCardModel(props) {
  const {
    product,
    isWishlisted = false,
    addingToCart = false,
    onAddToCart,
    onToggleWishlist,
    onProductClick,
    currency = 'USD',
    locale,
    formatPrice: customFormat,
    labels: labelOverrides,
    headingLevel,
  } = props

  const labels = { ...DEFAULT_LABELS, ...labelOverrides }
  const format = (amount) =>
    typeof customFormat === 'function' ? customFormat(amount, product) : formatPrice(amount, { currency, locale })

  const discount = getDiscount(product.price, product.originalPrice)
  const rating = normalizeRating(product.rating)
  const reviewCount = normalizeReviewCount(product.reviewCount)
  const hasStars = rating !== null && rating > 0
  const hasReviews = reviewCount !== null && reviewCount > 0
  const href = typeof product.href === 'string' && product.href ? product.href : undefined

  const bind = (callback) => (callback ? (event) => callback(product, event) : null)

  return {
    product,
    name: product.name,
    brand: product.brand || null,
    description: product.description || null,
    href,
    headingLevel: resolveHeadingLevel(headingLevel),
    labels,

    image: { src: product.image || null, alt: product.imageAlt || '' },

    price: {
      text: format(product.price),
      // Only shown alongside a real discount, so a stale originalPrice never confuses shoppers.
      originalText: discount ? format(product.originalPrice) : null,
      discount: discount && {
        percent: discount.percent,
        percentText: `-${discount.percent}%`,
        amountText: format(discount.amount),
      },
    },

    rating:
      hasStars || hasReviews
        ? {
            value: hasStars ? rating : null,
            percent: hasStars ? ratingFillPercent(rating) : 0,
            label: hasStars ? labels.rating(Math.round(rating * 10) / 10) : null,
            countText: hasReviews ? formatReviewCount(reviewCount, locale) : null,
            countLabel: hasReviews ? labels.reviews(reviewCount) : null,
          }
        : null,

    badges: normalizeBadges(product.badges),
    inStock: product.inStock !== false,
    isWishlisted,
    addingToCart,

    actions: {
      addToCart: bind(onAddToCart),
      toggleWishlist: bind(onToggleWishlist),
      click: bind(onProductClick),
    },
  }
}
