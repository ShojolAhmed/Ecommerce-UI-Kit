const photo = (seed) => `https://picsum.photos/seed/${seed}/300/375`

/**
 * Sample cart lines for the cart demos. There is no cart service: these are plain objects in the
 * shape the library documents (`CartItem`). `id` identifies the cart line, not the product.
 *
 *   c-1002   quantity equals `maxQuantity`: shows the "maximum reached" note and a disabled plus
 *   c-1008   no image: shows the placeholder frame
 */
export const sampleCartItems = [
  {
    id: 'c-1001',
    name: 'Merino Crewneck Sweater',
    price: 89,
    originalPrice: 120,
    quantity: 1,
    maxQuantity: 8,
    image: photo('merino-sweater'),
    options: [
      { label: 'Size', value: 'M' },
      { label: 'Colour', value: 'Navy' },
    ],
    href: '#product-1001',
  },
  {
    id: 'c-1002',
    name: 'Waxed Canvas Weekender Bag',
    price: 148,
    quantity: 2,
    maxQuantity: 2,
    limitNote: 'Limited to 2 per customer',
    image: photo('weekender-bag'),
    options: [{ label: 'Colour', value: 'Olive' }],
    href: '#product-1002',
  },
  {
    id: 'c-pour-over',
    name: 'Stoneware Pour-Over Set',
    price: 64,
    originalPrice: 80,
    quantity: 2,
    maxQuantity: 10,
    image: photo('pour-over-set'),
    href: '#product-pour-over',
  },
  {
    id: 'c-1008',
    name: 'Cashmere Scarf',
    price: 195,
    quantity: 1,
    maxQuantity: 3,
    options: [{ label: 'Colour', value: 'Oatmeal' }],
    href: '#product-1008',
  },
]

/**
 * Lines with problems, to show the disabled and warning states (and a disabled checkout):
 *   c-1010   out of stock: quantity locked, line marked unavailable
 *   c-1007   quantity above the available stock (3 in the cart, 2 available), long name
 */
export const sampleCartIssues = [
  sampleCartItems[0],
  {
    id: 'c-1010',
    name: 'Hand-Poured Soy Candle',
    price: 28,
    quantity: 1,
    inStock: false,
    image: photo('soy-candle'),
    href: '#product-1010',
  },
  {
    id: 'c-1007',
    name: 'Hand-Turned Ceramic Table Lamp with Linen Shade and Aged Brass Detail, Extra Large',
    price: 119,
    quantity: 3,
    maxQuantity: 2,
    image: photo('table-lamp'),
    href: '#product-1007',
  },
]

/** A catalog product becomes a cart line (the product ids in `sampleData.js` are reused). */
export function toCartItem(product) {
  return {
    id: `c-${product.id}`,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    quantity: 1,
    maxQuantity: 10,
    image: product.image,
    href: product.href,
  }
}
