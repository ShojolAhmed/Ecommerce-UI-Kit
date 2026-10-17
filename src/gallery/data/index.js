/**
 * Shared sample data for every gallery preview. The sample files stay where the existing
 * preview page keeps them; everything the gallery shows is imported through this one module,
 * so all families preview the same store ("Northwind") and moving the data later is a one-file change.
 */
import { sampleProducts, sampleNavbar } from '../../preview/sampleData.js'
import { sampleCategories as discoveryCategories, sampleFilterGroups, sampleSortOptions } from '../../preview/sampleDiscovery.js'
import {
  sampleAnnouncements,
  sampleCategories as homeCategories,
  sampleFaq,
  sampleFeaturedProducts,
  sampleFooter,
  sampleHero,
  samplePromo,
  sampleTestimonials,
} from '../../preview/home/sampleHome.js'
import { sampleCartIssues, sampleCartItems } from '../../preview/cart/sampleCart.js'
import { fakeSubscribe } from '../../preview/home/demoActions.js'

export {
  sampleProducts,
  sampleNavbar,
  discoveryCategories,
  sampleFilterGroups,
  sampleSortOptions,
  sampleAnnouncements,
  homeCategories,
  sampleFaq,
  sampleFeaturedProducts,
  sampleFooter,
  sampleHero,
  samplePromo,
  sampleTestimonials,
  sampleCartIssues,
  sampleCartItems,
  fakeSubscribe,
}

const byId = (id) => sampleProducts.find((product) => product.id === id)

/**
 * One product per case worth seeing in a card: discounted with a badge, a very long name
 * without a rating, a discounted product whose image fails to load, and out of stock.
 */
export const productCases = [
  { id: 'discounted', label: 'Discounted, badge, rating', product: byId(1001) },
  { id: 'long-name', label: 'Long name, no rating', product: byId(1007) },
  { id: 'broken-image', label: 'Image fails to load', product: byId(1009) },
  { id: 'out-of-stock', label: 'Out of stock', product: byId(1010) },
]

export const navbarLinks = sampleNavbar.links.map((link) => ({ ...link, current: link.id === 'new' }))

export const breadcrumbTrail = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'shop', label: 'Shop', href: '#shop' },
  { id: 'clothing', label: 'Clothing', href: '#clothing' },
  { id: 'knitwear', label: 'Knitwear', href: '#knitwear' },
  { id: 'sweaters', label: 'Sweaters', href: '#sweaters' },
  { id: 'merino', label: 'Merino Crewneck Sweater', href: '#merino' },
]

export const sampleActiveFilters = {
  brand: ['Northwind', 'Hearth & Co.'],
  price: { min: 20, max: 150 },
  rating: 4,
}

/** Reducer for the wishlist demos: toggles a product id in a list of ids. */
export const toggleWishlistId = (ids, product) =>
  ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id]
