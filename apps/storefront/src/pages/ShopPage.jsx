import { useParams } from 'react-router-dom'
import { ProductGrid } from 'ecom-ui-kit'
import FeatureNote from '../components/FeatureNote.jsx'
import Page from '../components/Page.jsx'
import { getCategoryBySlug, getProducts } from '../data/catalog.js'
import { priceProps } from '../lib/format.js'
import { paths } from '../routing/paths.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'
import { useProductActions } from '../state/useProductActions.js'
import NotFoundPage from './NotFoundPage.jsx'

/** /shop and /shop/:categorySlug. Lists products in catalog order: filtering, sorting and paging are not built. */
export default function ShopPage() {
  const { categorySlug } = useParams()
  const handleLink = useLinkHandler()
  const actions = useProductActions()

  const category = categorySlug ? getCategoryBySlug(categorySlug) : null
  if (categorySlug && !category) {
    return <NotFoundPage title="Category not found" message="We could not find that category." />
  }

  const products = getProducts({ categorySlug })
  const title = category ? category.label : 'Shop all'
  const breadcrumbs = category
    ? [{ label: 'Home', href: paths.home }, { label: 'Shop', href: paths.shop }, { label: category.label }]
    : [{ label: 'Home', href: paths.home }, { label: 'Shop' }]

  return (
    <Page title={title} intro={category?.description ?? 'Everything we make.'} breadcrumbs={breadcrumbs}>
      <ProductGrid
        label={title}
        products={products}
        columns={4}
        headingLevel={2}
        {...actions}
        {...priceProps}
        onProductClick={handleLink}
      />
      <FeatureNote owner="Catalog filtering, sorting and pagination" file="src/pages/ShopPage.jsx">
        Use the kit&apos;s Sidebar, SortDropdown, ActiveFilters and FilterDrawer here.
      </FeatureNote>
    </Page>
  )
}
