import { cn } from '../../../utils/cn.js'
import { StarIcon } from './icons.jsx'

const Stars = () => (
  <>
    {[0, 1, 2, 3, 4].map((index) => (
      <StarIcon key={index} />
    ))}
  </>
)

/**
 * Star rating (to the nearest half) with a compact review count.
 * The stars are one image with a text name ("Rated 4.5 out of 5"); the count
 * is announced in full ("1,240 reviews") while the visible text stays short.
 * Renders nothing without a rating or review count.
 */
export default function ProductRating({ model, className }) {
  const { rating } = model
  if (!rating) return null

  return (
    <div className={cn('flex items-center gap-1.5 text-xs text-foreground-muted', className)}>
      {rating.value !== null && (
        <span role="img" aria-label={rating.label} className="relative inline-flex text-border-strong">
          <Stars />
          {/* Same row in the accent color, clipped to the rating. `start-0` keeps it correct in RTL. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 start-0 flex overflow-hidden text-warning"
            style={{ width: `${rating.percent}%` }}
          >
            <Stars />
          </span>
        </span>
      )}
      {rating.countText && (
        <span>
          <span aria-hidden="true">({rating.countText})</span>
          <span className="sr-only">{rating.countLabel}</span>
        </span>
      )}
    </div>
  )
}
