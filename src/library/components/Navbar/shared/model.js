/**
 * Pure helpers that turn the public props into the structures variants render.
 * Keeping this logic in one place is what keeps the variants consistent.
 */

const ACTION_LABELS = { account: 'Account', wishlist: 'Wishlist', cart: 'Cart' }

/** Cart / wishlist badge text: hidden at 0, capped at 99+. */
export function formatCount(count) {
  if (!count || count < 1) return null
  return count > 99 ? '99+' : String(count)
}

/** Ordered list of enabled actions, each with a ready-to-use accessible name. */
export function buildActions({ account, wishlist, cart }, icons) {
  const configs = { account, wishlist, cart }
  return Object.keys(ACTION_LABELS).flatMap((id) => {
    const config = configs[id]
    if (!config) return []
    const { label = ACTION_LABELS[id], href, onClick, count } = config === true ? {} : config
    const countText = formatCount(count)
    const noun = count === 1 ? 'item' : 'items'
    return [
      {
        id,
        label,
        // Screen readers hear "Cart, 3 items" rather than a bare number.
        accessibleLabel: countText ? `${label}, ${count} ${noun}` : label,
        href,
        onClick,
        count: countText,
        icon: icons[id],
      },
    ]
  })
}

/** `search` accepts an object, `true` (defaults) or nothing. Returns null when hidden. */
export function normalizeSearch(search) {
  if (!search) return null
  const config = search === true ? {} : search
  return { placeholder: 'Search products', label: 'Search', ...config }
}

/** Stable React key for a link-like object. */
export function itemKey(item) {
  return item.id ?? item.href ?? item.label
}
