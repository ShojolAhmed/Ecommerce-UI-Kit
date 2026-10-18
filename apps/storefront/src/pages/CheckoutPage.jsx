import FeatureNote from '../components/FeatureNote.jsx'
import Page from '../components/Page.jsx'
import { paths } from '../routing/paths.js'

/** /checkout. Placeholder only: no form, payment or order logic exists in this phase. */
export default function CheckoutPage() {
  return (
    <Page title="Checkout" breadcrumbs={[{ label: 'Home', href: paths.home }, { label: 'Cart', href: paths.cart }, { label: 'Checkout' }]}>
      <FeatureNote owner="Checkout" file="src/pages/CheckoutPage.jsx">
        Read the cart with <code>useStore()</code>. Consider a leaner layout (no mega menu) for this route.
      </FeatureNote>
    </Page>
  )
}
