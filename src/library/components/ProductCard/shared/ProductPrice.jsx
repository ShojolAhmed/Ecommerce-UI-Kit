import { cn } from '../../../utils/cn.js'

/**
 * Current price plus, when there is a real discount, the struck-through
 * original. Screen readers get "Current price: …" and "Original price: …"
 * instead of two unlabelled numbers.
 *
 * Utilities are not merged with defaults that could conflict (Tailwind's
 * stylesheet order, not class order, decides which of two `font-*` or `text-*`
 * classes wins). So `currentClassName` REPLACES the default weight, and the
 * text color is inherited from the card.
 *
 * @param {object} props
 * @param {ReturnType<import('./model.js').buildProductCardModel>} props.model
 * @param {string} [props.currentClassName='font-semibold']  Weight, size and color of the current price.
 * @param {string} [props.originalClassName]               Size of the struck-through price.
 */
export default function ProductPrice({ model, className, currentClassName = 'font-semibold', originalClassName }) {
  const { text, originalText } = model.price
  if (!text) return null

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={currentClassName}>
        <span className="sr-only">{model.labels.currentPrice}: </span>
        {text}
      </span>
      {originalText && (
        <s className={cn('text-foreground-muted', originalClassName)}>
          <span className="sr-only">{model.labels.originalPrice}: </span>
          {originalText}
        </s>
      )}
    </p>
  )
}
