import { useState } from 'react'
import {
  Button, Container, FeaturedProducts, HeroBanner, LuxuryProductCard, Navbar, ProductCard, ProductGrid, ToastProvider,
  productCardVariants,
} from 'ecom-ui-kit'
import type { NavbarLink, Product, ProductCardProps } from 'ecom-ui-kit'

const links: NavbarLink[] = [{ id: 'new', label: 'New In', href: '#new' }]
const product: Product = { id: 1, name: 'Merino Crewneck Sweater', price: 89, originalPrice: 120 }
const cardProps: ProductCardProps = { product, onAddToCart: (p: Product) => console.log(p.name) }

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <ToastProvider>
      <Navbar variant="megaMenu" brand={{ name: 'Northwind' }} links={links} cart={{ count }} />
      <Container className="my-8">
        <HeroBanner title="Autumn" className="x" layout="split" />
        <ProductCard variant="sale" {...cardProps} />
        <LuxuryProductCard product={product} />
        <ProductGrid variant="luxury" products={[product]} onAddToCart={() => setCount((c) => c + 1)} />
        <FeaturedProducts title="Picks" products={[product]} variant="minimal" className="y" />
        <Button variant="outline" className="z" onClick={() => setCount(0)}>Reset {Object.keys(productCardVariants).length}</Button>
      </Container>
    </ToastProvider>
  )
}

// Each line below must be a type error. If one stops erroring, `@ts-expect-error` itself fails the check.
// @ts-expect-error unknown prop on a strict family
const a = <Navbar brand={{ name: 'x' }} brnd="typo" />
// @ts-expect-error variant is a closed union
const b = <Navbar variant="not-real" brand={{ name: 'x' }} />
// @ts-expect-error required prop missing
const c = <ProductCard />
// @ts-expect-error documented props keep their exact types, even where extras are allowed
const d = <Button variant="nope">x</Button>
// @ts-expect-error wrong type for a documented prop
const e = <ProductCard product={{ id: 1, name: 'x', price: 'free' }} />
export { a, b, c, d, e }
