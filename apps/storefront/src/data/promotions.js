import { placeholderImage } from './images.js'
import { paths } from '../routing/paths.js'

// Props for the kit's HeroBanner, PromoBanner and AnnouncementBar, kept as data so marketing copy changes
// without touching page code. `href`s are internal paths; the layout routes them client-side.

export const hero = {
  title: 'Made to be used, mended and kept.',
  description: 'Everyday carry, outerwear and home goods in materials that get better with age.',
  badge: 'Autumn collection',
  primaryAction: { label: 'Shop the collection', href: paths.shop },
  secondaryAction: { label: 'Our story', href: paths.about },
  image: { src: placeholderImage({ label: 'Autumn collection', hue: 28, width: 1200, height: 1100, showLabel: false }), alt: '' },
  footnote: 'Free shipping on orders over $75.',
}

export const announcements = [
  { id: 'ship', text: 'Free shipping on orders over $75' },
  { id: 'returns', text: '30-day returns on everything', href: paths.returns, linkLabel: 'Read the policy' },
]

export const promotions = {
  firstOrder: {
    badge: 'New customers',
    title: '10% off your first order',
    description: 'Use the code at checkout. Valid on full-price items.',
    code: 'FIRST10',
    primaryAction: { label: 'Start shopping', href: paths.shop },
    image: { src: placeholderImage({ label: 'First order', hue: 150, width: 1000, height: 800, showLabel: false }), alt: '' },
    footnote: 'One use per customer. Cannot be combined with other offers.',
    tone: 'primary',
  },
  sale: {
    title: 'Selected knitwear and boots, up to 25% off',
    description: 'While stock lasts.',
    primaryAction: { label: 'See what is on sale', href: paths.shop },
    tone: 'dark',
  },
}
