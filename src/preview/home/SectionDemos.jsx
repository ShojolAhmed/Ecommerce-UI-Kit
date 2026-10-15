import { useState } from 'react'
import {
  AnnouncementBar,
  FaqAccordion,
  FeaturedCategoryGrid,
  FeaturedProducts,
  Footer,
  HeroBanner,
  NewsletterSignup,
  PromoBanner,
  Testimonials,
} from '../../library/index.js'
import { Button } from '../../library/index.js'
import DemoFrame from './DemoFrame.jsx'
import { fakeSubscribe, useDemoLog, useFakeShop } from './demoActions.js'
import {
  sampleAnnouncements,
  sampleCategories,
  sampleFaq,
  sampleFeaturedProducts,
  sampleFooter,
  sampleHero,
  samplePromo,
  sampleTestimonials,
} from './sampleHome.js'

const subscribe = (log) => async (values) => {
  log(`Subscribing ${values.email}…`)
  try {
    await fakeSubscribe(values)
    log(`Subscribed: ${values.email}${values.consent ? ' (consent given)' : ''}`)
  } catch (error) {
    log(`Subscribe failed: ${error.message}`)
    throw error
  }
}

export function FooterDemo({ variant }) {
  const [message, log] = useDemoLog()
  return (
    <DemoFrame message={message} onLog={log}>
      <Footer
        variant={variant}
        navLabel={`Footer (${variant})`}
        {...sampleFooter}
        newsletter={{
          ...sampleFooter.newsletter,
          consent: variant === 'newsletter' ? 'Yes, email me about new arrivals. I can unsubscribe at any time.' : undefined,
          onSubscribe: subscribe(log),
        }}
        bottomSlot={<span className="text-sm text-foreground-muted">Prices in USD</span>}
        onNavigate={(item) => log(`Navigate: ${item.label}`)}
      />
    </DemoFrame>
  )
}

export function AnnouncementBarDemo({ mode }) {
  const [message, log] = useDemoLog()
  const [open, setOpen] = useState(true)
  const common = { onLinkClick: (item) => log(`Announcement link: ${item.linkLabel}`) }

  return (
    <DemoFrame message={message} onLog={log}>
      {mode === 'static' && <AnnouncementBar {...common} messages={sampleAnnouncements.slice(0, 1)} />}
      {mode === 'rotating' && <AnnouncementBar {...common} messages={sampleAnnouncements} interval={4000} />}
      {mode === 'dismissible' && (
        <>
          <AnnouncementBar
            {...common}
            messages={sampleAnnouncements.slice(0, 2)}
            dismissible
            open={open}
            onOpenChange={(next) => {
              setOpen(next)
              log(`Announcements ${next ? 'shown' : 'dismissed'}`)
            }}
          />
          {!open && (
            <div className="p-4">
              <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                Show the bar again
              </Button>
            </div>
          )}
        </>
      )}
      {mode === 'tones' &&
        ['default', 'muted', 'primary', 'accent', 'dark'].map((tone) => (
          <AnnouncementBar
            key={tone}
            {...common}
            tone={tone}
            labels={{ region: `Announcements (${tone})` }}
            messages={sampleAnnouncements.slice(0, 1)}
            autoRotate={false}
          />
        ))}
    </DemoFrame>
  )
}

export function HeroBannerDemo({ mode }) {
  const [message, log] = useDemoLog()
  const overlay = mode.startsWith('overlay')
  return (
    <DemoFrame message={message} onLog={log}>
      <HeroBanner
        {...sampleHero}
        image={overlay ? sampleHero.wideImage : sampleHero.image}
        layout={overlay ? 'overlay' : 'split'}
        imagePosition={mode === 'split-image-start' ? 'start' : 'end'}
        align={mode === 'overlay-centered' ? 'center' : 'start'}
        headingLevel={2}
        onAction={(action) => log(`Hero button: ${action.label}`)}
      />
    </DemoFrame>
  )
}

export function CategoryGridDemo({ mode }) {
  const [message, log] = useDemoLog()
  return (
    <DemoFrame message={message} onLog={log}>
      <FeaturedCategoryGrid
        title="Shop by category"
        description="Start with what you need, or browse everything."
        action={{ label: 'All categories', href: '#all-categories' }}
        categories={mode === 'three-columns' ? sampleCategories.slice(0, 3) : sampleCategories}
        layout={mode === 'mosaic' ? 'mosaic' : 'grid'}
        columns={mode === 'three-columns' ? 3 : 4}
        aspect={mode === 'three-columns' ? 'landscape' : 'portrait'}
        onCategoryClick={(category) => log(`Category: ${category.label}`)}
        onAction={(action) => log(`Header action: ${action.label}`)}
      />
    </DemoFrame>
  )
}

export function FeaturedProductsDemo({ mode }) {
  const [message, log] = useDemoLog()
  const shop = useFakeShop()
  const carousel = mode.startsWith('carousel')
  return (
    <DemoFrame message={message} onLog={log}>
      <FeaturedProducts
        title="Bestsellers"
        description="What people are buying most this month."
        action={{ label: 'View all', href: '#bestsellers' }}
        products={sampleFeaturedProducts}
        layout={carousel ? 'carousel' : 'grid'}
        variant={mode === 'carousel-overlay' ? 'overlay' : mode === 'grid-sale' ? 'sale' : 'minimal'}
        columns={4}
        wishlistedIds={shop.wishlist}
        addingToCartIds={shop.adding}
        onToggleWishlist={(product) => {
          shop.toggleWishlist(product)
          log(`Wishlist: ${product.name}`)
        }}
        onAddToCart={(product) => {
          shop.addToCart(product)
          log(`Add to cart: ${product.name}`)
        }}
        onProductClick={(product, event) => {
          event.preventDefault()
          log(`Open product: ${product.name}`)
        }}
      />
    </DemoFrame>
  )
}

export function PromoBannerDemo({ mode }) {
  const [message, log] = useDemoLog()
  const tone = mode === 'accent' ? 'accent' : mode === 'dark-strip' ? 'dark' : 'primary'
  const strip = mode === 'strip' || mode === 'dark-strip'
  return (
    <DemoFrame message={message} onLog={log}>
      <PromoBanner
        {...samplePromo}
        layout={strip ? 'strip' : 'split'}
        imagePosition={mode === 'split-image-start' ? 'start' : 'end'}
        tone={tone}
        code={mode === 'no-code' ? undefined : samplePromo.code}
        onCopyCode={(code) => log(`Code copied: ${code}`)}
        onAction={(action) => log(`Promo button: ${action.label}`)}
      />
    </DemoFrame>
  )
}

export function TestimonialsDemo({ mode }) {
  const [message, log] = useDemoLog()
  return (
    <DemoFrame message={message} onLog={log}>
      <Testimonials
        title="What customers say"
        description="Reviews from people who bought and wore the things."
        testimonials={sampleTestimonials}
        layout={mode}
        columns={mode === 'grid' ? 2 : 3}
        onSlideChange={(item) => log(`Showing review by ${item.author}`)}
      />
    </DemoFrame>
  )
}

export function FaqDemo({ mode }) {
  const [message, log] = useDemoLog()
  return (
    <DemoFrame message={message} onLog={log}>
      <FaqAccordion
        title="Questions, answered"
        description="Can't find what you need? Our team replies within one working day."
        items={sampleFaq}
        layout={mode === 'split' ? 'split' : 'stacked'}
        allowMultiple={mode === 'allow-multiple'}
        defaultOpenIds={['delivery']}
        onOpenChange={(ids) => log(`Open: ${ids.length ? ids.join(', ') : 'none'}`)}
        footer={
          <p>
            Still stuck? <a className="font-medium text-foreground underline underline-offset-4" href="#contact">Contact us</a>.
          </p>
        }
      />
    </DemoFrame>
  )
}

export function NewsletterSignupDemo({ mode }) {
  const [message, log] = useDemoLog('Try an address starting with “fail” to see the error state.')
  return (
    <DemoFrame message={message} onLog={log}>
      <NewsletterSignup
        title="Get 10% off your first order"
        description="Join for new arrivals, restocks and stories from the workshop."
        privacyNote="One email a month. Unsubscribe anytime."
        layout={mode === 'split' || mode === 'split-image' ? 'split' : 'centered'}
        image={mode === 'split-image' ? { src: 'https://picsum.photos/seed/newsletter-desk/900/700', alt: 'A desk with a notebook and a candle' } : undefined}
        tone={mode === 'dark' ? 'dark' : 'muted'}
        consent={mode === 'with-consent' ? 'I agree to receive marketing emails from Northwind.' : undefined}
        formLabels={{ submit: 'Join now' }}
        onSubscribe={subscribe(log)}
      />
    </DemoFrame>
  )
}
