import { EmptyCartState } from 'ecom-ui-kit'
import FeatureNote from '../components/FeatureNote.jsx'
import Page from '../components/Page.jsx'
import { formatPrice } from '../lib/format.js'
import { paths } from '../routing/paths.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'
import { useStore } from '../state/useStore.js'

/** /cart. Placeholder: shows the shared cart state so integrators can verify it. */
export default function CartPage() {
  const { cartItems, cartCount } = useStore()
  const handleLink = useLinkHandler()
  const breadcrumbs = [{ label: 'Home', href: paths.home }, { label: 'Cart' }]

  return (
    <Page title="Cart" breadcrumbs={breadcrumbs}>
      {cartItems.length === 0 ? (
        <EmptyCartState action={{ label: 'Continue shopping', href: paths.shop }} onAction={handleLink} />
      ) : (
        <>
          <p>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart.</p>
          <ul className="plain-list">
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} &times; {item.quantity} &ndash; {formatPrice(item.price * item.quantity)}
              </li>
            ))}
          </ul>
        </>
      )}
      <FeatureNote owner="Cart page" file="src/pages/CartPage.jsx">
        Build it from the kit&apos;s CartItemRow, QuantitySelector, CartSummary and getCartTotals, using <code>useStore()</code>.
      </FeatureNote>
    </Page>
  )
}
