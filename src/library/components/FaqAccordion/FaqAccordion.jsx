import { useId } from 'react'
import { cn } from '../../utils/cn.js'
import { Container } from '../../primitives/index.js'
import Accordion from '../Accordion/Accordion.jsx'
import SectionHeader from '../SectionHeader/SectionHeader.jsx'
import { sectionSpacing } from '../shared/spacing.js'

const isValid = (item) => Boolean(item) && item.id != null && Boolean(item.question)

/**
 * Frequently asked questions as a homepage section: heading block plus the shared `Accordion`
 * (WAI-ARIA disclosure pattern with Arrow / Home / End keys, closed answers hidden from assistive
 * tech, animation off under reduced motion).
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
  const entries = items.filter(isValid)
  if (entries.length === 0) return null

  const split = layout === 'split'
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
            <Accordion
              items={entries.map(({ id: itemId, question, answer }) => ({ id: itemId, title: question, content: answer }))}
              allowMultiple={allowMultiple}
              openIds={openIds}
              defaultOpenIds={defaultOpenIds}
              onOpenChange={onOpenChange}
              size="lg"
              headingLevel={headingLevel + 1}
              contentClassName="max-w-prose"
            />
            {footer && <div className="mt-8 text-foreground-muted">{footer}</div>}
          </div>
        </div>
      </Container>
    </section>
  )
}
