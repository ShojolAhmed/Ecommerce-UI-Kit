import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'

/** Logo / wordmark link. Style the text through `className` (each variant does). */
export default function NavbarBrand({ brand, onNavigate, className }) {
  const { name, href = '/', logo } = brand

  return (
    <a
      href={href}
      // An image or svg logo has no text, so the store name becomes the link's name.
      aria-label={logo ? name : undefined}
      onClick={(event) => onNavigate?.({ ...brand, id: 'brand', label: name }, event)}
      className={cn('inline-flex shrink-0 items-center gap-2 rounded-sm', focusRing, className)}
    >
      {logo ?? name}
    </a>
  )
}
