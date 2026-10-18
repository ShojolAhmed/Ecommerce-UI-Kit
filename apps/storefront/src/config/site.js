import { getCategories } from '../data/catalog.js'
import { paths } from '../routing/paths.js'

// Everything a store owner would rename or reword. Layout code reads from here; nothing else hardcodes store copy.

export const site = {
  brand: { name: 'Fieldhouse', href: paths.home },
  currency: 'USD',
  locale: 'en-US',
  /** Highest quantity of one product in the cart. */
  maxCartQuantity: 10,
  freeShippingThreshold: 75,
}

const categoryLinks = () => getCategories().map(({ id, label, href }) => ({ id, label, href }))

/**
 * Primary navigation in the kit's `NavbarLink[]` shape. `current` is set from the pathname, so the kit can mark the
 * active page.
 * @param {string} pathname
 */
export function getNavLinks(pathname) {
  const isCurrent = (href) => pathname === href || pathname.startsWith(`${href}/`)

  return [
    {
      id: 'shop',
      label: 'Shop',
      href: paths.shop,
      current: pathname === paths.shop,
      menu: {
        columns: [
          { title: 'Categories', links: categoryLinks() },
          {
            title: 'Help',
            links: [
              { label: 'Shipping', href: paths.shipping },
              { label: 'Returns', href: paths.returns },
              { label: 'FAQ', href: paths.faq },
              { label: 'Contact', href: paths.contact },
            ],
          },
        ],
        featured: {
          title: 'New this season',
          description: 'Linen, suede and a watch worth keeping.',
          href: paths.shop,
          cta: 'Shop all',
        },
      },
    },
    ...getCategories().map(({ id, label, href }) => ({ id: `nav-${id}`, label, href, current: isCurrent(href) })),
    { id: 'about', label: 'About', href: paths.about, current: pathname === paths.about },
  ]
}

export const footer = {
  brand: { ...site.brand, description: 'Everyday carry, outerwear and home goods, made to last.' },
  columns: [
    { id: 'shop', title: 'Shop', links: [{ label: 'All products', href: paths.shop }, ...categoryLinks()] },
    {
      id: 'help',
      title: 'Help',
      links: [
        { label: 'Shipping', href: paths.shipping },
        { label: 'Returns', href: paths.returns },
        { label: 'FAQ', href: paths.faq },
        { label: 'Contact', href: paths.contact },
      ],
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { label: 'About', href: paths.about },
        { label: 'Account', href: paths.account },
        { label: 'Wishlist', href: paths.wishlist },
      ],
    },
  ],
  legalLinks: [
    { label: 'Privacy', href: paths.privacy },
    { label: 'Terms', href: paths.terms },
  ],
  newsletter: {
    title: 'Get the monthly note',
    description: 'New arrivals and restocks, once a month.',
  },
}
