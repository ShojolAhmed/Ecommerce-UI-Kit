/**
 * ProductGrid contract. Card-level props are forwarded to the selected variant
 * (see ProductCard/types.js); the grid adds the list-level ones.
 *
 * @typedef {object} ProductGridProps
 * @property {import('../ProductCard/types.js').Product[]} products
 * @property {'minimal'|'sale'|'overlay'|'horizontal'|'luxury'} [variant='minimal']  Card design used for every product.
 * @property {1|2|3|4} [columns]               Columns on wide screens. Defaults to the variant's own responsive layout.
 * @property {Iterable<string|number>} [wishlistedIds]    Ids shown as wishlisted. Compared with strict equality, so keep id types consistent.
 * @property {Iterable<string|number>} [addingToCartIds]  Ids whose add-to-cart button shows the busy state.
 * @property {(product, event) => void} [onAddToCart]       Forwarded to every card. Omit to hide the buttons.
 * @property {(product, event) => void} [onToggleWishlist]  Forwarded to every card. Omit to hide the buttons.
 * @property {(product, event) => void} [onProductClick]    Forwarded to every card.
 * @property {string} [currency='USD']
 * @property {string} [locale]
 * @property {(amount: number, product) => string} [formatPrice]
 * @property {import('../ProductCard/types.js').ProductCardLabels} [labels]
 * @property {2|3|4|5|6} [headingLevel=3]      Heading level of each product name. Pick the level below the section heading.
 * @property {React.ReactNode} [emptyState]    Shown when there is nothing to render.
 * @property {string} [label]                  Accessible name of the list (e.g. "Women's knitwear").
 * @property {string} [className]
 * @property {string} [cardClassName]          Extra classes for every card.
 */

export {}
