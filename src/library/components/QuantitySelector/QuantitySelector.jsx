import { useRef, useState } from 'react'
import { cn } from '../../utils/cn.js'
import { IconButton } from '../../primitives/index.js'
import { MinusIcon, PlusIcon } from '../../icons/index.jsx'
import { focusRing } from '../../primitives/shared/styles.js'
import { useControllableState } from '../../hooks/useControllableState.js'
import { clampQuantity } from '../../utils/cart.js'

const quantityLabels = {
  decrease: (name) => (name ? `Decrease quantity: ${name}` : 'Decrease quantity'),
  increase: (name) => (name ? `Increase quantity: ${name}` : 'Increase quantity'),
  quantity: (name) => (name ? `Quantity: ${name}` : 'Quantity'),
  /** Spoken (polite) whenever the value changes. */
  announce: (value, { atMax, max }) => (atMax ? `Quantity ${value}. Maximum of ${max} reached.` : `Quantity ${value}`),
}

const sizes = {
  sm: { button: 'sm', input: 'h-8 w-10 text-sm' },
  md: { button: 'md', input: 'h-10 w-12 text-sm' },
  lg: { button: 'lg', input: 'h-12 w-14 text-base' },
}

/**
 * Quantity stepper: a minus button, an editable number and a plus button. It holds no cart
 * logic: it keeps the value inside `[min, max]` and reports the next value through `onChange`.
 *
 * - Minus is disabled at `min`, plus at `max`; `disabled` disables everything. When a press
 *   reaches a limit, focus moves to the number so it is not lost on the disabled button.
 * - The number accepts typing (digits only) and commits on blur or Enter, clamped to the limits;
 *   Escape discards the edit. It is an ARIA spinbutton: Arrow Up / Down step, Home / End jump to
 *   the limits.
 * - A polite live region announces each change and the maximum being reached.
 *
 * Uncontrolled by default (`defaultValue`) or controlled with `value` + `onChange`.
 *
 * @param {object} props
 * @param {number} [props.value]          Controlled quantity.
 * @param {number} [props.defaultValue]   Initial quantity when uncontrolled (default `min`).
 * @param {(next: number) => void} [props.onChange]  Called with the clamped next quantity.
 * @param {number} [props.min=1]
 * @param {number} [props.max]            Omit for no upper limit.
 * @param {number} [props.step=1]         Amount added or removed by the buttons and arrow keys.
 * @param {boolean} [props.disabled=false]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.label]          What is being counted (usually the product name); added to every accessible name.
 * @param {(limit: 'min'|'max', limitValue: number) => void} [props.onLimitReached]
 *   Called when an action asked for more than `max` or less than `min` (typing 99 with `max=5`,
 *   Arrow Up at the maximum). Use it to show a message.
 * @param {Partial<typeof quantityLabels>} [props.labels]   Override any string (localisation).
 * @param {string} [props.className]
 */
export default function QuantitySelector({
  value: valueProp,
  defaultValue,
  onChange,
  min = 1,
  max = Infinity,
  step = 1,
  disabled = false,
  size = 'md',
  label,
  onLimitReached,
  labels: labelOverrides,
  className,
}) {
  const labels = { ...quantityLabels, ...labelOverrides }
  const inputRef = useRef(null)
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? min,
    onChange,
  })
  const [draft, setDraft] = useState(null) // text being typed, or null when not editing

  const scale = sizes[size] ?? sizes.md
  const hasMax = Number.isFinite(max)
  const atMin = value <= min
  const atMax = value >= max
  const outOfRange = value < min || value > max

  /** Clamp, report a limit that was exceeded, and commit when the value changes. */
  const apply = (requested) => {
    const next = clampQuantity(requested, { min, max })
    if (requested > max) onLimitReached?.('max', max)
    else if (requested < min) onLimitReached?.('min', min)
    if (next !== value) setValue(next)
    return next
  }

  const stepBy = (direction) => {
    const next = apply(value + direction * step)
    // A button that just became disabled would drop focus, so keep it in the control.
    if ((direction > 0 && next >= max) || (direction < 0 && next <= min)) inputRef.current?.focus()
  }

  const commitDraft = () => {
    if (draft === null) return
    setDraft(null)
    if (draft !== '') apply(Number.parseInt(draft, 10))
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        setDraft(null)
        apply(value + step)
        break
      case 'ArrowDown':
        event.preventDefault()
        setDraft(null)
        apply(value - step)
        break
      case 'Home':
        if (hasMax || draft === null) {
          event.preventDefault()
          setDraft(null)
          apply(min)
        }
        break
      case 'End':
        if (hasMax) {
          event.preventDefault()
          setDraft(null)
          apply(max)
        }
        break
      case 'Enter':
        event.preventDefault() // never submit a surrounding form
        commitDraft()
        break
      case 'Escape':
        if (draft !== null) {
          event.preventDefault()
          event.stopPropagation() // discard the edit without closing a surrounding dialog
          setDraft(null)
        }
        break
      default:
    }
  }

  return (
    <div role="group" aria-label={labels.quantity(label)} className={cn('inline-flex items-center gap-1', className)}>
      <IconButton
        variant="outline"
        size={scale.button}
        label={labels.decrease(label)}
        disabled={disabled || atMin}
        onClick={() => stepBy(-1)}
      >
        <MinusIcon />
      </IconButton>

      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-label={labels.quantity(label)}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={hasMax ? max : undefined}
        aria-invalid={outOfRange || undefined}
        autoComplete="off"
        disabled={disabled}
        value={draft ?? String(value)}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
        onBlur={commitDraft}
        onKeyDown={handleKeyDown}
        className={cn(
          'rounded-control border border-border-strong bg-surface text-center font-medium tabular-nums text-foreground transition-colors',
          'hover:border-foreground-subtle aria-invalid:border-danger',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-50 disabled:hover:border-border-strong',
          focusRing,
          scale.input,
        )}
      />

      <IconButton
        variant="outline"
        size={scale.button}
        label={labels.increase(label)}
        disabled={disabled || atMax}
        onClick={() => stepBy(1)}
      >
        <PlusIcon />
      </IconButton>

      <span role="status" className="sr-only">
        {labels.announce(value, { atMin, atMax: atMax && hasMax, min, max })}
      </span>
    </div>
  )
}
