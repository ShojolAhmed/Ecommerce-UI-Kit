import { useId, useMemo } from 'react'
import { cn } from '../../utils/cn.js'
import { Container, IconButton } from '../../primitives/index.js'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons/index.jsx'
import { ProductCard } from '../ProductCard/index.js'
import { DEFAULT_PRODUCT_CARD_VARIANT, productCardVariants } from '../ProductCard/variants/index.js'
import { ProductGrid } from '../ProductGrid/index.js'
import SectionHeader from '../SectionHeader/SectionHeader.jsx'
import { sectionSpacing } from '../shared/spacing.js'
import { useCarousel } from './useCarousel.js'

// Width of one carousel item, by how many are visible on wide screens (gap is 1rem).
const slideSizes = {
  2: 'basis-[72%] sm:basis-[calc((100%-1rem)/2)]',
  3: 'basis-[72%] sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]',
  4: 'basis-[72%] sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)] xl:basis-[calc((100%-3rem)/4)]',
}

const defaultLabels = {
  list: 'Featured products',
  previous: 'Previous products',
  next: 'Next products',
}

const isValidProduct = (product) =>
  Boolean(product) && product.id != null && typeof product.name === 'string' && product.name.trim() !== ''

/** One scrolling row of cards plus its arrows (placed in the section header). */
function ProductCarousel({ items, columns, variant, wishlisted, adding, cardProps, listLabel, header, labels }) {
  const { listRef, atStart, atEnd, scrollByPage } = useCarousel(items.length)

  const arrows = (
    <div className="flex gap-2">
      <IconButton label={labels.previous} variant="outline" shape="pill" disabled={atStart} onClick={() => scrollByPage(-1)}>
        <ChevronLeftIcon />
      </IconButton>
      <IconButton label={labels.next} variant="outline" shape="pill" disabled={atEnd} onClick={() => scrollByPage(1)}>
        <ChevronRightIcon />
      </IconButton>
    </div>
  )

  return (
    <>
      <SectionHeader {...header} endSlot={items.length > 1 ? arrows : undefined} />
      <ul
        ref={listRef}
        role="list"
        aria-label={listLabel}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((product) => (
          <li key={product.id} className={cn('min-w-0 shrink-0 snap-start', slideSizes[columns] ?? slideSizes[4])}>
            <ProductCard
              {...cardProps}
              variant={variant}
              product={product}
              isWishlisted={wishlisted.has(product.id)}
              addingToCart={adding.has(product.id)}
              className="h-full"
            />
          </li>
        ))}
      </ul>
    </>
  )
}

/**
 * Section of hand-picked products, built from the library's ProductCard.
 *
 *  - `grid`      a ProductGrid (wraps to as many rows as needed).
 *  - `carousel`  one swipeable, scroll-snapping row with previous / next buttons (disabled at either
 *                end). It is plain scrolling, so touch, wheel and keyboard all work natively, and
 *                tabbing to a card scrolls it into view.
 *
 * Card props (`onAddToCart`, `onToggleWishlist`, `onProductClick`, `wishlistedIds`, `addingToCartIds`,
 * `currency`, `locale`, `formatPrice`) are forwarded to the cards; see ProductCard. The page owns all
 * cart and wishlist state.
 *
 * @param {object} props
 * @param {import('../ProductCard/types.js').Product[]} props.products
 * @param {'grid'|'carousel'} [props.layout='grid']
 * @param {'minimal'|'sale'|'overlay'|'horizontal'|'luxury'} [props.variant='minimal']  Card design.
 * @param {2|3|4} [props.columns=4]  Cards per row on wide screens.
 * @param {React.ReactNode} [props.title]
 * @param {React.ReactNode} [props.description]
 * @param {import('../shared/types.js').Action} [props.action]  "View all" link in the header.
 * @param {2|3|4} [props.headingLevel=2]  Product names use the next level unless `cardHeadingLevel` is set.
 * @param {2|3|4|5|6} [props.cardHeadingLevel]
 * @param {object} [props.cardLabels]  Passed to each card as `labels` (see ProductCard).
 * @param {{ list?: string, previous?: string, next?: string }} [props.labels]  Section strings.
 * @param {'none'|'sm'|'md'|'lg'} [props.spacing='md']
 */
export default function FeaturedProducts({
  products = [],
  layout = 'grid',
  variant = DEFAULT_PRODUCT_CARD_VARIANT,
  columns = 4,
  title,
  description,
  action,
  onAction,
  headingLevel = 2,
  cardHeadingLevel,
  cardLabels,
  wishlistedIds,
  addingToCartIds,
  spacing = 'md',
  labels: sectionLabels,
  containerSize,
  id,
  className,
  ...cardProps
}) {
  const labels = { ...defaultLabels, ...sectionLabels }
  const headingId = useId()
  const wishlisted = useMemo(() => new Set(wishlistedIds ?? []), [wishlistedIds])
  const adding = useMemo(() => new Set(addingToCartIds ?? []), [addingToCartIds])
  const items = useMemo(() => products.filter(isValidProduct), [products])

  const forwarded = {
    ...cardProps,
    labels: cardLabels,
    headingLevel: cardHeadingLevel ?? Math.min(headingLevel + 1, 6),
  }
  const header = { id: headingId, title, description, action, onAction, headingLevel }

  if (!productCardVariants[variant]) {
    if (import.meta.env?.DEV) {
      console.warn(`[FeaturedProducts] Unknown variant "${variant}". Available: ${Object.keys(productCardVariants).join(', ')}`)
    }
    return null
  }

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      aria-label={title ? undefined : labels.list}
      className={cn(sectionSpacing[spacing], className)}
    >
      <Container size={containerSize} className="flex flex-col gap-8">
        {layout === 'carousel' && items.length > 0 ? (
          <ProductCarousel
            items={items}
            columns={columns}
            variant={variant}
            wishlisted={wishlisted}
            adding={adding}
            cardProps={forwarded}
            listLabel={title ? undefined : labels.list}
            header={header}
            labels={labels}
          />
        ) : (
          <>
            <SectionHeader {...header} />
            <ProductGrid
              {...forwarded}
              products={items}
              variant={variant}
              columns={columns}
              wishlistedIds={wishlistedIds}
              addingToCartIds={addingToCartIds}
              label={title ? undefined : labels.list}
            />
          </>
        )}
      </Container>
    </section>
  )
}
