# Ecom UI Kit

Reusable React e-commerce UI components with interchangeable design variants
(navbars, product cards, sidebars, footers, …). Built with React, Vite, JavaScript and Tailwind CSS.

> Status: **Phase 4 – product cards.** Design tokens, light/dark themes, six primitives (Button, IconButton, Badge, Input, Container, Spinner), the `Navbar` family (four variants), and the `ProductCard` family (five variants) with a reusable `ProductGrid`.

## Getting started

```bash
npm install
npm run dev      # preview page at http://localhost:5173
npm run lint     # ESLint
npm run build    # production build of the preview app
```

## Structure

```
src/
  library/               # the future npm package – public API only
    styles/              # theme.css (tokens + light/dark), base.css, index.css
    primitives/<Name>/   # Button, IconButton, Badge, Input, Container, Spinner
      <Name>.jsx         # component
      <name>Styles.js    # class maps (kept out of the component file for fast refresh)
    components/<Family>/
      <Family>.jsx       # picks a variant via the `variant` prop
      variants/          # one file per design + index.js registry
    utils/
    index.js             # public exports
  preview/               # dev-only preview app (not packaged)
  App.jsx, main.jsx, index.css
```

## Adding a component or variant

1. **New variant:** add `variants/MyVariant.jsx` (same props as its siblings) and register it in `variants/index.js`.
2. **New family:** create `components/<Family>/`, export it from `src/library/index.js`, and add an entry to `src/preview/registry.jsx`.

Anything in `src/library` must not import from `src/preview`.

## Design tokens & theming

All tokens live in `src/library/styles/theme.css` and become Tailwind utilities:

| Token | Utilities / usage |
| --- | --- |
| Colors (semantic) | `bg-background`, `bg-surface`, `text-foreground`, `text-foreground-muted`, `border-border`, `bg-primary text-primary-foreground`, `bg-danger-soft`, … |
| Typography | `font-sans`, `font-display`, `font-mono`, `text-xs` … `text-4xl` |
| Spacing | Tailwind scale (base `0.25rem`) plus fluid `px-gutter`, `py-section` |
| Radius | `rounded-sm` … `rounded-2xl`, semantic `rounded-control`, `rounded-surface` |
| Shadow | `shadow-xs` … `shadow-xl` (color adapts to theme) |
| Breakpoints | `xs` (30rem), `sm`, `md`, `lg`, `xl`, `2xl` |
| Layout widths | `max-w-page-narrow`, `max-w-page`, `max-w-page-wide` |

**Themes.** Colors are runtime CSS variables (`--ui-*`), so components use semantic
classes and need no `dark:` overrides. The theme follows the OS by default; set
`<html data-theme="light|dark">` to force one (any element can scope a theme to its subtree).
The `dark:` variant follows `data-theme="dark"` only.

**States.** Primitives share one focus style (`outline-ring`, keyboard only) and use the custom
`actionable:` variant so hover/active styles never apply to disabled or loading controls.

## Styling note

Components use Tailwind utility classes. Tailwind v4 must scan the library's source;
`src/index.css` does this with `@source "./library"` and imports `library/styles/index.css` for the tokens.
Consumers will need an equivalent `@source` line plus that stylesheet import.

## Navbar

```jsx
import { Navbar } from './library'

<Navbar
  variant="mega"               // 'minimal' | 'centered' | 'mega' | 'compact'
  sticky
  brand={{ name: 'Northwind', href: '/' }}
  links={[
    { id: 'new', label: 'New In', href: '/new', current: true },
    { id: 'women', label: 'Women', href: '/women', menu: { columns: [/* … */], featured: {/* … */} } },
  ]}
  search={{ placeholder: 'Search products', onSubmit: (query) => runSearch(query) }}
  account={{ href: '/account' }}
  wishlist={{ count: 3, href: '/wishlist' }}
  cart={{ count: 2, onClick: openCart }}
  onNavigate={(item, event) => { event.preventDefault(); router.push(item.href) }}
/>
```

Every variant takes the **same props**, so changing `variant` is the only edit needed to swap designs.
The full contract is documented in `src/library/components/Navbar/types.js`.

| Prop | Notes |
| --- | --- |
| `brand` | `{ name, href?, logo? }`. `logo` (img/svg) replaces the text wordmark; `name` stays the accessible name. |
| `links` | `[{ id?, label, href, current?, badge?, menu? }]`. Give every link an `href`, even ones with a `menu`. |
| `search` | `{ placeholder?, label?, defaultValue?, onSubmit?, action? }`. `onSubmit(query)` keeps the page in place; without it the form does a native GET to `action`. Omit to hide. |
| `account`, `wishlist`, `cart` | `{ label?, href?, onClick?, count? }` or `true`. A link when `href` is set, otherwise a button. Counts show as a badge and are included in the accessible name. Omit to hide. |
| `onNavigate(item, event)` | Called for every link click (brand, links, menu links). Call `event.preventDefault()` to route client-side. |
| `endSlot` | Extra node after the actions (currency or locale picker). Desktop only. |
| `icons` | Replace built-in icons: `{ search, account, wishlist, cart, menu, close, chevron }`. |
| `navLabel`, `containerSize`, `sticky`, `className` | Accessible name of the main `<nav>` (make it unique if several navbars share a page), `Container` size, `position: sticky`, extra classes. |

**Variants**

| `variant` | Desktop | Mobile | Mobile menu |
| --- | --- | --- | --- |
| `minimal` | One slim row. Links beside the logo; search is an icon that takes over the bar. | Logo, search, cart, menu button. | Right drawer. |
| `centered` | Search left, spaced wordmark centered, actions right, links on a second centered row (from `lg`). | Menu, logo, cart. | Left drawer, includes search. |
| `mega` | Logo, wide search and actions, then an inverse link band. Links with a `menu` open a full-width panel (columns plus a featured card). From `lg`. | Menu, logo, cart, search row below. | Left drawer, menus become accordions. |
| `compact` | One slim row: logo, links, small search, actions. | Logo and always-visible search on top, plus a fixed bottom tab bar (Menu, Wishlist, Account, Cart). | Bottom sheet. |

`compact`'s tab bar is `position: fixed`; add bottom padding to the page (e.g. `pb-16 md:pb-0`).

**Behaviour shared by all variants.** The mobile menu is a modal dialog: focus moves in on open, Tab is trapped,
Escape closes, page scroll is locked, and focus returns to the button that opened it. It also closes itself if the
window grows past the variant's breakpoint. The mega menu uses the disclosure pattern: hover (mouse only) or click
opens a panel, a click after hover pins it, and Escape, outside click or tabbing out closes it.

**Demo.** `npm run dev` shows every variant under *Navbar* with sample data from `src/preview/sampleData.js`
(clicking links, searching and the cart button update a status line). Layouts follow the browser width, so resize the
window below `768px` to see the mobile layouts.

## Product Card

```jsx
import { ProductCard } from './library'

<ProductCard
  variant="sale"               // 'minimal' | 'sale' | 'overlay' | 'horizontal' | 'luxury'
  product={{
    id: 1001,
    name: 'Merino Crewneck Sweater',
    price: 89,
    originalPrice: 120,
    image: '/img/sweater.jpg',
    rating: 4.7,
    reviewCount: 312,
    badges: ['New', { label: 'Bestseller', variant: 'brand' }],
    href: '/products/merino-crewneck',
  }}
  isWishlisted={wishlist.has(1001)}
  onAddToCart={(product) => cart.add(product.id)}
  onToggleWishlist={(product) => wishlist.toggle(product.id)}
  onProductClick={(product, event) => { event.preventDefault(); router.push(product.href) }}
/>
```

Every variant takes the **same props**, so changing `variant` is the only edit needed to swap designs. The cards are
purely presentational: they keep no cart or wishlist state and call no API. Your page owns the logic and passes state in
(`isWishlisted`, `addingToCart`) and callbacks out. The full contract is in `src/library/components/ProductCard/types.js`.

**`product`**

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string \| number` | Required. |
| `name` | `string` | Required. |
| `price` | `number` | Required. Major units (`49.9` = $49.90). |
| `originalPrice` | `number` | Optional. Shown struck through, and drives the discount, only when higher than `price`. |
| `image` | `string` | Optional. A missing or failing URL shows a placeholder of the same size (no layout shift). |
| `imageAlt` | `string` | Optional. Images are decorative by default because the name sits beside them. |
| `rating` | `number` | Optional, 0–5, shown to the nearest half star. Hidden when missing or 0. |
| `reviewCount` | `number` | Optional. Shown compactly (`1.2K`) and announced in full. Hidden when missing or 0. |
| `badges` | `(string \| { label, variant? })[]` | Optional. `variant` is any `Badge` variant (default `neutral`). Long labels truncate. |
| `href` | `string` | Optional. Makes the name a real link. |
| `brand`, `description` | `string` | Optional. `description` is shown by `horizontal` only. |
| `inStock` | `boolean` | Optional, default `true`. `false` fades the image and disables add to cart. |

**Props**

| Prop | Notes |
| --- | --- |
| `product` | See above. |
| `isWishlisted`, `addingToCart` | Controlled booleans. The wishlist button uses `aria-pressed`; `addingToCart` shows the busy state and ignores clicks. |
| `onAddToCart(product, event)` | Omit to hide the add-to-cart button. |
| `onToggleWishlist(product, event)` | Omit to hide the wishlist button. |
| `onProductClick(product, event)` | Fires when the card is activated. With `href`, call `event.preventDefault()` to route client-side. |
| `currency`, `locale` | Price formatting through `Intl.NumberFormat`. Defaults: `'USD'` and the browser locale. |
| `formatPrice(amount, product)` | Replaces the built-in formatting entirely. |
| `labels` | Override any string for localisation: `addToCart`, `outOfStock`, `wishlist`, `currentPrice`, `originalPrice`, and the functions `off(percent)`, `save(amountText)`, `rating(value)`, `reviews(count)`. |
| `headingLevel` | Heading level of the name, `2`–`6` (default `3`). Pick the level below your section heading. |
| `className` | Extra classes for the card root. |

**Variants**

| `variant` | Look | Notes |
| --- | --- | --- |
| `minimal` | Borderless, square photo, quiet text, outlined button. | One badge, on the image. |
| `sale` | Bordered card, bold `-26%` badge, price in the danger color, struck-through original, "Save $31.00". | Falls back to a plain price when there is no real discount, so it can be used on a mixed catalog. |
| `overlay` | Portrait photo with the wishlist heart on it and an add-to-cart bar that slides up over the image. | The bar shows on hover or keyboard focus on hover-capable devices and is always visible on touch screens. Text stays below the image. |
| `horizontal` | Image left, details right. | For lists and search results. Shows `description` from `sm` up. |
| `luxury` | Tall portrait photo, square corners, wide letter-spacing, centered text, slow image zoom, outlined labels instead of colored pills. | Uses the `font-display` token, so set it in `theme.css` to give it the brand's serif. |

**Behaviour shared by all variants**

- **One click target.** The name is the link (or a button when there is only `onProductClick`, or plain text when there is
  neither) and is stretched over the whole card, so the image and the empty space are clickable without nesting
  interactive elements. The keyboard focus ring outlines the whole card. The wishlist and add-to-cart buttons sit above
  that layer and never trigger a product click.
- **Accessible names.** Buttons are named with the product ("Add to cart: Name", "Add to wishlist: Name"). Stars read
  "Rated 4.7 out of 5", prices read "Current price: … Original price: …", the discount badge reads "26% off".
- **Missing data.** No rating, reviews, badges, brand, image or `originalPrice` simply leaves that part out. A stale
  `originalPrice` that is not higher than `price` is ignored. Entries the grid cannot render are skipped (see below).
- **Responsive.** Cards fill their container; pair them with `ProductGrid` or your own grid. Names clamp to two lines.
  Verified down to 320px wide.

**Where the data logic lives.** All parsing and formatting (discount, rating, price, badges) lives in
`ProductCard/shared/model.js` as pure functions, so a new variant only arranges the pieces in `shared/`.

## Product Grid

```jsx
import { ProductGrid } from './library'

<ProductGrid
  products={products}
  variant="overlay"
  wishlistedIds={wishlist}                 // array or Set of ids
  addingToCartIds={pendingIds}
  onAddToCart={addToCart}
  onToggleWishlist={toggleWishlist}
  onProductClick={openProduct}
  currency="USD"
  label="New arrivals"
/>
```

Renders a semantic list (`<ul>` of `<li>`) of cards in the selected variant. It forwards every card prop, so see the
table above for `onAddToCart`, `onToggleWishlist`, `onProductClick`, `currency`, `locale`, `formatPrice`, `labels` and
`headingLevel`.

| Prop | Notes |
| --- | --- |
| `products` | `Product[]`. Entries without an `id` or a `name` are skipped (with a console warning in development). |
| `variant` | Any card variant (default `minimal`). Switching it needs no other change. |
| `columns` | `1 \| 2 \| 3 \| 4`: the column count on wide screens, collapsing on smaller ones. Omit to use the variant's own responsive layout (4 columns for `minimal`/`sale`/`overlay`, 2 for `horizontal`, 3 for `luxury`). |
| `wishlistedIds`, `addingToCartIds` | Ids (array or `Set`) mapped to each card's `isWishlisted` / `addingToCart`. Compared with strict equality, so keep id types consistent. |
| `emptyState` | Node shown when there is nothing to render. Defaults to "No products to show." |
| `label` | Accessible name of the list. |
| `className`, `cardClassName` | Extra classes for the grid and for every card. |

Per-variant defaults are exported as `productCardLayouts` (`{ columns, gap }` class strings) if you build your own grid.

**Demo.** `npm run dev` shows every card variant (four data states each: discounted, long name without a rating, broken
image, out of stock) under *Product Card*, and a playground under *Product Grid* with a variant switcher, a column
switcher and the empty states. The 12 sample products live in `src/preview/sampleData.js` and deliberately include
missing and broken images, no rating, a rating without a count, long names, out of stock and mixed id types. The wishlist,
the busy state and the cart count in the demo are fake preview state (`src/preview/product/useProductDemo.js`): there is
no cart or backend. The sample photos come from picsum.photos, so they need an internet connection.

## Styling gotcha for variant authors

Tailwind decides which of two conflicting utilities wins (`relative`/`absolute`, `text-sm`/`text-xs`, `font-semibold`/
`font-normal`) by its stylesheet order, **not** by their order in `className`. Do not pass a utility to a primitive that
it already sets. Wrap it instead (as `WishlistButton` does for positioning), or use the important modifier on purpose
(`rounded-none!` in the luxury button), and avoid baking defaults into shared components that variants must override.

## Roadmap

Sidebars and footers, then library build mode and npm publishing. Not included yet.
