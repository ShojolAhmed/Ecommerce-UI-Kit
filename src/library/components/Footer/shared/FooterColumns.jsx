import { cn } from '../../../utils/cn.js'
import FooterLink from './FooterLink.jsx'
import { linkKey, validLinks } from './model.js'

/**
 * Titled link groups. The caller supplies the grid (`className`), so each
 * variant lays the columns out its own way.
 */
export default function FooterColumns({
  columns = [],
  headingLevel = 2,
  onNavigate,
  opensInNewTab,
  className,
  titleClassName,
  linkClassName,
  listClassName,
}) {
  const Heading = `h${headingLevel}`
  const groups = columns.filter((column) => column?.title && validLinks(column.links).length > 0)
  if (groups.length === 0) return null

  return (
    <div className={cn('grid', className)}>
      {groups.map((column) => (
        <section key={column.id ?? column.title} className="min-w-0">
          <Heading className={cn('mb-4 text-sm font-semibold text-foreground', titleClassName)}>{column.title}</Heading>
          <ul role="list" className={cn('flex flex-col gap-2.5', listClassName)}>
            {validLinks(column.links).map((link) => (
              <li key={linkKey(link)}>
                <FooterLink link={link} onNavigate={onNavigate} opensInNewTab={opensInNewTab} className={linkClassName} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
