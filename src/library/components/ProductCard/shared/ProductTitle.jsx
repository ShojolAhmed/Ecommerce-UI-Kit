import { cn } from '../../../utils/cn.js'
import { stretchedLink, stretchedRadius } from './styles.js'

/**
 * The product name, and the card's one click target.
 *
 *  - `href` set            → a real link (open in new tab, copy address…)
 *  - only `onProductClick` → a button
 *  - neither               → plain text, and the card is not clickable
 *
 * The link is stretched over the whole card (see `stretchedLink`), so the
 * image and the empty space are clickable without nesting interactive elements.
 * The card root must be `relative`.
 *
 * @param {object} props
 * @param {ReturnType<import('./model.js').buildProductCardModel>} props.model
 * @param {'surface'|'none'} [props.radius='surface']  Corner radius of the clickable layer.
 */
export default function ProductTitle({ model, radius = 'surface', className }) {
  const Heading = `h${model.headingLevel}`
  const { name, href, actions } = model
  const linkClass = cn(stretchedLink, stretchedRadius[radius], 'group-hover:underline underline-offset-4')

  let content = name
  if (href) {
    content = (
      <a href={href} onClick={actions.click ?? undefined} className={linkClass}>
        {name}
      </a>
    )
  } else if (actions.click) {
    content = (
      <button type="button" onClick={actions.click} className={cn(linkClass, 'text-start')}>
        {name}
      </button>
    )
  }

  return <Heading className={cn('text-pretty', className)}>{content}</Heading>
}
