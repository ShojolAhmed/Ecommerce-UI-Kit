// Register each new design here. The key is the public `variant` name.
import MinimalNavbar from './MinimalNavbar.jsx'
import CenteredLogoNavbar from './CenteredLogoNavbar.jsx'
import MegaMenuNavbar from './MegaMenuNavbar.jsx'
import CompactNavbar from './CompactNavbar.jsx'

export const navbarVariants = {
  minimal: MinimalNavbar,
  centered: CenteredLogoNavbar,
  mega: MegaMenuNavbar,
  compact: CompactNavbar,
}

export const DEFAULT_NAVBAR_VARIANT = 'minimal'
