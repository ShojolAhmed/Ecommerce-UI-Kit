# Ecom UI Kit

Reusable React e-commerce UI components with interchangeable design variants
(navbars, product cards, sidebars, footers, …). Built with React, Vite, JavaScript and Tailwind CSS.

> Status: **Phase 2 – design foundation.** Design tokens, light/dark themes and six primitives (Button, IconButton, Badge, Input, Container, Spinner). A sample `ProductCard` proves the variant structure.

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

## Roadmap

Library build mode and npm publishing, then the component catalog. Not included yet.
