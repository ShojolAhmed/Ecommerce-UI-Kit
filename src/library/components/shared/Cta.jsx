import { Button } from '../../primitives/index.js'

/**
 * Renders a call-to-action described by plain data, so sections can take
 * `primaryAction={{ label, href, onClick }}` instead of JSX.
 *
 *  - with `href`     -> a real link styled as a Button
 *  - without `href`  -> a <button> (needs `onClick`)
 *
 * Everything except `label`, `href`, `onClick`, `id` and `icon` goes to Button
 * (variant, size, shape, loading, disabled, ...).
 *
 * @param {object} props
 * @param {import('./types.js').Action} props.action
 * @param {(action, event) => void} [props.onAction]  Called for every click, after `action.onClick`.
 */
export default function Cta({ action, onAction, variant = 'primary', size = 'lg', ...rest }) {
  if (!action || !action.label) return null
  const { label, href, onClick, icon, id: _id, ...buttonProps } = action

  const handleClick = (event) => {
    onClick?.(event)
    onAction?.(action, event)
  }

  return (
    <Button
      variant={variant}
      size={size}
      {...rest}
      {...buttonProps}
      as={href ? 'a' : 'button'}
      href={href}
      trailingIcon={icon}
      onClick={handleClick}
    >
      {label}
    </Button>
  )
}
