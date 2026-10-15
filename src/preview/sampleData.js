const productImage = (seed) => `https://picsum.photos/seed/${seed}/600/750`

/**
 * Demo catalog for the product card and grid previews. The images are
 * placeholder photos. Some products are deliberately incomplete or unusual so
 * the cards' fallbacks show up in every variant:
 *   - 1004, 1007, 1011   no badges
 *   - 1007               very long name, no rating, no reviews
 *   - 1008               no `image` (placeholder)
 *   - 1009               an image URL that fails to load (placeholder)
 *   - 1010               out of stock
 *   - 1011               a rating without a review count
 *   - 1004, 1012         no `href`, so the name renders as a button
 *   - ids mix numbers and strings, as real catalogs do
 * Products without `originalPrice` are the full-price case; the rest are discounted.
 */
export const sampleProducts = [
  {
    id: 1001,
    name: 'Merino Crewneck Sweater',
    brand: 'Northwind',
    description: 'Midweight, ethically sourced merino in a relaxed fit. Machine washable and naturally odor-resistant.',
    price: 89,
    originalPrice: 120,
    image: productImage('merino-sweater'),
    rating: 4.7,
    reviewCount: 312,
    badges: [{ label: 'Bestseller', variant: 'brand' }],
    href: '#product-1001',
  },
  {
    id: 1002,
    name: 'Waxed Canvas Weekender Bag',
    brand: 'Northwind',
    description: 'Water-resistant waxed canvas with leather handles, a shoe compartment and a laptop sleeve.',
    price: 148,
    image: productImage('weekender-bag'),
    rating: 4.8,
    reviewCount: 96,
    badges: ['New'],
    href: '#product-1002',
  },
  {
    id: 'sku-pour-over',
    name: 'Stoneware Pour-Over Set',
    brand: 'Hearth & Co.',
    description: 'Hand-glazed dripper, carafe and two cups. Dishwasher safe.',
    price: 64,
    originalPrice: 80,
    image: productImage('pour-over-set'),
    rating: 4.5,
    reviewCount: 1240,
    badges: [{ label: 'Limited', variant: 'warning' }],
    href: '#product-pour-over',
  },
  {
    id: 1004,
    name: 'Leather Card Holder',
    brand: 'Atelier Nord',
    description: 'Vegetable-tanned leather that darkens with age. Holds six cards and folded notes.',
    price: 38,
    image: productImage('card-holder'),
    rating: 4.3,
    reviewCount: 58,
  },
  {
    id: 1005,
    name: 'Linen Throw Blanket',
    brand: 'Hearth & Co.',
    description: 'Stonewashed European linen, softer with every wash. 130 × 180 cm.',
    price: 72,
    originalPrice: 96,
    image: productImage('linen-throw'),
    rating: 4.9,
    reviewCount: 2087,
    badges: [{ label: 'Eco', variant: 'success' }],
    href: '#product-1005',
  },
  {
    id: 1006,
    name: 'Wireless Noise-Cancelling Headphones',
    brand: 'Sonara',
    description: '40-hour battery, adaptive noise cancelling and multipoint Bluetooth.',
    price: 229,
    originalPrice: 299,
    image: productImage('headphones'),
    rating: 4.6,
    reviewCount: 4521,
    badges: [{ label: 'Deal of the day', variant: 'danger' }],
    href: '#product-1006',
  },
  {
    id: 1007,
    name: 'Hand-Turned Ceramic Table Lamp with Linen Shade and Aged Brass Detail, Extra Large',
    brand: 'Atelier Nord',
    description: 'A sculptural lamp base finished by hand, with a tapered linen shade.',
    price: 119,
    image: productImage('table-lamp'),
    href: '#product-1007',
  },
  {
    id: 1008,
    name: 'Cashmere Scarf',
    brand: 'Maison Verre',
    description: 'Grade-A Mongolian cashmere, woven in Scotland. Finished with hand-rolled edges.',
    price: 195,
    // No image on purpose: shows the placeholder.
    rating: 5,
    reviewCount: 12,
    badges: ['Limited edition'],
    href: '#product-1008',
  },
  {
    id: 1009,
    name: 'Selvedge Denim Jacket',
    brand: 'Northwind',
    description: '14 oz Japanese selvedge denim with copper rivets. Made to age well.',
    price: 165,
    originalPrice: 220,
    image: 'https://example.invalid/missing-image.jpg', // fails to load: shows the placeholder
    rating: 4.4,
    reviewCount: 203,
    badges: [{ label: 'Last sizes', variant: 'warning' }],
    href: '#product-1009',
  },
  {
    id: 1010,
    name: 'Hand-Poured Soy Candle',
    brand: 'Hearth & Co.',
    description: 'Cedar and fig. Roughly 45 hours of burn time in a reusable glass jar.',
    price: 28,
    image: productImage('soy-candle'),
    rating: 4.6,
    reviewCount: 87,
    inStock: false,
    badges: ['Restocking soon'],
    href: '#product-1010',
  },
  {
    id: 1011,
    name: 'Brass Desk Organiser',
    brand: 'Atelier Nord',
    description: 'Solid brass tray with three compartments. Develops a soft patina.',
    price: 54,
    image: productImage('desk-organiser'),
    rating: 4.2, // a rating without a review count
    href: '#product-1011',
  },
  {
    id: 1012,
    name: 'Mulberry Silk Pillowcase',
    brand: 'Maison Verre',
    description: '22 momme mulberry silk with an envelope closure. Gentle on hair and skin.',
    price: 45,
    originalPrice: 60,
    image: productImage('silk-pillowcase'),
    rating: 4.5,
    reviewCount: 688,
    badges: [{ label: 'Gift idea', variant: 'info' }],
  },
]

const photo = (seed) => `https://picsum.photos/seed/${seed}/600/450`

/** Sample content for the navbar demos. Nothing here is built into the library. */
export const sampleNavbar = {
  brand: { name: 'Northwind', href: '#home' },
  links: [
    { id: 'new', label: 'New In', href: '#new' },
    {
      id: 'women',
      label: 'Women',
      href: '#women',
      menu: {
        columns: [
          {
            title: 'Clothing',
            links: [
              { label: 'Dresses', href: '#women-dresses' },
              { label: 'Knitwear', href: '#women-knitwear' },
              { label: 'Coats & Jackets', href: '#women-coats', badge: 'New' },
              { label: 'Denim', href: '#women-denim' },
            ],
          },
          {
            title: 'Shoes',
            links: [
              { label: 'Boots', href: '#women-boots' },
              { label: 'Sneakers', href: '#women-sneakers' },
              { label: 'Sandals', href: '#women-sandals' },
            ],
          },
          {
            title: 'Accessories',
            links: [
              { label: 'Bags', href: '#women-bags' },
              { label: 'Scarves', href: '#women-scarves' },
              { label: 'Jewellery', href: '#women-jewellery' },
            ],
          },
        ],
        featured: {
          title: 'The Autumn Edit',
          description: 'Layers, textures and warm tones for the new season.',
          href: '#autumn-edit',
          image: photo('autumn-edit'),
          imageAlt: 'Model wearing a camel coat',
          cta: 'Shop the edit',
        },
      },
    },
    {
      id: 'men',
      label: 'Men',
      href: '#men',
      menu: {
        columns: [
          {
            title: 'Clothing',
            links: [
              { label: 'Shirts', href: '#men-shirts' },
              { label: 'Knitwear', href: '#men-knitwear' },
              { label: 'Outerwear', href: '#men-outerwear' },
            ],
          },
          {
            title: 'Shoes',
            links: [
              { label: 'Boots', href: '#men-boots' },
              { label: 'Sneakers', href: '#men-sneakers' },
            ],
          },
        ],
      },
    },
    {
      id: 'home',
      label: 'Home',
      href: '#home-living',
      menu: {
        columns: [
          {
            title: 'Living',
            links: [
              { label: 'Throws & Cushions', href: '#home-throws' },
              { label: 'Candles', href: '#home-candles' },
            ],
          },
          {
            title: 'Kitchen',
            links: [
              { label: 'Tableware', href: '#home-tableware' },
              { label: 'Mugs', href: '#home-mugs' },
            ],
          },
        ],
        featured: {
          title: 'Slow Mornings',
          description: 'Ceramics made to be held.',
          href: '#slow-mornings',
          image: photo('slow-mornings'),
          imageAlt: 'Ceramic mugs on a wooden table',
        },
      },
    },
    { id: 'sale', label: 'Sale', href: '#sale', badge: '-30%' },
  ],
}
