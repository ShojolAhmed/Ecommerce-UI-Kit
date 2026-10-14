import { useRef } from 'react'
import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'
import { Container, IconButton } from '../../../primitives/index.js'
import { ActionButton, ActionButtons } from '../shared/ActionButtons.jsx'
import MobileMenu from '../shared/MobileMenu.jsx'
import NavbarBrand from '../shared/NavbarBrand.jsx'
import NavLink from '../shared/NavLink.jsx'
import SearchField from '../shared/SearchField.jsx'
import { itemKey } from '../shared/model.js'
import { useNavbarModel } from '../shared/useNavbarModel.js'

const linkClass = cn(
  'inline-flex items-center border-b-2 border-transparent py-1 text-xs font-medium uppercase tracking-[0.18em] text-foreground-muted transition-colors',
  'hover:border-foreground-subtle hover:text-foreground',
  focusRing,
)
const currentLinkClass = 'border-foreground text-foreground'

/**
 * Centered-logo navbar: a spaced-out wordmark in the middle, search on the
 * left, account actions on the right, and the links on their own centered
 * row underneath. Below `lg` it becomes menu | logo | cart with a left drawer
 * that also holds the search field.
 *
 * @param {import('../types.js').NavbarProps} props
 */
export default function CenteredLogoNavbar(props) {
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
  const { icons, actions, search, mobileMenu } = useNavbarModel(props, { closeAbove: '(min-width: 64rem)' })
  const triggerRef = useRef(null)

  const cart = actions.find((action) => action.id === 'cart')
  const secondary = actions.filter((action) => action.id !== 'cart')

  return (
    <header
      className={cn(
        'z-40 border-b border-border bg-surface text-foreground',
        sticky ? 'sticky top-0' : 'relative',
        className,
      )}
    >
      <Container size={containerSize}>
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-24">
          <div className="flex items-center">
            <IconButton
              ref={triggerRef}
              label="Open menu"
              className="-ml-2 lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={mobileMenu.open}
              onClick={mobileMenu.openMenu}
            >
              {icons.menu}
            </IconButton>
            {search && (
              <div className="hidden w-full max-w-64 lg:block">
                <SearchField search={search} icon={icons.search} size="sm" shape="pill" />
              </div>
            )}
          </div>

          <NavbarBrand
            brand={brand}
            onNavigate={onNavigate}
            className="font-display text-xl uppercase tracking-[0.3em] lg:text-3xl"
          />

          <div className="flex items-center justify-end gap-1">
            <ActionButtons actions={secondary} className="hidden items-center gap-1 lg:flex" />
            {cart && <ActionButton action={cart} />}
            {endSlot && <div className="ml-2 hidden lg:block">{endSlot}</div>}
          </div>
        </div>

        <nav aria-label={navLabel} className="hidden border-t border-border lg:block">
          <ul className="flex items-center justify-center gap-10 py-3.5">
            {links.map((item) => (
              <li key={itemKey(item)}>
                <NavLink item={item} onNavigate={onNavigate} className={linkClass} currentClassName={currentLinkClass} />
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <MobileMenu
        open={mobileMenu.open}
        onClose={mobileMenu.closeMenu}
        triggerRef={triggerRef}
        placement="left"
        links={links}
        search={search}
        actions={secondary}
        icons={icons}
        onNavigate={onNavigate}
      />
    </header>
  )
}
