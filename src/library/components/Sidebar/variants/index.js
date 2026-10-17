// Register each new design here. The key is the public `variant` name.
import { createVariantRegistry } from '../../../utils/variants.js'
import ClassicSidebar from './ClassicSidebar.jsx'
import CollapsibleSidebar from './CollapsibleSidebar.jsx'
import MinimalSidebar from './MinimalSidebar.jsx'

/** Canonical variant names and their components (a plain object, so unused designs can be tree-shaken). */
export const sidebarVariants = {
  classic: ClassicSidebar,
  collapsible: CollapsibleSidebar,
  minimal: MinimalSidebar,
}

export const DEFAULT_SIDEBAR_VARIANT = 'classic'

/**
 * The Sidebar registry (pure, so it is dropped when nothing uses it): `resolve(variant)` returns the component to render and falls back to the
 * default (with a development warning) for an unknown name. Used by `<Sidebar variant>`.
 */
export const sidebarRegistry = /* @__PURE__ */ createVariantRegistry({
  name: 'Sidebar',
  variants: sidebarVariants,
  defaultVariant: DEFAULT_SIDEBAR_VARIANT,
})

// Each design is also importable on its own.
export { ClassicSidebar, CollapsibleSidebar, MinimalSidebar }
