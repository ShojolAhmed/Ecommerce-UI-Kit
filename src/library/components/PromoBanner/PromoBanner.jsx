import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn.js'
import { Badge, Button, Container } from '../../primitives/index.js'
import { CheckIcon, CopyIcon } from '../../icons/index.jsx'
import Cta from '../shared/Cta.jsx'
import MediaImage from '../shared/MediaImage.jsx'
import { sectionSpacing } from '../shared/spacing.js'
import { getTone } from '../shared/tones.js'

const defaultLabels = {
  copyCode: (code) => `Copy code ${code}`,
  copied: 'Code copied',
}

/** Promo code chip. Copies to the clipboard (when allowed) and always reports through `onCopy`. */
function PromoCode({ code, tone, labels, onCopy }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const handleClick = async (event) => {
    try {
      await navigator.clipboard?.writeText(code)
    } catch {
      // Clipboard may be blocked (insecure context, permissions). The callback still fires.
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
    onCopy?.(code, event)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="md"
        aria-label={labels.copyCode(code)}
        leadingIcon={copied ? <CheckIcon /> : <CopyIcon />}
        className={cn('border-dashed font-mono tracking-wider', tone.quietCta)}
        onClick={handleClick}
      >
        {code}
      </Button>
      <span role="status" className="text-sm">
        {copied ? labels.copied : ''}
      </span>
    </div>
  )
}

/**
 * Promotional block with an offer, an optional code and one or two buttons. It is an inset, rounded
 * band inside the page width (use `NewsletterSignup` or `HeroBanner` for full-bleed ones).
 *
 *  - `split`  text beside an image (stacks on small screens).
 *  - `strip`  text and buttons on one row, no image: a slim banner between sections.
 *
 * @param {object} props
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {string} [props.badge]               Short label such as "This weekend only".
 * @param {string} [props.code]                Promo code, shown with a copy button.
 * @param {(code: string, event) => void} [props.onCopyCode]
 * @param {import('../shared/types.js').Action} [props.primaryAction]
 * @param {import('../shared/types.js').Action} [props.secondaryAction]
 * @param {import('../shared/types.js').ImageSource} [props.image]   `split` only.
 * @param {'split'|'strip'} [props.layout='split']
 * @param {'start'|'end'} [props.imagePosition='end']
 * @param {'default'|'muted'|'primary'|'accent'|'dark'} [props.tone='primary']
 * @param {React.ReactNode} [props.footnote]   Terms and exclusions.
 * @param {2|3|4} [props.headingLevel=2]
 * @param {'none'|'sm'|'md'|'lg'} [props.spacing='md']
 */
export default function PromoBanner({
  title,
  description,
  badge,
  code,
  onCopyCode,
  primaryAction,
  secondaryAction,
  onAction,
  image,
  layout = 'split',
  imagePosition = 'end',
  tone = 'primary',
  footnote,
  headingLevel = 2,
  spacing = 'md',
  labels: labelOverrides,
  containerSize,
  id,
  className,
}) {
  const labels = { ...defaultLabels, ...labelOverrides }
  const headingId = useId()
  const Heading = `h${headingLevel}`
  const toneStyle = getTone(tone, 'primary')
  const strip = layout === 'strip'
  const showImage = !strip && image

  const buttons = (primaryAction || secondaryAction || code) && (
    <div className={cn('flex flex-wrap items-center gap-3', strip && 'md:justify-end')}>
      <Cta action={primaryAction} onAction={onAction} variant={toneStyle.cta} />
      <Cta action={secondaryAction} onAction={onAction} variant="outline" className={toneStyle.quietCta} />
      {code && <PromoCode code={code} tone={toneStyle} labels={labels} onCopy={onCopyCode} />}
    </div>
  )

  const text = (
    <div className="flex min-w-0 flex-col items-start gap-3">
      {badge && <Badge variant={tone === 'primary' || tone === 'dark' ? 'neutral' : 'brand'} size="md">{badge}</Badge>}
      <Heading
        id={headingId}
        className={cn(
          'font-display font-semibold tracking-tight text-balance',
          strip ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl',
        )}
      >
        {title}
      </Heading>
      {description && <p className="max-w-xl text-base text-pretty opacity-85">{description}</p>}
      {footnote && !strip && <p className="text-sm opacity-90">{footnote}</p>}
    </div>
  )

  return (
    <section id={id} aria-labelledby={headingId} className={cn(sectionSpacing[spacing], className)}>
      <Container size={containerSize}>
        <div
          data-theme={toneStyle.theme}
          className={cn(
            'overflow-hidden rounded-surface',
            toneStyle.root,
            strip
              ? 'grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto]'
              : showImage
                ? 'grid md:grid-cols-2'
                : 'p-8 sm:p-12',
          )}
        >
          {showImage ? (
            <>
              <div className={cn('flex flex-col justify-center gap-6 p-8 sm:p-12', imagePosition === 'start' && 'md:order-2')}>
                {text}
                {buttons}
              </div>
              <MediaImage
                src={image.src}
                alt={image.alt}
                className={cn('min-h-56 md:min-h-full', imagePosition === 'start' && 'md:order-1')}
              />
            </>
          ) : (
            <>
              {text}
              {buttons && <div className={cn(!strip && 'mt-6')}>{buttons}</div>}
            </>
          )}
        </div>
        {strip && footnote && <p className="mt-3 text-sm text-foreground-muted">{footnote}</p>}
      </Container>
    </section>
  )
}
