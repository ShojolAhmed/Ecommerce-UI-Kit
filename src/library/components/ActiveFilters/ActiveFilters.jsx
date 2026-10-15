import { useEffect, useRef } from 'react'
import { cn } from '../../utils/cn.js'
import { focusRing } from '../../primitives/shared/styles.js'
import { Button } from '../../primitives/index.js'
import { CloseIcon } from '../../icons/index.jsx'
import { getActiveFilterChips, removeFilterChip } from '../../utils/discovery.js'

const defaultLabels = {
  list: 'Active filters',
  clearAll: 'Clear all',
  remove: (chipText) => `Remove filter: ${chipText}`,
  status: (count) => (count === 0 ? 'No filters applied' : `${count} ${count === 1 ? 'filter' : 'filters'} applied`),
  rangeFrom: (amount) => `From ${amount}`,
  rangeUpTo: (amount) => `Up to ${amount}`,
}

/**
 * Removable chips for the filters that are currently applied, plus "Clear all".
 * Controlled: removing a chip calls `onFiltersChange` with the next filter object.
 *
 * Chips come from the same `filterGroups` + `filters` the sidebar uses. Anything
 * else the page wants as a chip (search text, a category) goes in `extraChips`.
 * With no chips the component renders nothing visible (and takes no layout space).
 *
 * Accessibility: each remove button is named "Remove filter: Brand: Northwind";
 * a polite status line announces "2 filters applied"; after a removal focus moves
 * to the neighbouring chip, or to the status line when none is left, so keyboard
 * users never lose their place.
 *
 * @param {object} props
 * @param {import('../Sidebar/types.js').FilterGroup[]} [props.filterGroups=[]]
 * @param {import('../Sidebar/types.js').FilterState} [props.filters={}]
 * @param {(next: object) => void} [props.onFiltersChange]
 * @param {() => void} [props.onClearAll]   Defaults to `onFiltersChange({})` and removing every extra chip.
 * @param {{ id: string, label: string, onRemove: () => void }[]} [props.extraChips=[]]  Shown before the filter chips.
 * @param {boolean} [props.showGroupLabel=true]  "Brand: Northwind" instead of just "Northwind".
 * @param {object} [props.labels]   `list`, `clearAll`, `remove(chipText)`, `status(count)`, `rangeFrom(amount)`, `rangeUpTo(amount)`.
 * @param {string} [props.className]
 */
export default function ActiveFilters({
  filterGroups = [],
  filters = {},
  onFiltersChange,
  onClearAll,
  extraChips = [],
  showGroupLabel = true,
  labels: labelsProp,
  className,
}) {
  const labels = { ...defaultLabels, ...labelsProp }
  const listRef = useRef(null)
  const statusRef = useRef(null)
  const pendingFocus = useRef(null)

  const chips = [
    ...extraChips.map((chip) => ({ ...chip, extra: true })),
    ...getActiveFilterChips(filterGroups, filters, {
      rangeLabels: { from: labels.rangeFrom, upTo: labels.rangeUpTo },
    }),
  ]
  const chipKey = chips.map((chip) => chip.id).join('|')

  // Restore focus once the chips have re-rendered without the removed one.
  useEffect(() => {
    const pending = pendingFocus.current
    if (!pending || pending.key === chipKey) return
    pendingFocus.current = null
    const buttons = listRef.current?.querySelectorAll('[data-chip-remove]') ?? []
    const target = buttons[Math.min(pending.index, buttons.length - 1)] ?? statusRef.current
    target?.focus()
  }, [chipKey])

  const remove = (chip, index) => {
    pendingFocus.current = { index, key: chipKey }
    if (chip.extra) chip.onRemove?.()
    else onFiltersChange?.(removeFilterChip(filters, chip))
  }

  const clearAll = () => {
    pendingFocus.current = { index: 0, key: chipKey }
    if (onClearAll) {
      onClearAll()
      return
    }
    onFiltersChange?.({})
    extraChips.forEach((chip) => chip.onRemove?.())
  }

  const text = (chip) => (!chip.extra && showGroupLabel ? `${chip.groupLabel}: ${chip.label}` : chip.label)

  return (
    // `display: contents` when empty: no box, so no stray gap in a parent's flex/grid/space-y layout.
    <div className={chips.length > 0 ? className : 'contents'}>
      <p ref={statusRef} role="status" tabIndex={-1} className="sr-only">
        {labels.status(chips.length)}
      </p>
      {chips.length > 0 && (
        <ul ref={listRef} role="list" aria-label={labels.list} className="flex flex-wrap items-center gap-2">
          {chips.map((chip, index) => (
            <li
              key={chip.id}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-surface-muted pl-3 pr-1 text-sm text-foreground"
            >
              <span>
                {!chip.extra && showGroupLabel && <span className="text-foreground-muted">{chip.groupLabel}: </span>}
                {chip.label}
              </span>
              <button
                type="button"
                data-chip-remove=""
                aria-label={labels.remove(text(chip))}
                onClick={() => remove(chip, index)}
                className={cn(
                  'inline-flex size-6 items-center justify-center rounded-full text-foreground-muted transition-colors',
                  'hover:bg-surface-sunken hover:text-foreground',
                  focusRing,
                )}
              >
                <CloseIcon className="size-3.5" />
              </button>
            </li>
          ))}
          <li>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              {labels.clearAll}
            </Button>
          </li>
        </ul>
      )}
    </div>
  )
}
