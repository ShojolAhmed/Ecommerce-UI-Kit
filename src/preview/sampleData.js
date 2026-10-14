const img = (seed) => `https://picsum.photos/seed/${seed}/400/400`

export const sampleProducts = [
  { id: 1, title: 'Canvas Backpack', price: 59.0, category: 'Bags', image: img('backpack') },
  { id: 2, title: 'Wireless Headphones', price: 129.99, category: 'Audio', image: img('headphones') },
  { id: 3, title: 'Ceramic Mug', price: 18.5, category: 'Home', image: img('mug') },
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
