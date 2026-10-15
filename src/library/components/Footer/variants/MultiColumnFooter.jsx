import { cn } from '../../../utils/cn.js'
import { Container } from '../../../primitives/index.js'
import FooterBrand from '../shared/FooterBrand.jsx'
import FooterColumns from '../shared/FooterColumns.jsx'
import FooterBottom from '../shared/FooterBottom.jsx'
import SocialLinks from '../shared/SocialLinks.jsx'
import { resolveCopyright, resolveLabels } from '../shared/model.js'

/** Brand and social on the left, link columns on the right. The columns fit themselves to however many you pass. */
export default function MultiColumnFooter({
  brand,
  columns,
  social,
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

  return (
    <footer className={cn('border-t border-border bg-surface-muted text-foreground', className)}>
      <Container size={containerSize}>
        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <FooterBrand
              brand={brand}
              onNavigate={onNavigate}
              wordmarkClassName="font-display text-2xl font-semibold tracking-tight"
            />
            <SocialLinks items={social} label={labels.social} onNavigate={onNavigate} className="-ms-2.5" />
          </div>
          <nav aria-label={labels.navigation} className="lg:col-span-8">
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
