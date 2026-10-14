import { useId } from 'react'
import { cn } from '../../utils/cn.js'
import { focusRing } from '../shared/styles.js'
import { inputSizes } from './inputStyles.js'

/**
 * Text input. Pass `label`, `hint` and/or `error` to get an associated field
 * (label via htmlFor, hint/error via aria-describedby). With none of them it
 * renders the bare <input>, so provide `aria-label` yourself in that case.
 *
 * Note: `size` here is the visual size ('sm' | 'md' | 'lg'), not the native
 * HTML `size` attribute.
 *
 * @param {object}  props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {React.ReactNode} [props.label]
 * @param {React.ReactNode} [props.hint]
 * @param {React.ReactNode} [props.error]   Sets aria-invalid automatically.
 * @param {boolean} [props.invalid]         Force the invalid state without a message.
 * @param {string}  [props.wrapperClassName] Class for the field wrapper (only rendered with label/hint/error).
 */
export default function Input({
  id,
  type = 'text',
  size = 'md',
  label,
  hint,
  error,
  invalid,
  required,
  className,
  wrapperClassName,
  'aria-describedby': describedByProp,
  ref,
  ...rest
}) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const isInvalid = invalid ?? Boolean(error)
  const describedBy = [describedByProp, hintId, errorId].filter(Boolean).join(' ') || undefined

  const input = (
    <input
      {...rest}
      ref={ref}
      id={inputId}
      type={type}
      required={required}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy}
      className={cn(
        'w-full rounded-control border border-border-strong bg-surface text-foreground transition-colors',
        'placeholder:text-foreground-subtle',
        'hover:border-foreground-subtle',
        'aria-invalid:border-danger',
        'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-50 disabled:hover:border-border-strong',
        'read-only:bg-surface-muted',
        focusRing,
        inputSizes[size],
        className,
      )}
    />
  )

  if (!label && !hint && !error) return input

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {required && (
            <span aria-hidden="true" className="text-danger">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {input}
      {hint && (
        <p id={hintId} className="text-sm text-foreground-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
