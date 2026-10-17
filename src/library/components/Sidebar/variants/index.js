// Register each new design here. The key is the public `variant` name.
import { createVariantRegistry } from '../../../utils/variants.js'
import ClassicSidebar from './ClassicSidebar.jsx'
import CollapsibleSidebar from './CollapsibleSidebar.jsx'
import MinimalSidebar from './MinimalSidebar.jsx'

const sidebarVariantsMap = {
  classic: ClassicSidebar,
  collapsible: CollapsibleSidebar,
  minimal: MinimalSidebar,
}

export const DEFAULT_SIDEBAR_VARIANT = 'classic'

/**
 * The Sidebar registry: `resolve(variant)` returns the component to render and falls back to the
 * default (with a development warning) for an unknown name. Used by `<Sidebar variant>`.
 */
export const sidebarRegistry = createVariantRegistry({
  name: 'Sidebar',
  variants: sidebarVariantsMap,
  defaultVariant: DEFAULT_SIDEBAR_VARIANT,
})

/** Canonical variant names and their components. */
export const sidebarVariants = sidebarRegistry.variants

// Each design is also importable on its own.
export { ClassicSidebar, CollapsibleSidebar, MinimalSidebar }
