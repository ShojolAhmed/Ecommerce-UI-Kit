import { useId, useRef } from 'react'
import { cn } from '../../utils/cn.js'
import { useControllableState } from '../../hooks/useControllableState.js'

const slug = (value) => String(value).replace(/\s+/g, '-')
const isValid = (item) => Boolean(item) && item.id != null && Boolean(item.label)

// Tabs sit in a scrolling row, which would clip an outset focus ring, so the ring is drawn inside.
const tabFocus = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring'

const listStyles = {
  underline: { horizontal: 'border-b border-border gap-1', vertical: 'border-s border-border gap-1' },
  pills: { horizontal: 'gap-1', vertical: 'gap-1' },
}

const tabStyles = {
  underline: {
    base: 'text-foreground-muted hover:text-foreground',
    selected: 'text-foreground',
    horizontal: 'border-b-2 -mb-px px-3 py-2.5',
    vertical: 'border-s-2 -ms-px px-3 py-2 justify-start text-start',
    mark: { on: 'border-primary', off: 'border-transparent' },
  },
  pills: {
    base: 'rounded-control px-3 py-2 text-foreground-muted hover:bg-surface-muted hover:text-foreground',
    selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
    horizontal: '',
    vertical: 'justify-start text-start',
    mark: { on: '', off: '' },
  },
}

/**
 * Tabs (WAI-ARIA tabs pattern). One tab is in the tab order (roving tabindex); Arrow keys move
 * between tabs (Left / Right, or Up / Down when `orientation="vertical"`, mirrored in right-to-left
 * pages), Home and End jump to the first and last, and disabled tabs are skipped. With
 * `activation="automatic"` (default) the focused tab is selected right away; with `"manual"`
 * Enter or Space selects it (use that when showing a panel is slow).
 *
 * The selected tab is uncontrolled by default (`defaultValue`) or controlled with `value` + `onChange`.
 * Every tab has a panel in the DOM (hidden when not selected) so `aria-controls` always resolves.
 *
 * @param {object} props
 * @param {{ id: string|number, label: React.ReactNode, content: React.ReactNode, disabled?: boolean, badge?: React.ReactNode }[]} props.items
 * @param {string|number} [props.value]         Controlled selected id.
 * @param {string|number} [props.defaultValue]  Initially selected id (default: the first enabled tab).
 * @param {(id: string|number, item: object) => void} [props.onChange]
 * @param {string} [props.label]                Accessible name of the tab list. Give each list on a page a different one.
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal']
 * @param {'automatic'|'manual'} [props.activation='automatic']
 * @param {'underline'|'pills'} [props.variant='underline']
 * @param {boolean} [props.fullWidth=false]     Horizontal only: tabs share the row equally.
 * @param {boolean} [props.unmountInactive=false] Render the content of the selected panel only (empty hidden panels stay).
 * @param {string} [props.className]
 * @param {string} [props.panelClassName]
 */
export default function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  label,
  orientation = 'horizontal',
  activation = 'automatic',
  variant = 'underline',
  fullWidth = false,
  unmountInactive = false,
  className,
  panelClassName,
}) {
  const baseId = useId()
  const listRef = useRef(null)
  const entries = items.filter(isValid)
  const firstEnabled = entries.find((item) => !item.disabled)

  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? firstEnabled?.id,
    onChange: (id) => onChange?.(id, entries.find((item) => item.id === id)),
  })
  if (entries.length === 0) return null

  // A stale or disabled id falls back to the first enabled tab so one panel is always visible.
  const selected = entries.find((item) => item.id === selectedValue && !item.disabled) ?? firstEnabled
  const vertical = orientation === 'vertical'
  const look = tabStyles[variant] ?? tabStyles.underline

  const select = (item) => {
    if (!item.disabled && item.id !== selected?.id) setSelectedValue(item.id)
  }

  const handleKeyDown = (event) => {
    const tabs = [...listRef.current.querySelectorAll('[role="tab"]:not(:disabled)')]
    const position = tabs.indexOf(document.activeElement)
    if (position === -1) return

    const rtl = getComputedStyle(listRef.current).direction === 'rtl'
    const nextKey = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight'
    const previousKey = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft'

    let target
    if (event.key === nextKey) target = tabs[(position + 1) % tabs.length]
    else if (event.key === previousKey) target = tabs[(position - 1 + tabs.length) % tabs.length]
    else if (event.key === 'Home') target = tabs[0]
    else if (event.key === 'End') target = tabs[tabs.length - 1]
    if (!target) return

    event.preventDefault()
    target.focus()
    if (activation === 'automatic') target.click()
  }

  return (
    <div className={cn(vertical && 'sm:flex sm:gap-6', className)}>
      {/* Keyboard handler on the list: it only reacts to keys pressed on a tab. */}
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        aria-orientation={vertical ? 'vertical' : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex',
          vertical ? 'flex-col sm:shrink-0' : 'overflow-x-auto overscroll-x-contain',
          listStyles[variant]?.[orientation] ?? listStyles.underline[orientation],
        )}
      >
        {entries.map((item) => {
          const isSelected = item.id === selected?.id
          return (
            <button
              key={item.id}
              id={`${baseId}-tab-${slug(item.id)}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${slug(item.id)}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-50',
                tabFocus,
                look.base,
                look[orientation],
                look.mark[isSelected ? 'on' : 'off'],
                isSelected && look.selected,
                fullWidth && !vertical && 'flex-1 justify-center',
              )}
            >
              {item.label}
              {item.badge != null && <span className="text-xs tabular-nums opacity-80">{item.badge}</span>}
            </button>
          )
        })}
      </div>

      <div className={cn(vertical ? 'mt-4 min-w-0 flex-1 sm:mt-0' : 'mt-4')}>
        {entries.map((item) => {
          const isSelected = item.id === selected?.id
          return (
            <div
              key={item.id}
              id={`${baseId}-panel-${slug(item.id)}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${slug(item.id)}`}
              hidden={!isSelected}
              // Focusable so keyboard users can scroll a panel that has no focusable content.
              tabIndex={isSelected ? 0 : undefined}
              className={cn('rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring', panelClassName)}
            >
              {(isSelected || !unmountInactive) && item.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
