// Register each new design here. The key is the public `variant` name.
import { createVariantRegistry } from '../../../utils/variants.js'
import MinimalNavbar from './MinimalNavbar.jsx'
import CenteredLogoNavbar from './CenteredLogoNavbar.jsx'
import MegaMenuNavbar from './MegaMenuNavbar.jsx'
import CompactNavbar from './CompactNavbar.jsx'

const navbarVariantsMap = {
  minimal: MinimalNavbar,
  centered: CenteredLogoNavbar,
  mega: MegaMenuNavbar,
  compact: CompactNavbar,
}

export const DEFAULT_NAVBAR_VARIANT = 'minimal'

/**
 * The Navbar registry: `resolve(variant)` returns the component to render and falls back to the
 * default (with a development warning) for an unknown name. Used by `<Navbar variant>`.
 */
export const navbarRegistry = createVariantRegistry({
  name: 'Navbar',
  variants: navbarVariantsMap,
  defaultVariant: DEFAULT_NAVBAR_VARIANT,
  aliases: { megaMenu: 'mega', centeredLogo: 'centered' },
})

/** Canonical variant names and their components. */
export const navbarVariants = navbarRegistry.variants

/** Extra accepted spellings, mapped to canonical names. */
export const navbarVariantAliases = navbarRegistry.aliases

// Each design is also importable on its own.
export { MinimalNavbar, CenteredLogoNavbar, MegaMenuNavbar, CompactNavbar }
