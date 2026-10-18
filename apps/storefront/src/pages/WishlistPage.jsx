import { EmptyCartState, ProductGrid } from 'ecom-ui-kit'
import FeatureNote from '../components/FeatureNote.jsx'
import Page from '../components/Page.jsx'
import { getProductsByIds } from '../data/catalog.js'
import { priceProps } from '../lib/format.js'
import { paths } from '../routing/paths.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'
import { useProductActions } from '../state/useProductActions.js'
import { useStore } from '../state/useStore.js'

/** /wishlist. Shows saved products in a grid; sharing, moving to cart and sorting are not built. */
export default function WishlistPage() {
  const { wishlistIds } = useStore()
  const handleLink = useLinkHandler()
  const actions = useProductActions()
  const products = getProductsByIds(wishlistIds)

  return (
    <Page title="Wishlist" breadcrumbs={[{ label: 'Home', href: paths.home }, { label: 'Wishlist' }]}>
      {products.length === 0 ? (
        <EmptyCartState
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          action={{ label: 'Browse products', href: paths.shop }}
          onAction={handleLink}
        />
      ) : (
        <ProductGrid products={products} columns={4} headingLevel={2} {...actions} {...priceProps} onProductClick={handleLink} />
      )}
      <FeatureNote owner="Wishlist" file="src/pages/WishlistPage.jsx" />
    </Page>
  )
}
