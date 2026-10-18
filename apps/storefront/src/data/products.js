import { placeholderImage } from './images.js'
import { paths } from '../routing/paths.js'

/**
 * @typedef {object} ProductRecord   The kit's `Product` (id, name, price, originalPrice, image, imageAlt, rating,
 *   reviewCount, badges, href, brand, description, inStock) plus the storefront's own fields:
 * @property {string} slug          URL segment: /product/:slug.
 * @property {string} categoryId    A `Category.id`.
 * @property {string[]} tags        Lower-case keywords (used by search).
 * @property {boolean} featured     Shown in the homepage "Featured" row.
 * @property {string} createdAt     ISO date. "New arrivals" are the most recent.
 * @property {string} [details]     Longer description for the product page.
 *
 * Prices are in major units (USD). Ids are strings; keep them strings everywhere (the kit compares ids with ===).
 */

// [slug, name, categoryId, price, originalPrice, hue, rating, reviews, badges, featured, createdAt, inStock, tags, description]
const rows = [
  ['merino-crewneck', 'Merino Crewneck Sweater', 'cat-apparel', 89, 120, 24, 4.6, 128, ['Sale'], true, '2026-06-02', true, ['sweater', 'wool', 'knitwear'], 'Midweight merino with a ribbed collar that keeps its shape wash after wash.'],
  ['waxed-field-jacket', 'Waxed Field Jacket', 'cat-apparel', 248, null, 28, 4.8, 87, ['Bestseller'], true, '2026-03-14', true, ['jacket', 'outerwear', 'waxed cotton'], 'Water-resistant waxed cotton with a corduroy collar and four deep pockets.'],
  ['heavyweight-tee', 'Heavyweight Pocket Tee', 'cat-apparel', 38, null, 18, 4.4, 301, [], false, '2026-09-20', true, ['t-shirt', 'cotton', 'basics'], 'A dense 8 oz cotton jersey that drapes instead of clinging.'],
  ['linen-overshirt', 'Washed Linen Overshirt', 'cat-apparel', 96, null, 42, 4.5, 54, ['New'], false, '2026-10-05', true, ['shirt', 'linen', 'summer'], 'Stone-washed linen, cut a little long, softer after every wash.'],

  ['canvas-weekender', 'Canvas Weekender Bag', 'cat-bags', 145, null, 150, 4.8, 64, ['Bestseller'], true, '2026-02-11', true, ['bag', 'travel', 'canvas'], 'Waxed canvas with leather handles and a zip-top that opens flat for packing.'],
  ['everyday-tote', 'Everyday Leather Tote', 'cat-bags', 178, 210, 140, 4.7, 92, ['Sale'], true, '2026-04-08', true, ['tote', 'leather', 'work'], 'Vegetable-tanned leather that darkens with use. Fits a 14-inch laptop.'],
  ['roll-top-pack', 'Roll-Top Daypack', 'cat-bags', 124, null, 160, 4.3, 41, ['New'], false, '2026-10-01', true, ['backpack', 'commute', 'waterproof'], 'A 22-litre roll-top in recycled nylon with a padded laptop sleeve.'],
  ['crossbody-sling', 'Compact Crossbody Sling', 'cat-bags', 68, null, 130, 4.2, 73, [], false, '2026-08-17', true, ['sling', 'small', 'travel'], 'Just enough room for phone, wallet and keys.'],

  ['leather-chelsea', 'Leather Chelsea Boots', 'cat-footwear', 210, null, 38, 4.6, 112, [], true, '2026-01-20', false, ['boots', 'leather', 'resoleable'], 'Goodyear-welted and fully resoleable. Currently between restocks.'],
  ['canvas-court', 'Canvas Court Sneakers', 'cat-footwear', 79, 99, 48, 4.1, 205, ['Sale'], false, '2026-05-30', true, ['sneakers', 'canvas', 'casual'], 'A low-profile sneaker on a natural rubber sole.'],
  ['suede-loafer', 'Suede Penny Loafers', 'cat-footwear', 165, null, 30, 4.5, 38, ['New'], false, '2026-10-09', true, ['loafers', 'suede', 'dress'], 'Unlined suede that moulds to your foot within a week.'],
  ['trail-boot', 'All-Weather Trail Boot', 'cat-footwear', 189, null, 100, 4.7, 66, [], false, '2026-07-12', true, ['boots', 'hiking', 'waterproof'], 'Waterproof membrane, lugged sole, and a leather upper that breaks in fast.'],

  ['wool-throw', 'Herringbone Wool Throw', 'cat-home', 112, null, 200, 4.9, 49, ['Bestseller'], true, '2026-03-02', true, ['blanket', 'wool', 'textile'], 'Woven in a small mill from undyed lambswool.'],
  ['stoneware-set', 'Stoneware Dinner Set (4)', 'cat-home', 134, 160, 210, 4.6, 58, ['Sale'], false, '2026-06-25', true, ['ceramic', 'dinnerware', 'kitchen'], 'Four plates and four bowls with a reactive glaze. No two are identical.'],
  ['beeswax-candles', 'Beeswax Taper Candles (6)', 'cat-home', 24, null, 50, 4.4, 160, [], false, '2026-09-05', true, ['candle', 'beeswax', 'gift'], 'Hand-dipped, dripless and faintly honey-scented.'],
  ['linen-bedding', 'Stonewashed Linen Duvet Cover', 'cat-home', 189, null, 190, 4.7, 83, ['New'], true, '2026-10-12', true, ['bedding', 'linen', 'bedroom'], 'Softens with every wash. Pre-washed so it does not shrink.'],

  ['bridle-belt', 'Bridle Leather Belt', 'cat-accessories', 58, null, 340, 4.5, 94, [], false, '2026-02-27', true, ['belt', 'leather'], 'One piece of full-grain leather and a solid brass buckle.'],
  ['cardholder', 'Slim Leather Cardholder', 'cat-accessories', 42, null, 330, 4.6, 176, ['Bestseller'], true, '2026-04-19', true, ['wallet', 'leather', 'gift'], 'Four card slots and a centre pocket for folded notes.'],
  ['knit-beanie', 'Ribbed Merino Beanie', 'cat-accessories', 34, 44, 320, 4.3, 120, ['Sale'], false, '2026-08-03', true, ['hat', 'wool', 'winter'], 'A snug, double-layer rib that stays put.'],
  ['field-watch', 'Field Watch, 38 mm', 'cat-accessories', 285, null, 350, 4.8, 31, ['New'], true, '2026-10-14', true, ['watch', 'gift', 'steel'], 'Brushed steel, sapphire crystal and a quartz movement that just works.'],
]

const badgeVariant = { Sale: 'danger', New: 'brand', Bestseller: 'success' }

/** @type {ProductRecord[]} */
export const products = rows.map(
  ([slug, name, categoryId, price, originalPrice, hue, rating, reviewCount, badges, featured, createdAt, inStock, tags, description], index) => ({
    id: `p-${101 + index}`,
    slug,
    name,
    categoryId,
    price,
    ...(originalPrice ? { originalPrice } : null),
    image: placeholderImage({ label: name, hue }),
    rating,
    reviewCount,
    badges: badges.map((label) => ({ label, variant: badgeVariant[label] ?? 'neutral' })),
    href: paths.product(slug),
    brand: 'Fieldhouse',
    description,
    details: `${description} Made in small batches. Free returns within 30 days.`,
    inStock,
    tags,
    featured,
    createdAt,
  }),
)
