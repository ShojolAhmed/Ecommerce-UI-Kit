import { footerRegistry, footerVariants } from './variants/index.js'

/**
 * Variant-switching Footer. All variants share the props contract documented in
 * `types.js` (FooterProps), so designs can be swapped by changing only `variant`.
 * An unknown `variant` falls back to the default design and warns once in development.
 *
 * @param {import('./types.js').FooterProps & { variant?: 'simple'|'columns'|'newsletter'|'dark' }} props
 */
export default function Footer({ variant, ...props }) {
  // resolveId never returns an unregistered name, so this lookup always finds a component.
  const Variant = footerVariants[footerRegistry.resolveId(variant)]
  return <Variant {...props} />
}
