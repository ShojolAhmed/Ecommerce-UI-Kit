import { Badge } from '../../../primitives/index.js'
import { cn } from '../../../utils/cn.js'

/**
 * Product badges ("New", "Bestseller", …). Purely informational, so they let
 * clicks fall through to the card. A long label is truncated with an ellipsis
 * rather than spilling out of the image: cap the width with `className`
 * (e.g. `max-w-[calc(100%-3.5rem)]` to leave room for the wishlist button).
 *
 * @param {object} props
 * @param {{ label: string, variant: string }[]} props.badges  From the card model.
 * @param {number} [props.max=2]
 */
export function ProductBadges({ badges, max = 2, className }) {
  const visible = badges.slice(0, max)
  if (visible.length === 0) return null

  return (
    <div className={cn('pointer-events-none flex flex-wrap gap-1', className)}>
      {visible.map(({ label, variant }) => (
        <Badge key={label} variant={variant} className="max-w-full shadow-xs ring-1 ring-border">
          <span className="truncate">{label}</span>
        </Badge>
      ))}
    </div>
  )
}

/** Solid "-30%" badge. Reads as "30% off" to screen readers. Renders nothing without a discount. */
export function DiscountBadge({ model, className }) {
  const { discount } = model.price
  if (!discount) return null

  return (
    <span
      className={cn(
        'pointer-events-none inline-flex items-center rounded-full bg-danger px-2.5 py-1 text-sm font-bold leading-none text-danger-foreground',
        className,
      )}
    >
      <span aria-hidden="true">{discount.percentText}</span>
      <span className="sr-only">{model.labels.off(discount.percent)}</span>
    </span>
  )
}
