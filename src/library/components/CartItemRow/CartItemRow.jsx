import { cn } from '../../utils/cn.js'
import { Badge, IconButton } from '../../primitives/index.js'
import { TrashIcon } from '../../icons/index.jsx'
import { focusRing } from '../../primitives/shared/styles.js'
import { getLineTotal, getMaxQuantity, getMinQuantity } from '../../utils/cart.js'
import { getDiscount } from '../ProductCard/shared/model.js'
import MediaImage from '../shared/MediaImage.jsx'
import { createMoneyFormatter } from '../shared/money.js'
import QuantitySelector from '../QuantitySelector/QuantitySelector.jsx'

const defaultLabels = {
  remove: (name) => `Remove ${name} from cart`,
  each: (priceText) => `${priceText} each`,
  unitPrice: 'Unit price',
  originalPrice: 'Original price',
  lineTotal: 'Line total',
  quantity: (count) => `Qty ${count}`,
  outOfStock: 'Out of stock',
  unavailable: 'No longer available. Remove it to continue.',
  onlyAvailable: (count) => `Only ${count} available. Lower the quantity to continue.`,
  maxReached: (count) => `Maximum of ${count} per order`,
}

const layouts = {
  compact: {
    root: 'grid-cols-[4rem_minmax(0,1fr)]',
    image: '',
    controls: '',
  },
  comfortable: {
    root: 'grid-cols-[4rem_minmax(0,1fr)] sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:gap-x-5',
    image: 'sm:row-span-1',
    controls: 'sm:col-start-3 sm:row-start-1 sm:flex-col sm:items-end sm:justify-between sm:gap-3',
  },
}

/**
 * One line of the cart: image, name, chosen options, unit price, quantity selector, line total and
 * a remove button. Presentational only: it never changes the cart. Your page owns the items and
 * answers the callbacks (`onQuantityChange`, `onRemove`), so confirming a removal or calling an API
 * is your decision, not the row's.
 *
 * Quantity limits come from the item (`minQuantity`, `maxQuantity`); `inStock: false` locks the
 * line and shows why. `disabled` locks the controls (for example while a request is running) and
 * `pending` also marks the row busy. `readOnly` drops the controls and shows "Qty 2" (order review).
 *
 * Render it inside a `<ul>` (it is an `<li>`), or pass `as="div"`.
 *
 * @param {object} props
 * @param {import('../../utils/cart.js').CartItem} props.item
 * @param {(item, quantity: number) => void} [props.onQuantityChange]  Omit (with `readOnly`) to hide the stepper.
 * @param {(item, event) => void} [props.onRemove]     Omit to hide the remove button.
 * @param {(item, event) => void} [props.onItemClick]  Makes the name a link (`href`) or button that reports the click.
 * @param {(item, limit: 'min'|'max', value: number) => void} [props.onLimitReached]
 * @param {'comfortable'|'compact'} [props.layout='comfortable']  `compact` always uses the narrow arrangement (drawers).
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.pending=false]
 * @param {boolean} [props.readOnly=false]
 * @param {string} [props.currency='USD']
 * @param {string} [props.locale]
 * @param {(amount: number, item) => string} [props.formatPrice]
 * @param {Partial<typeof defaultLabels>} [props.labels]
 * @param {object} [props.quantityLabels]  Passed to `QuantitySelector` as its `labels`.
 * @param {React.ElementType} [props.as='li']
 */
export default function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
  onItemClick,
  onLimitReached,
  layout = 'comfortable',
  disabled = false,
  pending = false,
  readOnly = false,
  currency = 'USD',
  locale,
  formatPrice,
  labels: labelOverrides,
  quantityLabels,
  as: Component = 'li',
  className,
}) {
  if (!item) return null
  const labels = { ...defaultLabels, ...labelOverrides }
  const format = createMoneyFormatter({ currency, locale, formatPrice })
  const scale = layouts[layout] ?? layouts.comfortable

  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0
  const available = item.inStock !== false
  const min = getMinQuantity(item)
  const max = getMaxQuantity(item)
  const overStock = available && quantity > max
  const atLimit = available && Number.isFinite(max) && quantity === max
  const locked = disabled || pending
  const discount = getDiscount(item.price, item.originalPrice)

  const options = Array.isArray(item.options) ? item.options.filter((option) => option?.label && option?.value) : []
  const showStepper = !readOnly && Boolean(onQuantityChange)

  const nameClass = cn('rounded-sm font-medium text-foreground text-pretty', focusRing)
  let name = <span className="font-medium text-foreground text-pretty">{item.name}</span>
  if (item.href) {
    name = (
      <a href={item.href} onClick={onItemClick ? (event) => onItemClick(item, event) : undefined} className={cn(nameClass, 'hover:underline')}>
        {item.name}
      </a>
    )
  } else if (onItemClick) {
    name = (
      <button type="button" onClick={(event) => onItemClick(item, event)} className={cn(nameClass, 'text-start hover:underline')}>
        {item.name}
      </button>
    )
  }

  return (
    <Component
      aria-busy={pending || undefined}
      className={cn('grid gap-x-3 gap-y-2 py-4', scale.root, pending && 'opacity-60', className)}
    >
      <MediaImage
        src={item.image}
        alt={item.imageAlt}
        className={cn('row-span-2 aspect-[4/5] w-full rounded-control', scale.image, !available && 'opacity-60')}
      />

      <div className="min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 text-sm sm:text-base">{name}</p>
          {onRemove && !readOnly && (
            <IconButton
              size="sm"
              label={labels.remove(item.name)}
              disabled={locked}
              onClick={(event) => onRemove(item, event)}
              className="-me-1 -mt-1 shrink-0 text-foreground-muted"
            >
              <TrashIcon />
            </IconButton>
          )}
        </div>

        {options.length > 0 && (
          <p className="text-sm text-foreground-muted">
            {options.map((option) => `${option.label}: ${option.value}`).join(' · ')}
          </p>
        )}

        <p className="flex flex-wrap items-baseline gap-x-2 text-sm text-foreground-muted">
          <span>
            <span className="sr-only">{labels.unitPrice}: </span>
            {labels.each(format(item.price, item))}
          </span>
          {discount && (
            <s className="text-foreground-subtle">
              <span className="sr-only">{labels.originalPrice}: </span>
              {format(item.originalPrice, item)}
            </s>
          )}
        </p>

        {!available && (
          <p className="flex flex-wrap items-center gap-2 text-sm text-danger-soft-foreground">
            <Badge variant="danger">{labels.outOfStock}</Badge>
            <span>{labels.unavailable}</span>
          </p>
        )}
        {overStock && <p className="text-sm font-medium text-warning-soft-foreground">{labels.onlyAvailable(max)}</p>}
        {atLimit && <p className="text-sm text-foreground-muted">{item.limitNote ?? labels.maxReached(max)}</p>}
      </div>

      <div
        className={cn(
          'col-start-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2',
          scale.controls,
        )}
      >
        {showStepper ? (
          <QuantitySelector
            size="sm"
            label={item.name}
            value={quantity}
            min={min}
            max={available ? max : quantity}
            disabled={locked || !available}
            onChange={(next) => onQuantityChange(item, next)}
            onLimitReached={onLimitReached ? (limit, value) => onLimitReached(item, limit, value) : undefined}
            labels={quantityLabels}
          />
        ) : (
          <p className="text-sm text-foreground-muted">{labels.quantity(quantity)}</p>
        )}
        <p className={cn('ms-auto font-semibold tabular-nums text-foreground sm:ms-0', !available && 'line-through opacity-60')}>
          <span className="sr-only">{labels.lineTotal}: </span>
          {format(getLineTotal(item), item)}
        </p>
      </div>
    </Component>
  )
}
