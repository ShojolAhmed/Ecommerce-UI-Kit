import { cn } from '../../../utils/cn.js'
import FooterLink from './FooterLink.jsx'
import { linkKey, validLinks } from './model.js'

/** Bottom bar: copyright on one side, legal links and an optional slot on the other. */
export default function FooterBottom({ copyright, legalLinks, bottomSlot, labels, onNavigate, className }) {
  const legal = validLinks(legalLinks)
  if (!copyright && legal.length === 0 && !bottomSlot) return null

  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-center md:justify-between', className)}>
      {copyright && <p className="text-sm text-foreground-muted">{copyright}</p>}
      {(legal.length > 0 || bottomSlot) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
          {legal.length > 0 && (
            <nav aria-label={labels.legal}>
              <ul role="list" className="flex flex-wrap gap-x-6 gap-y-2">
                {legal.map((link) => (
                  <li key={linkKey(link)}>
                    <FooterLink link={link} onNavigate={onNavigate} opensInNewTab={labels.opensInNewTab} />
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {bottomSlot}
        </div>
      )}
    </div>
  )
}
