# Ecom UI Kit

Reusable React e-commerce UI components with interchangeable design variants
(navbars, product cards, sidebars, footers, homepage sections, …). Built with React, Vite, JavaScript and Tailwind CSS.

> Status: **Phase 6 – footers and homepage sections.** Four `Footer` variants and eight independent homepage sections (see below), on top of the phase 5 components. Earlier: **Phase 5 – product discovery.** Design tokens, light/dark themes, six primitives (Button, IconButton, Badge, Input, Container, Spinner), the `Navbar` family (four variants), the `ProductCard` family (five variants) with a reusable `ProductGrid`, and the discovery components: `Sidebar` (three variants), `FilterDrawer`, `SearchInput`, `SortDropdown`, `Breadcrumbs` and `ActiveFilters`.

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
    hooks/               # useDialogBehavior (focus trap, Escape, scroll lock), useControllableState
    icons/               # built-in icons for the discovery components
    utils/               # cn, discovery.js (pure filter / category helpers)
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

## Product discovery

Search, sort, categories, filters and breadcrumbs for a listing page. **Your page owns all the state**: the active
category, the filter values, the search text and the sort. The components only render what you pass in and call back
with the next value. There is no backend, no searching, no filtering and no sorting in the library; `Sidebar` and friends
never look at your products.

```jsx
import {
  Breadcrumbs, SearchInput, SortDropdown, Sidebar, ActiveFilters,
  FilterButton, FilterDrawer, ProductGrid, countActiveFilters,
} from './library'

const [category, setCategory] = useState(null)
const [filters, setFilters] = useState({})          // { brand: ['Northwind'], price: { min: 20 }, rating: 4 }
const [query, setQuery] = useState('')
const [sort, setSort] = useState('featured')
const [drawerOpen, setDrawerOpen] = useState(false)
const triggerRef = useRef(null)

const filterProps = {
  categories, activeCategory: category, onCategoryChange: (id) => setCategory(id),
  filterGroups, filters, onFiltersChange: setFilters,
}

<Breadcrumbs items={trail} onNavigate={(item, e) => { e.preventDefault(); router.push(item.href) }} />

{/* desktop */}
<div className="hidden lg:block w-64"><Sidebar variant="classic" {...filterProps} /></div>

{/* mobile */}
<FilterButton ref={triggerRef} className="lg:hidden" open={drawerOpen}
  activeCount={countActiveFilters(filterGroups, filters)} onClick={() => setDrawerOpen(true)} />
<FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} triggerRef={triggerRef}
  resultCount={results.length} {...filterProps} />

<SearchInput value={query} onChange={setQuery} onSubmit={(text) => runSearch(text)} />
<SortDropdown options={sortOptions} value={sort} onChange={setSort} />
<ActiveFilters filterGroups={filterGroups} filters={filters} onFiltersChange={setFilters} />
<ProductGrid products={results} />
```

### Data you provide

```js
categories = [                                   // Category[]
  { id: 'clothing', label: 'Clothing', count: 12, href: '/c/clothing',
    children: [{ id: 'knitwear', label: 'Knitwear', count: 5 }] },
]
filterGroups = [                                 // FilterGroup[]
  { id: 'brand',  label: 'Brand',  type: 'checkbox', options: [{ value: 'northwind', label: 'Northwind', count: 3 }] },
  { id: 'rating', label: 'Rating', type: 'radio',    options: [{ value: 4, label: '4 stars & up' }] },
  { id: 'price',  label: 'Price',  type: 'range', min: 0, max: 300, step: 1, currency: 'USD' },
]
sortOptions = [{ value: 'price-asc', label: 'Price: low to high' }, /* … */]
```

| Field | Notes |
| --- | --- |
| `Category` | `id`, `label`, optional `count`, `href` (renders a real link; otherwise a button) and `children`. Children show only while the category or one of its descendants is active. |
| `FilterGroup.type` | `'checkbox'` (default, many options), `'radio'` (one option) or `'range'` (min / max numbers). |
| `FilterGroup.options` | `{ value, label, count?, disabled? }`. `value` is compared with strict equality, so keep types consistent. |
| `FilterGroup.visibleOptions` | Checkbox groups longer than this (default 6) get "Show more". Selected options always stay visible. |
| `FilterGroup.defaultOpen` | Initial open state when the sidebar uses accordions (collapsible sidebar, drawer). Default `true`. |
| `FilterGroup` range fields | `min` / `max` (also placeholders; entries are clamped to them), `step`, `currency` (ISO 4217, used to format chips) or `format(amount)`. |

### Filter state

One plain object keyed by group id. An absent key means "nothing selected", and `{}` means "no filters".

| Group type | Value | Example |
| --- | --- | --- |
| checkbox | array of option values | `{ brand: ['northwind', 'atelier'] }` |
| radio | one option value | `{ rating: 4 }` |
| range | `{ min?, max? }` | `{ price: { min: 20, max: 100 } }` |

Components never mutate it: they call `onFiltersChange(next)` with the complete next object. That makes it easy to put in
a reducer or sync with the URL. Pure helpers exported from the library (no React) cover the common operations:
`countActiveFilters(groups, filters)`, `getActiveFilterChips`, `removeFilterChip`, `setFilterValue`, `toggleFilterOption`,
`clearFilterGroup`, `getFilterValue` and `getCategoryPath(categories, id)`.

### Sidebar

```jsx
<Sidebar variant="classic" {...filterProps} onClearAll={() => { setFilters({}); setPage(1) }} />
```

All variants take **the same props**, so changing `variant` is the only edit needed to swap designs (contract in
`components/Sidebar/types.js`). Each sidebar fills the width of its container, except `collapsible`, which sizes itself.

| Prop | Notes |
| --- | --- |
| `categories`, `activeCategory`, `onCategoryChange(id, category, event)` | Controlled. `id` is `null` for the "All products" row. Links navigate unless you call `event.preventDefault()`. |
| `filterGroups`, `filters`, `onFiltersChange(next)` | Controlled (see above). Ignored by `minimal`. |
| `onClearAll()` | Optional. Defaults to `onFiltersChange({})`. Provide it to also reset search, page, etc. The button only shows while filters are active. |
| `labels` | Override any string: `filters`, `categories`, `allCategories` (`null` hides the row), `clearAll`, `clear`, `clearGroup(label)`, `min`, `max`, `showMore`, `showLess`, `itemCount(n)`, `expandFilters`, `collapseFilters`, `activeCount(n)`. |
| `ariaLabel` | Name of the sidebar landmark (default: the "Filters" label). Make it unique if several sidebars share a page. |
| `headingLevel` | Level of the sidebar title, `2`-`5` (default `2`). Sections inside use the next level. |
| `className` | Extra classes for the root. |

| `variant` | Look | Notes |
| --- | --- | --- |
| `classic` | Bordered panel: "Filters" header with active count and Clear all, category list, then every group open. | Best for short filter lists. |
| `collapsible` | Same content, but each group is an accordion, and the whole panel folds into a slim rail (one toggle with the active count). | Extra props: `collapsed` + `onCollapsedChange(collapsed)` (controlled) or `defaultCollapsed`, `width` (`'16rem'`), `collapsedWidth` (`'3.5rem'`). Filters stay applied while collapsed. Sizes itself with inline widths, so its layout column must not force a width. |
| `minimal` | Category navigation only: quiet text, a rule on the active row. | No filters, so no clear-all. Its landmark is the category `<nav>`. |

**Filter groups.** Checkboxes and radios are native inputs wrapped in labels (so a click anywhere on the row works and
screen readers read "Northwind, 3 items"). Each group has its own "Clear" button while active. **Range groups** commit on
blur or Enter, not on every keystroke, so your page is not asked to refilter while someone types. Values are clamped to
`min` / `max`, and a reversed pair (200 / 50) is swapped.

### FilterDrawer and FilterButton

```jsx
<FilterButton ref={triggerRef} open={open} activeCount={n} onClick={() => setOpen(true)} />
<FilterDrawer open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} resultCount={results.length} {...filterProps} />
```

A modal bottom sheet or side drawer with the same content as the sidebars (categories, then accordion groups with
44px-tall touch rows) and a footer with **Clear all** and **Show N results**. Takes every sidebar prop above, plus:

| Prop | Notes |
| --- | --- |
| `open`, `onClose` | Required. The page owns the open state. |
| `triggerRef` | Ref of the button that opened it, so focus returns there on close. Pass the same ref to `FilterButton`. |
| `placement` | `'bottom'` (default, a sheet), `'left'` or `'right'`. |
| `title` | Dialog title (default: the "Filters" label). |
| `resultCount` | Footer reads "Show 24 results". Without it, "Show results". |
| `onApply()` | Called just before the drawer closes from the footer button. |
| `closeAbove` | Media query at which the drawer closes itself (default `'(min-width: 64rem)'`, i.e. when the desktop sidebar appears). |
| `children` | Optional slot above the filters, handy for a search field or sort on small screens. |
| `labels` | Sidebar labels plus `closeFilters`, `showResults`, `showResultsCount(n)`. |

Changes apply **live** through the same callbacks as the sidebars. To stage them instead, pass a draft copy of the
filters and commit it in `onApply`. Behaviour: focus moves in on open (to Close), Tab is trapped, Escape closes, page
scroll is locked and focus returns to the trigger.

`FilterButton` takes every `Button` prop plus `activeCount` (badge, announced as "Filters, 3 active"), `open`
(`aria-expanded`), `label` and `activeLabel(n)`.

### SearchInput

```jsx
<SearchInput value={query} onChange={setQuery} onSubmit={(text) => runSearch(text)} onClear={() => setPage(1)} />
```

Controlled. It only reports what is typed: no requests and no debouncing (debounce in your own handler if you query as
people type).

| Prop | Notes |
| --- | --- |
| `value`, `onChange(value, event)` | Required (the component warns in development without `value`). |
| `onSubmit(query, event)` | Enter. Receives the trimmed text. |
| `onClear()` | After the clear button or Escape empties the field (`onChange('')` fires too). |
| `label`, `clearLabel`, `placeholder` | Accessible name (also names the search landmark), clear button name, placeholder. |
| `size`, `shape`, `icon`, `className` | `'sm' \| 'md' \| 'lg'`, `'rounded' \| 'pill'`, replacement icon, classes for the `<form>`. |

Keyboard: Enter submits; Escape clears a non-empty field and stops there (it will not also close a surrounding dialog).
Give it a `label` that differs from the navbar's search so the two landmarks are distinguishable.

### SortDropdown

```jsx
<SortDropdown options={sortOptions} value={sort} onChange={(value, option) => setSort(value)} />
```

| Prop | Notes |
| --- | --- |
| `options`, `value`, `onChange(value, option)` | `options`: `{ value, label, disabled? }`. Controlled. A `value` that matches nothing shows the placeholder. |
| `label`, `hideLabel` | Visible label (default "Sort by") and the accessible name. `hideLabel` makes it screen-reader-only. |
| `native` | Renders a styled native `<select>`: the OS picker on phones, nothing custom to go wrong. Same props. |
| `size`, `align`, `placeholder`, `disabled`, `className` | `'sm' \| 'md' \| 'lg'`; `'start' \| 'end'` edge the open list lines up with; placeholder text. |

The default rendering is a listbox following the WAI-ARIA "select-only combobox" pattern. Keyboard: Enter, Space or
ArrowDown/Up open; arrows, Home and End move; Enter or Space picks; Escape closes without changing; Tab commits the
highlighted option; typing jumps to a matching label. Focus never leaves the trigger. Use `native` below your mobile breakpoint
if you prefer the OS picker there.

### Breadcrumbs

```jsx
<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Clothing', href: '/c/clothing' }, { label: 'Knitwear' }]}
             onNavigate={(item, event) => { event.preventDefault(); router.push(item.href) }} />
```

| Prop | Notes |
| --- | --- |
| `items` | `{ id?, label, href? }`, root first, **current page last**. The last item is `aria-current="page"` and never a link. |
| `onNavigate(item, event)` | Items with `href` are links, items without are buttons; both call it. |
| `maxItems` | Keep the first and last items and fold the middle behind a "…" button (minimum 2). Activating it reveals the rest and moves focus to the first revealed crumb. |
| `separator`, `label`, `expandLabel`, `className` | Replacement separator (rendered `aria-hidden`), name of the `<nav>` (default "Breadcrumb"), name of the "…" button. |

### ActiveFilters

```jsx
<ActiveFilters filterGroups={filterGroups} filters={filters} onFiltersChange={setFilters}
  extraChips={query ? [{ id: 'q', label: `Search: “${query}”`, onRemove: () => setQuery('') }] : []} />
```

Removable chips for the filters currently applied, plus **Clear all**. Chips are built from the same `filterGroups` and
`filters` as the sidebar, so a range reads "Price: $20 – $100". Anything else (search text, a category) goes in `extraChips`
(`{ id, label, onRemove }`), shown before the filter chips. With no chips it renders nothing visible and takes no layout
space.

| Prop | Notes |
| --- | --- |
| `filterGroups`, `filters`, `onFiltersChange(next)` | Removing a chip calls it with the next filter object. |
| `onClearAll()` | Optional. Defaults to `onFiltersChange({})` plus every extra chip's `onRemove`. |
| `extraChips` | `{ id, label, onRemove }[]`. |
| `showGroupLabel` | `"Brand: Northwind"` (default) or just `"Northwind"`. |
| `labels` | `list`, `clearAll`, `remove(chipText)`, `status(count)`, `rangeFrom(amount)`, `rangeUpTo(amount)`. |

Accessibility: each remove button reads "Remove filter: Brand: Northwind", a polite status line announces "2 filters
applied", and after a removal focus moves to the neighbouring chip (or the status line when none is left) so keyboard users
never lose their place.

### Accessibility summary

- Sidebars are landmarks (`<aside>` / `<nav>`) with accessible names; categories use `aria-current`; filter groups are
  labelled `group` / `radiogroup` regions; accordion headers use `aria-expanded` / `aria-controls`.
- The drawer is a modal dialog with the same focus handling as the navbar's mobile menu (shared `useDialogBehavior`).
- Counts are announced ("Knitwear, 12 items"); nothing relies on color alone.
- All controls are native elements or follow a published ARIA pattern, work by keyboard and use the shared focus ring.

### Demo

`npm run dev` shows, under *Sidebar*, *Filter Drawer*, *Search Input*, *Sort Dropdown*, *Breadcrumbs* and *Active Filters*,
each component on its own, and under *Product Discovery (all together)* every component wired to one set of state in
front of a `ProductGrid`, with a sidebar-variant switcher. Below `1024px` the sidebar gives way to the Filters button and
drawer. The sample categories, filter groups and sort options are in `src/preview/sampleDiscovery.js`; the demo's
in-memory filtering (`applyDiscovery`) is preview-only and stands in for your catalog logic. A status line under each demo
shows the last callback and the state the page owns.

## Footers and homepage sections

Everything below is presentational. Your page owns the data, and the components report what happens through
callbacks. Every section stands alone (no section imports another, and none needs a wrapper), so combine them in any
order. Shared building blocks are the primitives plus `SectionHeader`, `NewsletterForm`, and a few internals in
`components/shared/` (`Cta`, `MediaImage`, tones, spacing).

```jsx
import {
  AnnouncementBar, Navbar, HeroBanner, FeaturedCategoryGrid, FeaturedProducts,
  PromoBanner, Testimonials, FaqAccordion, NewsletterSignup, Footer,
} from './library'
```

**Conventions shared by the sections**

| Prop | Notes |
| --- | --- |
| `title`, `description`, `action` | Section heading block (`SectionHeader`). `action` is `{ label, href?, onClick? }`: a link when it has an `href`, otherwise a button. Same shape for `primaryAction` / `secondaryAction` on the hero and promo. |
| `onAction(action, event)` | Called for every button in the section, after the action's own `onClick`. |
| `headingLevel` | Level of the section title. Hero defaults to `1`, everything else to `2`. Items inside use the next level. |
| `spacing` | `'none' \| 'sm' \| 'md' \| 'lg'` vertical padding. A prop, not a class, because two `py-*` classes are resolved by stylesheet order. Adjacent sections add their paddings together. |
| `tone` | `default`, `muted`, `primary`, `accent` or `dark` where a section can sit on a colored band. `dark` re-themes its subtree through `data-theme="dark"` (always dark, even on a light page). |
| `containerSize`, `id`, `className` | `Container` size, anchor id, extra classes. |
| `labels` | Override built-in strings (localisation). |

Each section is a landmark named by its title (`aria-labelledby`). Give `labels` / `navLabel` unique names if you put
two of the same section on one page.

### Footer

```jsx
<Footer
  variant="columns"            // 'simple' | 'columns' | 'newsletter' | 'dark'
  brand={{ name: 'Northwind', href: '/', description: 'Made in small batches.' }}
  columns={[{ title: 'Shop', links: [{ label: 'New arrivals', href: '/new' }] }]}
  social={[{ platform: 'instagram', href: 'https://instagram.com/…' }]}
  newsletter={{ title: 'One email a month', onSubscribe: async ({ email }) => api.subscribe(email) }}
  legalLinks={[{ label: 'Privacy', href: '/privacy' }]}
  bottomSlot={<CurrencyPicker />}
  onNavigate={(item, event) => { event.preventDefault(); router.push(item.href) }}
/>
```

All variants take the same props (contract in `components/Footer/types.js`); a variant ignores what it does not show.

| `variant` | Look | Uses |
| --- | --- | --- |
| `simple` | One slim block: wordmark, one row of links, social icons, legal line. | `links` (or the first 6 links of `columns`), `social`, legal bar |
| `columns` | Brand and social on the left, link columns on the right (auto-fit to 2 to 5 columns). | `columns`, `social`, legal bar |
| `newsletter` | Large signup band on top, then the columns. No `newsletter` prop, no band. | `newsletter`, `columns`, `social`, legal bar |
| `dark` | Premium look: always dark, spaced serif wordmark, hairline rules. Uses the `font-display` token. | everything, including a compact `newsletter` |

Social links need only a `platform` (`instagram`, `facebook`, `x`, `youtube`) and an `href`; add `icon` and `label`
for anything else. Links with `external: true` open in a new tab and say so to screen readers.

### NewsletterForm (used by `NewsletterSignup` and the footers)

```jsx
<NewsletterForm onSubscribe={async ({ email, consent }) => { await myApi.subscribe(email) }} consent="I agree to receive emails." />
```

There is **no email service**: it validates the address, calls `onSubscribe`, and reflects the result. A rejected promise
shows `error.message` and keeps the typed address; success clears the field. The button shows a busy state while the
callback is pending, and results are announced through a live region. Passing `consent` adds a required checkbox and the
callback receives `{ email, consent }`. Override any string with `labels` (`email`, `placeholder`, `submit`, `success`,
`invalidEmail`, `consentRequired`, `failed`).

### Sections

| Component | Layouts / options | Notes |
| --- | --- | --- |
| `AnnouncementBar` | `messages` (`{ text, href?, linkLabel? }[]`), `tone`, `dismissible`, `open` / `defaultOpen` / `onOpenChange`, `autoRotate`, `interval` | Several messages rotate with previous / next / pause buttons. Rotation stops on hover or focus and never starts under reduced motion. It does not remember a dismissal: persist it yourself and pass `open={false}`. |
| `HeroBanner` | `layout`: `split` or `overlay`; `imagePosition`, `align`, `tone`, `badge`, `footnote` | Title is an `<h1>`. `overlay` is always dark with a scrim over the photo. |
| `FeaturedCategoryGrid` | `layout`: `grid` or `mosaic`; `columns` 2 to 4; `aspect`; `onCategoryClick` | `mosaic` makes the first tile large (best with 5). Each tile is a link, a button or plain, depending on `href` / `onCategoryClick`. |
| `FeaturedProducts` | `layout`: `grid` or `carousel`; `variant` (any card design); `columns` | Forwards card props (`onAddToCart`, `onToggleWishlist`, `onProductClick`, `wishlistedIds`, `addingToCartIds`, `currency`, ...). Card labels go in `cardLabels`; `labels` is the section's own strings. Carousel is native scroll-snap with disabled-at-end arrows. |
| `PromoBanner` | `layout`: `split` or `strip`; `tone`; `code` + `onCopyCode`; `image` | Inset rounded band. The code button copies to the clipboard (when allowed) and always calls `onCopyCode`. |
| `Testimonials` | `layout`: `grid` or `slider`; `columns` | Quotes with optional `rating`, `role`, `avatar` (initials otherwise). The slider has no autoplay. |
| `FaqAccordion` | `layout`: `stacked` or `split`; `allowMultiple`; `openIds` / `defaultOpenIds` / `onOpenChange`; `footer` | Disclosure pattern with Arrow / Home / End keys. Closed answers are hidden from assistive tech. |
| `NewsletterSignup` | `layout`: `centered` or `split`; `tone`: `default`, `muted` or `dark`; `consent`, `privacyNote`, `image` | Wraps `NewsletterForm`. |

Missing data degrades quietly: no image shows a tinted frame of the same size, and entries without the required fields
are skipped. The photos are decorative unless you give an `alt`.

### Demo homepage

`npm run dev`, then open **Open the demo homepage** (or `http://localhost:5173/#/home`). It composes the announcement
bar, the existing `Navbar`, hero, category mosaic, product carousel, promo banner, testimonials, FAQ, newsletter signup
and footer, with a *Demo options* panel to switch the hero layout, product layout and footer variant. The cart,
wishlist and mailing list are fake preview state (`src/preview/home/demoActions.js`); an address starting with `fail`
shows the error state. Each section also has its own entries on the component preview page. Sample content is in
`src/preview/home/sampleHome.js`, and the photos come from picsum.photos, so they need an internet connection.

## Styling gotcha for variant authors

Tailwind decides which of two conflicting utilities wins (`relative`/`absolute`, `text-sm`/`text-xs`, `font-semibold`/
`font-normal`) by its stylesheet order, **not** by their order in `className`. Do not pass a utility to a primitive that
it already sets. Wrap it instead (as `WishlistButton` does for positioning), or use the important modifier on purpose
(`rounded-none!` in the luxury button), and avoid baking defaults into shared components that variants must override.

## Roadmap

Library build mode and npm publishing. Not included yet.
