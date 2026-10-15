import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'

/** Footer text link. Reports clicks through `onNavigate(item, event)`. */
export default function FooterLink({ link, onNavigate, opensInNewTab, className }) {
  return (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      onClick={(event) => onNavigate?.(link, event)}
      className={cn(
        'rounded-sm text-sm text-foreground-muted underline-offset-4 transition-colors hover:text-foreground hover:underline',
        focusRing,
        className,
      )}
    >
      {link.label}
      {link.external && <span className="sr-only"> {opensInNewTab}</span>}
    </a>
  )
}
