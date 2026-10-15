import { cn } from '../../../utils/cn.js'
import AddToCartButton from '../shared/AddToCartButton.jsx'
import { ProductBadges } from '../shared/ProductBadges.jsx'
import ProductImage from '../shared/ProductImage.jsx'
import ProductPrice from '../shared/ProductPrice.jsx'
import ProductRating from '../shared/ProductRating.jsx'
import ProductTitle from '../shared/ProductTitle.jsx'
import WishlistButton from '../shared/WishlistButton.jsx'
import { buildProductCardModel } from '../shared/model.js'

/**
 * Horizontal card: image on the left, details on the right. Suits search
 * results, cart suggestions and list views. The only variant that shows
 * `product.description` (from `sm` up, where there is room for it).
 *
 * @param {import('../types.js').ProductCardProps} props
 */
export default function HorizontalProductCard(props) {
  const model = buildProductCardModel(props)

  return (
    <article
      className={cn(
        'group relative flex gap-3 rounded-surface border border-border bg-surface p-3 transition-shadow hover:shadow-md sm:gap-4 sm:p-4',
        props.className,
      )}
    >
      <ProductImage
        src={model.image.src}
        alt={model.image.alt}
        dimmed={!model.inStock}
        className="aspect-square w-28 shrink-0 self-start rounded-lg sm:w-44"
      >
        {/* The phone-width image is too narrow for a badge beside the heart, so it moves to the bottom edge. */}
        <ProductBadges
          badges={model.badges}
          max={1}
          className="absolute bottom-1.5 left-1.5 max-w-[calc(100%-0.75rem)] sm:bottom-auto sm:top-1.5 sm:max-w-[calc(100%-3.5rem)]"
        />
        <WishlistButton model={model} size="sm" className="right-1.5 top-1.5" />
      </ProductImage>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {model.brand && <p className="text-xs uppercase tracking-wide text-foreground-subtle">{model.brand}</p>}
        <ProductTitle model={model} className="line-clamp-2 text-base font-semibold text-foreground" />
        <ProductRating model={model} />
        {model.description && (
          <p className="mt-1 line-clamp-2 hidden text-sm text-foreground-muted sm:block">{model.description}</p>
        )}
        <ProductPrice model={model} className="mt-1" currentClassName="text-lg font-semibold" originalClassName="text-sm" />
        <div className="mt-auto pt-2">
          <AddToCartButton model={model} size="sm" fullWidth={false} className="w-full sm:w-auto" />
        </div>
      </div>
    </article>
  )
}
