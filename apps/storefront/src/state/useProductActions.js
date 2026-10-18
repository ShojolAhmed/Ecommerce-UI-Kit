import { useToast } from 'ecom-ui-kit'
import { useStore } from './useStore.js'

/**
 * The callbacks every product card / grid / section needs, wired to the shared store and to toasts.
 * Spread the result onto ProductGrid, FeaturedProducts or ProductCard:
 *
 *   const actions = useProductActions()
 *   <ProductGrid products={products} {...actions} />
 *
 * Product links are routed client-side separately, with `useLinkHandler()` as `onProductClick`.
 */
export function useProductActions() {
  const { addToCart, toggleWishlist, wishlistIds } = useStore()
  const toast = useToast()

  return {
    wishlistedIds: wishlistIds,
    onAddToCart: (product) => {
      addToCart(product)
      toast.success({ id: `cart-${product.id}`, title: 'Added to cart', description: product.name })
    },
    onToggleWishlist: (product) => {
      const added = toggleWishlist(product)
      toast.info({ id: `wish-${product.id}`, title: added ? 'Saved to wishlist' : 'Removed from wishlist', description: product.name })
    },
  }
}
