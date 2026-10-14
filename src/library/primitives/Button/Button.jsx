import { cn } from '../../utils/cn.js'
import Spinner from '../Spinner/Spinner.jsx'
import {
  buttonBase,
  buttonVariants,
  buttonSizes,
  buttonIconSizes,
  buttonShapes,
} from './buttonStyles.js'

/**
 * Generic button. Renders a native <button> by default; pass `as` to render a
 * link or router component with the same look.
 *
 * States:
 *  - disabled: native `disabled` (or aria-disabled + tabIndex=-1 for non-buttons), dimmed
 *  - loading:  stays focusable, `aria-busy`, clicks are ignored, width does not change
 *
 * @param {object}  props
 * @param {React.ElementType} [props.as='button']
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {'rounded'|'pill'} [props.shape='rounded']
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {boolean} [props.iconOnly=false] Square sizing. Prefer <IconButton>, which also requires a label.
 * @param {React.ReactNode} [props.leadingIcon]
 * @param {React.ReactNode} [props.trailingIcon]
 */
export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  loading = false,
  disabled = false,
  fullWidth = false,
  iconOnly = false,
  leadingIcon,
  trailingIcon,
  type,
  className,
  children,
  onClick,
  ref,
  ...rest
}) {
  const isNative = Component === 'button'
  const blocked = disabled || loading

  const handleClick = (event) => {
    if (blocked) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  const stateProps = isNative
    ? {
        type: type ?? 'button',
        disabled,
        'aria-disabled': loading && !disabled ? true : undefined,
      }
    : {
        'aria-disabled': blocked || undefined,
        tabIndex: disabled ? -1 : rest.tabIndex,
      }

  return (
    <Component
      {...rest}
      {...stateProps}
      ref={ref}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={cn(
        buttonBase,
        buttonShapes[shape],
        buttonVariants[variant],
        iconOnly ? buttonIconSizes[size] : buttonSizes[size],
        fullWidth && 'w-full',
        disabled && 'cursor-not-allowed opacity-50',
        loading && !disabled && 'cursor-progress',
        className,
      )}
    >
      {/* Content stays in the layout (and the accessibility tree) while loading
          so the button keeps its width and its accessible name. */}
      <span className={cn('inline-flex items-center justify-center gap-2', loading && 'opacity-0')}>
        {leadingIcon && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {leadingIcon}
          </span>
        )}
        {children}
        {trailingIcon && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {trailingIcon}
          </span>
        )}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner decorative size="sm" />
        </span>
      )}
    </Component>
  )
}
