import { ProductCard, ProductGrid, productCardVariants } from '../../../library/index.js'
import { sampleProducts, toggleWishlistId } from '../../data/index.js'
import { defineFamily, variantsFromRegistry } from '../define.js'
import { fn, ref, state, update } from '../markers.js'
import { ProductCardStage } from '../stages.jsx'

const CATEGORY = 'products'

const cardInfo = {
  minimal: { label: 'Minimal', description: 'Borderless, square photo, quiet text and an outlined button. One badge, on the image.' },
  sale: { label: 'Sale', description: 'Bordered card with a bold discount badge, danger-colored price and "Save $31.00". Falls back to a plain price when there is no real discount.' },
  overlay: { label: 'Overlay', description: 'Portrait photo with the wishlist heart on it and an add-to-cart bar that slides up over the image (always visible on touch screens).' },
  horizontal: { label: 'Horizontal', description: 'Image left, details right, for lists and search results. Shows the description from sm up.' },
  luxury: { label: 'Luxury', description: 'Tall portrait photo, square corners, wide letter-spacing and outlined labels. Uses the font-display token.' },
}

export const productCard = defineFamily({
  id: 'product-card',
  name: 'Product Card',
  category: CATEGORY,
  summary: 'One product in five designs. Presentational only: your page owns the cart and wishlist and passes state in.',
  component: ProductCard,
  importName: 'ProductCard',
  source: 'src/library/components/ProductCard',
  variantProp: 'variant',
  baseProps: {
    product: ref('product', sampleProducts[0]),
    isWishlisted: state('wishlisted', true),
    onToggleWishlist: update('wishlisted', (current) => !current, 'handleToggleWishlist'),
    onAddToCart: fn('handleAddToCart'),
    onProductClick: fn('handleProductClick'),
  },
  variants: variantsFromRegistry(productCardVariants, cardInfo),
  Stage: ProductCardStage,
  frame: { desktop: 640, mobile: 1180 },
  docs: {
    sections: [{ title: 'Props', file: 'components/ProductCard/types.js', typedef: 'ProductCardProps' }],
    shapes: ['components/ProductCard/types.js'],
  },
})

export const productGrid = defineFamily({
  id: 'product-grid',
  name: 'Product Grid',
  category: CATEGORY,
  summary: 'A semantic list of cards in any card design. Switching the variant needs no other change.',
  component: ProductGrid,
  importName: 'ProductGrid',
  source: 'src/library/components/ProductGrid',
  variantProp: 'variant',
  baseProps: {
    products: ref('products', sampleProducts),
    label: 'New arrivals',
    wishlistedIds: state('wishlist', [1001]),
    onToggleWishlist: update('wishlist', toggleWishlistId, 'handleToggleWishlist'),
    onAddToCart: fn('handleAddToCart'),
    onProductClick: fn('handleProductClick'),
  },
  variants: variantsFromRegistry(productCardVariants, {
    minimal: { label: 'Minimal', description: 'Four columns on wide screens, two on phones.' },
    sale: { label: 'Sale', description: 'Same columns as minimal with tighter gaps.' },
    overlay: { label: 'Overlay', description: 'Four columns; the add-to-cart bar slides up over each photo.' },
    horizontal: { label: 'Horizontal', description: 'Two columns of image-left rows (one on phones).' },
    luxury: { label: 'Luxury', description: 'Three columns with generous gaps.' },
  }),
  frame: { desktop: 900, mobile: 900 },
  docs: {
    sections: [{ title: 'Props', file: 'components/ProductGrid/types.js', typedef: 'ProductGridProps' }],
    shapes: ['components/ProductCard/types.js'],
  },
})
