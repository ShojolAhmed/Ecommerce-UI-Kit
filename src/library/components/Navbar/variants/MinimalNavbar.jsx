import { useId, useRef, useState } from 'react'
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
  'inline-flex items-center rounded-control px-3 py-2 text-sm font-medium text-foreground-muted transition-colors',
  'hover:text-foreground',
  focusRing,
)
const currentLinkClass = 'text-foreground underline decoration-2 underline-offset-8'

/**
 * Minimal navbar: one slim row. Links sit beside the logo, search is an icon
 * that takes over the bar while open, and below `md` everything moves into a
 * right-hand drawer.
 *
 * @param {import('../types.js').NavbarProps} props
 */
export default function MinimalNavbar(props) {
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

  const [searchOpen, setSearchOpen] = useState(false)
  const searchToggleRef = useRef(null)
  const searchId = useId()
  const closeSearch = () => {
    setSearchOpen(false)
    searchToggleRef.current?.focus()
  }

  // The cart stays in the bar on phones; account and wishlist move into the drawer.
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
      <Container size={containerSize} className="relative flex h-16 items-center gap-4 md:gap-8">
        <NavbarBrand brand={brand} onNavigate={onNavigate} className="text-lg font-semibold tracking-tight" />

        <nav aria-label={navLabel} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((item) => (
              <li key={itemKey(item)}>
                <NavLink item={item} onNavigate={onNavigate} className={linkClass} currentClassName={currentLinkClass} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {search && (
            <IconButton
              ref={searchToggleRef}
              label="Search"
              aria-expanded={searchOpen}
              aria-controls={searchOpen ? searchId : undefined}
              onClick={() => setSearchOpen(true)}
            >
              {icons.search}
            </IconButton>
          )}
          <ActionButtons actions={secondary} className="hidden items-center gap-1 md:flex" />
          {cart && <ActionButton action={cart} />}
          {endSlot && <div className="ml-2 hidden md:block">{endSlot}</div>}
          <IconButton
            ref={triggerRef}
            label="Open menu"
            className="md:hidden"
            aria-haspopup="dialog"
            aria-expanded={mobileMenu.open}
            onClick={mobileMenu.openMenu}
          >
            {icons.menu}
          </IconButton>
        </div>

        {search && searchOpen && (
          // Takes over the bar. Escape or the close button hands focus back to the toggle.
          <div
            id={searchId}
            onKeyDown={(event) => event.key === 'Escape' && closeSearch()}
            className="absolute inset-0 z-10 flex items-center gap-2 bg-surface px-gutter"
          >
            <SearchField search={search} icon={icons.search} autoFocus onSubmitted={closeSearch} className="flex-1" />
            <IconButton label="Close search" onClick={closeSearch}>
              {icons.close}
            </IconButton>
          </div>
        )}
      </Container>

      <MobileMenu
        open={mobileMenu.open}
        onClose={mobileMenu.closeMenu}
        triggerRef={triggerRef}
        placement="right"
        links={links}
        actions={secondary}
        icons={icons}
        onNavigate={onNavigate}
      />
    </header>
  )
}
