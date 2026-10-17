// Register each new design here. The key is the public `variant` name.
import { createVariantRegistry } from '../../../utils/variants.js'
import SimpleFooter from './SimpleFooter.jsx'
import MultiColumnFooter from './MultiColumnFooter.jsx'
import NewsletterFooter from './NewsletterFooter.jsx'
import DarkFooter from './DarkFooter.jsx'

const footerVariantsMap = {
  simple: SimpleFooter,
  columns: MultiColumnFooter,
  newsletter: NewsletterFooter,
  dark: DarkFooter,
}

export const DEFAULT_FOOTER_VARIANT = 'columns'

/**
 * The Footer registry: `resolve(variant)` returns the component to render and falls back to the
 * default (with a development warning) for an unknown name. Used by `<Footer variant>`.
 */
export const footerRegistry = createVariantRegistry({
  name: 'Footer',
  variants: footerVariantsMap,
  defaultVariant: DEFAULT_FOOTER_VARIANT,
})

/** Canonical variant names and their components. */
export const footerVariants = footerRegistry.variants

// Each design is also importable on its own.
export { SimpleFooter, MultiColumnFooter, NewsletterFooter, DarkFooter }
