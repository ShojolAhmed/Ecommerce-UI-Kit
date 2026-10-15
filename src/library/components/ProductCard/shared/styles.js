/**
 * Style fragments shared by the ProductCard variants.
 * Keep full class names in strings so Tailwind can detect them.
 */

/** Controls must sit above the card-wide link layer (see `stretchedLink`). */
export const controlLayer = 'z-10'

/**
 * "Stretched link": the product name's ::after covers the whole (relatively
 * positioned) card, so the entire card is one click target without wrapping
 * buttons inside a link. The focus ring is drawn on that pseudo-element so it
 * outlines the card, not just the text.
 *
 * Layering: the layer is `z-[1]`, which puts it above other positioned content
 * (the star rating is `relative`) and below the `z-10` controls.
 */
export const stretchedLink = [
  'after:absolute after:inset-0 after:z-[1] after:content-[""]',
  'focus-visible:outline-none',
  'focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring',
].join(' ')

/** Radius of the stretched layer, so the focus ring matches the card's corners. */
export const stretchedRadius = {
  surface: 'after:rounded-surface',
  none: 'after:rounded-none',
}

/**
 * Hide on hover-capable devices until the card is hovered or contains focus.
 * Touch devices have no hover, so the content stays visible there.
 * Opacity (not display) keeps hidden controls reachable by keyboard.
 */
export const revealOnHover = [
  'transition duration-200 motion-reduce:transition-none',
  '[@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0',
  '[@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100',
  '[@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100',
].join(' ')
