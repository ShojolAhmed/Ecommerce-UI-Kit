import { ProductCard, productCardVariants } from '../library/index.js'
import { sampleProducts } from './sampleData.js'

/**
 * Preview registry: one entry per component family.
 * Add a family here and it appears on the preview page automatically.
 * Each entry lists its variants and how to render one.
 */
export const families = [
  {
    id: 'product-card',
    name: 'Product Card',
    variants: Object.keys(productCardVariants),
    render: (variant) => (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} variant={variant} product={product} />
        ))}
      </div>
    ),
  },
]
