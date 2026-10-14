import Button from '../Button/Button.jsx'

/**
 * Square button that contains only an icon. `label` is required because the
 * icon alone gives assistive technology nothing to announce.
 *
 * Accepts the same props as Button (variant, size, shape, loading, disabled, as…).
 *
 * @param {object} props
 * @param {string} props.label  Accessible name, e.g. "Add to wishlist".
 * @param {React.ReactNode} props.children  The icon (decorative, hidden from AT).
 */
export default function IconButton({ label, variant = 'ghost', children, ...props }) {
  if (!label && import.meta.env?.DEV) {
    console.warn('[IconButton] The "label" prop is required for an accessible name.')
  }

  return (
    <Button {...props} variant={variant} iconOnly aria-label={label}>
      <span aria-hidden="true" className="inline-flex">
        {children}
      </span>
    </Button>
  )
}
