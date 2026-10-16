import { useId, useRef } from 'react'
import { cn } from '../../utils/cn.js'
import { MinusIcon, PlusIcon } from '../../icons/index.jsx'
import { focusRing } from '../../primitives/shared/styles.js'
import { useControllableState } from '../../hooks/useControllableState.js'

const isValid = (item) => Boolean(item) && item.id != null && Boolean(item.title)

/** Ids go into `aria-controls` / `aria-labelledby`, which are space separated lists. */
const slug = (value) => String(value).replace(/\s+/g, '-')

const variants = {
  divided: { root: 'divide-y divide-border border-y border-border', item: '', gutter: '' },
  boxed: { root: 'space-y-2', item: 'rounded-surface border border-border bg-surface', gutter: 'px-4' },
}

const sizes = {
  sm: { trigger: 'py-3 text-sm font-medium', panel: 'pb-3 text-sm' },
  md: { trigger: 'py-4 text-base font-medium', panel: 'pb-4 text-base' },
  lg: { trigger: 'py-5 text-base font-medium sm:text-lg', panel: 'pb-5 text-base' },
}

/**
 * Generic accordion (WAI-ARIA disclosure pattern): each title is a button inside a heading with
 * `aria-expanded` and `aria-controls`. Arrow Up / Down, Home and End move between titles
 * (disabled ones are skipped). Closed content is hidden from assistive technology and from the
 * tab order, and the open / close animation is off when the OS asks for reduced motion.
 *
 * Open state is uncontrolled by default (`defaultOpenIds`) or controlled with `openIds` + `onOpenChange`.
 * `FaqAccordion` is built on this component.
 *
 * @param {object} props
 * @param {{ id: string|number, title: React.ReactNode, content: React.ReactNode, disabled?: boolean }[]} props.items
 * @param {boolean} [props.allowMultiple=false]  Let several panels be open at once.
 * @param {boolean} [props.collapsible=true]     Single mode only: allow closing the open panel.
 * @param {(string|number)[]} [props.openIds]    Controlled open ids.
 * @param {(string|number)[]} [props.defaultOpenIds=[]]
 * @param {(ids: (string|number)[]) => void} [props.onOpenChange]
 * @param {'divided'|'boxed'} [props.variant='divided']  Hairlines between rows, or one bordered card per item.
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {2|3|4|5|6} [props.headingLevel=3]     Level of the heading that wraps each title.
 * @param {string} [props.contentClassName]      Extra classes for the content wrapper (e.g. `max-w-prose`).
 * @param {string} [props.className]
 */
export default function Accordion({
  items = [],
  allowMultiple = false,
  collapsible = true,
  openIds,
  defaultOpenIds = [],
  onOpenChange,
  variant = 'divided',
  size = 'md',
  headingLevel = 3,
  contentClassName,
  className,
}) {
  const baseId = useId()
  const rootRef = useRef(null)
  const [open, setOpen] = useControllableState({ value: openIds, defaultValue: defaultOpenIds, onChange: onOpenChange })
  const entries = items.filter(isValid)
  if (entries.length === 0) return null

  const Heading = `h${Math.min(Math.max(headingLevel, 2), 6)}`
  const style = variants[variant] ?? variants.divided
  const scale = sizes[size] ?? sizes.md

  const toggle = (itemId) => {
    if (open.includes(itemId)) {
      if (allowMultiple) setOpen(open.filter((value) => value !== itemId))
      else if (collapsible) setOpen([])
    } else {
      setOpen(allowMultiple ? [...open, itemId] : [itemId])
    }
  }

  const handleKeyDown = (event) => {
    // Only this accordion's own titles: a nested accordion handles its own keys.
    const triggers = [...rootRef.current.querySelectorAll('[data-accordion-trigger]:not(:disabled)')].filter(
      (trigger) => trigger.closest('[data-accordion-root]') === rootRef.current,
    )
    const position = triggers.indexOf(document.activeElement)
    if (position === -1) return
    const target = {
      ArrowDown: triggers[(position + 1) % triggers.length],
      ArrowUp: triggers[(position - 1 + triggers.length) % triggers.length],
      Home: triggers[0],
      End: triggers[triggers.length - 1],
    }[event.key]
    if (target) {
      event.preventDefault()
      target.focus()
    }
  }

  return (
    // Keyboard handler on the wrapper: it only reacts to keys pressed on a title button.
    <div ref={rootRef} data-accordion-root="" onKeyDown={handleKeyDown} className={cn(style.root, className)}>
      {entries.map((item) => {
        const expanded = open.includes(item.id)
        const triggerId = `${baseId}-trigger-${slug(item.id)}`
        const panelId = `${baseId}-panel-${slug(item.id)}`
        return (
          <div key={item.id} className={style.item}>
            <Heading>
              <button
                id={triggerId}
                type="button"
                data-accordion-trigger=""
                aria-expanded={expanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 rounded-sm text-start transition-colors',
                  'enabled:hover:text-foreground-muted disabled:cursor-not-allowed disabled:opacity-50',
                  focusRing,
                  style.gutter,
                  scale.trigger,
                )}
              >
                <span className="min-w-0">{item.title}</span>
                <span aria-hidden="true" className="shrink-0 text-foreground-muted">
                  {expanded ? <MinusIcon className="size-5" /> : <PlusIcon className="size-5" />}
                </span>
              </button>
            </Heading>
            {/* Rows animate 0fr -> 1fr; `invisible` (delayed by the transition) removes closed
                content from the accessibility tree and the tab order. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                'grid motion-safe:transition-[grid-template-rows,visibility] motion-safe:duration-200',
                expanded ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className={cn('text-foreground-muted text-pretty', style.gutter, scale.panel, contentClassName)}>
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
