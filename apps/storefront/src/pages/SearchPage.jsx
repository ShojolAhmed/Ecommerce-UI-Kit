import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from 'ecom-ui-kit'
import FeatureNote from '../components/FeatureNote.jsx'
import Page from '../components/Page.jsx'
import { searchProducts } from '../data/catalog.js'
import { priceProps } from '../lib/format.js'
import { paths, SEARCH_PARAM } from '../routing/paths.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'
import { useProductActions } from '../state/useProductActions.js'

/** /search?q=term. Shows basic text matches from `searchProducts`: no filters, suggestions or pagination. */
export default function SearchPage() {
  const [params] = useSearchParams()
  const query = (params.get(SEARCH_PARAM) ?? '').trim()
  const handleLink = useLinkHandler()
  const actions = useProductActions()
  const results = searchProducts(query)

  const intro = !query
    ? 'Type a product, material or category in the search box.'
    : `${results.length} ${results.length === 1 ? 'result' : 'results'} for \u201C${query}\u201D`

  return (
    <Page
      title="Search"
      intro={intro}
      breadcrumbs={[{ label: 'Home', href: paths.home }, { label: 'Search' }]}
    >
      {query && (
        <ProductGrid
          label={`Search results for ${query}`}
          products={results}
          columns={4}
          headingLevel={2}
          emptyState={<p className="empty">Nothing matched. Try a shorter or different word.</p>}
          {...actions}
          {...priceProps}
          onProductClick={handleLink}
        />
      )}
      <FeatureNote owner="Search results page" file="src/pages/SearchPage.jsx">
        Add filters, sorting, suggestions and paging on top of <code>searchProducts</code>.
      </FeatureNote>
    </Page>
  )
}
