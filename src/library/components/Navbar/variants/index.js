// Register each new design here. The key is the public `variant` name.
import { createVariantRegistry } from '../../../utils/variants.js'
import MinimalNavbar from './MinimalNavbar.jsx'
import CenteredLogoNavbar from './CenteredLogoNavbar.jsx'
import MegaMenuNavbar from './MegaMenuNavbar.jsx'
import CompactNavbar from './CompactNavbar.jsx'

/** Canonical variant names and their components (a plain object, so unused designs can be tree-shaken). */
export const navbarVariants = {
  minimal: MinimalNavbar,
  centered: CenteredLogoNavbar,
  mega: MegaMenuNavbar,
  compact: CompactNavbar,
}

export const DEFAULT_NAVBAR_VARIANT = 'minimal'

/** Extra accepted spellings, mapped to canonical names. */
export const navbarVariantAliases = { megaMenu: 'mega', centeredLogo: 'centered' }

/**
 * The Navbar registry (pure, so it is dropped when nothing uses it): `resolve(variant)` returns the component to render and falls back to the
 * default (with a development warning) for an unknown name. Used by `<Navbar variant>`.
 */
export const navbarRegistry = /* @__PURE__ */ createVariantRegistry({
  name: 'Navbar',
  variants: navbarVariants,
  defaultVariant: DEFAULT_NAVBAR_VARIANT,
  aliases: navbarVariantAliases,
})

// Each design is also importable on its own.
export { MinimalNavbar, CenteredLogoNavbar, MegaMenuNavbar, CompactNavbar }
