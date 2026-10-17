import { sidebarRegistry, sidebarVariants } from './variants/index.js'

/**
 * Variant-switching Sidebar. All variants share the props contract documented
 * in `types.js` (SidebarProps), so designs can be swapped by changing only
 * `variant`. The `collapsible` variant accepts a few extra props (CollapsibleSidebarProps).
 * An unknown `variant` falls back to the default design and warns once in development.
 *
 * @param {import('./types.js').CollapsibleSidebarProps & { variant?: 'classic'|'collapsible'|'minimal' }} props
 */
export default function Sidebar({ variant, ...props }) {
  // resolveId never returns an unregistered name, so this lookup always finds a component.
  const Variant = sidebarVariants[sidebarRegistry.resolveId(variant)]
  return <Variant {...props} />
}
