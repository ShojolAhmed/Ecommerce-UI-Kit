import { cn } from '../../../utils/cn.js'
import { Container } from '../../../primitives/index.js'
import FooterBrand from '../shared/FooterBrand.jsx'
import FooterLink from '../shared/FooterLink.jsx'
import FooterBottom from '../shared/FooterBottom.jsx'
import SocialLinks from '../shared/SocialLinks.jsx'
import { linkKey, resolveCopyright, resolveLabels, simpleLinks } from '../shared/model.js'

/** One slim block: wordmark, a single row of links, social icons, then the legal line. */
export default function SimpleFooter({
  brand,
  columns,
  links,
  social,
  legalLinks,
  copyright,
  bottomSlot,
  onNavigate,
  labels: labelOverrides,
  navLabel,
  containerSize,
  className,
}) {
  const labels = resolveLabels(labelOverrides, navLabel)
  const items = simpleLinks(links, columns)

  return (
    <footer className={cn('border-t border-border bg-background text-foreground', className)}>
      <Container size={containerSize}>
        <div className="flex flex-col items-center gap-6 py-10 md:flex-row md:justify-between">
          <FooterBrand
            brand={brand}
            onNavigate={onNavigate}
            showDescription={false}
            wordmarkClassName="font-display text-xl font-semibold tracking-tight"
          />
          {items.length > 0 && (
            <nav aria-label={labels.navigation}>
              <ul role="list" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {items.map((link) => (
                  <li key={linkKey(link)}>
                    <FooterLink link={link} onNavigate={onNavigate} opensInNewTab={labels.opensInNewTab} />
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <SocialLinks items={social} label={labels.social} onNavigate={onNavigate} className="justify-center" />
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
