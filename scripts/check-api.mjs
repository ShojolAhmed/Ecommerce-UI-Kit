// Checks the built package (dist-lib) the way a consumer sees it: public exports, variant selection,
// fallbacks and warnings. Run with `npm run test:api`.
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import * as kit from '../dist-lib/ecom-ui-kit.js'

let passed = 0
const test = (name, fn) => {
  try {
    fn()
    passed += 1
    console.log(`  ok  ${name}`)
  } catch (error) {
    console.error(`FAIL  ${name}\n      ${error.message}`)
    process.exitCode = 1
  }
}
const html = (element) => renderToString(element)

// Capture development warnings.
const warnings = []
console.warn = (message) => warnings.push(String(message))
const takeWarnings = () => warnings.splice(0)

const product = { id: 1, name: 'Merino Sweater', price: 89, image: 'https://example.com/a.jpg' }
const navbarProps = {
  brand: { name: 'Northwind', href: '/' },
  links: [{ id: 'new', label: 'New', href: '/new' }, { id: 'sale', label: 'Sale', href: '/sale' }],
}
const sidebarProps = {
  categories: [{ id: 'all', label: 'All' }],
  filterGroups: [{ id: 'brand', label: 'Brand', type: 'checkbox', options: [{ value: 'A', label: 'A' }] }],
  filters: {},
  onFiltersChange: () => {},
}
const footerProps = { brand: { name: 'Northwind' }, columns: [{ id: 'help', title: 'Help', links: [{ label: 'FAQ', href: '/faq' }] }] }

const families = {
  Navbar: { Selector: kit.Navbar, registry: kit.navbarRegistry, variants: kit.navbarVariants, dflt: kit.DEFAULT_NAVBAR_VARIANT, props: navbarProps },
  ProductCard: { Selector: kit.ProductCard, registry: kit.productCardRegistry, variants: kit.productCardVariants, dflt: kit.DEFAULT_PRODUCT_CARD_VARIANT, props: { product } },
  Sidebar: { Selector: kit.Sidebar, registry: kit.sidebarRegistry, variants: kit.sidebarVariants, dflt: kit.DEFAULT_SIDEBAR_VARIANT, props: sidebarProps },
  Footer: { Selector: kit.Footer, registry: kit.footerRegistry, variants: kit.footerVariants, dflt: kit.DEFAULT_FOOTER_VARIANT, props: footerProps },
}
const direct = {
  Navbar: { minimal: 'MinimalNavbar', centered: 'CenteredLogoNavbar', mega: 'MegaMenuNavbar', compact: 'CompactNavbar' },
  ProductCard: { minimal: 'MinimalProductCard', sale: 'SaleProductCard', overlay: 'OverlayProductCard', horizontal: 'HorizontalProductCard', luxury: 'LuxuryProductCard' },
  Sidebar: { classic: 'ClassicSidebar', collapsible: 'CollapsibleSidebar', minimal: 'MinimalSidebar' },
  Footer: { simple: 'SimpleFooter', columns: 'MultiColumnFooter', newsletter: 'NewsletterFooter', dark: 'DarkFooter' },
}

console.log('Public exports')
for (const [family, { variants }] of Object.entries(families)) {
  test(`${family}: every registered variant has a named export`, () => {
    assert.deepEqual(Object.keys(variants).sort(), Object.keys(direct[family]).sort())
    for (const [id, exportName] of Object.entries(direct[family])) {
      assert.equal(typeof kit[exportName], 'function', `${exportName} is not exported`)
      assert.equal(kit[exportName], variants[id], `${exportName} is not the "${id}" variant`)
    }
  })
}
test('helpers and primitives are still exported', () => {
  for (const name of ['ProductGrid', 'FeaturedProducts', 'CartDrawer', 'Button', 'ToastProvider', 'getCartTotals', 'countActiveFilters']) {
    assert.ok(kit[name], `${name} missing`)
  }
})

for (const [family, { Selector, registry, variants, dflt, props }] of Object.entries(families)) {
  console.log(`${family} selection`)

  test('every variant renders through the selector and matches its direct import', () => {
    for (const [id, exportName] of Object.entries(direct[family])) {
      const viaSelector = html(h(Selector, { variant: id, ...props }))
      const viaDirect = html(h(kit[exportName], props))
      assert.ok(viaSelector.length > 50, `"${id}" rendered nothing`)
      assert.equal(viaSelector, viaDirect, `"${id}" differs between selector and direct import`)
    }
    assert.deepEqual(takeWarnings(), [])
  })

  test('no variant (undefined / null) renders the default silently', () => {
    const expected = html(h(variants[dflt], props))
    assert.equal(html(h(Selector, props)), expected)
    assert.equal(html(h(Selector, { variant: null, ...props })), expected)
    assert.deepEqual(takeWarnings(), [])
  })

  test('unknown variants fall back to the default and warn once per value', () => {
    const expected = html(h(variants[dflt], props))
    for (const bad of ['does-not-exist', '', 'constructor', '__proto__', 42]) {
      assert.equal(html(h(Selector, { variant: bad, ...props })), expected, `${JSON.stringify(bad)} did not fall back`)
    }
    const first = takeWarnings()
    assert.equal(first.length, 5)
    assert.ok(first.every((message) => message.includes(`[${family}]`) && message.includes(`"${dflt}"`) && message.includes('Available:')))
    html(h(Selector, { variant: 'does-not-exist', ...props }))
    assert.deepEqual(takeWarnings(), [], 'the same unknown value warned twice')
  })

  test('registry resolves canonical names only; resolve never returns undefined', () => {
    assert.deepEqual(registry.names, Object.keys(variants))
    for (const value of [undefined, null, 'x', 'toString', 7]) assert.equal(typeof registry.resolve(value), 'function')
    takeWarnings()
  })
}

console.log('Aliases')
test('Navbar accepts megaMenu and centeredLogo for mega and centered', () => {
  const { props } = families.Navbar
  assert.equal(html(h(kit.Navbar, { variant: 'megaMenu', ...props })), html(h(kit.Navbar, { variant: 'mega', ...props })))
  assert.equal(html(h(kit.Navbar, { variant: 'centeredLogo', ...props })), html(h(kit.Navbar, { variant: 'centered', ...props })))
  assert.deepEqual(kit.navbarVariantAliases, { megaMenu: 'mega', centeredLogo: 'centered' })
  assert.ok(!Object.keys(kit.navbarVariants).includes('megaMenu'), 'aliases must not appear in the canonical list')
  assert.deepEqual(takeWarnings(), [])
})

console.log('Families that forward a card variant')
test('ProductGrid and FeaturedProducts fall back instead of rendering nothing', () => {
  const grid = (variant) => html(h(kit.ProductGrid, { products: [product], variant }))
  assert.ok(grid('nope').includes('Merino Sweater'))
  assert.equal(grid('nope'), grid('minimal'))
  assert.equal(takeWarnings().length, 1)
  const featured = (variant) => html(h(kit.FeaturedProducts, { products: [product], title: 'Picks', variant }))
  assert.equal(featured('also-nope'), featured('minimal'))
  assert.equal(takeWarnings().length, 1)
})

console.log(`\n${passed} checks passed${process.exitCode ? ' (with failures)' : ''}`)
