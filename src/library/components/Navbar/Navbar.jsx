import { navbarVariants, DEFAULT_NAVBAR_VARIANT } from './variants/index.js'

/**
 * Variant-switching Navbar. All variants share the props contract documented in
 * `types.js` (NavbarProps), so designs can be swapped by changing only `variant`.
 *
 * @param {import('./types.js').NavbarProps & { variant?: 'minimal'|'centered'|'mega'|'compact' }} props
 */
export default function Navbar({ variant = DEFAULT_NAVBAR_VARIANT, ...props }) {
  const Variant = navbarVariants[variant]

  if (!Variant) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[Navbar] Unknown variant "${variant}". Available: ${Object.keys(navbarVariants).join(', ')}`,
      )
    }
    return null
  }

  return <Variant {...props} />
}
