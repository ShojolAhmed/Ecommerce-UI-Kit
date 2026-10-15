import { useEffect, useId, useRef } from 'react'
import { cn } from '../../utils/cn.js'
import { Button, IconButton } from '../../primitives/index.js'
import { CloseIcon } from '../../icons/index.jsx'
import { useDialogBehavior } from '../../hooks/useDialogBehavior.js'
import SidebarBody from '../Sidebar/shared/SidebarBody.jsx'
import { withSidebarLabels } from '../Sidebar/shared/labels.js'
import { useFilterSummary } from '../Sidebar/shared/useFilterSummary.js'

const placements = {
  left: 'inset-y-0 left-0 w-[min(24rem,92vw)] motion-safe:animate-ui-slide-left',
  right: 'inset-y-0 right-0 w-[min(24rem,92vw)] motion-safe:animate-ui-slide-right',
  bottom: 'inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl motion-safe:animate-ui-slide-up',
}

const drawerLabels = {
  closeFilters: 'Close filters',
  showResults: 'Show results',
  /** Footer button text when `resultCount` is given. */
  showResultsCount: (count) => `Show ${count} ${count === 1 ? 'result' : 'results'}`,
}

/**
 * Mobile filter drawer (modal dialog or bottom sheet) with the same content as
 * the sidebars: categories, then filter groups as accordions with touch-sized rows.
 *
 * Fully controlled: the page owns `open`, the active category and the filters.
 * Changes are reported live through the same callbacks as the sidebars, and the
 * footer button just closes the drawer ("Show N results"). To stage changes
 * instead, pass a draft copy of the filters and commit it in `onApply`.
 *
 * Behaviour: focus moves in on open, Tab is trapped, Escape closes, page scroll
 * is locked, focus returns to `triggerRef`, and it closes itself when the window
 * grows past `closeAbove` (so it never stays open once the desktop sidebar shows).
 *
 * @param {import('../Sidebar/types.js').SidebarProps & {
 *   open: boolean,
 *   onClose: () => void,
 *   triggerRef?: React.RefObject<HTMLElement>,
 *   placement?: 'left'|'right'|'bottom',
 *   title?: string,
 *   resultCount?: number,
 *   onApply?: () => void,
 *   closeAbove?: string,
 *   children?: React.ReactNode,
 *   labels?: Partial<typeof drawerLabels> & import('../Sidebar/types.js').SidebarLabels,
 * }} props
 */
export default function FilterDrawer({
  open,
  onClose,
  triggerRef,
  placement = 'bottom',
  title,
  categories,
  activeCategory,
  onCategoryChange,
  filterGroups = [],
  filters = {},
  onFiltersChange,
  onClearAll,
  resultCount,
  onApply,
  closeAbove = '(min-width: 64rem)',
  labels: labelsProp,
  className,
  children,
}) {
  const labels = { ...drawerLabels, ...withSidebarLabels(labelsProp) }
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()
  const { activeCount, clearAll } = useFilterSummary({ filterGroups, filters, onFiltersChange, onClearAll })

  useDialogBehavior({
    open,
    onClose,
    panelRef,
    returnFocusRef: triggerRef,
    initialFocusRef: closeRef, // start on Close rather than opening a keyboard or a first checkbox
  })

  // Close when the layout switches to the desktop sidebar (rotation, window resize).
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  useEffect(() => {
    if (!open || typeof window.matchMedia !== 'function') return undefined
    const query = window.matchMedia(closeAbove)
    const onChange = (event) => {
      if (event.matches) onCloseRef.current()
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [open, closeAbove])

  if (!open) return null

  const apply = () => {
    onApply?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 motion-safe:animate-ui-fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'absolute flex flex-col overflow-hidden bg-surface text-foreground shadow-xl outline-none',
          placements[placement] ?? placements.bottom,
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
          <h2 id={titleId} className="text-base font-semibold">
            {title ?? labels.filters}
          </h2>
          <IconButton ref={closeRef} label={labels.closeFilters} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
          {children}
          <SidebarBody
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            filterGroups={filterGroups}
            filters={filters}
            onFiltersChange={onFiltersChange}
            labels={labels}
            accordion
            size="lg"
            headingLevel={3}
          />
        </div>

        <div className="flex shrink-0 gap-2 border-t border-border p-3">
          {activeCount > 0 && (
            <Button variant="outline" size="lg" onClick={clearAll}>
              {labels.clearAll}
            </Button>
          )}
          <Button size="lg" className="flex-1" onClick={apply}>
            {resultCount === undefined ? labels.showResults : labels.showResultsCount(resultCount)}
          </Button>
        </div>
      </div>
    </div>
  )
}
