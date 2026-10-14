import { cn } from '../../../utils/cn.js'
import { Badge } from '../../../primitives/index.js'

/**
 * One navigation link. Variants pass their own look through `className`
 * (and `currentClassName` for the active page); behaviour is identical everywhere.
 */
export default function NavLink({ item, onNavigate, className, currentClassName }) {
  return (
    <a
      href={item.href}
      aria-current={item.current ? 'page' : undefined}
      onClick={(event) => onNavigate?.(item, event)}
      className={cn(className, item.current && currentClassName)}
    >
      {item.label}
      {item.badge && (
        <Badge variant="danger" className="ml-1.5">
          {item.badge}
        </Badge>
      )}
    </a>
  )
}
