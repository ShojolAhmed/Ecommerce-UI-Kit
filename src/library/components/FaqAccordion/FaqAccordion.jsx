import { useId, useRef } from 'react'
import { cn } from '../../utils/cn.js'
import { Container } from '../../primitives/index.js'
import { MinusIcon, PlusIcon } from '../../icons/index.jsx'
import { focusRing } from '../../primitives/shared/styles.js'
import { useControllableState } from '../../hooks/useControllableState.js'
import SectionHeader from '../SectionHeader/SectionHeader.jsx'
import { sectionSpacing } from '../shared/spacing.js'

const isValid = (item) => Boolean(item) && item.id != null && Boolean(item.question)

/**
 * Frequently asked questions as an accordion (WAI-ARIA disclosure pattern): each question is a
 * button inside a heading, with `aria-expanded` and `aria-controls`. Arrow Up / Down, Home and
 * End move between questions. Closed answers are hidden from assistive technology and from the
 * tab order, and the open / close animation is off when the OS asks for reduced motion.
 *
 * Open state is uncontrolled by default (`defaultOpenIds`) or controlled with `openIds` + `onOpenChange`.
 *
 * @param {object} props
 * @param {{ id: string|number, question: React.ReactNode, answer: React.ReactNode }[]} props.items
 * @param {boolean} [props.allowMultiple=false]  Let several answers be open at once.
 * @param {(string|number)[]} [props.openIds]      Controlled open ids.
 * @param {(string|number)[]} [props.defaultOpenIds=[]]
 * @param {(ids: (string|number)[]) => void} [props.onOpenChange]
 * @param {'stacked'|'split'} [props.layout='stacked']  `split` puts the heading beside the list from `lg`.
 * @param {React.ReactNode} [props.title]
 * @param {React.ReactNode} [props.description]
 * @param {React.ReactNode} [props.footer]   Under the list, e.g. "Still have questions? Contact us".
 * @param {2|3|4} [props.headingLevel=2]     Questions use the next level.
 * @param {'none'|'sm'|'md'|'lg'} [props.spacing='md']
 */
export default function FaqAccordion({
  items = [],
  allowMultiple = false,
  openIds,
  defaultOpenIds = [],
  onOpenChange,
  layout = 'stacked',
  title,
  description,
  footer,
  headingLevel = 2,
  spacing = 'md',
  containerSize,
  id,
  className,
}) {
  const baseId = useId()
  const listRef = useRef(null)
  const [open, setOpen] = useControllableState({ value: openIds, defaultValue: defaultOpenIds, onChange: onOpenChange })
  const entries = items.filter(isValid)
  if (entries.length === 0) return null

  const QuestionHeading = `h${Math.min(headingLevel + 1, 6)}`
  const split = layout === 'split'

  const toggle = (itemId) => {
    if (open.includes(itemId)) setOpen(open.filter((value) => value !== itemId))
    else setOpen(allowMultiple ? [...open, itemId] : [itemId])
  }

  const handleKeyDown = (event) => {
    const triggers = [...listRef.current.querySelectorAll('[data-faq-trigger]')]
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

  const headingId = `${baseId}-title`

  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cn(sectionSpacing[spacing], className)}>
      <Container size={containerSize}>
        <div className={cn(split && 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16')}>
          <SectionHeader
            id={headingId}
            title={title}
            description={description}
            headingLevel={headingLevel}
            className={cn(!split && 'mb-8', split && 'lg:flex-col lg:items-start lg:self-start')}
          />
          <div className={cn(!split && 'mx-auto max-w-3xl')}>
            {/* Keyboard handler on the wrapper: it only reacts to keys pressed on a question button. */}
            <div ref={listRef} onKeyDown={handleKeyDown} className="divide-y divide-border border-y border-border">
              {entries.map((item) => {
                const expanded = open.includes(item.id)
                const triggerId = `${baseId}-trigger-${item.id}`
                const panelId = `${baseId}-panel-${item.id}`
                return (
                  <div key={item.id}>
                    <QuestionHeading>
                      <button
                        id={triggerId}
                        type="button"
                        data-faq-trigger=""
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        onClick={() => toggle(item.id)}
                        className={cn(
                          'flex w-full items-center justify-between gap-4 rounded-sm py-5 text-start text-base font-medium sm:text-lg',
                          'transition-colors hover:text-foreground-muted',
                          focusRing,
                        )}
                      >
                        <span>{item.question}</span>
                        <span aria-hidden="true" className="shrink-0 text-foreground-muted">
                          {expanded ? <MinusIcon className="size-5" /> : <PlusIcon className="size-5" />}
                        </span>
                      </button>
                    </QuestionHeading>
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
                        <div className="max-w-prose pb-5 text-base text-foreground-muted text-pretty">{item.answer}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {footer && <div className="mt-8 text-foreground-muted">{footer}</div>}
          </div>
        </div>
      </Container>
    </section>
  )
}
