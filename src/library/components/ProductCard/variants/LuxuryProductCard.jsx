import { cn } from '../../../utils/cn.js'
import AddToCartButton from '../shared/AddToCartButton.jsx'
import ProductImage from '../shared/ProductImage.jsx'
import ProductPrice from '../shared/ProductPrice.jsx'
import ProductRating from '../shared/ProductRating.jsx'
import ProductTitle from '../shared/ProductTitle.jsx'
import WishlistButton from '../shared/WishlistButton.jsx'
import { buildProductCardModel } from '../shared/model.js'

/**
 * Premium card: tall portrait image, square corners, wide letter-spacing,
 * centered text in the brand's `font-display` face, and a slow image zoom.
 * Badges become understated outlined labels instead of colored pills.
 *
 * @param {import('../types.js').ProductCardProps} props
 */
export default function LuxuryProductCard(props) {
  const model = buildProductCardModel(props)
  const label = model.badges[0]

  return (
    <article className={cn('group relative flex flex-col gap-5 text-center', props.className)}>
      <ProductImage
        src={model.image.src}
        alt={model.image.alt}
        dimmed={!model.inStock}
        className="aspect-[3/4]"
        imgClassName="transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
      >
        {label && (
          <span className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate border sm:bottom-auto sm:top-3 sm:max-w-[calc(100%-5rem)] border-border-strong bg-surface/90 px-2 py-1 text-[0.625rem] uppercase leading-none tracking-[0.2em] text-foreground">
            {label.label}
          </span>
        )}
        <WishlistButton model={model} className="right-3 top-3" />
      </ProductImage>

      <div className="flex flex-1 flex-col items-center gap-2 px-1">
        {model.brand && <p className="text-[0.6875rem] uppercase tracking-[0.25em] text-foreground-subtle">{model.brand}</p>}
        <ProductTitle
          model={model}
          radius="none"
          className="line-clamp-2 font-display text-base font-light tracking-wide text-foreground sm:text-lg"
        />
        <ProductPrice
          model={model}
          className="justify-center tracking-wide"
          currentClassName="text-sm font-normal"
          originalClassName="text-xs"
        />
        <ProductRating model={model} className="justify-center" />
      </div>

      {/* The primitive already sets a radius and a font size; `!` overrides them (utility order, not class order, decides). */}
      <AddToCartButton
        model={model}
        variant="outline"
        icon={false}
        className="rounded-none! text-xs! uppercase tracking-[0.2em]"
      />
    </article>
  )
}
