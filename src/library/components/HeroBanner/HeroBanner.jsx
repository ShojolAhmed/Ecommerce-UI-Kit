import { useId } from 'react'
import { cn } from '../../utils/cn.js'
import { Badge, Container } from '../../primitives/index.js'
import Cta from '../shared/Cta.jsx'
import MediaImage from '../shared/MediaImage.jsx'
import { getTone } from '../shared/tones.js'

/**
 * The first thing on the page. Two layouts, same props:
 *
 *  - `split`    text on one side, image on the other (stacks on small screens, image first).
 *  - `overlay`  full-width image behind the text. The section is always themed dark, and a
 *               scrim keeps the text readable on any photo. If the image fails, the dark
 *               background remains.
 *
 * The title is an <h1> by default: use `headingLevel` if the page already has one.
 *
 * @param {object} props
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {string} [props.badge]               Short label above the title, e.g. "New season".
 * @param {import('../shared/types.js').Action} [props.primaryAction]
 * @param {import('../shared/types.js').Action} [props.secondaryAction]
 * @param {import('../shared/types.js').ImageSource} [props.image]
 * @param {'split'|'overlay'} [props.layout='split']
 * @param {'start'|'end'} [props.imagePosition='end']   `split` only: which side the image is on (from `lg`).
 * @param {'start'|'center'} [props.align='start']      `overlay` only.
 * @param {'default'|'muted'|'primary'|'accent'|'dark'} [props.tone='default']   `split` only.
 * @param {React.ReactNode} [props.footnote]   Small line under the buttons (shipping or returns note).
 * @param {1|2|3} [props.headingLevel=1]
 * @param {(action, event) => void} [props.onAction]  Called for every button click.
 */
export default function HeroBanner({
  title,
  description,
  badge,
  primaryAction,
  secondaryAction,
  image,
  layout = 'split',
  imagePosition = 'end',
  align = 'start',
  tone = 'default',
  footnote,
  headingLevel = 1,
  onAction,
  containerSize,
  id,
  className,
}) {
  const headingId = useId()
  const Heading = `h${headingLevel}`
  const overlay = layout === 'overlay'
  const centered = overlay && align === 'center'
  const toneStyle = overlay ? getTone('dark') : getTone(tone)

  const content = (
    <div className={cn('flex flex-col gap-6', centered ? 'items-center text-center' : 'items-start')}>
      {badge && <Badge variant={overlay ? 'neutral' : 'brand'} size="md">{badge}</Badge>}
      <Heading
        id={headingId}
        className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
      >
        {title}
      </Heading>
      {description && (
        <p className={cn('max-w-xl text-lg text-pretty', overlay ? 'text-foreground/90' : tone === 'dark' ? 'text-foreground-muted' : 'opacity-85')}>
          {description}
        </p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className={cn('flex flex-wrap gap-3', centered && 'justify-center')}>
          <Cta action={primaryAction} onAction={onAction} variant={toneStyle.cta} />
          <Cta action={secondaryAction} onAction={onAction} variant="outline" className={toneStyle.quietCta} />
        </div>
      )}
      {footnote && <p className="text-sm opacity-90">{footnote}</p>}
    </div>
  )

  if (overlay) {
    return (
      <section
        id={id}
        aria-labelledby={headingId}
        data-theme="dark"
        className={cn('relative isolate overflow-hidden bg-background text-foreground', className)}
      >
        <MediaImage src={image?.src} alt={image?.alt} eager className="absolute inset-0 -z-20" />
        <div
          aria-hidden="true"
          className={cn(
            '-z-10 absolute inset-0 bg-linear-to-t from-background/90 via-background/60 to-background/25',
            centered
              ? 'md:bg-background/65 md:bg-none'
              : 'md:bg-linear-to-r md:from-background/90 md:via-background/60 md:to-transparent',
          )}
        />
        <Container size={containerSize} className="flex min-h-[30rem] items-end py-12 md:min-h-[38rem] md:items-center md:py-20">
          {content}
        </Container>
      </section>
    )
  }

  return (
    <section id={id} aria-labelledby={headingId} className={cn(toneStyle.root, className)} data-theme={toneStyle.theme}>
      <Container size={containerSize}>
        <div className="grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
          <div className={cn(imagePosition === 'start' ? 'lg:order-2' : '')}>{content}</div>
          {image && (
            <MediaImage
              src={image.src}
              alt={image.alt}
              eager
              className={cn(
                'aspect-[4/3] rounded-surface sm:aspect-[16/10] lg:aspect-[4/5]',
                'order-first',
                imagePosition === 'start' ? 'lg:order-1' : 'lg:order-none',
              )}
            />
          )}
        </div>
      </Container>
    </section>
  )
}
