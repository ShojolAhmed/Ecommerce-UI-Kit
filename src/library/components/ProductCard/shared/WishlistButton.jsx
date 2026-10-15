import { IconButton } from '../../../primitives/index.js'
import { cn } from '../../../utils/cn.js'
import { HeartIcon } from './icons.jsx'
import { controlLayer } from './styles.js'

/**
 * Heart toggle, laid over the nearest positioned ancestor (the image frame).
 * `className` only supplies the offsets (e.g. `right-2 top-2`): the button sits
 * in its own absolutely positioned wrapper because the Button primitive is
 * already `relative`, and two position utilities on one element conflict.
 *
 * The accessible name stays constant ("Add to wishlist: Name") and
 * `aria-pressed` carries the state. Renders nothing without `onToggleWishlist`.
 *
 * @param {object} props
 * @param {ReturnType<import('./model.js').buildProductCardModel>} props.model
 * @param {string} [props.className]  Offsets and extras for the wrapper.
 */
export default function WishlistButton({ model, variant = 'secondary', size = 'md', shape = 'pill', className }) {
  if (!model.actions.toggleWishlist) return null
  const active = model.isWishlisted

  return (
    <div className={cn('absolute', controlLayer, className)}>
      <IconButton
        label={`${model.labels.wishlist}: ${model.name}`}
        aria-pressed={active}
        variant={variant}
        size={size}
        shape={shape}
        onClick={model.actions.toggleWishlist}
        className="shadow-sm"
      >
        <HeartIcon filled={active} className={active ? 'text-danger' : undefined} />
      </IconButton>
    </div>
  )
}
