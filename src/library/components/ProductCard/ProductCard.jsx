import { productCardVariants, DEFAULT_PRODUCT_CARD_VARIANT } from './variants/index.js'

/**
 * Variant-switching ProductCard. All variants share the props contract
 * documented in `types.js` (ProductCardProps), so designs can be swapped by
 * changing only `variant`.
 *
 * @param {import('./types.js').ProductCardProps & { variant?: 'minimal'|'sale'|'overlay'|'horizontal'|'luxury' }} props
 */
export default function ProductCard({ variant = DEFAULT_PRODUCT_CARD_VARIANT, ...props }) {
  const Variant = productCardVariants[variant]

  if (!Variant) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[ProductCard] Unknown variant "${variant}". Available: ${Object.keys(productCardVariants).join(', ')}`,
      )
    }
    return null
  }

  return <Variant {...props} />
}
