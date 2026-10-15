// Register each new design here. The key is the public `variant` name.
import SimpleFooter from './SimpleFooter.jsx'
import MultiColumnFooter from './MultiColumnFooter.jsx'
import NewsletterFooter from './NewsletterFooter.jsx'
import DarkFooter from './DarkFooter.jsx'

export const footerVariants = {
  simple: SimpleFooter,
  columns: MultiColumnFooter,
  newsletter: NewsletterFooter,
  dark: DarkFooter,
}

export const DEFAULT_FOOTER_VARIANT = 'columns'
