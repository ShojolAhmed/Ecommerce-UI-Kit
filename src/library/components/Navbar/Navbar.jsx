import { navbarRegistry, navbarVariants } from './variants/index.js'

/**
 * Variant-switching Navbar. All variants share the props contract documented in
 * `types.js` (NavbarProps), so designs can be swapped by changing only `variant`.
 * An unknown `variant` falls back to the default design and warns once in development.
 *
 * @param {import('./types.js').NavbarProps & { variant?: 'minimal'|'centered'|'mega'|'compact'|'megaMenu'|'centeredLogo' }} props
 */
export default function Navbar({ variant, ...props }) {
  // resolveId never returns an unregistered name, so this lookup always finds a component.
  const Variant = navbarVariants[navbarRegistry.resolveId(variant)]
  return <Variant {...props} />
}
