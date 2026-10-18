import FeatureNote from '../components/FeatureNote.jsx'
import Page from '../components/Page.jsx'
import { paths } from '../routing/paths.js'

/** /account. Placeholder only: there is no sign-in, profile or order history in this phase. */
export default function AccountPage() {
  return (
    <Page title="Account" breadcrumbs={[{ label: 'Home', href: paths.home }, { label: 'Account' }]}>
      <FeatureNote owner="Account" file="src/pages/AccountPage.jsx">
        Sign-in, profile and order history will be added here.
      </FeatureNote>
    </Page>
  )
}
