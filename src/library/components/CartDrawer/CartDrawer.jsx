import { useEffect, useId, useRef } from 'react'
import { cn } from '../../utils/cn.js'
import { IconButton, Spinner } from '../../primitives/index.js'
import { CloseIcon } from '../../icons/index.jsx'
import { useDialogBehavior } from '../../hooks/useDialogBehavior.js'
import { getCartTotals, isValidCartItem } from '../../utils/cart.js'
import CartItemRow from '../CartItemRow/CartItemRow.jsx'
import CartSummary from '../CartSummary/CartSummary.jsx'
import EmptyCartState from '../EmptyCartState/EmptyCartState.jsx'
import Portal from '../shared/Portal.jsx'

const defaultLabels = {
  title: 'Your cart',
  close: 'Close cart',
  items: 'Cart items',
  count: (count) => (count === 1 ? '1 item' : `${count} items`),
  loading: 'Updating your cart',
}

const placements = {
  right: 'right-0 motion-safe:animate-ui-slide-right',
  left: 'left-0 motion-safe:animate-ui-slide-left',
}

const idSet = (ids) => new Set(ids ?? [])

/**
 * Slide-out cart: a modal drawer with the cart lines, a summary footer and an empty state.
 * Controlled and presentational: the page owns `open` and the items, and answers every callback
 * (change a quantity, remove a line, check out). Nothing here reads or writes a cart, calls an
 * API or navigates. To confirm a removal, open a `ConfirmDialog` from `onRemove`; it stacks above
 * the drawer.
 *
 * Behaviour: focus moves in on open (to Close), Tab is trapped, Escape and a click on the backdrop
 * close it, page scroll is locked and focus returns to `triggerRef`. If the focused line is removed,
 * focus moves to the next control in the drawer instead of being lost. Slide animation is off
 * under reduced motion. It fills at most 92% of narrow screens so the backdrop stays tappable.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {React.RefObject<HTMLElement>} [props.triggerRef]  The cart button, so focus returns there on close.
 * @param {import('../../utils/cart.js').CartItem[]} [props.items]
 * @param {(item, quantity: number) => void} [props.onQuantityChange]
 * @param {(item, event) => void} [props.onRemove]
 * @param {(item, event) => void} [props.onItemClick]
 * @param {(item, limit: 'min'|'max', value: number) => void} [props.onLimitReached]
 * @param {Array<string|number>|Set<string|number>} [props.pendingIds]  Lines being updated (locked, marked busy).
 * @param {object|false} [props.summary]   Props for `CartSummary` (`onCheckout`, `shipping`, `discount`, `checkoutDisabled`...).
 *   `subtotal` and `itemCount` default to the values computed from `items`. `false` hides the footer.
 * @param {import('../shared/types.js').Action} [props.emptyAction]  Primary action of the built-in empty state.
 * @param {(action, event) => void} [props.onEmptyAction]
 * @param {React.ReactNode} [props.emptyState]  Replaces the built-in `EmptyCartState`.
 * @param {boolean} [props.loading=false]  Cart being fetched: a spinner when empty, `aria-busy` when not.
 * @param {'right'|'left'} [props.placement='right']
 * @param {React.ReactNode} [props.title]
 * @param {boolean} [props.closeOnBackdropClick=true]
 * @param {boolean} [props.portal=true]   Render in `document.body`; `false` renders in place.
 * @param {React.ReactNode} [props.children]  Slot above the lines (a free-shipping progress bar).
 * @param {string} [props.currency='USD']
 * @param {string} [props.locale]
 * @param {(amount: number, context?) => string} [props.formatPrice]
 * @param {Partial<typeof defaultLabels>} [props.labels]
 * @param {object} [props.rowLabels]   Passed to every `CartItemRow` as `labels`.
 * @param {object} [props.summaryLabels]
 * @param {string} [props.className]
 */
export default function CartDrawer({
  open,
  onClose,
  triggerRef,
  items = [],
  onQuantityChange,
  onRemove,
  onItemClick,
  onLimitReached,
  pendingIds,
  summary = {},
  emptyAction,
  onEmptyAction,
  emptyState,
  loading = false,
  placement = 'right',
  title,
  closeOnBackdropClick = true,
  portal = true,
  children,
  currency = 'USD',
  locale,
  formatPrice,
  labels: labelOverrides,
  rowLabels,
  summaryLabels,
  className,
}) {
  const labels = { ...defaultLabels, ...labelOverrides }
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()

  const rows = items.filter(isValidCartItem)
  const totals = getCartTotals({ items: rows })
  const pending = idSet(pendingIds)

  useDialogBehavior({ open, onClose, panelRef, returnFocusRef: triggerRef, initialFocusRef: closeRef })

  // When the focused control disappears (its line was removed) the browser drops focus on <body>.
  // Hand it to the next useful control so keyboard and screen reader users keep their place.
  const idsKey = rows.map((item) => item.id).join('|')
  const previousIds = useRef(idsKey)
  useEffect(() => {
    const changed = idsKey !== previousIds.current
    previousIds.current = idsKey
    const panel = panelRef.current
    const active = document.activeElement
    if (!open || !changed || !panel || (active && active !== document.body)) return
    const next =
      panel.querySelector('[data-cart-lines] button:not(:disabled), [data-cart-lines] a[href]') ??
      panel.querySelector('[data-cart-empty] a[href], [data-cart-empty] button:not(:disabled)') ??
      closeRef.current
    next?.focus()
  }, [idsKey, open])

  if (!open) return null

  const isEmpty = rows.length === 0
  const showSummary = summary !== false && !isEmpty

  return (
    <Portal enabled={portal}>
      <div className="fixed inset-0 z-50">
        <div
          aria-hidden="true"
          onClick={closeOnBackdropClick ? onClose : undefined}
          className="absolute inset-0 bg-foreground/40 motion-safe:animate-ui-fade-in"
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-busy={loading || undefined}
          tabIndex={-1}
          className={cn(
            'absolute inset-y-0 flex w-[min(28rem,92vw)] flex-col overflow-hidden bg-surface text-foreground shadow-xl outline-none',
            placements[placement] ?? placements.right,
            className,
          )}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2">
            <h2 id={titleId} className="min-w-0 text-base font-semibold">
              {title ?? labels.title}
              {!isEmpty && <span className="ms-2 font-normal text-foreground-muted">({labels.count(totals.itemCount)})</span>}
            </h2>
            <IconButton ref={closeRef} label={labels.close} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {loading && isEmpty ? (
              <div className="flex justify-center py-16">
                <Spinner label={labels.loading} />
              </div>
            ) : isEmpty ? (
              <div data-cart-empty="">
                {emptyState ?? (
                  <EmptyCartState size="sm" headingLevel={3} action={emptyAction} onAction={onEmptyAction} />
                )}
              </div>
            ) : (
              <>
                {children && <div className="px-4 pt-4">{children}</div>}
                <ul data-cart-lines="" aria-label={labels.items} className="divide-y divide-border px-4">
                  {rows.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      layout="compact"
                      pending={pending.has(item.id)}
                      onQuantityChange={onQuantityChange}
                      onRemove={onRemove}
                      onItemClick={onItemClick}
                      onLimitReached={onLimitReached}
                      currency={currency}
                      locale={locale}
                      formatPrice={formatPrice}
                      labels={rowLabels}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>

          {showSummary && (
            <div className="shrink-0 border-t border-border bg-surface p-4">
              <CartSummary
                bordered={false}
                hideTitle
                headingLevel={3}
                subtotal={totals.subtotal}
                itemCount={totals.itemCount}
                currency={currency}
                locale={locale}
                formatPrice={formatPrice}
                labels={summaryLabels}
                {...summary}
              />
            </div>
          )}
        </div>
      </div>
    </Portal>
  )
}
