import { cn } from '../../../utils/cn.js'
import { Container } from '../../../primitives/index.js'
import NewsletterForm from '../../NewsletterForm/NewsletterForm.jsx'
import FooterBrand from '../shared/FooterBrand.jsx'
import FooterColumns from '../shared/FooterColumns.jsx'
import FooterBottom from '../shared/FooterBottom.jsx'
import SocialLinks from '../shared/SocialLinks.jsx'
import { resolveCopyright, resolveLabels } from '../shared/model.js'

/**
 * Premium look: always dark (it re-themes its own subtree with data-theme="dark"),
 * generous space, a spaced serif wordmark and hairline rules. Set `--font-display`
 * to your brand serif for the full effect.
 */
export default function DarkFooter({
  brand,
  columns,
  social,
  newsletter,
  legalLinks,
  copyright,
  bottomSlot,
  onNavigate,
  headingLevel = 2,
  labels: labelOverrides,
  navLabel,
  containerSize,
  className,
}) {
  const labels = resolveLabels(labelOverrides, navLabel)
  const Heading = `h${headingLevel}`
  const { title, description, consent, onSubscribe, labels: formLabels } = newsletter ?? {}

  return (
    <footer data-theme="dark" className={cn('bg-background text-foreground', className)}>
      <Container size={containerSize}>
        <div className="grid gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="flex flex-col gap-6">
            <FooterBrand
              brand={brand}
              onNavigate={onNavigate}
              wordmarkClassName="font-display text-3xl font-normal uppercase tracking-[0.28em]"
            />
            <SocialLinks items={social} label={labels.social} onNavigate={onNavigate} className="-ms-2.5" />
          </div>
          {newsletter && (
            <div className="lg:justify-self-end lg:w-full lg:max-w-md">
              {title && <Heading className="font-display text-xl font-normal tracking-wide">{title}</Heading>}
              {description && <p className="mt-2 mb-5 text-sm text-foreground-muted text-pretty">{description}</p>}
              <NewsletterForm
                onSubscribe={onSubscribe}
                consent={consent}
                labels={formLabels}
                layout="stacked"
                size="md"
              />
            </div>
          )}
        </div>

        <div className="border-t border-border py-12">
          <nav aria-label={labels.navigation}>
            <FooterColumns
              columns={columns}
              headingLevel={headingLevel}
              onNavigate={onNavigate}
              opensInNewTab={labels.opensInNewTab}
              className="grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]"
              titleClassName="font-display text-base font-normal tracking-wide"
              listClassName="gap-3"
            />
          </nav>
        </div>

        <FooterBottom
          copyright={resolveCopyright(copyright, brand)}
          legalLinks={legalLinks}
          bottomSlot={bottomSlot}
          labels={labels}
          onNavigate={onNavigate}
          className="border-t border-border py-6"
        />
      </Container>
    </footer>
  )
}
