import { useRef, useState, useId } from 'react'
import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'
import { Badge, IconButton } from '../../../primitives/index.js'
import { itemKey } from './model.js'
import { useDialogBehavior } from './useDialogBehavior.js'
import SearchField from './SearchField.jsx'

const placements = {
  left: {
    panel: 'inset-y-0 left-0 w-[min(22rem,88vw)] motion-safe:animate-ui-slide-left',
  },
  right: {
    panel: 'inset-y-0 right-0 w-[min(22rem,88vw)] motion-safe:animate-ui-slide-right',
  },
  bottom: {
    panel: 'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl motion-safe:animate-ui-slide-up',
  },
}

const rowClass = cn(
  'flex w-full items-center justify-between gap-3 rounded-control px-3 py-3 text-left text-base font-medium text-foreground',
  'transition-colors hover:bg-surface-muted',
  focusRing,
)

/** Top-level link with sub-links, shown as an expandable group. */
function MobileGroup({ item, icons, onNavigate, onClose }) {
  const [expanded, setExpanded] = useState(false)
  const contentId = useId()
  const follow = (target) => (event) => {
    onNavigate?.(target, event)
    onClose()
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={expanded ? contentId : undefined}
        onClick={() => setExpanded((value) => !value)}
        className={rowClass}
      >
        <span>{item.label}</span>
        <span aria-hidden="true" className={cn('transition-transform', expanded && 'rotate-180')}>
          {icons.chevron}
        </span>
      </button>
      {expanded && (
        <div id={contentId} className="space-y-4 pb-3 pl-3">
          {item.href && (
            <a href={item.href} onClick={follow(item)} className={cn(rowClass, 'text-sm')}>
              All {item.label}
            </a>
          )}
          {item.menu.columns.map((column) => (
            <div key={column.title}>
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                {column.title}
              </p>
              <ul>
                {column.links.map((link) => (
                  <li key={itemKey(link)}>
                    <a href={link.href} onClick={follow(link)} className={cn(rowClass, 'text-sm font-normal')}>
                      {link.label}
                      {link.badge && <Badge variant="danger">{link.badge}</Badge>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  )
}

/**
 * Modal drawer / bottom sheet used by every variant below its desktop breakpoint.
 * Focus trap, Escape, scroll lock and focus return come from useDialogBehavior.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {React.RefObject} props.triggerRef  Button that opened it (focus returns there).
 * @param {'left'|'right'|'bottom'} [props.placement='right']
 * @param {object} [props.search]   Normalized search config; omit when the bar already shows one.
 * @param {object[]} [props.actions] Actions the bar does not show on small screens.
 */
export default function MobileMenu({
  open,
  onClose,
  triggerRef,
  placement = 'right',
  title = 'Menu',
  links = [],
  search,
  actions = [],
  icons,
  onNavigate,
}) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()

  useDialogBehavior({
    open,
    onClose,
    panelRef,
    returnFocusRef: triggerRef,
    // With a search field present, start on the close button rather than opening a keyboard.
    initialFocusRef: closeRef,
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 motion-safe:animate-ui-fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'absolute flex flex-col overflow-hidden bg-surface text-foreground shadow-xl outline-none',
          placements[placement].panel,
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          <IconButton ref={closeRef} label="Close menu" onClick={onClose}>
            {icons.close}
          </IconButton>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-3">
          {search && <SearchField search={search} icon={icons.search} onSubmitted={onClose} />}

          <nav aria-label={title}>
            <ul>
              {links.map((item) =>
                item.menu ? (
                  <MobileGroup key={itemKey(item)} item={item} icons={icons} onNavigate={onNavigate} onClose={onClose} />
                ) : (
                  <li key={itemKey(item)}>
                    <a
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      onClick={(event) => {
                        onNavigate?.(item, event)
                        onClose()
                      }}
                      className={cn(rowClass, item.current && 'bg-surface-muted')}
                    >
                      {item.label}
                      {item.badge && <Badge variant="danger">{item.badge}</Badge>}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        {actions.length > 0 && (
          <ul className="shrink-0 border-t border-border p-3">
            {actions.map((action) => {
              const Tag = action.href ? 'a' : 'button'
              return (
                <li key={action.id}>
                  <Tag
                    {...(action.href ? { href: action.href } : { type: 'button' })}
                    onClick={(event) => {
                      action.onClick?.(event)
                      onClose()
                    }}
                    className={rowClass}
                  >
                    <span className="flex items-center gap-3">
                      <span aria-hidden="true">{action.icon}</span>
                      {action.label}
                    </span>
                    {action.count && <Badge variant="brand">{action.count}</Badge>}
                  </Tag>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
