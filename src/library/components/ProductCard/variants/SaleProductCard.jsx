import { cn } from '../../../utils/cn.js'
import AddToCartButton from '../shared/AddToCartButton.jsx'
import { DiscountBadge, ProductBadges } from '../shared/ProductBadges.jsx'
import ProductImage from '../shared/ProductImage.jsx'
import ProductPrice from '../shared/ProductPrice.jsx'
import ProductRating from '../shared/ProductRating.jsx'
import ProductTitle from '../shared/ProductTitle.jsx'
import WishlistButton from '../shared/WishlistButton.jsx'
import { buildProductCardModel } from '../shared/model.js'

/**
 * Sale-focused card: a bold discount badge on the image, the price in the
 * danger color, the struck-through original, and an explicit "Save $X" line.
 * Without a real discount it falls back to a plain price, so mixed catalogs
 * can use this variant everywhere.
 *
 * @param {import('../types.js').ProductCardProps} props
 */
export default function SaleProductCard(props) {
  const model = buildProductCardModel(props)
  const { discount } = model.price

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-surface border border-border bg-surface shadow-xs transition-shadow hover:shadow-md',
        props.className,
      )}
    >
      <ProductImage src={model.image.src} alt={model.image.alt} dimmed={!model.inStock} className="aspect-square">
        <div className="pointer-events-none absolute left-2 top-2 flex max-w-[calc(100%-3.5rem)] flex-col items-start gap-1">
          <DiscountBadge model={model} />
          <ProductBadges badges={model.badges} max={2} />
        </div>
        <WishlistButton model={model} className="right-2 top-2" />
      </ProductImage>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <ProductTitle model={model} radius="surface" className="line-clamp-2 text-sm font-medium text-foreground" />
        <ProductRating model={model} />
        <ProductPrice
          model={model}
          className="mt-0.5"
          currentClassName={cn('text-xl font-bold', discount && 'text-danger')}
          originalClassName="text-sm"
        />
        {discount && <p className="text-sm font-medium text-success">{model.labels.save(discount.amountText)}</p>}
        <div className="mt-auto pt-2">
          <AddToCartButton model={model} />
        </div>
      </div>
    </article>
  )
}
