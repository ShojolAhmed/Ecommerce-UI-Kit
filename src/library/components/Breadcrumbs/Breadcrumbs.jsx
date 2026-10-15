import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn.js'
import { focusRing } from '../../primitives/shared/styles.js'
import { ChevronRightIcon } from '../../icons/index.jsx'

const crumbClass = cn(
  'rounded-sm text-foreground-muted underline-offset-4 transition-colors hover:text-foreground hover:underline',
  focusRing,
)

const itemKey = (item) => item.id ?? item.href ?? item.label

/**
 * Breadcrumb trail: `<nav aria-label="Breadcrumb">` with an ordered list. The
 * last item is the current page (`aria-current="page"`, never a link).
 *
 * Items with `href` render as links, items without as buttons; both call
 * `onNavigate(item, event)`. With `href`, call `event.preventDefault()` to route client-side.
 *
 * Long trails: set `maxItems` to keep the first item and the last ones and fold the
 * rest behind a "…" button. Activating it reveals them all and moves focus to the first revealed one.
 *
 * @param {object} props
 * @param {{ id?: string|number, label: string, href?: string }[]} props.items  Root first, current page last.
 * @param {(item: object, event: React.MouseEvent) => void} [props.onNavigate]
 * @param {number} [props.maxItems]               Show at most this many items (minimum 2) before folding. Omit to show all.
 * @param {React.ReactNode} [props.separator]     Replaces the chevron. Rendered aria-hidden.
 * @param {string} [props.label='Breadcrumb']     Accessible name of the <nav>.
 * @param {string} [props.expandLabel='Show hidden breadcrumbs']
 * @param {string} [props.className]
 */
export default function Breadcrumbs({
  items = [],
  onNavigate,
  maxItems,
  separator,
  label = 'Breadcrumb',
  expandLabel = 'Show hidden breadcrumbs',
  className,
}) {
  const [expanded, setExpanded] = useState(false)
  const listRef = useRef(null)
  const focusRevealed = useRef(false)

  useEffect(() => {
    if (expanded && focusRevealed.current) {
      focusRevealed.current = false
      listRef.current?.querySelectorAll('a[href], button')[1]?.focus()
    }
  }, [expanded])

  const limit = maxItems === undefined ? Infinity : Math.max(2, maxItems)
  const fold = !expanded && items.length > limit
  // Keep the first item, fold the middle, keep the last (limit - 1) items.
  const tail = fold ? items.slice(items.length - (limit - 1)) : []
  const visible = fold ? [items[0], null, ...tail] : items

  return (
    <nav aria-label={label} className={className}>
      <ol ref={listRef} role="list" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {visible.map((item, index) => {
          const last = index === visible.length - 1
          return (
            <li key={item ? itemKey(item) : 'folded'} className="flex min-w-0 items-center gap-1.5">
              {item === null ? (
                <button
                  type="button"
                  aria-label={expandLabel}
                  onClick={() => {
                    focusRevealed.current = true
                    setExpanded(true)
                  }}
                  className={cn(crumbClass, 'px-1')}
                >
                  <span aria-hidden="true">…</span>
                </button>
              ) : last ? (
                <span aria-current="page" className="max-w-[16rem] truncate font-medium text-foreground">
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} onClick={(event) => onNavigate?.(item, event)} className={crumbClass}>
                  {item.label}
                </a>
              ) : (
                <button type="button" onClick={(event) => onNavigate?.(item, event)} className={crumbClass}>
                  {item.label}
                </button>
              )}
              {!last && (
                <span aria-hidden="true" className="flex shrink-0 text-foreground-subtle">
                  {separator ?? <ChevronRightIcon />}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
