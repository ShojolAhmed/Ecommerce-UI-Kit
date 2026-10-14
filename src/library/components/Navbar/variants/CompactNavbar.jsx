import { useRef } from 'react'
import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'
import { Badge, Container } from '../../../primitives/index.js'
import { ActionButtons } from '../shared/ActionButtons.jsx'
import MobileMenu from '../shared/MobileMenu.jsx'
import NavbarBrand from '../shared/NavbarBrand.jsx'
import NavLink from '../shared/NavLink.jsx'
import SearchField from '../shared/SearchField.jsx'
import { itemKey } from '../shared/model.js'
import { useNavbarModel } from '../shared/useNavbarModel.js'

const linkClass = cn(
  'inline-flex items-center rounded-control px-2.5 py-1.5 text-sm font-medium text-foreground-muted transition-colors',
  'hover:bg-surface-muted hover:text-foreground',
  focusRing,
)
const currentLinkClass = 'bg-surface-muted text-foreground'

const tabClass = cn(
  'relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-medium text-foreground-muted transition-colors',
  'hover:text-foreground aria-expanded:text-foreground',
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
)

/** One cell of the bottom tab bar: a link or a button with an icon and a visible label. */
function Tab({ icon, label, accessibleLabel, count, href, onClick, ...rest }) {
  const Tag = href ? 'a' : 'button'
  return (
    <li>
      <Tag
        {...(href ? { href } : { type: 'button' })}
        aria-label={accessibleLabel}
        onClick={onClick}
        className={tabClass}
        {...rest}
      >
        <span aria-hidden="true" className="relative inline-flex text-xl">
          {icon}
          {count && (
            <Badge variant="brand" className="absolute -right-2.5 -top-1.5 min-w-4 justify-center px-1 py-0 text-[0.625rem] leading-4">
              {count}
            </Badge>
          )}
        </span>
        <span aria-hidden={accessibleLabel ? true : undefined}>{label}</span>
      </Tag>
    </li>
  )
}

/**
 * Compact / mobile-focused navbar. On phones: a slim bar with an always-visible
 * search field, plus a fixed bottom tab bar (Menu, Wishlist, Account, Cart) that
 * stays under the thumb. The menu opens as a bottom sheet. From `md` up it
 * collapses into one slim row and the tab bar disappears.
 *
 * The tab bar is `position: fixed`, so reserve about 3.5rem of bottom padding
 * on the page (e.g. `pb-16 md:pb-0`) to keep content from sliding under it.
 *
 * @param {import('../types.js').NavbarProps} props
 */
export default function CompactNavbar(props) {
  const {
    brand,
    links = [],
    onNavigate,
    endSlot,
    navLabel = 'Main',
    containerSize = 'default',
    sticky = false,
    className,
  } = props
  const { icons, actions, search, mobileMenu } = useNavbarModel(props, { closeAbove: '(min-width: 48rem)' })
  const triggerRef = useRef(null)

  return (
    <>
      <header
        className={cn(
          'z-40 border-b border-border bg-surface text-foreground',
          sticky ? 'sticky top-0' : 'relative',
          className,
        )}
      >
        <Container size={containerSize} className="flex h-14 items-center gap-3 md:h-16 md:gap-6">
          <NavbarBrand brand={brand} onNavigate={onNavigate} className="text-lg font-bold tracking-tight" />

          <nav aria-label={navLabel} className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {links.map((item) => (
                <li key={itemKey(item)}>
                  <NavLink item={item} onNavigate={onNavigate} className={linkClass} currentClassName={currentLinkClass} />
                </li>
              ))}
            </ul>
          </nav>

          {search && (
            <div className="min-w-0 flex-1 md:ml-auto md:max-w-72">
              <SearchField search={search} icon={icons.search} size="sm" shape="pill" />
            </div>
          )}

          <ActionButtons
            actions={actions}
            size="sm"
            className={cn('hidden items-center gap-0.5 md:flex', !search && 'md:ml-auto')}
          />
          {endSlot && <div className="hidden md:block">{endSlot}</div>}
        </Container>

        <MobileMenu
          open={mobileMenu.open}
          onClose={mobileMenu.closeMenu}
          triggerRef={triggerRef}
          placement="bottom"
          links={links}
          icons={icons}
          onNavigate={onNavigate}
        />
      </header>

      <nav
        aria-label="Quick actions"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid" style={{ gridTemplateColumns: `repeat(${actions.length + 1}, minmax(0, 1fr))` }}>
          <Tab
            ref={triggerRef}
            icon={icons.menu}
            label="Menu"
            aria-haspopup="dialog"
            aria-expanded={mobileMenu.open}
            onClick={mobileMenu.openMenu}
          />
          {actions.map((action) => (
            <Tab
              key={action.id}
              icon={action.icon}
              label={action.label}
              accessibleLabel={action.accessibleLabel}
              count={action.count}
              href={action.href}
              onClick={action.onClick}
            />
          ))}
        </ul>
      </nav>
    </>
  )
}
