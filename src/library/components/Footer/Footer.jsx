import { footerVariants, DEFAULT_FOOTER_VARIANT } from './variants/index.js'

/**
 * Variant-switching Footer. All variants share the props contract documented in
 * `types.js` (FooterProps), so designs can be swapped by changing only `variant`.
 *
 * @param {import('./types.js').FooterProps & { variant?: 'simple'|'columns'|'newsletter'|'dark' }} props
 */
export default function Footer({ variant = DEFAULT_FOOTER_VARIANT, ...props }) {
  const Variant = footerVariants[variant]

  if (!Variant) {
    if (import.meta.env?.DEV) {
      console.warn(`[Footer] Unknown variant "${variant}". Available: ${Object.keys(footerVariants).join(', ')}`)
    }
    return null
  }

  return <Variant {...props} />
}
