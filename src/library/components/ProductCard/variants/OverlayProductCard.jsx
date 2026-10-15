import { cn } from '../../../utils/cn.js'
import AddToCartButton from '../shared/AddToCartButton.jsx'
import { ProductBadges } from '../shared/ProductBadges.jsx'
import ProductImage from '../shared/ProductImage.jsx'
import ProductPrice from '../shared/ProductPrice.jsx'
import ProductRating from '../shared/ProductRating.jsx'
import ProductTitle from '../shared/ProductTitle.jsx'
import WishlistButton from '../shared/WishlistButton.jsx'
import { buildProductCardModel } from '../shared/model.js'
import { controlLayer, revealOnHover } from '../shared/styles.js'

/**
 * Image-overlay card with quick actions: the wishlist toggle sits on the image
 * and an add-to-cart bar slides up over its lower edge. On hover-capable
 * devices the bar appears on hover or keyboard focus; on touch screens it is
 * always visible. Text stays below the image, so it never competes with the
 * photo for contrast.
 *
 * @param {import('../types.js').ProductCardProps} props
 */
export default function OverlayProductCard(props) {
  const model = buildProductCardModel(props)

  return (
    <article className={cn('group relative flex flex-col gap-3', props.className)}>
      <ProductImage
        src={model.image.src}
        alt={model.image.alt}
        dimmed={!model.inStock}
        className="aspect-[4/5] rounded-surface"
        imgClassName="transition-transform duration-500 motion-safe:group-hover:scale-105"
      >
        <ProductBadges badges={model.badges} max={2} className="absolute left-2 top-2 max-w-[calc(100%-3.5rem)]" />
        <WishlistButton model={model} className="right-2 top-2" />
        {model.actions.addToCart && (
          <div className={cn('absolute inset-x-0 bottom-0 p-3', controlLayer, revealOnHover)}>
            <AddToCartButton model={model} className="shadow-md" />
          </div>
        )}
      </ProductImage>

      <div className="flex flex-col gap-1">
        {model.brand && <p className="text-xs uppercase tracking-wide text-foreground-subtle">{model.brand}</p>}
        <ProductTitle model={model} className="line-clamp-2 text-sm font-medium text-foreground" />
        <ProductRating model={model} />
        <ProductPrice model={model} className="text-sm" />
      </div>
    </article>
  )
}
