import { cn } from '../../utils/cn.js'
import { spinnerSizes } from './spinnerStyles.js'

/**
 * Loading indicator. Uses `currentColor`, so it inherits the surrounding text
 * color. The arc shape stays visible without motion: with
 * `prefers-reduced-motion` it pulses instead of spinning.
 *
 * @param {object}  props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string}  [props.label='Loading']  Text announced to screen readers.
 * @param {boolean} [props.decorative=false] Hide from assistive tech when a parent
 *   already communicates the loading state (e.g. a Button with aria-busy).
 * @param {string}  [props.className]
 */
export default function Spinner({ size = 'md', label = 'Loading', decorative = false, className }) {
  return (
    <span
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={cn(spinnerSizes[size], 'motion-safe:animate-spin motion-reduce:animate-pulse')}
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {!decorative && <span className="sr-only">{label}</span>}
    </span>
  )
}
