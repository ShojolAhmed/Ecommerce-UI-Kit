import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'

/** Wordmark (or logo) link, with the store description underneath when asked. */
export default function FooterBrand({ brand, onNavigate, showDescription = true, className, wordmarkClassName }) {
  const { name, href = '/', logo, description } = brand

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <a
        href={href}
        aria-label={logo ? name : undefined}
        onClick={(event) => onNavigate?.({ ...brand, id: 'brand', label: name }, event)}
        className={cn('inline-flex w-fit items-center rounded-sm', focusRing, wordmarkClassName)}
      >
        {logo ?? name}
      </a>
      {showDescription && description && (
        <p className="max-w-sm text-sm text-foreground-muted text-pretty">{description}</p>
      )}
    </div>
  )
}
