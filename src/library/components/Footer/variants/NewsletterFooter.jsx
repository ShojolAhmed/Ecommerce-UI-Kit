import { cn } from '../../../utils/cn.js'
import { Container } from '../../../primitives/index.js'
import NewsletterForm from '../../NewsletterForm/NewsletterForm.jsx'
import FooterBrand from '../shared/FooterBrand.jsx'
import FooterColumns from '../shared/FooterColumns.jsx'
import FooterBottom from '../shared/FooterBottom.jsx'
import SocialLinks from '../shared/SocialLinks.jsx'
import { resolveCopyright, resolveLabels } from '../shared/model.js'

/** A large signup band on top, then a quieter row of links. Without `newsletter` the band is simply not shown. */
export default function NewsletterFooter({
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
    <footer className={cn('border-t border-border bg-background text-foreground', className)}>
      {newsletter && (
        <div className="border-b border-border bg-surface-muted">
          <Container size={containerSize}>
            <div className="grid gap-8 py-12 md:grid-cols-2 md:items-center md:gap-12 lg:py-16">
              <div>
                {title && (
                  <Heading className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                    {title}
                  </Heading>
                )}
                {description && <p className="mt-3 max-w-md text-foreground-muted text-pretty">{description}</p>}
              </div>
              <NewsletterForm onSubscribe={onSubscribe} consent={consent} labels={formLabels} />
            </div>
          </Container>
        </div>
      )}

      <Container size={containerSize}>
        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-3">
            <FooterBrand
              brand={brand}
              onNavigate={onNavigate}
              wordmarkClassName="font-display text-xl font-semibold tracking-tight"
            />
            <SocialLinks items={social} label={labels.social} onNavigate={onNavigate} className="-ms-2.5" />
          </div>
          <nav aria-label={labels.navigation} className="lg:col-span-9">
            <FooterColumns
              columns={columns}
              headingLevel={headingLevel}
              onNavigate={onNavigate}
              opensInNewTab={labels.opensInNewTab}
              className="grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]"
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
