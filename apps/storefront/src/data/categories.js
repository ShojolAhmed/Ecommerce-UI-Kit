import { placeholderImage } from './images.js'
import { paths } from '../routing/paths.js'

/**
 * @typedef {object} Category
 * @property {string} id            Stable id, also what `Product.categoryId` points to.
 * @property {string} slug          URL segment: /shop/:slug.
 * @property {string} label
 * @property {string} description   One sentence.
 * @property {string} image         Image URL (tile artwork).
 * @property {string} href          Derived: paths.category(slug).
 *
 * `getCategories()` in data/catalog.js adds `count` (number of products), which makes the same object valid for the
 * kit's FeaturedCategoryGrid and Sidebar `Category` shapes.
 */

const raw = [
  { id: 'cat-apparel', slug: 'apparel', label: 'Apparel', description: 'Knitwear, outer layers and everyday basics.', hue: 24 },
  { id: 'cat-bags', slug: 'bags', label: 'Bags', description: 'Totes, packs and weekenders built to carry.', hue: 150 },
  { id: 'cat-footwear', slug: 'footwear', label: 'Footwear', description: 'Boots and shoes made to be resoled.', hue: 38 },
  { id: 'cat-home', slug: 'home', label: 'Home', description: 'Textiles, ceramics and tools for the house.', hue: 200 },
  { id: 'cat-accessories', slug: 'accessories', label: 'Accessories', description: 'Small goods you will use every day.', hue: 340 },
]

/** @type {Category[]} */
export const categories = raw.map(({ hue, ...category }) => ({
  ...category,
  image: placeholderImage({ label: category.label, hue, width: 800, height: 1000, showLabel: false }),
  href: paths.category(category.slug),
}))
