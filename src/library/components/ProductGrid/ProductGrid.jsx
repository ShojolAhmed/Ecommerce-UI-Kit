import { useMemo } from 'react'
import { cn } from '../../utils/cn.js'
import { ProductCard } from '../ProductCard/index.js'
import {
  productCardLayouts,
  productCardRegistry,
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
 * With nothing to show it renders, in this order: `error` (an alert), placeholders while `loading`,
 * then the empty state. With products present, `loading` only marks the list busy (a refetch).
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
  loading = false,
  loadingCount = 8,
  loadingLabel = 'Loading products',
  error,
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

  // Resolve once so the grid layout and the cards always use the same (possibly fallback) design.
  const variantId = productCardRegistry.resolveId(variant)
  const layout = productCardLayouts[variantId]

  if (items.length === 0 && error) {
    return <div role="alert">{error}</div>
  }

  if (items.length === 0 && loading) {
    const count = Number.isInteger(loadingCount) && loadingCount > 0 ? Math.min(loadingCount, 24) : 8
    return (
      <div aria-busy="true">
        <p role="status" className="sr-only">
          {loadingLabel}
        </p>
        <ul
          role="list"
          aria-hidden="true"
          className={cn('grid', gridColumns[columns] ?? layout.columns, layout.gap, className)}
        >
          {Array.from({ length: count }, (_, index) => (
            <li key={index} className="aspect-[4/5] min-w-0 rounded-surface bg-surface-muted motion-safe:animate-pulse" />
          ))}
        </ul>
      </div>
    )
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
      aria-busy={loading || undefined}
      className={cn('grid', gridColumns[columns] ?? layout.columns, layout.gap, className)}
    >
      {items.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard
            {...cardProps}
            variant={variantId}
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
