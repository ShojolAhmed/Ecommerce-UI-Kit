# Ecom UI Kit

Reusable React e-commerce UI components with interchangeable design variants
(navbars, product cards, sidebars, footers, …). Built with React, Vite, JavaScript and Tailwind CSS.

> Status: **Phase 1 – foundation.** Only a sample `ProductCard` (one variant) exists to prove the structure.

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

## Styling note

Components use Tailwind utility classes. Tailwind v4 must scan the library's source;
`src/index.css` does this with `@source "./library"`. Consumers will need an equivalent `@source` line.

## Roadmap

Library build mode and npm publishing, then the component catalog. Not included yet.
