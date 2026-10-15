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
 * Minimal product card: borderless, image on top, quiet text below and an
 * outlined add-to-cart button. Lets the photography do the work.
 *
 * @param {import('../types.js').ProductCardProps} props
 */
export default function MinimalProductCard(props) {
  const model = buildProductCardModel(props)

  return (
    <article className={cn('group relative flex flex-col gap-3', props.className)}>
      <ProductImage
        src={model.image.src}
        alt={model.image.alt}
        dimmed={!model.inStock}
        className="aspect-square rounded-surface"
      >
        <ProductBadges badges={model.badges} max={1} className="absolute left-2 top-2 max-w-[calc(100%-3.5rem)]" />
        <WishlistButton model={model} className="right-2 top-2" />
      </ProductImage>

      <div className="flex flex-1 flex-col gap-1">
        <ProductTitle model={model} className="line-clamp-2 text-sm font-medium text-foreground" />
        <ProductRating model={model} />
        <ProductPrice model={model} className="text-sm" />
      </div>

      <AddToCartButton model={model} variant="outline" size="sm" />
    </article>
  )
}
