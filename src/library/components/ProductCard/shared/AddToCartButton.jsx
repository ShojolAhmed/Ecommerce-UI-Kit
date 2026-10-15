import { Button } from '../../../primitives/index.js'
import { cn } from '../../../utils/cn.js'
import { BagIcon } from './icons.jsx'
import { controlLayer } from './styles.js'

/**
 * Add-to-cart button. Its accessible name includes the product ("Add to cart:
 * Canvas Backpack"), so a list of buttons is not a row of identical names.
 * Out of stock → disabled with the out-of-stock label. `addingToCart` shows
 * the busy state. Renders nothing without `onAddToCart`.
 *
 * @param {object} props
 * @param {ReturnType<import('./model.js').buildProductCardModel>} props.model
 * @param {boolean} [props.icon=true]
 */
export default function AddToCartButton({
  model,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  icon = true,
  className,
}) {
  if (!model.actions.addToCart) return null
  const label = model.inStock ? model.labels.addToCart : model.labels.outOfStock

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      // Starts with the visible text (WCAG label-in-name). An explicit label, not a hidden
      // span: `sr-only` is absolutely positioned, so browsers pad it with a stray space.
      aria-label={`${label}: ${model.name}`}
      loading={model.addingToCart}
      disabled={!model.inStock}
      leadingIcon={icon && model.inStock ? <BagIcon /> : undefined}
      onClick={model.actions.addToCart}
      className={cn(controlLayer, className)}
    >
      {label}
    </Button>
  )
}
