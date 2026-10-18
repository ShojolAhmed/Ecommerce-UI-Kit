// Every URL the storefront knows about. Link to these builders, never to string literals, so a path can change in
// one place. `patterns` are the matching <Route path> values used in src/App.jsx.

export const paths = {
  home: '/',
  shop: '/shop',
  category: (slug) => `/shop/${slug}`,
  product: (slug) => `/product/${slug}`,
  search: (query) => (query ? `/search?q=${encodeURIComponent(query)}` : '/search'),
  cart: '/cart',
  wishlist: '/wishlist',
  checkout: '/checkout',
  account: '/account',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  shipping: '/shipping',
  returns: '/returns',
  privacy: '/privacy',
  terms: '/terms',
}

export const patterns = {
  home: '/',
  shop: '/shop',
  category: '/shop/:categorySlug',
  product: '/product/:slug',
  search: '/search',
  cart: '/cart',
  wishlist: '/wishlist',
  checkout: '/checkout',
  account: '/account',
}

/** Name of the search query parameter on /search. */
export const SEARCH_PARAM = 'q'
