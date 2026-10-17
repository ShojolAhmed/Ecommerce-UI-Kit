import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Navbar,
  ProductCard,
  Sidebar,
  Footer,
  navbarVariants,
  productCardVariants,
  sidebarVariants,
  footerVariants,
  DEFAULT_NAVBAR_VARIANT,
  DEFAULT_PRODUCT_CARD_VARIANT,
  DEFAULT_SIDEBAR_VARIANT,
  DEFAULT_FOOTER_VARIANT,
} from '../src/library/index.js'

const product = { id: 1, name: 'Merino Sweater', price: 89, image: 'https://example.com/a.jpg' }
const families = {
  Navbar: {
    Selector: Navbar,
    variants: navbarVariants,
    dflt: DEFAULT_NAVBAR_VARIANT,
    props: {
      brand: { name: 'Northwind', href: '/' },
      links: [{ id: 'new', label: 'New', href: '/new' }],
    },
  },
  ProductCard: { Selector: ProductCard, variants: productCardVariants, dflt: DEFAULT_PRODUCT_CARD_VARIANT, props: { product } },
  Sidebar: {
    Selector: Sidebar,
    variants: sidebarVariants,
    dflt: DEFAULT_SIDEBAR_VARIANT,
    props: {
      categories: [{ id: 'all', label: 'All' }],
      filterGroups: [{ id: 'brand', label: 'Brand', type: 'checkbox', options: [{ value: 'A', label: 'A' }] }],
      filters: {},
      onFiltersChange: () => {},
    },
  },
  Footer: {
    Selector: Footer,
    variants: footerVariants,
    dflt: DEFAULT_FOOTER_VARIANT,
    props: { brand: { name: 'Northwind' }, columns: [{ id: 'help', title: 'Help', links: [{ label: 'FAQ', href: '/faq' }] }] },
  },
}

// React's useId() differs on every mount (":r1:", "_r_1b_"...), so compare markup with those ids masked.
const maskIds = (html) => html.replace(/_r_[0-9a-z]+_|:r[0-9a-z]+:/g, 'ID')

const markup = (element) => {
  const { container, unmount } = render(element)
  const html = maskIds(container.innerHTML)
  unmount()
  return html
}

describe.each(Object.entries(families))('%s variant selection', (_name, { Selector, variants, dflt, props }) => {
  it('renders every registered variant, each one identical to using that design directly', () => {
    for (const [id, Direct] of Object.entries(variants)) {
      const viaSelector = markup(<Selector variant={id} {...props} />)
      expect(viaSelector, `"${id}" rendered nothing`).not.toBe('')
      expect(viaSelector, `"${id}" differs from its direct import`).toBe(markup(<Direct {...props} />))
    }
  })

  it('uses the default design without a warning when no variant is given', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(markup(<Selector {...props} />)).toBe(markup(<Selector variant={dflt} {...props} />))
    expect(warn).not.toHaveBeenCalled()
  })

  it('falls back to the default and warns once per unknown value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const bogus = `nope-${_name}`
    expect(markup(<Selector variant={bogus} {...props} />)).toBe(markup(<Selector variant={dflt} {...props} />))
    markup(<Selector variant={bogus} {...props} />)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain(bogus)
  })

  it('swaps the design when the variant prop changes', () => {
    const ids = Object.keys(variants)
    const [first, second] = [ids[0], ids.find((id) => markup(<Selector variant={id} {...props} />) !== markup(<Selector variant={ids[0]} {...props} />))]
    expect(second, 'at least two visibly different designs').toBeDefined()
    const { container, rerender } = render(<Selector variant={first} {...props} />)
    const before = maskIds(container.innerHTML)
    rerender(<Selector variant={second} {...props} />)
    expect(maskIds(container.innerHTML)).not.toBe(before)
    expect(maskIds(container.innerHTML)).toBe(markup(<Selector variant={second} {...props} />))
  })
})

describe('Navbar aliases', () => {
  it('accepts megaMenu and centeredLogo for mega and centered', () => {
    const props = families.Navbar.props
    expect(markup(<Navbar variant="megaMenu" {...props} />)).toBe(markup(<Navbar variant="mega" {...props} />))
    expect(markup(<Navbar variant="centeredLogo" {...props} />)).toBe(markup(<Navbar variant="centered" {...props} />))
  })

  it('renders a labelled navigation landmark', () => {
    render(<Navbar {...families.Navbar.props} />)
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0)
  })
})
