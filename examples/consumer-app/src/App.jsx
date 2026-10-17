import { useState } from 'react'
import './app.css'
import { LuxuryProductCard, Navbar, ProductCard, ProductGrid, productCardVariants } from 'ecom-ui-kit'

// Your data, in the shapes the kit documents (see docs/API.md in the kit).
const photo = (label, hue) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="100%" height="100%" fill="hsl(${hue} 30% 82%)"/><text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="28" fill="hsl(${hue} 30% 30%)">${label}</text></svg>`,
  )}`

const products = [
  { id: 1, name: 'Merino Crewneck Sweater', price: 89, originalPrice: 120, image: photo('Sweater', 20), rating: 4.6, reviewCount: 128, badges: ['New'] },
  { id: 2, name: 'Canvas Weekender Bag', price: 145, image: photo('Bag', 150), rating: 4.8, reviewCount: 64 },
  { id: 3, name: 'Leather Chelsea Boots', price: 210, image: photo('Boots', 40), inStock: false },
]

const links = [
  { id: 'new', label: 'New In', href: '#new' },
  {
    id: 'women',
    label: 'Women',
    href: '#women',
    menu: { columns: [{ title: 'Clothing', links: [{ label: 'Knitwear', href: '#knitwear' }, { label: 'Denim', href: '#denim' }] }] },
  },
  { id: 'sale', label: 'Sale', href: '#sale' },
]

export default function App() {
  // The page owns the state. Variants only render it and report changes through callbacks.
  const [cartCount, setCartCount] = useState(0)
  const [wishlist, setWishlist] = useState([])
  const [cardVariant, setCardVariant] = useState('minimal')

  const toggleWishlist = (product) =>
    setWishlist((ids) => (ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id]))

  return (
    <>
      <Navbar
        variant="megaMenu" // alias of "mega"
        brand={{ name: 'Northwind', href: '#' }}
        links={links}
        search={{ placeholder: 'Search products', onSubmit: (query) => console.log('search', query) }}
        wishlist={{ count: wishlist.length }}
        cart={{ count: cartCount, onClick: () => console.log('open cart') }}
      />

      <main>
        <section aria-labelledby="grid-title">
          <div className="row">
            <h2 id="grid-title">ProductGrid</h2>
            <label>
              Card variant{' '}
              <select value={cardVariant} onChange={(event) => setCardVariant(event.target.value)}>
                {Object.keys(productCardVariants).map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
          <ProductGrid
            variant={cardVariant}
            products={products}
            wishlistedIds={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={() => setCartCount((count) => count + 1)}
          />
        </section>

        <section aria-labelledby="single-title">
          <div className="row"><h2 id="single-title">One card, three ways</h2></div>
          <div className="trio">
            <ProductCard variant="sale" product={products[0]} onAddToCart={() => setCartCount((count) => count + 1)} />
            {/* Direct import: this design only, no `variant` prop. */}
            <LuxuryProductCard product={products[1]} />
            {/* Unknown variants render the default design (and warn in development). */}
            <ProductCard variant="not-a-variant" product={products[2]} />
          </div>
        </section>
      </main>
    </>
  )
}
