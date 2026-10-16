import { useId } from 'react'
import { cn } from '../../utils/cn.js'
import { Button } from '../../primitives/index.js'
import { createMoneyFormatter } from '../shared/money.js'
import Cta from '../shared/Cta.jsx'

const defaultLabels = {
  title: 'Order summary',
  items: (count) => (count === 1 ? '1 item' : `${count} items`),
  subtotal: 'Subtotal',
  discount: 'Discount',
  shipping: 'Shipping',
  tax: 'Tax',
  total: 'Total',
  free: 'Free',
  calculatedLater: 'Calculated at checkout',
  checkout: 'Checkout',
}

const isNumber = (value) => typeof value === 'number' && Number.isFinite(value)

/**
 * Order summary: subtotal, optional discount, shipping and tax, and the total, with a checkout
 * button. It does **no** pricing: shipping rules, taxes and promo codes are your business logic,
 * so you pass the resulting amounts in (`getCartTotals` in the library can add them up). It never
 * navigates or pays; `onCheckout` just reports the click.
 *
 * Row rules: `discount` shows as a negative amount when above 0. `shipping` of `0` reads "Free",
 * `null` reads "Calculated at checkout", `undefined` hides the row; `tax` works the same way
 * (without "Free"). Without `total`, it is subtotal - discount + shipping + tax.
 *
 * @param {object} props
 * @param {number} props.subtotal
 * @param {number} [props.discount]          Positive amount taken off. `discountLabel` names it ("Code SPRING10").
 * @param {React.ReactNode} [props.discountLabel]
 * @param {number|null} [props.shipping]
 * @param {number|null} [props.tax]
 * @param {number} [props.total]             Overrides the computed total.
 * @param {number} [props.itemCount]         Shown next to the subtotal label ("3 items").
 * @param {{ id?: string, label: React.ReactNode, amount: number|string }[]} [props.lines]  Extra rows above the total (gift wrap, duties).
 * @param {() => void} [props.onCheckout]    Omit to hide the checkout button.
 * @param {string} [props.checkoutLabel]
 * @param {boolean} [props.checkoutDisabled=false]  For example while a line is out of stock.
 * @param {React.ReactNode} [props.checkoutDisabledReason]  Shown under the button and linked to it.
 * @param {boolean} [props.checkoutLoading=false]
 * @param {import('../shared/types.js').Action} [props.secondaryAction]  "Continue shopping"; link or button.
 * @param {(action, event) => void} [props.onAction]
 * @param {React.ReactNode} [props.note]     Small print under the buttons.
 * @param {React.ReactNode} [props.children] Slot above the rows (promo code field, free-shipping progress).
 * @param {React.ReactNode} [props.title]
 * @param {boolean} [props.hideTitle=false]  Keeps the heading for screen readers only.
 * @param {2|3|4|5|6} [props.headingLevel=2]
 * @param {boolean} [props.bordered=true]    `false` removes the card look (inside a drawer footer).
 * @param {string} [props.currency='USD']
 * @param {string} [props.locale]
 * @param {(amount: number) => string} [props.formatPrice]
 * @param {Partial<typeof defaultLabels>} [props.labels]
 */
export default function CartSummary({
  subtotal,
  discount,
  discountLabel,
  shipping,
  tax,
  total,
  itemCount,
  lines = [],
  onCheckout,
  checkoutLabel,
  checkoutDisabled = false,
  checkoutDisabledReason,
  checkoutLoading = false,
  secondaryAction,
  onAction,
  note,
  children,
  title,
  hideTitle = false,
  headingLevel = 2,
  bordered = true,
  currency = 'USD',
  locale,
  formatPrice,
  labels: labelOverrides,
  className,
}) {
  const baseId = useId()
  const labels = { ...defaultLabels, ...labelOverrides }
  const format = createMoneyFormatter({ currency, locale, formatPrice })
  const Heading = `h${Math.min(Math.max(headingLevel, 2), 6)}`

  const hasDiscount = isNumber(discount) && discount > 0
  const computedTotal = Math.max(
    0,
    Math.round(((isNumber(subtotal) ? subtotal : 0) - (hasDiscount ? discount : 0) + (isNumber(shipping) ? shipping : 0) + (isNumber(tax) ? tax : 0)) * 100) / 100,
  )
  const grandTotal = isNumber(total) ? total : computedTotal

  const reasonId = `${baseId}-reason`
  const showReason = checkoutDisabled && Boolean(checkoutDisabledReason)

  const row = (key, label, value, { muted = false, tone } = {}) => (
    <div key={key} className="flex items-baseline justify-between gap-4">
      <dt className={cn('text-sm', muted ? 'text-foreground-muted' : 'text-foreground')}>{label}</dt>
      <dd className={cn('text-sm tabular-nums', tone === 'discount' ? 'font-medium text-success-soft-foreground' : 'text-foreground')}>
        {value}
      </dd>
    </div>
  )

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={cn(bordered && 'rounded-surface border border-border bg-surface p-4 sm:p-5', className)}
    >
      <Heading id={`${baseId}-title`} className={cn('text-lg font-semibold', hideTitle ? 'sr-only' : 'mb-4')}>
        {title ?? labels.title}
      </Heading>

      {children && <div className="mb-4">{children}</div>}

      <dl className="space-y-2.5">
        {row(
          'subtotal',
          <>
            {labels.subtotal}
            {isNumber(itemCount) && <span className="text-foreground-muted"> ({labels.items(itemCount)})</span>}
          </>,
          isNumber(subtotal) ? format(subtotal) : '',
        )}
        {hasDiscount &&
          row('discount', discountLabel ?? labels.discount, <>−{format(discount)}</>, { tone: 'discount' })}
        {shipping !== undefined &&
          row('shipping', labels.shipping, shipping === null ? labels.calculatedLater : shipping === 0 ? labels.free : format(shipping), {
            muted: true,
          })}
        {tax !== undefined && row('tax', labels.tax, tax === null ? labels.calculatedLater : format(tax), { muted: true })}
        {lines.map((line, index) =>
          row(line.id ?? index, line.label, typeof line.amount === 'number' ? format(line.amount) : line.amount, { muted: true }),
        )}

        {/* Polite live region: the total is re-read when quantities change. */}
        <div aria-live="polite" aria-atomic="true" className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
          <dt className="text-base font-semibold">{labels.total}</dt>
          <dd className="text-lg font-semibold tabular-nums">{format(grandTotal)}</dd>
        </div>
      </dl>

      {(onCheckout || secondaryAction) && (
        <div className="mt-5 space-y-2">
          {onCheckout && (
            <Button
              size="lg"
              fullWidth
              disabled={checkoutDisabled}
              loading={checkoutLoading}
              aria-describedby={showReason ? reasonId : undefined}
              onClick={() => onCheckout()}
            >
              {checkoutLabel ?? labels.checkout}
            </Button>
          )}
          {showReason && (
            <p id={reasonId} className="text-sm text-foreground-muted">
              {checkoutDisabledReason}
            </p>
          )}
          <Cta action={secondaryAction} onAction={onAction} variant="ghost" size="md" fullWidth />
        </div>
      )}

      {note && <div className="mt-4 text-xs text-foreground-muted">{note}</div>}
    </section>
  )
}
