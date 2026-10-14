# Ecom UI Kit

Reusable React e-commerce UI components with interchangeable design variants
(navbars, product cards, sidebars, footers, …). Built with React, Vite, JavaScript and Tailwind CSS.

> Status: **Phase 3 – navbars.** Design tokens, light/dark themes, six primitives (Button, IconButton, Badge, Input, Container, Spinner), a sample `ProductCard`, and the `Navbar` family with four variants.

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

## Roadmap

Product cards, sidebars and footers, then library build mode and npm publishing. Not included yet.
