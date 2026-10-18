import { useParams } from 'react-router-dom'
import { Button, ProductGrid } from 'ecom-ui-kit'
import FeatureNote from '../components/FeatureNote.jsx'
import Page from '../components/Page.jsx'
import { getCategoryById, getProductBySlug, getRelatedProducts } from '../data/catalog.js'
import { formatPrice, priceProps } from '../lib/format.js'
import { paths } from '../routing/paths.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'
import { useProductActions } from '../state/useProductActions.js'
import { useStore } from '../state/useStore.js'
import NotFoundPage from './NotFoundPage.jsx'

/** /product/:slug. A basic detail view: image, price, description, add to cart and wishlist, related products. */
export default function ProductPage() {
  const { slug } = useParams()
  const handleLink = useLinkHandler()
  const actions = useProductActions()
  const { isWishlisted } = useStore()

  const product = getProductBySlug(slug)
  if (!product) return <NotFoundPage title="Product not found" message="We could not find that product." />

  const category = getCategoryById(product.categoryId)
  const wishlisted = isWishlisted(product.id)
  const onSale = product.originalPrice > product.price

  return (
    <Page
      title={product.name}
      breadcrumbs={[
        { label: 'Home', href: paths.home },
        { label: 'Shop', href: paths.shop },
        ...(category ? [{ label: category.label, href: category.href }] : []),
        { label: product.name },
      ]}
    >
      <div className="product-layout">
        <img className="product-image" src={product.image} alt={product.imageAlt ?? ''} />
        <div className="product-info">
          <p className="product-price">
            {formatPrice(product.price)}
            {onSale && <s className="product-was">{formatPrice(product.originalPrice)}</s>}
          </p>
          <p>{product.details ?? product.description}</p>
          <div className="product-actions">
            <Button disabled={!product.inStock} onClick={() => actions.onAddToCart(product)}>
              {product.inStock ? 'Add to cart' : 'Out of stock'}
            </Button>
            <Button variant="outline" aria-pressed={wishlisted} onClick={() => actions.onToggleWishlist(product)}>
              {wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            </Button>
          </div>
        </div>
      </div>

      <FeatureNote owner="Product details" file="src/pages/ProductPage.jsx">
        Gallery, variants, quantity selector, reviews and shipping info belong here.
      </FeatureNote>

      <section aria-labelledby="related-title" className="page-section">
        <h2 id="related-title">You may also like</h2>
        <ProductGrid
          products={getRelatedProducts(product, 4)}
          columns={4}
          headingLevel={3}
          {...actions}
          {...priceProps}
          onProductClick={handleLink}
        />
      </section>
    </Page>
  )
}
