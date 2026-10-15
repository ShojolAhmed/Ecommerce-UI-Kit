/**
 * Pure helpers for filter state and category trees. Nothing here touches React
 * or the DOM, so the page can use them in its own reducers, URL sync or tests.
 *
 * Filter state is one plain object keyed by filter group id:
 *   checkbox group -> array of selected option values   { brand: ['a', 'b'] }
 *   radio group    -> the selected option value         { rating: 4 }
 *   range group    -> { min?: number, max?: number }    { price: { min: 20, max: 100 } }
 * Empty values are never stored, so `{}` always means "no filters".
 * Every helper returns a new object and never mutates its input.
 */

/** Group `type` defaults to 'checkbox'. */
export const filterType = (group) => group?.type ?? 'checkbox'

/** Accepts a number or numeric string; anything else (including '') is `undefined`. */
export function parseNumber(value) {
  if (value === '' || value === null || value === undefined) return undefined
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) ? number : undefined
}

/** Coerce a stored value to the canonical shape for its group type, or `undefined` when empty. */
export function normalizeFilterValue(group, value) {
  switch (filterType(group)) {
    case 'radio':
      return value === undefined || value === null || value === '' ? undefined : value
    case 'range': {
      const min = parseNumber(value?.min)
      const max = parseNumber(value?.max)
      return min === undefined && max === undefined ? undefined : { min, max }
    }
    default:
      return Array.isArray(value) && value.length > 0 ? value : undefined
  }
}

/** Current (normalized) value of one group, or `undefined` when nothing is selected. */
export function getFilterValue(group, filters) {
  return normalizeFilterValue(group, filters?.[group.id])
}

/** Replace one group's value. Empty values remove the key. */
export function setFilterValue(filters, group, value) {
  const next = { ...filters }
  const normalized = normalizeFilterValue(group, value)
  if (normalized === undefined) delete next[group.id]
  else next[group.id] = normalized
  return next
}

/** Checkbox: add or remove `optionValue`. Radio: select it (radios cannot be unchecked). */
export function toggleFilterOption(filters, group, optionValue) {
  if (filterType(group) === 'radio') return setFilterValue(filters, group, optionValue)
  const current = getFilterValue(group, filters) ?? []
  const next = current.includes(optionValue)
    ? current.filter((value) => value !== optionValue)
    : [...current, optionValue]
  return setFilterValue(filters, group, next)
}

/** Remove one group from the filter state. */
export function clearFilterGroup(filters, groupId) {
  const next = { ...filters }
  delete next[groupId]
  return next
}

/** Format a range bound. Uses `group.format`, else `group.currency`, else a plain number. */
export function formatFilterNumber(group, amount) {
  if (typeof group.format === 'function') return group.format(amount)
  const options = group.currency
    ? { style: 'currency', currency: group.currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }
    : { maximumFractionDigits: 2 }
  return new Intl.NumberFormat(undefined, options).format(amount)
}

const defaultRangeLabels = {
  from: (amount) => `From ${amount}`,
  upTo: (amount) => `Up to ${amount}`,
}

/** "$20 – $100", "From $20" or "Up to $100". */
export function formatFilterRange(group, value, rangeLabels) {
  const { from, upTo } = { ...defaultRangeLabels, ...rangeLabels }
  const { min, max } = value
  if (min !== undefined && max !== undefined) {
    return `${formatFilterNumber(group, min)} – ${formatFilterNumber(group, max)}`
  }
  return min !== undefined
    ? from(formatFilterNumber(group, min))
    : upTo(formatFilterNumber(group, max))
}

/**
 * One chip per selected option (checkbox / radio) and one per range.
 * Selected values that match no option are ignored, so stale state never shows a nameless chip.
 *
 * @returns {{ id: string, groupId: string, groupLabel: string, type: string, optionValue?: any, label: string }[]}
 */
export function getActiveFilterChips(groups = [], filters = {}, { rangeLabels } = {}) {
  return groups.flatMap((group) => {
    const value = getFilterValue(group, filters)
    if (value === undefined) return []

    const type = filterType(group)
    const base = { groupId: group.id, groupLabel: group.label, type }

    if (type === 'range') {
      return [{ ...base, id: `${group.id}:range`, label: formatFilterRange(group, value, rangeLabels) }]
    }

    const selected = type === 'radio' ? [value] : value
    return (group.options ?? [])
      .filter((option) => selected.includes(option.value))
      .map((option) => ({
        ...base,
        id: `${group.id}:${String(option.value)}`,
        optionValue: option.value,
        label: option.label,
      }))
  })
}

/** Number of chips `getActiveFilterChips` would return. */
export function countActiveFilters(groups, filters) {
  return getActiveFilterChips(groups, filters).length
}

/** Filter state without the option, or the whole group, that a chip stands for. */
export function removeFilterChip(filters, chip) {
  const next = { ...filters }
  if (chip.type === 'checkbox') {
    const remaining = (next[chip.groupId] ?? []).filter((value) => value !== chip.optionValue)
    if (remaining.length > 0) next[chip.groupId] = remaining
    else delete next[chip.groupId]
  } else {
    delete next[chip.groupId]
  }
  return next
}

/** Ids from the top-level category down to `id` (inclusive), or `[]` when `id` is not in the tree. */
export function getCategoryPath(categories, id) {
  for (const category of categories ?? []) {
    if (category.id === id) return [category.id]
    const below = getCategoryPath(category.children, id)
    if (below.length > 0) return [category.id, ...below]
  }
  return []
}
