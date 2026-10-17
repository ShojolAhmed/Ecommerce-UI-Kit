import { Breadcrumbs, Footer, Navbar, AnnouncementBar, footerVariants, navbarVariants } from '../../../library/index.js'
import {
  breadcrumbTrail,
  fakeSubscribe,
  navbarLinks,
  sampleAnnouncements,
  sampleFooter,
  sampleNavbar,
} from '../../data/index.js'
import { defineFamily, variantsFromRegistry } from '../define.js'
import { fn, node, ref, setter, state } from '../markers.js'

const CATEGORY = 'chrome'

const navbarInfo = {
  minimal: {
    label: 'Minimal',
    description: 'One slim row. Links beside the logo; search is an icon that takes over the bar. Mobile: logo, search, cart and a right-hand drawer.',
  },
  centered: {
    label: 'Centered logo',
    description: 'Search left, spaced wordmark centered, actions right, links on a second row from lg. Mobile: menu, logo, cart and a left drawer that includes search.',
  },
  mega: {
    label: 'Mega menu',
    description: 'Logo, wide search and actions over an inverse link band. Links with a menu open a full-width panel (from lg). Mobile: menus become accordions in a left drawer.',
  },
  compact: {
    label: 'Compact',
    description: 'One slim row with a small search. Mobile: always-visible search plus a fixed bottom tab bar (Menu, Wishlist, Account, Cart) and a bottom-sheet menu. Add bottom padding to the page.',
  },
}

export const navbar = defineFamily({
  id: 'navbar',
  name: 'Navbar',
  category: CATEGORY,
  summary: 'Site header with brand, links, search and account / wishlist / cart actions. All four designs share one props contract.',
  component: Navbar,
  importName: 'Navbar',
  source: 'src/library/components/Navbar',
  variantProp: 'variant',
  baseProps: {
    sticky: true,
    brand: ref('brand', sampleNavbar.brand),
    links: ref('links', navbarLinks),
    onNavigate: fn('handleNavigate'),
    search: { placeholder: 'Search products', onSubmit: fn('handleSearch') },
    account: { onClick: fn('openAccount') },
    wishlist: { count: 3, onClick: fn('openWishlist') },
    cart: { count: 2, onClick: fn('openCart') },
  },
  variants: variantsFromRegistry(navbarVariants, navbarInfo),
  frame: { desktop: 560, mobile: 720, padded: false, filler: true },
  docs: {
    sections: [{ title: 'Props', file: 'components/Navbar/types.js', typedef: 'NavbarProps' }],
    shapes: ['components/Navbar/types.js'],
  },
})

const footerInfo = {
  simple: { label: 'Simple', description: 'One slim block: wordmark, one row of links, social icons and the legal line.' },
  columns: { label: 'Multi-column', description: 'Brand and social on the left, link columns on the right (auto-fit to 2 to 5 columns).' },
  newsletter: { label: 'Newsletter', description: 'Large signup band on top, then the columns. Without a newsletter prop there is no band.' },
  dark: { label: 'Dark', description: 'Always dark, spaced serif wordmark, hairline rules and a compact newsletter.' },
}

export const footer = defineFamily({
  id: 'footer',
  name: 'Footer',
  category: CATEGORY,
  summary: 'Site footer in four designs. A variant ignores the props it does not show.',
  component: Footer,
  importName: 'Footer',
  source: 'src/library/components/Footer',
  variantProp: 'variant',
  baseProps: {
    brand: ref('brand', sampleFooter.brand),
    columns: ref('columns', sampleFooter.columns),
    social: ref('social', sampleFooter.social),
    legalLinks: ref('legalLinks', sampleFooter.legalLinks),
    newsletter: { ...sampleFooter.newsletter, onSubscribe: fn('handleSubscribe', fakeSubscribe) },
    bottomSlot: node('<span>Prices in USD</span>', <span className="text-sm text-foreground-muted">Prices in USD</span>),
    onNavigate: fn('handleNavigate'),
  },
  variants: variantsFromRegistry(footerVariants, footerInfo, (id) =>
    id === 'newsletter'
      ? { newsletter: { ...sampleFooter.newsletter, consent: 'Yes, email me about new arrivals. I can unsubscribe at any time.', onSubscribe: fn('handleSubscribe', fakeSubscribe) } }
      : {},
  ),
  frame: { desktop: 760, mobile: 980, padded: false },
  docs: {
    sections: [{ title: 'Props', file: 'components/Footer/types.js', typedef: 'FooterProps' }],
    shapes: ['components/Footer/types.js'],
  },
})

const crumbBase = { onNavigate: fn('handleNavigate') }

export const breadcrumbs = defineFamily({
  id: 'breadcrumbs',
  name: 'Breadcrumbs',
  category: CATEGORY,
  summary: 'Trail of ancestors ending in the current page. Long trails can fold the middle behind a "…" button.',
  component: Breadcrumbs,
  importName: 'Breadcrumbs',
  source: 'src/library/components/Breadcrumbs',
  baseProps: crumbBase,
  variants: [
    { id: 'default', label: 'Default', description: 'Four levels, current page last.', props: { items: ref('items', breadcrumbTrail.slice(0, 4)) } },
    { id: 'collapsed', label: 'Collapsed', description: 'maxItems folds the middle of a long trail; activating "…" reveals it.', props: { items: ref('items', breadcrumbTrail), maxItems: 3 } },
    { id: 'custom-separator', label: 'Custom separator', description: 'Replacement separator, rendered aria-hidden.', props: { items: ref('items', breadcrumbTrail.slice(0, 4)), separator: '/' } },
  ],
  frame: { desktop: 220, mobile: 260 },
  docs: { sections: [{ title: 'Props', file: 'components/Breadcrumbs/Breadcrumbs.jsx' }] },
})

export const announcementBar = defineFamily({
  id: 'announcement-bar',
  name: 'Announcement Bar',
  category: CATEGORY,
  summary: 'Thin strip above the header for shipping and promo messages. Rotates when it has several messages.',
  component: AnnouncementBar,
  importName: 'AnnouncementBar',
  source: 'src/library/components/AnnouncementBar',
  baseProps: { onLinkClick: fn('handleLinkClick') },
  variants: [
    { id: 'static', label: 'Single message', description: 'One message, no controls.', props: { messages: ref('messages', sampleAnnouncements.slice(0, 1)) } },
    { id: 'rotating', label: 'Rotating', description: 'Previous / next / pause buttons. Rotation stops on hover or focus and never starts under reduced motion.', props: { messages: ref('messages', sampleAnnouncements), interval: 4000 } },
    {
      id: 'dismissible',
      label: 'Dismissible',
      description: 'Controlled with open / onOpenChange. It does not remember a dismissal: persist it yourself. Use Reload preview to bring it back.',
      props: { messages: ref('messages', sampleAnnouncements.slice(0, 2)), dismissible: true, open: state('open', true), onOpenChange: setter('open') },
    },
    { id: 'tone-primary', label: 'Primary tone', description: 'tone="primary".', props: { messages: ref('messages', sampleAnnouncements.slice(0, 1)), tone: 'primary' } },
    { id: 'tone-dark', label: 'Dark tone', description: 'tone="dark" re-themes the bar through data-theme.', props: { messages: ref('messages', sampleAnnouncements.slice(0, 1)), tone: 'dark' } },
  ],
  frame: { desktop: 200, mobile: 220, padded: false },
  docs: { sections: [{ title: 'Props', file: 'components/AnnouncementBar/AnnouncementBar.jsx' }] },
})
