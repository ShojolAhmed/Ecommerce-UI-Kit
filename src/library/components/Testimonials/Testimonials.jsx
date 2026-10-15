import { useId, useState } from 'react'
import { cn } from '../../utils/cn.js'
import { Container, IconButton } from '../../primitives/index.js'
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon, StarIcon } from '../../icons/index.jsx'
import SectionHeader from '../SectionHeader/SectionHeader.jsx'
import MediaImage from '../shared/MediaImage.jsx'
import { sectionSpacing } from '../shared/spacing.js'

const defaultLabels = {
  list: 'Customer reviews',
  previous: 'Previous review',
  next: 'Next review',
  rating: (value) => `Rated ${value} out of 5`,
  position: (index, total) => `Review ${index} of ${total}`,
}

const columnClasses = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
}

const isValid = (item) => Boolean(item) && Boolean(item.quote) && Boolean(item.author)

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

function Stars({ value, label }) {
  const filled = Math.round(Math.min(5, Math.max(0, value)))
  return (
    <span role="img" aria-label={label} className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map((star) => (
        <StarIcon key={star} className={star < filled ? 'text-warning' : 'text-border-strong'} />
      ))}
    </span>
  )
}

function Avatar({ author, image }) {
  return image ? (
    <MediaImage src={image} className="size-10 shrink-0 rounded-full" />
  ) : (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-sm font-semibold text-foreground-muted"
    >
      {initials(author)}
    </span>
  )
}

/** A review: stars, the quote, and who said it. `large` is the single-slide size. */
function Review({ item, labels, large = false, className }) {
  const { quote, author, role, avatar, rating } = item
  return (
    <figure className={cn('flex h-full flex-col gap-4', large && 'items-center', className)}>
      {typeof rating === 'number' && rating > 0 && <Stars value={rating} label={labels.rating(rating)} />}
      <blockquote className="flex-1">
        <p className={cn(large ? 'font-display text-xl text-balance sm:text-2xl lg:text-3xl' : 'text-base text-pretty')}>
          {quote}
        </p>
      </blockquote>
      <figcaption className={cn('flex items-center gap-3', large && 'justify-center')}>
        <Avatar author={author} image={avatar} />
        <span className="flex flex-col text-start">
          <span className="text-sm font-semibold">{author}</span>
          {role && <span className="text-sm text-foreground-muted">{role}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

/** One review at a time with previous / next. Announces the new review when it changes. */
function ReviewSlider({ items, labels, label, onSlideChange }) {
  const [index, setIndex] = useState(0)
  const total = items.length
  const current = items[Math.min(index, total - 1)]

  const go = (direction) => {
    const next = (index + direction + total) % total
    setIndex(next)
    onSlideChange?.(items[next], next)
  }

  return (
    <div role="group" aria-roledescription="carousel" aria-label={label} className="mx-auto flex max-w-3xl flex-col items-center gap-8">
      <QuoteIcon aria-hidden="true" className="text-border-strong" />
      <div aria-live="polite" aria-atomic="true" className="w-full text-center">
        <Review item={current} labels={labels} large />
      </div>
      {total > 1 && (
        <div className="flex items-center gap-4">
          <IconButton label={labels.previous} variant="outline" shape="pill" onClick={() => go(-1)}>
            <ChevronLeftIcon />
          </IconButton>
          <span className="min-w-14 text-center text-sm text-foreground-muted">
            <span aria-hidden="true">
              {index + 1} / {total}
            </span>
            <span className="sr-only">{labels.position(index + 1, total)}</span>
          </span>
          <IconButton label={labels.next} variant="outline" shape="pill" onClick={() => go(1)}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      )}
    </div>
  )
}

/**
 * Customer reviews as pull-quotes.
 *
 *  - `grid`    every review visible, as bordered cards (1 column on phones).
 *  - `slider`  one large quote at a time with previous / next. No autoplay.
 *
 * @param {object} props
 * @param {{ id?: string|number, quote: string, author: string, role?: string, avatar?: string, rating?: number }[]} props.testimonials
 *        `role` is free text such as "Verified buyer". Without `avatar`, initials are shown.
 * @param {'grid'|'slider'} [props.layout='grid']
 * @param {2|3} [props.columns=3]   `grid` only.
 * @param {React.ReactNode} [props.title]
 * @param {React.ReactNode} [props.description]
 * @param {import('../shared/types.js').Action} [props.action]
 * @param {'start'|'center'} [props.align]  Header alignment. Defaults to `center` for `slider`, `start` for `grid`.
 * @param {(testimonial, index) => void} [props.onSlideChange]  `slider` only.
 * @param {2|3|4} [props.headingLevel=2]
 * @param {'none'|'sm'|'md'|'lg'} [props.spacing='md']
 */
export default function Testimonials({
  testimonials = [],
  layout = 'grid',
  columns = 3,
  title,
  description,
  action,
  onAction,
  align,
  onSlideChange,
  headingLevel = 2,
  spacing = 'md',
  labels: labelOverrides,
  containerSize,
  id,
  className,
}) {
  const labels = { ...defaultLabels, ...labelOverrides }
  const headingId = useId()
  const items = testimonials.filter(isValid)
  if (items.length === 0) return null

  const slider = layout === 'slider'
  const listLabel = title ? undefined : labels.list

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      aria-label={listLabel}
      className={cn(sectionSpacing[spacing], className)}
    >
      <Container size={containerSize} className="flex flex-col gap-10">
        <SectionHeader
          id={headingId}
          title={title}
          description={description}
          action={action}
          onAction={onAction}
          headingLevel={headingLevel}
          align={align ?? (slider ? 'center' : 'start')}
        />
        {slider ? (
          <ReviewSlider items={items} labels={labels} label={title ?? labels.list} onSlideChange={onSlideChange} />
        ) : (
          <ul role="list" className={cn('grid gap-4 sm:gap-6', columnClasses[columns] ?? columnClasses[3])}>
            {items.map((item) => (
              <li key={item.id ?? item.author + item.quote.slice(0, 12)} className="min-w-0">
                <Review item={item} labels={labels} className="rounded-surface border border-border bg-surface p-6" />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}
