import {
  FaqAccordion,
  FeaturedCategoryGrid,
  FeaturedProducts,
  HeroBanner,
  NewsletterSignup,
  PromoBanner,
  Testimonials,
} from '../../../library/index.js'
import {
  fakeSubscribe,
  homeCategories,
  sampleFaq,
  sampleFeaturedProducts,
  sampleHero,
  samplePromo,
  sampleTestimonials,
  toggleWishlistId,
} from '../../data/index.js'
import { defineFamily } from '../define.js'
import { fn, ref, update, state } from '../markers.js'

const CATEGORY = 'sections'
const section = { padded: false }

const heroBase = {
  badge: sampleHero.badge,
  title: sampleHero.title,
  description: sampleHero.description,
  primaryAction: sampleHero.primaryAction,
  secondaryAction: sampleHero.secondaryAction,
  footnote: sampleHero.footnote,
  headingLevel: 2,
  onAction: fn('handleAction'),
}

export const heroBanner = defineFamily({
  id: 'hero-banner',
  name: 'Hero Banner',
  category: CATEGORY,
  summary: 'The first thing on the page. Two layouts, same props: text beside an image, or text over a full-width photo.',
  component: HeroBanner,
  importName: 'HeroBanner',
  source: 'src/library/components/HeroBanner',
  baseProps: heroBase,
  variants: [
    { id: 'split', label: 'Split', description: 'Text on one side, image on the other. Stacks on small screens, image first.', props: { layout: 'split', image: sampleHero.image } },
    { id: 'split-image-start', label: 'Split, image first', description: 'imagePosition="start" moves the image to the left from lg.', props: { layout: 'split', imagePosition: 'start', image: sampleHero.image } },
    { id: 'overlay', label: 'Overlay', description: 'Full-width image behind the text; always themed dark, with a scrim for legibility.', props: { layout: 'overlay', image: sampleHero.wideImage } },
    { id: 'overlay-centered', label: 'Overlay, centered', description: 'align="center" for the overlay layout.', props: { layout: 'overlay', align: 'center', image: sampleHero.wideImage } },
  ],
  frame: { desktop: 720, mobile: 900, ...section },
  docs: { sections: [{ title: 'Props', file: 'components/HeroBanner/HeroBanner.jsx' }], shapes: ['components/shared/types.js'] },
})

const gridBase = {
  title: 'Shop by category',
  description: 'Start with what you need, or browse everything.',
  action: { label: 'All categories', href: '#all-categories' },
  onCategoryClick: fn('handleCategoryClick'),
  onAction: fn('handleAction'),
}

export const featuredCategoryGrid = defineFamily({
  id: 'featured-category-grid',
  name: 'Featured Category Grid',
  category: CATEGORY,
  summary: 'Image tiles that lead into categories. Each tile is a link, a button or plain, depending on href / onCategoryClick.',
  component: FeaturedCategoryGrid,
  importName: 'FeaturedCategoryGrid',
  source: 'src/library/components/FeaturedCategoryGrid',
  baseProps: gridBase,
  variants: [
    { id: 'grid', label: 'Grid', description: 'Four portrait tiles per row on wide screens.', props: { categories: ref('categories', homeCategories), layout: 'grid', columns: 4, aspect: 'portrait' } },
    { id: 'mosaic', label: 'Mosaic', description: 'The first tile is large. Best with five categories.', props: { categories: ref('categories', homeCategories), layout: 'mosaic' } },
    { id: 'three-columns', label: 'Three landscape', description: 'columns={3} with landscape tiles.', props: { categories: ref('categories', homeCategories.slice(0, 3)), layout: 'grid', columns: 3, aspect: 'landscape' } },
  ],
  frame: { desktop: 720, mobile: 1100, ...section },
  docs: { sections: [{ title: 'Props', file: 'components/FeaturedCategoryGrid/FeaturedCategoryGrid.jsx' }], shapes: ['components/shared/types.js'] },
})

const featuredBase = {
  title: 'Bestsellers',
  description: 'What people are buying most this month.',
  action: { label: 'View all', href: '#bestsellers' },
  products: ref('products', sampleFeaturedProducts),
  columns: 4,
  wishlistedIds: state('wishlist', [1001]),
  onToggleWishlist: update('wishlist', toggleWishlistId, 'handleToggleWishlist'),
  onAddToCart: fn('handleAddToCart'),
  onProductClick: fn('handleProductClick'),
}

export const featuredProducts = defineFamily({
  id: 'featured-products',
  name: 'Featured Products',
  category: CATEGORY,
  summary: 'A product section as a grid or a scroll-snap carousel, in any card design. Forwards the card props.',
  component: FeaturedProducts,
  importName: 'FeaturedProducts',
  source: 'src/library/components/FeaturedProducts',
  baseProps: featuredBase,
  variants: [
    { id: 'grid', label: 'Grid', description: 'layout="grid" with minimal cards.', props: { layout: 'grid', variant: 'minimal' } },
    { id: 'grid-sale', label: 'Grid, sale cards', description: 'Any card design: here the sale card.', props: { layout: 'grid', variant: 'sale' } },
    { id: 'carousel', label: 'Carousel', description: 'Native scroll-snap with arrows that disable at the ends.', props: { layout: 'carousel', variant: 'minimal' } },
    { id: 'carousel-overlay', label: 'Carousel, overlay cards', description: 'Carousel of overlay cards.', props: { layout: 'carousel', variant: 'overlay' } },
  ],
  frame: { desktop: 780, mobile: 900, ...section },
  docs: { sections: [{ title: 'Props', file: 'components/FeaturedProducts/FeaturedProducts.jsx' }], shapes: ['components/shared/types.js'] },
})

const promoBase = {
  badge: samplePromo.badge,
  title: samplePromo.title,
  description: samplePromo.description,
  primaryAction: samplePromo.primaryAction,
  footnote: samplePromo.footnote,
  image: samplePromo.image,
  code: samplePromo.code,
  onCopyCode: fn('handleCopyCode'),
  onAction: fn('handleAction'),
}

export const promoBanner = defineFamily({
  id: 'promo-banner',
  name: 'Promo Banner',
  category: CATEGORY,
  summary: 'Inset rounded band for an offer. The code button copies to the clipboard (when allowed) and always calls onCopyCode.',
  component: PromoBanner,
  importName: 'PromoBanner',
  source: 'src/library/components/PromoBanner',
  baseProps: promoBase,
  variants: [
    { id: 'split', label: 'Split', description: 'Text and image side by side.', props: { layout: 'split', tone: 'primary' } },
    { id: 'split-image-start', label: 'Split, image first', description: 'imagePosition="start".', props: { layout: 'split', tone: 'primary', imagePosition: 'start' } },
    { id: 'strip', label: 'Strip', description: 'Compact single band.', props: { layout: 'strip', tone: 'primary' } },
    { id: 'dark-strip', label: 'Dark strip', description: 'tone="dark" on the strip layout.', props: { layout: 'strip', tone: 'dark' } },
    { id: 'accent', label: 'Accent', description: 'tone="accent" on the split layout.', props: { layout: 'split', tone: 'accent' } },
    { id: 'no-code', label: 'Without code', description: 'Omit code to hide the copy button.', props: { layout: 'split', tone: 'primary', code: undefined } },
  ],
  frame: { desktop: 560, mobile: 820, ...section },
  docs: { sections: [{ title: 'Props', file: 'components/PromoBanner/PromoBanner.jsx' }], shapes: ['components/shared/types.js'] },
})

const testimonialBase = {
  title: 'What customers say',
  description: 'Reviews from people who bought and wore the things.',
  testimonials: ref('testimonials', sampleTestimonials),
}

export const testimonials = defineFamily({
  id: 'testimonials',
  name: 'Testimonials',
  category: CATEGORY,
  summary: 'Customer quotes with optional rating, role and avatar. The slider has no autoplay.',
  component: Testimonials,
  importName: 'Testimonials',
  source: 'src/library/components/Testimonials',
  baseProps: testimonialBase,
  variants: [
    { id: 'grid', label: 'Grid', description: 'Quotes in two columns on wide screens.', props: { layout: 'grid', columns: 2 } },
    { id: 'slider', label: 'Slider', description: 'One review at a time with previous / next controls.', props: { layout: 'slider', columns: 3, onSlideChange: fn('handleSlideChange') } },
  ],
  frame: { desktop: 640, mobile: 900, ...section },
  docs: { sections: [{ title: 'Props', file: 'components/Testimonials/Testimonials.jsx' }] },
})

const faqBase = {
  title: 'Questions, answered',
  description: "Can't find what you need? Our team replies within one working day.",
  items: ref('items', sampleFaq),
  defaultOpenIds: ['delivery'],
  onOpenChange: fn('handleOpenChange'),
}

export const faqAccordion = defineFamily({
  id: 'faq-accordion',
  name: 'FAQ Accordion',
  category: CATEGORY,
  summary: 'Heading block around the generic Accordion. Disclosure pattern with Arrow / Home / End keys.',
  component: FaqAccordion,
  importName: 'FaqAccordion',
  source: 'src/library/components/FaqAccordion',
  baseProps: faqBase,
  variants: [
    { id: 'stacked', label: 'Stacked', description: 'Heading above, answers below.', props: { layout: 'stacked' } },
    { id: 'split', label: 'Split', description: 'Heading on one side, answers on the other (from lg).', props: { layout: 'split' } },
    { id: 'allow-multiple', label: 'Allow multiple', description: 'Several answers can be open at once.', props: { layout: 'stacked', allowMultiple: true } },
  ],
  frame: { desktop: 640, mobile: 760, ...section },
  docs: { sections: [{ title: 'Props', file: 'components/FaqAccordion/FaqAccordion.jsx' }] },
})

const newsletterBase = {
  title: 'Get 10% off your first order',
  description: 'Join for new arrivals, restocks and stories from the workshop.',
  privacyNote: 'One email a month. Unsubscribe anytime.',
  formLabels: { submit: 'Join now' },
  onSubscribe: fn('handleSubscribe', fakeSubscribe),
}

export const newsletterSignup = defineFamily({
  id: 'newsletter-signup',
  name: 'Newsletter Signup',
  category: CATEGORY,
  summary: 'Signup block around NewsletterForm. There is no email service: it validates, calls onSubscribe and shows the result. An address starting with "fail" shows the error state.',
  component: NewsletterSignup,
  importName: 'NewsletterSignup',
  source: 'src/library/components/NewsletterSignup',
  baseProps: newsletterBase,
  variants: [
    { id: 'centered', label: 'Centered', description: 'Centered copy and form on a muted band.', props: { layout: 'centered', tone: 'muted' } },
    { id: 'split', label: 'Split', description: 'Copy and form side by side.', props: { layout: 'split', tone: 'muted' } },
    { id: 'split-image', label: 'Split with image', description: 'Adds an image to the split layout.', props: { layout: 'split', tone: 'muted', image: { src: 'https://picsum.photos/seed/newsletter-desk/900/700', alt: 'A desk with a notebook and a candle' } } },
    { id: 'dark', label: 'Dark', description: 'tone="dark".', props: { layout: 'centered', tone: 'dark' } },
    { id: 'with-consent', label: 'With consent', description: 'consent adds a required checkbox; the callback receives { email, consent }.', props: { layout: 'centered', tone: 'muted', consent: 'I agree to receive marketing emails from Northwind.' } },
  ],
  frame: { desktop: 560, mobile: 760, ...section },
  docs: { sections: [{ title: 'Props', file: 'components/NewsletterSignup/NewsletterSignup.jsx' }], shapes: ['components/shared/types.js'] },
})
