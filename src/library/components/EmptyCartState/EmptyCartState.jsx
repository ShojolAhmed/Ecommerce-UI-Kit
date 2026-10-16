import { cn } from '../../utils/cn.js'
import { ShoppingBagIcon } from '../../icons/index.jsx'
import Cta from '../shared/Cta.jsx'

const defaultLabels = {
  title: 'Your cart is empty',
  description: 'Add something you love and it will show up here.',
}

const sizes = {
  sm: { root: 'gap-3 px-4 py-8', icon: 'size-12', iconGlyph: 'size-6', title: 'text-base' },
  md: { root: 'gap-4 px-6 py-14', icon: 'size-16', iconGlyph: 'size-8', title: 'text-xl' },
}

/**
 * What to show when there is nothing in the cart: an icon, a message and a way forward
 * (usually "Continue shopping"). Purely presentational; it knows nothing about the cart.
 * It sits well inside the cart drawer (`size="sm"`) and on a cart page (`size="md"`).
 *
 * @param {object} props
 * @param {React.ReactNode} [props.title]
 * @param {React.ReactNode} [props.description]
 * @param {import('../shared/types.js').Action} [props.action]           Primary call to action; link with `href`, else button.
 * @param {import('../shared/types.js').Action} [props.secondaryAction]
 * @param {(action, event) => void} [props.onAction]  Called for both actions, after the action's own `onClick`.
 * @param {React.ReactNode} [props.icon]   Replaces the built-in bag icon (decorative).
 * @param {'sm'|'md'} [props.size='md']
 * @param {2|3|4|5|6} [props.headingLevel=2]
 * @param {React.ReactNode} [props.children]  Extra content under the actions (suggested products).
 */
export default function EmptyCartState({
  title,
  description,
  action,
  secondaryAction,
  onAction,
  icon,
  size = 'md',
  headingLevel = 2,
  children,
  className,
}) {
  const scale = sizes[size] ?? sizes.md
  const Heading = `h${Math.min(Math.max(headingLevel, 2), 6)}`

  return (
    <div className={cn('flex flex-col items-center text-center', scale.root, className)}>
      <span aria-hidden="true" className={cn('flex items-center justify-center rounded-full bg-surface-muted text-foreground-muted', scale.icon)}>
        {icon ?? <ShoppingBagIcon className={scale.iconGlyph} />}
      </span>
      <div className="space-y-1">
        <Heading className={cn('font-semibold text-balance', scale.title)}>{title ?? defaultLabels.title}</Heading>
        <p className="mx-auto max-w-sm text-sm text-foreground-muted text-pretty">{description ?? defaultLabels.description}</p>
      </div>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap justify-center gap-2">
          <Cta action={action} onAction={onAction} size={size === 'sm' ? 'md' : 'lg'} />
          <Cta action={secondaryAction} onAction={onAction} variant="outline" size={size === 'sm' ? 'md' : 'lg'} />
        </div>
      )}
      {children}
    </div>
  )
}
