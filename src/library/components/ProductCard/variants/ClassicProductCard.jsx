import { cn } from '../../../utils/cn.js'

/**
 * Classic product card: image on top, details below.
 *
 * @param {object}   props
 * @param {object}   props.product  { id, title, price, image, category? }
 * @param {Function} [props.onAddToCart]
 * @param {string}   [props.className]
 */
export default function ClassicProductCard({ product, onAddToCart, className }) {
  const { title, price, image, category } = product

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
        className,
      )}
    >
      <img src={image} alt={title} className="aspect-square w-full object-cover" />
      <div className="flex flex-1 flex-col gap-1 p-4">
        {category && (
          <span className="text-xs uppercase tracking-wide text-slate-500">{category}</span>
        )}
        <h3 className="font-medium text-slate-900">{title}</h3>
        <p className="text-lg font-semibold text-slate-900">${price.toFixed(2)}</p>
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="mt-auto rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
