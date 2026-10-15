import { sidebarVariants, DEFAULT_SIDEBAR_VARIANT } from './variants/index.js'

/**
 * Variant-switching Sidebar. All variants share the props contract documented
 * in `types.js` (SidebarProps), so designs can be swapped by changing only
 * `variant`. The `collapsible` variant accepts a few extra props (CollapsibleSidebarProps).
 *
 * @param {import('./types.js').CollapsibleSidebarProps & { variant?: 'classic'|'collapsible'|'minimal' }} props
 */
export default function Sidebar({ variant = DEFAULT_SIDEBAR_VARIANT, ...props }) {
  const Variant = sidebarVariants[variant]

  if (!Variant) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[Sidebar] Unknown variant "${variant}". Available: ${Object.keys(sidebarVariants).join(', ')}`,
      )
    }
    return null
  }

  return <Variant {...props} />
}
