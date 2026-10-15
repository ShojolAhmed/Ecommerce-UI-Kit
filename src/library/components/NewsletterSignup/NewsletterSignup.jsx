import { useId } from 'react'
import { cn } from '../../utils/cn.js'
import { Container } from '../../primitives/index.js'
import NewsletterForm from '../NewsletterForm/NewsletterForm.jsx'
import MediaImage from '../shared/MediaImage.jsx'
import { sectionSpacing } from '../shared/spacing.js'
import { toneStyles } from '../shared/tones.js'

// Only tones whose success and error text colors stay readable on them.
const tones = { default: toneStyles.default, muted: toneStyles.muted, dark: toneStyles.dark }

/**
 * Full-width signup band. It collects an email and calls `onSubscribe`; it does not connect to any
 * email service. The callback may be async: the button shows a busy state while it is pending, a
 * rejected promise shows its message and keeps the typed address, and success is announced.
 *
 *  - `centered`  title, text and form in one narrow column.
 *  - `split`     text on one side, form on the other, with an optional image.
 *
 * @param {object} props
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {(values: { email: string, consent?: boolean }, event) => void | Promise<void>} [props.onSubscribe]
 * @param {React.ReactNode} [props.consent]       Consent checkbox label. Setting it makes the box required.
 * @param {React.ReactNode} [props.privacyNote]   Small print under the form, e.g. "One email a month. Unsubscribe anytime."
 * @param {object} [props.formLabels]             See NewsletterForm `labels` (button text, messages, ...).
 * @param {import('../shared/types.js').ImageSource} [props.image]  `split` only.
 * @param {'centered'|'split'} [props.layout='centered']
 * @param {'default'|'muted'|'dark'} [props.tone='muted']
 * @param {2|3|4} [props.headingLevel=2]
 * @param {'none'|'sm'|'md'|'lg'} [props.spacing='lg']
 */
export default function NewsletterSignup({
  title,
  description,
  onSubscribe,
  consent,
  privacyNote,
  formLabels,
  image,
  layout = 'centered',
  tone = 'muted',
  headingLevel = 2,
  spacing = 'lg',
  containerSize,
  id,
  className,
}) {
  const headingId = useId()
  const Heading = `h${headingLevel}`
  const toneStyle = tones[tone] ?? tones.muted
  const split = layout === 'split'

  const heading = (
    <div className={cn(!split && 'mx-auto max-w-xl text-center')}>
      <Heading id={headingId} className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </Heading>
      {description && <p className="mt-3 text-base text-foreground-muted text-pretty">{description}</p>}
    </div>
  )

  const form = (
    <div className={cn(!split && 'mx-auto mt-8 w-full max-w-xl')}>
      <NewsletterForm onSubscribe={onSubscribe} consent={consent} labels={formLabels} />
      {privacyNote && <p className="mt-3 text-sm text-foreground-muted">{privacyNote}</p>}
    </div>
  )

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-theme={toneStyle.theme}
      className={cn(toneStyle.root, sectionSpacing[spacing], className)}
    >
      <Container size={containerSize}>
        {split ? (
          <div className={cn('grid items-center gap-10 lg:gap-16', image ? 'lg:grid-cols-[1fr_1fr]' : 'lg:grid-cols-2')}>
            <div className="flex flex-col gap-8">
              {heading}
              {form}
            </div>
            {image && <MediaImage src={image.src} alt={image.alt} className="aspect-[4/3] rounded-surface" />}
          </div>
        ) : (
          <>
            {heading}
            {form}
          </>
        )}
      </Container>
    </section>
  )
}
