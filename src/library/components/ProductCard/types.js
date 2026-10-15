/**
 * Shared ProductCard contract. Every variant accepts exactly these props, so
 * switching designs only means changing `variant`.
 *
 * @typedef {'neutral'|'brand'|'success'|'warning'|'danger'|'info'} ProductBadgeVariant
 *
 * @typedef {object} ProductBadge
 * @property {string} label
 * @property {ProductBadgeVariant} [variant='neutral']
 *
 * @typedef {object} Product
 * @property {string|number} id
 * @property {string} name
 * @property {number} price                    Current selling price, in major units (49.9 = $49.90).
 * @property {number} [originalPrice]          Price before the discount. Ignored unless it is higher than `price`.
 * @property {string} [image]                  Image URL. A missing or broken image shows a placeholder.
 * @property {string} [imageAlt]               Only set it when the image says something the name does not. Defaults to decorative.
 * @property {number} [rating]                 0–5, decimals allowed. Hidden when missing or 0.
 * @property {number} [reviewCount]            Hidden when missing or 0.
 * @property {(string|ProductBadge)[]} [badges]  Strings are neutral badges.
 * @property {string} [href]                   Product page URL. Makes the name a real link.
 * @property {string} [brand]
 * @property {string} [description]            Short blurb. Only the `horizontal` variant shows it.
 * @property {boolean} [inStock=true]          `false` disables add to cart and shows the out-of-stock label.
 *
 * @typedef {object} ProductCardLabels         Every visible or announced string, so stores can localise.
 * @property {string} [addToCart='Add to cart']
 * @property {string} [outOfStock='Out of stock']
 * @property {string} [wishlist='Add to wishlist']        The product name is appended: "Add to wishlist: Name".
 * @property {string} [currentPrice='Current price']      Screen-reader prefix.
 * @property {string} [originalPrice='Original price']    Screen-reader prefix.
 * @property {(percent: number) => string} [off]          Screen-reader text for the discount badge.
 * @property {(amountText: string) => string} [save]      Visible savings line (`sale` variant).
 * @property {(rating: number) => string} [rating]        Accessible name of the stars.
 * @property {(count: number) => string} [reviews]        Screen-reader text after the review count.
 *
 * @typedef {object} ProductCardProps
 * @property {Product} product
 * @property {boolean} [isWishlisted=false]    Controlled. The card keeps no wishlist state of its own.
 * @property {boolean} [addingToCart=false]    Controlled. Shows the busy state on the add-to-cart button.
 * @property {(product: Product, event: React.MouseEvent) => void} [onAddToCart]       Omit to hide the add-to-cart button.
 * @property {(product: Product, event: React.MouseEvent) => void} [onToggleWishlist]  Omit to hide the wishlist button.
 * @property {(product: Product, event: React.MouseEvent) => void} [onProductClick]    Fires when the card is activated. Call `event.preventDefault()` to route client-side.
 * @property {string} [currency='USD']         ISO 4217 code used to format prices.
 * @property {string} [locale]                 BCP 47 tag for number formatting. Defaults to the browser's.
 * @property {(amount: number, product: Product) => string} [formatPrice]  Replaces the built-in price formatting.
 * @property {ProductCardLabels} [labels]
 * @property {2|3|4|5|6} [headingLevel=3]      Heading level of the product name.
 * @property {string} [className]
 */

export {}
