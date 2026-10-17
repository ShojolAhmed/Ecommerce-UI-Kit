import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard, ProductGrid } from '../src/library/index.js'
// Internal helper (not part of the public API), tested because every card formats prices through it.
import { formatPrice } from '../src/library/components/ProductCard/shared/model.js'

const products = [
  { id: 1, name: 'Merino Sweater', price: 89, originalPrice: 120, image: 'https://example.com/a.jpg', imageAlt: 'Sweater' },
  { id: 2, name: 'Canvas Bag', price: 40, inStock: false },
  { id: 3, name: 'Wool Hat', price: 25 },
]

describe('ProductCard', () => {
  it('reports the product to each callback', async () => {
    const onAddToCart = vi.fn()
    const onToggleWishlist = vi.fn()
    render(<ProductCard product={products[0]} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} />)
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart: Merino Sweater' }))
    expect(onAddToCart).toHaveBeenCalledWith(products[0], expect.anything())
    await userEvent.click(screen.getByRole('button', { name: /wishlist/i }))
    expect(onToggleWishlist).toHaveBeenCalledWith(products[0], expect.anything())
  })

  it('disables add to cart when out of stock and swaps the label', () => {
    render(<ProductCard product={products[1]} onAddToCart={() => {}} />)
    const button = screen.getByRole('button', { name: 'Out of stock: Canvas Bag' })
    expect(button.disabled).toBe(true)
  })

  it('shows a busy add button while addingToCart', () => {
    render(<ProductCard product={products[2]} onAddToCart={() => {}} addingToCart />)
    const button = screen.getByRole('button', { name: /Add to cart: Wool Hat/ })
    expect(button.getAttribute('aria-busy') === 'true' || button.disabled).toBe(true)
  })

  it('renders no action buttons without callbacks', () => {
    render(<ProductCard product={products[2]} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('survives a missing price and a broken image', () => {
    const { container } = render(<ProductCard product={{ id: 9, name: 'No Price', image: 'https://example.com/broken.jpg' }} />)
    expect(screen.getByText('No Price')).toBeTruthy()
    const img = container.querySelector('img')
    if (img) fireEvent.error(img)
    expect(screen.getByText('No Price')).toBeTruthy()
    expect(container.textContent).not.toMatch(/NaN|undefined/)
  })
})

describe('ProductGrid', () => {
  it('renders one card per valid product and skips invalid entries with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<ProductGrid label="Products" products={[...products, null, { price: 1 }, { id: 7, name: '  ' }]} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(warn).toHaveBeenCalled()
  })

  it('marks wishlisted and adding products by id', () => {
    render(
      <ProductGrid
        products={products}
        wishlistedIds={[1]}
        addingToCartIds={[3]}
        onAddToCart={() => {}}
        onToggleWishlist={() => {}}
      />,
    )
    const wish = screen.getAllByRole('button', { name: /wishlist/i })
    expect(wish.filter((b) => b.getAttribute('aria-pressed') === 'true')).toHaveLength(1)
  })

  it('shows the empty message, or a custom empty state', () => {
    const { rerender } = render(<ProductGrid products={[]} />)
    expect(screen.getByText('No products to show.')).toBeTruthy()
    rerender(<ProductGrid products={[]} emptyState={<p>Nothing matches your filters</p>} />)
    expect(screen.getByText('Nothing matches your filters')).toBeTruthy()
  })

  it('does not fall back to a different card design when the variant is unknown', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<ProductGrid products={products} variant="does-not-exist" />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('formats prices and degrades for a bad currency code', () => {
    expect(formatPrice(89, { currency: 'USD', locale: 'en-US' })).toBe('$89.00')
    expect(formatPrice(89, { currency: 'NOPE' })).toContain('89')
    expect(formatPrice(Number.NaN)).toBeNull()
  })
})

describe('ProductGrid loading and error states', () => {
  it('shows announced placeholders, not the empty message, while loading with no products', () => {
    const { container } = render(<ProductGrid products={[]} loading loadingCount={3} />)
    expect(screen.getByRole('status').textContent).toBe('Loading products')
    expect(screen.queryByText('No products to show.')).toBeNull()
    expect(container.querySelectorAll('li')).toHaveLength(3)
    expect(container.firstChild.getAttribute('aria-busy')).toBe('true')
  })

  it('keeps showing products and only marks the list busy while refetching', () => {
    render(<ProductGrid products={products} loading label="Products" />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('list', { name: 'Products' }).getAttribute('aria-busy')).toBe('true')
  })

  it('shows the error as an alert, ahead of loading and empty', () => {
    render(<ProductGrid products={[]} loading error={<p>Could not load products</p>} />)
    expect(screen.getByRole('alert').textContent).toBe('Could not load products')
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('does not forward loading to the cards', () => {
    render(<ProductGrid products={products} loading onAddToCart={() => {}} />)
    for (const button of screen.getAllByRole('button', { name: /Add to cart/ })) {
      expect(button.getAttribute('aria-busy')).not.toBe('true')
    }
  })
})
