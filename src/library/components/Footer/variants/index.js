// Register each new design here. The key is the public `variant` name.
import { createVariantRegistry } from '../../../utils/variants.js'
import SimpleFooter from './SimpleFooter.jsx'
import MultiColumnFooter from './MultiColumnFooter.jsx'
import NewsletterFooter from './NewsletterFooter.jsx'
import DarkFooter from './DarkFooter.jsx'

/** Canonical variant names and their components (a plain object, so unused designs can be tree-shaken). */
export const footerVariants = {
  simple: SimpleFooter,
  columns: MultiColumnFooter,
  newsletter: NewsletterFooter,
  dark: DarkFooter,
}

export const DEFAULT_FOOTER_VARIANT = 'columns'

/**
 * The Footer registry (pure, so it is dropped when nothing uses it): `resolve(variant)` returns the component to render and falls back to the
 * default (with a development warning) for an unknown name. Used by `<Footer variant>`.
 */
export const footerRegistry = /* @__PURE__ */ createVariantRegistry({
  name: 'Footer',
  variants: footerVariants,
  defaultVariant: DEFAULT_FOOTER_VARIANT,
})

// Each design is also importable on its own.
export { SimpleFooter, MultiColumnFooter, NewsletterFooter, DarkFooter }
