import { useId } from 'react'
import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'
import { getCategoryPath } from '../../../utils/discovery.js'

/* Full class names so Tailwind can detect them. */
const itemBase = [
  'flex w-full items-center justify-between gap-2 text-left text-sm transition-colors',
  focusRing,
].join(' ')

const itemSizes = { md: 'min-h-9 py-1.5', lg: 'min-h-11 py-2' }

const appearances = {
  // Pill highlight: used by the classic, collapsible sidebars and the drawer.
  filled: {
    item: 'rounded-control px-3',
    idle: 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
    active: 'bg-surface-muted font-semibold text-foreground',
    nested: 'ml-3 border-l border-border pl-1',
  },
  // Quiet text with a rule on the active row: used by the minimal sidebar.
  plain: {
    item: 'border-l-2 pl-3',
    idle: 'border-transparent text-foreground-muted hover:text-foreground',
    active: 'border-primary font-semibold text-foreground',
    nested: 'ml-3',
  },
}

function CategoryItem({ category, active, onSelect, appearance, size, labels }) {
  const styles = appearances[appearance]
  const isAll = category === null
  const label = isAll ? labels.allCategories : category.label
  const className = cn(itemBase, itemSizes[size], styles.item, active ? styles.active : styles.idle)
  const content = (
    <>
      <span className="min-w-0 truncate">{label}</span>
      {!isAll && category.count !== undefined && (
        <>
          <span aria-hidden="true" className="shrink-0 text-xs font-normal tabular-nums text-foreground-subtle">
            {category.count}
          </span>
          <span className="sr-only">, {labels.itemCount(category.count)}</span>
        </>
      )}
    </>
  )

  if (!isAll && category.href) {
    return (
      <a href={category.href} onClick={onSelect} aria-current={active ? 'page' : undefined} className={className}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onSelect} aria-current={active ? 'true' : undefined} className={className}>
      {content}
    </button>
  )
}

/** Children show only for the active category and its ancestors, so the tree stays short and fully controlled. */
function CategoryNodes({ items, leading, activeCategory, openIds, onCategoryChange, appearance, size, labels }) {
  return (
    <ul role="list">
      {leading}
      {items.map((category) => {
        const active = category.id === activeCategory
        const showChildren = category.children?.length > 0 && openIds.includes(category.id)
        return (
          <li key={category.id}>
            <CategoryItem
              category={category}
              active={active}
              appearance={appearance}
              size={size}
              labels={labels}
              onSelect={(event) => onCategoryChange?.(category.id, category, event)}
            />
            {showChildren && (
              <div className={appearances[appearance].nested}>
                <CategoryNodes
                  items={category.children}
                  activeCategory={activeCategory}
                  openIds={openIds}
                  onCategoryChange={onCategoryChange}
                  appearance={appearance}
                  size={size}
                  labels={labels}
                />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Category navigation: a <nav> with a heading and a (possibly nested) list.
 * Controlled by `activeCategory`; selecting calls `onCategoryChange`.
 */
export default function CategoryList({
  categories,
  activeCategory = null,
  onCategoryChange,
  labels,
  appearance = 'filled',
  size = 'md',
  headingLevel = 3,
  className,
}) {
  const headingId = useId()
  const Heading = `h${headingLevel}`
  const openIds = getCategoryPath(categories, activeCategory)

  return (
    <nav aria-labelledby={headingId} className={className}>
      <Heading id={headingId} className="pb-1 text-sm font-semibold text-foreground">
        {labels.categories}
      </Heading>
      <CategoryNodes
        items={categories}
        leading={
          labels.allCategories && (
            <li>
              <CategoryItem
                category={null}
                active={activeCategory === null || activeCategory === undefined}
                appearance={appearance}
                size={size}
                labels={labels}
                onSelect={(event) => onCategoryChange?.(null, null, event)}
              />
            </li>
          )
        }
        activeCategory={activeCategory}
        openIds={openIds}
        onCategoryChange={onCategoryChange}
        appearance={appearance}
        size={size}
        labels={labels}
      />
    </nav>
  )
}
