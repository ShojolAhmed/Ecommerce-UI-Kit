import { useEffect, useRef, useState, useId } from 'react'
import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'
import { Badge, Container, IconButton } from '../../../primitives/index.js'
import { ActionButtons, ActionButton } from '../shared/ActionButtons.jsx'
import MobileMenu from '../shared/MobileMenu.jsx'
import NavbarBrand from '../shared/NavbarBrand.jsx'
import NavLink from '../shared/NavLink.jsx'
import SearchField from '../shared/SearchField.jsx'
import { itemKey } from '../shared/model.js'
import { useNavbarModel } from '../shared/useNavbarModel.js'

// The nav band sits on the inverse `primary` surface, so its own focus ring uses the inverse color too.
const bandFocus = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-foreground'
const bandItem = cn(
  'inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-primary-foreground transition-colors',
  'hover:bg-primary-hover aria-expanded:bg-primary-hover',
  bandFocus,
)
const bandCurrent = 'underline decoration-2 underline-offset-[0.6rem]'

const panelLink = cn(
  'inline-flex items-center gap-2 rounded-sm py-1 text-sm text-foreground-muted transition-colors hover:text-foreground hover:underline',
  focusRing,
)

/** The panel under an open mega menu trigger: link columns plus an optional featured card. */
function MegaPanel({ id, label, menu, onNavigate, onClose }) {
  const follow = (item) => (event) => {
    onNavigate?.(item, event)
    onClose()
  }
  const { columns, featured } = menu

  return (
    <div
      id={id}
      role="region"
      aria-label={`${label} menu`}
      className="absolute inset-x-0 top-full border-b border-border bg-surface text-foreground shadow-lg motion-safe:animate-ui-fade-in"
    >
      <Container className="flex gap-10 py-8">
        <div
          className="grid flex-1 gap-8"
          style={{ gridTemplateColumns: `repeat(${Math.min(columns.length, 4)}, minmax(0, 1fr))` }}
        >
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                {column.title}
              </h3>
              <ul className="space-y-1">
                {column.links.map((link) => (
                  <li key={itemKey(link)}>
                    <a href={link.href} onClick={follow(link)} className={panelLink}>
                      {link.label}
                      {link.badge && <Badge variant="danger">{link.badge}</Badge>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {featured && (
          <a
            href={featured.href}
            onClick={follow(featured)}
            className={cn('group relative hidden w-72 shrink-0 overflow-hidden rounded-surface xl:block', focusRing)}
          >
            {featured.image && (
              <img
                src={featured.image}
                alt={featured.imageAlt ?? ''}
                loading="lazy"
                className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <span className="block bg-surface-muted p-4">
              <span className="block font-semibold">{featured.title}</span>
              {featured.description && (
                <span className="mt-1 block text-sm text-foreground-muted">{featured.description}</span>
              )}
              <span className="mt-3 inline-block text-sm font-medium underline underline-offset-4">
                {featured.cta ?? 'Shop now'}
              </span>
            </span>
          </a>
        )}
      </Container>
    </div>
  )
}

/**
 * Navbar with a mega menu. Top row: logo, a wide search field and actions. Below
 * it, a full-width inverse band holds the links; links that have a `menu` open a
 * panel of link columns and a featured card. Below `lg` the band is replaced by a
 * left drawer where each menu becomes an accordion.
 *
 * Menu behaviour (disclosure pattern): hover (mouse only) or click opens, click
 * keeps it open, Escape closes and returns focus to the trigger, and so do
 * clicking outside or tabbing out.
 *
 * @param {import('../types.js').NavbarProps} props
 */
export default function MegaMenuNavbar(props) {
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

  const [openId, setOpenId] = useState(null)
  const bandRef = useRef(null)
  const triggerRefs = useRef({})
  const openedByHover = useRef(false)
  const hoverTimer = useRef(null)
  const panelBaseId = useId()

  const clearTimer = () => window.clearTimeout(hoverTimer.current)
  const close = () => {
    clearTimer()
    setOpenId(null)
  }

  // Click or focus outside the band closes the open panel.
  useEffect(() => {
    if (!openId) return undefined
    const onPointerDown = (event) => {
      if (!bandRef.current?.contains(event.target)) setOpenId(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openId])

  useEffect(() => clearTimer, [])

  const cart = actions.find((action) => action.id === 'cart')
  const secondary = actions.filter((action) => action.id !== 'cart')

  const handleTriggerClick = (id) => {
    clearTimer() // a hover-open still pending must not fire after the click
    if (openId === id && openedByHover.current) {
      // The pointer already opened it; a click pins it open instead of toggling it shut.
      openedByHover.current = false
      return
    }
    openedByHover.current = false
    setOpenId((current) => (current === id ? null : id))
  }

  const handlePointerEnter = (event, id) => {
    if (event.pointerType !== 'mouse') return
    clearTimer()
    hoverTimer.current = window.setTimeout(() => {
      openedByHover.current = openId !== id
      setOpenId(id)
    }, 80)
  }

  const handlePointerLeave = (event) => {
    if (event.pointerType !== 'mouse') return
    clearTimer()
    hoverTimer.current = window.setTimeout(() => {
      if (openedByHover.current) setOpenId(null)
    }, 150)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && openId) {
      event.stopPropagation()
      triggerRefs.current[openId]?.focus()
      close()
    }
  }

  const handleBlur = (event) => {
    if (openId && event.relatedTarget && !bandRef.current?.contains(event.relatedTarget)) close()
  }

  return (
    <header
      className={cn(
        'z-40 border-b border-border bg-surface text-foreground',
        sticky ? 'sticky top-0' : 'relative',
        className,
      )}
    >
      <Container size={containerSize} className="flex h-16 items-center gap-3 lg:gap-8">
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

        <NavbarBrand brand={brand} onNavigate={onNavigate} className="text-xl font-extrabold tracking-tight" />

        {search && (
          <div className="mx-auto hidden w-full max-w-2xl lg:block">
            <SearchField search={search} icon={icons.search} />
          </div>
        )}

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <ActionButtons actions={secondary} className="hidden items-center gap-1 lg:flex" />
          {cart && <ActionButton action={cart} />}
          {endSlot && <div className="ml-2 hidden lg:block">{endSlot}</div>}
        </div>
      </Container>

      {search && (
        <Container size={containerSize} className="pb-3 lg:hidden">
          <SearchField search={search} icon={icons.search} />
        </Container>
      )}

      {/* Desktop link band. The ref wrapper also contains the panels, so moving the
          pointer from a trigger down into its panel never counts as leaving. */}
      <div
        ref={bandRef}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onPointerLeave={handlePointerLeave}
        className="hidden bg-primary lg:block"
      >
        <Container size={containerSize}>
          <nav aria-label={navLabel}>
            <ul className="-mx-4 flex items-center">
              {links.map((item) => {
                const key = itemKey(item)
                const panelId = `${panelBaseId}-${key}`
                const isOpen = openId === key

                return (
                  <li
                    key={key}
                    onPointerEnter={(event) => {
                      if (item.menu) handlePointerEnter(event, key)
                      // Hovering a plain link dismisses a panel that the pointer opened.
                      else if (event.pointerType === 'mouse' && openedByHover.current) close()
                    }}
                  >
                    {item.menu ? (
                      <button
                        ref={(node) => {
                          triggerRefs.current[key] = node
                        }}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? panelId : undefined}
                        onClick={() => handleTriggerClick(key)}
                        className={cn(bandItem, item.current && bandCurrent)}
                      >
                        {item.label}
                        <span aria-hidden="true" className={cn('transition-transform', isOpen && 'rotate-180')}>
                          {icons.chevron}
                        </span>
                      </button>
                    ) : (
                      <NavLink
                        item={item}
                        onNavigate={(target, event) => {
                          close()
                          onNavigate?.(target, event)
                        }}
                        className={bandItem}
                        currentClassName={bandCurrent}
                      />
                    )}
                    {item.menu && isOpen && (
                      <MegaPanel id={panelId} label={item.label} menu={item.menu} onNavigate={onNavigate} onClose={close} />
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </Container>
      </div>

      <MobileMenu
        open={mobileMenu.open}
        onClose={mobileMenu.closeMenu}
        triggerRef={triggerRef}
        placement="left"
        links={links}
        actions={secondary}
        icons={icons}
        onNavigate={onNavigate}
      />
    </header>
  )
}
