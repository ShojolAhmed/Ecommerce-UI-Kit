import { cn } from '../../utils/cn.js'
import { ArrowRightIcon } from '../../icons/index.jsx'
import Cta from '../shared/Cta.jsx'

/**
 * Heading block for a page section: title, optional description and an
 * optional "view all" action. Every homepage section uses it, and so can your
 * own sections.
 *
 * @param {object} props
 * @param {string} [props.id]            Put on the heading so the section can use `aria-labelledby`.
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {import('../shared/types.js').Action} [props.action]
 * @param {React.ReactNode} [props.endSlot]  Extra controls after the action (e.g. carousel arrows).
 * @param {2|3|4} [props.headingLevel=2]
 * @param {'start'|'center'} [props.align='start']
 */
export default function SectionHeader({
  id,
  title,
  description,
  action,
  onAction,
  endSlot,
  headingLevel = 2,
  align = 'start',
  className,
}) {
  if (!title && !description && !action && !endSlot) return null
  const Heading = `h${headingLevel}`
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('min-w-0 max-w-2xl', centered && 'mx-auto')}>
        {title && (
          <Heading id={id} className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {title}
          </Heading>
        )}
        {description && <p className="mt-2 text-base text-foreground-muted text-pretty">{description}</p>}
      </div>
      {(action || endSlot) && (
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {action && (
            <Cta
              action={{ icon: <ArrowRightIcon />, ...action }}
              onAction={onAction}
              variant="outline"
              size="md"
            />
          )}
          {endSlot}
        </div>
      )}
    </div>
  )
}
