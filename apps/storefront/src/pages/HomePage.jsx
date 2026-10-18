import { useEffect } from 'react'
import { FeaturedCategoryGrid, FeaturedProducts, HeroBanner, PromoBanner } from 'ecom-ui-kit'
import { site } from '../config/site.js'
import { getCategories, getFeaturedProducts, getNewArrivals } from '../data/catalog.js'
import { hero, promotions } from '../data/promotions.js'
import { priceProps } from '../lib/format.js'
import { paths } from '../routing/paths.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'
import { useProductActions } from '../state/useProductActions.js'

const categories = getCategories()
const featured = getFeaturedProducts(8)
const newArrivals = getNewArrivals(4)

export default function HomePage() {
  const handleLink = useLinkHandler()
  const actions = useProductActions()

  useEffect(() => {
    document.title = `${site.brand.name} | Everyday carry, outerwear and home goods`
  }, [])

  // Every section reports link clicks as (item, event); one handler routes them all client-side.
  const productProps = { ...actions, ...priceProps, onProductClick: handleLink }

  return (
    <>
      <HeroBanner {...hero} onAction={handleLink} />

      <FeaturedCategoryGrid
        title="Shop by category"
        categories={categories}
        layout="mosaic"
        action={{ label: 'View all', href: paths.shop }}
        onAction={handleLink}
        onCategoryClick={handleLink}
      />

      <FeaturedProducts
        title="Featured"
        description="The pieces our customers come back for."
        products={featured}
        layout="carousel"
        columns={4}
        action={{ label: 'View all', href: paths.shop }}
        onAction={handleLink}
        {...productProps}
      />

      <PromoBanner {...promotions.firstOrder} onAction={handleLink} />

      <FeaturedProducts
        title="New arrivals"
        description="Just in this month."
        products={newArrivals}
        layout="grid"
        columns={4}
        variant="sale"
        action={{ label: 'View all', href: paths.shop }}
        onAction={handleLink}
        {...productProps}
      />

      <PromoBanner {...promotions.sale} layout="strip" onAction={handleLink} />
    </>
  )
}
