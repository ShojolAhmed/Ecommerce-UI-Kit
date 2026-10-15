import { useMemo } from 'react'
import { cn } from '../../utils/cn.js'
import { ProductCard } from '../ProductCard/index.js'
import {
  productCardLayouts,
  productCardVariants,
  DEFAULT_PRODUCT_CARD_VARIANT,
} from '../ProductCard/variants/index.js'
import { gridColumns } from './gridStyles.js'

const isValidProduct = (product) =>
  Boolean(product) &&
  product.id !== undefined &&
  product.id !== null &&
  typeof product.name === 'string' &&
  product.name.trim() !== ''

/**
 * Responsive grid that renders every product with the selected card variant.
 * Presentational only: wishlist and busy state come in as id lists, and all
 * actions go out through callbacks, so the page owns the real logic.
 *
 * Entries without an `id` or a `name` are skipped (with a warning in development).
 *
 * @param {import('./types.js').ProductGridProps} props
 */
export default function ProductGrid({
  products = [],
  variant = DEFAULT_PRODUCT_CARD_VARIANT,
  columns,
  wishlistedIds,
  addingToCartIds,
  emptyState,
  label,
  className,
  cardClassName,
  ...cardProps
}) {
  const wishlisted = useMemo(() => new Set(wishlistedIds ?? []), [wishlistedIds])
  const adding = useMemo(() => new Set(addingToCartIds ?? []), [addingToCartIds])

  const items = useMemo(() => {
    const valid = products.filter(isValidProduct)
    if (import.meta.env?.DEV && valid.length !== products.length) {
      console.warn(
        `[ProductGrid] Skipped ${products.length - valid.length} product(s) without an "id" or "name".`,
      )
    }
    return valid
  }, [products])

  const layout = productCardLayouts[variant]
  if (!layout) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[ProductGrid] Unknown variant "${variant}". Available: ${Object.keys(productCardVariants).join(', ')}`,
      )
    }
    return null
  }

  if (items.length === 0) {
    return (
      emptyState ?? (
        <p className="rounded-surface border border-dashed border-border-strong p-8 text-center text-sm text-foreground-muted">
          No products to show.
        </p>
      )
    )
  }

  return (
    <ul
      role="list" // Safari drops list semantics from unstyled lists
      aria-label={label}
      className={cn('grid', gridColumns[columns] ?? layout.columns, layout.gap, className)}
    >
      {items.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard
            {...cardProps}
            variant={variant}
            product={product}
            isWishlisted={wishlisted.has(product.id)}
            addingToCart={adding.has(product.id)}
            className={cn('h-full', cardClassName)}
          />
        </li>
      ))}
    </ul>
  )
}
