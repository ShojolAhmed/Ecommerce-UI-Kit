# Storefront integration guide

For developers building features in parallel on `apps/storefront`. Read this, then work only in the files named for your feature.

## Run

```bash
cd apps/storefront
npm install
npm run dev      # builds the kit (predev), then Vite
npm run build    # builds the kit (prebuild), then the app
npm run lint     # ESLint (repo config)
```

The kit is consumed through its public entry (`ecom-ui-kit`, `file:../..`). Import everything from `'ecom-ui-kit'`; never deep-import kit source. `main.jsx` imports `ecom-ui-kit/styles.css` once. The app has no Tailwind: its own layout CSS is `src/app.css` and uses the kit's tokens (`var(--color-*)`, `var(--font-display)`). Component props: `docs/API.md` at the repo root, plus JSDoc in `src/library/components/*` for homepage sections and cart UI.

## Routes

Defined in `src/App.jsx`; every route renders inside `StoreLayout` (navbar, footer, `<main id="main">`). Build links with `paths` from `src/routing/paths.js`, never string literals.

| Route | `paths` key | Page file | Owner / status |
|---|---|---|---|
| `/` | `home` | `pages/HomePage.jsx` | Done |
| `/shop`, `/shop/:categorySlug` | `shop`, `category(slug)` | `pages/ShopPage.jsx` | Plain grid. Catalog feature adds filters, sort, paging |
| `/product/:slug` | `product(slug)` | `pages/ProductPage.jsx` | Basic. Product-details feature |
| `/search?q=` | `search(query)` | `pages/SearchPage.jsx` | Basic text match. Search feature |
| `/cart` | `cart` | `pages/CartPage.jsx` | Minimal list. Cart feature |
| `/wishlist` | `wishlist` | `pages/WishlistPage.jsx` | Basic grid |
| `/checkout` | `checkout` | `pages/CheckoutPage.jsx` | Placeholder |
| `/account` | `account` | `pages/AccountPage.jsx` | Placeholder |
| `/about /contact /faq /shipping /returns /privacy /terms` | same names | `pages/InfoPage.jsx` | Copy lives in `data/infoPages.js` |
| `*` | | `pages/NotFoundPage.jsx` | Done |

Add a page: create it in `src/pages`, add its path to `paths.js` (and `patterns` if parameterised), add one `<Route>` in `App.jsx`. Wrap content in `components/Page.jsx` (breadcrumbs, one `<h1>`, document title). Delete the page's `FeatureNote` when you replace its placeholder.

## Data shapes

Defined in `src/data/*.js` (JSDoc). Ids are **strings**; the kit compares ids with `===`.

- `ProductRecord` = kit `Product` (`id, name, price, originalPrice?, image, rating, reviewCount, badges, href, brand, description, inStock`) plus `slug, categoryId, tags[], featured, createdAt (ISO), details?`. Prices are major units (USD).
- `Category` = `{ id, slug, label, description, image, href }`; `getCategories()` adds `count`. It is valid as a kit `Category` (Sidebar) and FeaturedCategoryGrid item.
- Cart line (kit `CartItem`): `{ id (= product id), name, price, originalPrice?, image, href, quantity, maxQuantity, inStock }`. One line per product until variants exist; if you add variants, `id` must become unique per line.

## Data access (`src/data/catalog.js`)

The only module pages should read catalog data from. Synchronous, in-memory, read-only objects.

`getCategories()`, `getCategoryBySlug(slug)`, `getCategoryById(id)`, `getProducts({ categorySlug?, limit? })`, `getProductById(id)`, `getProductBySlug(slug)`, `getProductsByIds(ids)`, `getFeaturedProducts(limit?)`, `getNewArrivals(limit?)`, `getRelatedProducts(product, limit?)`, `searchProducts(query)`.

When a real API replaces the mock data, keep these names and make them async (breaking for callers by design).

## Shared state and hooks

| Export | File | Use |
|---|---|---|
| `useStore()` | `state/useStore.js` | `cartItems, cartCount, addToCart(product, qty?), setCartQuantity(id, qty), removeFromCart(id), clearCart(), wishlistIds, wishlistCount, isWishlisted(id), toggleWishlist(product)` |
| `useProductActions()` | `state/useProductActions.js` | `{ wishlistedIds, onAddToCart, onToggleWishlist }` with toasts; spread onto `ProductGrid`, `FeaturedProducts`, `ProductCard` |
| `useLinkHandler()` | `routing/useLinkHandler.js` | Pass as `onNavigate`, `onProductClick`, `onCategoryClick`, `onAction`, or Breadcrumbs `onNavigate` so kit links route client-side |
| `useToast()` | `ecom-ui-kit` | `toast.success/info/warning/error(...)`; provider is in `main.jsx` |
| `formatPrice`, `priceProps` | `lib/format.js` | Consistent currency/locale |

Cart and wishlist persist to `localStorage` under `fieldhouse.store.v1`. Change the stored shape only with a version bump. Quantity is capped at `site.maxCartQuantity` (10); out-of-stock products are ignored by `addToCart`.

Provider order (`main.jsx`): `BrowserRouter` > `ToastProvider` > `StoreProvider` > `App`.

## Layout and config

- `config/site.js`: brand, currency/locale, `getNavLinks(pathname)`, footer content. Change store copy here.
- `data/promotions.js`: hero, announcement bar, promo banners.
- `layout/StoreLayout.jsx`: owns navbar, footer, search submit (`/search?q=`), cart/wishlist counts. Pages must not render their own navbar, footer or `<main>`. A route that needs a leaner shell (checkout) should be moved under a second layout route in `App.jsx`.
- Images are generated SVG placeholders (`data/images.js`); replace with real URLs in the data files.

## Conventions

- One `<h1>` per page (`Page`); product cards are `h2` under it (`headingLevel={2}`).
- Keep kit components presentational: state lives in `state/`, not in pages.
- Do not edit `src/library` for storefront needs; request a kit change separately.

## Known limits

- Checked with build, lint, a jsdom smoke test and headless Chromium (all routes load without console errors; mobile menu navigates and closes). There is no committed automated test suite for the storefront.
- Kit bug worked around in `src/app.css`: `MediaImage` combines `relative` with a caller's `absolute inset-0`, so FeaturedCategoryGrid tile photos collapse to 0px. Remove the override once the kit fixes it.
- `file:../..` leaves two React copies on disk; `vite.config.js` dedupes them for the app. Other tools (e.g. vitest) need the same care.
- Search is a substring match; no filtering, sorting or pagination exists yet.
