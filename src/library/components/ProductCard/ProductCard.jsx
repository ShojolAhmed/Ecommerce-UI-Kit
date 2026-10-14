import { productCardVariants, DEFAULT_PRODUCT_CARD_VARIANT } from './variants/index.js'

/**
 * Variant-switching ProductCard. All variants share the same props contract,
 * so designs can be swapped by changing only `variant`.
 *
 * @param {object} props
 * @param {string} [props.variant='classic']
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
