import { useId } from 'react'
import { cn } from '../../utils/cn.js'
import { Container } from '../../primitives/index.js'
import { focusRing } from '../../primitives/shared/styles.js'
import SectionHeader from '../SectionHeader/SectionHeader.jsx'
import MediaImage from '../shared/MediaImage.jsx'
import { sectionSpacing } from '../shared/spacing.js'

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}

const aspectClasses = {
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
}

const defaultLabels = {
  list: 'Featured categories',
  count: (count) => `${count} ${count === 1 ? 'product' : 'products'}`,
}

/**
 * Tile for one category. Always the same element for the whole tile: a link when it has an `href`,
 * a button when it only has a click handler, plain text otherwise. The photo is decorative, because
 * the category name is the tile's accessible name.
 */
function CategoryTile({ category, onClick, labels, className }) {
  const { label, image, count, description, href } = category
  const interactive = Boolean(href) || Boolean(onClick)
  const Tag = href ? 'a' : onClick ? 'button' : 'div'

  return (
    <Tag
      {...(href ? { href } : null)}
      {...(Tag === 'button' ? { type: 'button' } : null)}
      onClick={interactive ? (event) => onClick?.(category, event) : undefined}
      data-theme="dark"
      className={cn(
        'group relative block size-full overflow-hidden rounded-surface bg-surface text-start text-foreground',
        interactive && focusRing,
        className,
      )}
    >
      <MediaImage
        src={image?.src ?? image}
        className="absolute inset-0"
        imgClassName="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
      />
      {/* Scrim: the text sits on the darkest part, so it stays readable on any photo. */}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
        <span className="block font-display text-lg font-semibold tracking-tight sm:text-xl">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-white/85">{description}</span>}
        {typeof count === 'number' && <span className="mt-0.5 block text-sm text-white/85">{labels.count(count)}</span>}
      </div>
    </Tag>
  )
}

/**
 * Grid of photo tiles that lead into the catalog.
 *
 *  - `grid`    equal tiles, 2 columns on phones.
 *  - `mosaic`  the first tile is large (2x2 from `md`). Works best with 5 categories (1 large + 4 small).
 *
 * @param {object} props
 * @param {{ id?: string|number, label: string, href?: string, image?: string|{src: string}, count?: number, description?: string }[]} props.categories
 * @param {2|3|4} [props.columns=4]
 * @param {'grid'|'mosaic'} [props.layout='grid']
 * @param {'square'|'portrait'|'landscape'} [props.aspect='portrait']  Tile shape (`grid` only; `mosaic` sizes its own).
 * @param {(category, event) => void} [props.onCategoryClick]  Tiles with an `href` navigate unless you call `event.preventDefault()`.
 * @param {React.ReactNode} [props.title]
 * @param {React.ReactNode} [props.description]
 * @param {import('../shared/types.js').Action} [props.action]  "View all" link in the header.
 * @param {2|3|4} [props.headingLevel=2]
 * @param {'none'|'sm'|'md'|'lg'} [props.spacing='md']
 */
export default function FeaturedCategoryGrid({
  categories = [],
  columns = 4,
  layout = 'grid',
  aspect = 'portrait',
  onCategoryClick,
  title,
  description,
  action,
  onAction,
  headingLevel = 2,
  spacing = 'md',
  labels: labelOverrides,
  containerSize,
  id,
  className,
}) {
  const labels = { ...defaultLabels, ...labelOverrides }
  const headingId = useId()
  const items = categories.filter((category) => category && category.label)
  if (items.length === 0) return null

  const mosaic = layout === 'mosaic'

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      aria-label={title ? undefined : labels.list}
      className={cn(sectionSpacing[spacing], className)}
    >
      <Container size={containerSize} className="flex flex-col gap-8">
        <SectionHeader
          id={headingId}
          title={title}
          description={description}
          action={action}
          onAction={onAction}
          headingLevel={headingLevel}
        />
        <ul
          role="list"
          className={cn(
            'grid gap-3 sm:gap-4',
            mosaic ? 'grid-cols-2 md:grid-cols-4 md:grid-rows-2' : columnClasses[columns] ?? columnClasses[4],
          )}
        >
          {items.map((category, index) => (
            <li
              key={category.id ?? category.label}
              className={cn(
                'min-w-0',
                mosaic ? (index === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square') : aspectClasses[aspect],
              )}
            >
              <CategoryTile category={category} onClick={onCategoryClick} labels={labels} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
