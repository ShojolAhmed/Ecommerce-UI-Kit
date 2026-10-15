// Register each new design here. The key is the public `variant` name.
import MinimalProductCard from './MinimalProductCard.jsx'
import SaleProductCard from './SaleProductCard.jsx'
import OverlayProductCard from './OverlayProductCard.jsx'
import HorizontalProductCard from './HorizontalProductCard.jsx'
import LuxuryProductCard from './LuxuryProductCard.jsx'

export const productCardVariants = {
  minimal: MinimalProductCard,
  sale: SaleProductCard,
  overlay: OverlayProductCard,
  horizontal: HorizontalProductCard,
  luxury: LuxuryProductCard,
}

export const DEFAULT_PRODUCT_CARD_VARIANT = 'minimal'

/**
 * Grid defaults per variant (used by ProductGrid): `columns` is the responsive
 * column classes and `gap` the spacing that suits the design. Keep full class
 * names so Tailwind can detect them.
 */
export const productCardLayouts = {
  minimal: { columns: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4', gap: 'gap-x-4 gap-y-8' },
  sale: { columns: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4', gap: 'gap-3 sm:gap-4' },
  overlay: { columns: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4', gap: 'gap-x-4 gap-y-8' },
  horizontal: { columns: 'grid-cols-1 lg:grid-cols-2', gap: 'gap-4' },
  luxury: { columns: 'grid-cols-2 lg:grid-cols-3', gap: 'gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14' },
}
