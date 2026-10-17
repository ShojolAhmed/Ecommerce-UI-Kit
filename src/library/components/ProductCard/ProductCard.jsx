import { productCardRegistry, productCardVariants } from './variants/index.js'

/**
 * Variant-switching ProductCard. All variants share the props contract
 * documented in `types.js` (ProductCardProps), so designs can be swapped by
 * changing only `variant`.
 * An unknown `variant` falls back to the default design and warns once in development.
 *
 * @param {import('./types.js').ProductCardProps & { variant?: 'minimal'|'sale'|'overlay'|'horizontal'|'luxury' }} props
 */
export default function ProductCard({ variant, ...props }) {
  // resolveId never returns an unregistered name, so this lookup always finds a component.
  const Variant = productCardVariants[productCardRegistry.resolveId(variant)]
  return <Variant {...props} />
}
