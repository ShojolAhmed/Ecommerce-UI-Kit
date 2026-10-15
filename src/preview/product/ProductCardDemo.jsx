import { ProductCard, productCardLayouts, productGridColumns } from '../../library/index.js'
import { cn } from '../../library/utils/cn.js'
import { sampleProducts } from '../sampleData.js'
import DemoStatus from './DemoStatus.jsx'
import { useProductDemo } from './useProductDemo.js'

// One product per case worth seeing: discounted + badge, long name without a
// rating, a discounted product whose image fails to load, and out of stock.
const stateIds = [1001, 1007, 1009, 1010]
const stateProducts = stateIds.map((id) => sampleProducts.find((product) => product.id === id))

/**
 * One card variant used directly (no grid), in four data states.
 * Horizontal cards keep their own two-column layout; the others use four
 * columns so the four states sit on one row.
 */
export default function ProductCardDemo({ variant }) {
  const { wishlistedIds, addingIds, cartCount, lastEvent, handlers } = useProductDemo({ initialWishlist: [1001] })
  const layout = productCardLayouts[variant]
  const columns = variant === 'horizontal' ? layout.columns : productGridColumns[4]

  return (
    <div className="space-y-4">
      <div className={cn('grid', columns, layout.gap)}>
        {stateProducts.map((product) => (
          <ProductCard
            key={product.id}
            variant={variant}
            product={product}
            isWishlisted={wishlistedIds.has(product.id)}
            addingToCart={addingIds.has(product.id)}
            {...handlers}
          />
        ))}
      </div>
      <DemoStatus lastEvent={lastEvent} cartCount={cartCount} />
    </div>
  )
}
