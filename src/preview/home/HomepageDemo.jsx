import { useState } from 'react'
import {
  AnnouncementBar,
  FaqAccordion,
  FeaturedCategoryGrid,
  FeaturedProducts,
  Footer,
  HeroBanner,
  Navbar,
  NewsletterSignup,
  PromoBanner,
  Testimonials,
} from '../../library/index.js'
import { sampleNavbar } from '../sampleData.js'
import Switcher from '../discovery/Switcher.jsx'
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

// Brand serif for headings: the library's `font-display` token, set for this page only.
const brandFonts = {
  '--font-display': '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
}

/**
 * Demo homepage: every section is an independent library component, composed in a page.
 * Nothing here is a real store. Cart, wishlist and the mailing list are fake preview state,
 * and the sample `#links` are intercepted so the page never navigates away.
 */
export default function HomepageDemo() {
  const [message, log] = useDemoLog('Click around: callbacks show up here.')
  const [heroLayout, setHeroLayout] = useState('split')
  const [productLayout, setProductLayout] = useState('carousel')
  const [footerVariant, setFooterVariant] = useState('dark')
  const shop = useFakeShop()

  const handleClickCapture = (event) => {
    const anchor = event.target.closest?.('a[href^="#"]')
    if (!anchor) return
    if (anchor.getAttribute('href') === '#/preview') return // the way back to the component preview
    event.preventDefault()
    log(`Link: ${anchor.getAttribute('aria-label') || anchor.textContent.trim()}`)
  }

  const subscribe = async (values) => {
    log(`Subscribing ${values.email}…`)
    try {
      await fakeSubscribe(values)
      log(`Subscribed: ${values.email}`)
    } catch (error) {
      log(`Subscribe failed: ${error.message}`)
      throw error
    }
  }

  const { newsletter, ...footerContent } = sampleFooter

  return (
    <div style={brandFonts} onClickCapture={handleClickCapture} className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:rounded-control focus:bg-surface focus:px-3 focus:py-2 focus:shadow-md"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>

      <AnnouncementBar messages={sampleAnnouncements} dismissible onLinkClick={(item) => log(`Announcement: ${item.linkLabel}`)} />

      <Navbar
        variant="mega"
        sticky
        brand={sampleNavbar.brand}
        links={sampleNavbar.links}
        search={{ placeholder: 'Search products', onSubmit: (query) => log(`Search: "${query}"`) }}
        account={{ onClick: () => log('Open account') }}
        wishlist={{ count: shop.wishlist.length, onClick: () => log('Open wishlist') }}
        cart={{ count: shop.cartCount, onClick: () => log('Open cart') }}
        onNavigate={(item) => log(`Navigate: ${item.label}`)}
      />

      <main id="main" tabIndex={-1} className="outline-none">
        <HeroBanner
          {...sampleHero}
          layout={heroLayout}
          image={heroLayout === 'overlay' ? sampleHero.wideImage : sampleHero.image}
          onAction={(action) => log(`Hero button: ${action.label}`)}
        />

        <FeaturedCategoryGrid
          layout="mosaic"
          title="Shop by category"
          description="Start with what you need, or browse everything."
          action={{ label: 'All categories', href: '#all-categories' }}
          categories={sampleCategories}
          onCategoryClick={(category) => log(`Category: ${category.label}`)}
        />

        <FeaturedProducts
          title="Bestsellers"
          description="What people are buying most this month."
          action={{ label: 'View all', href: '#bestsellers' }}
          products={sampleFeaturedProducts}
          layout={productLayout}
          variant="overlay"
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

        <PromoBanner {...samplePromo} onCopyCode={(code) => log(`Code copied: ${code}`)} onAction={(action) => log(`Promo button: ${action.label}`)} />

        <Testimonials
          title="What customers say"
          description="Reviews from people who bought and wore the things."
          testimonials={sampleTestimonials}
          layout="grid"
          columns={2}
        />

        <FaqAccordion
          layout="split"
          title="Questions, answered"
          description="Can't find what you need? Our team replies within one working day."
          items={sampleFaq}
          defaultOpenIds={['delivery']}
          footer={
            <p>
              Still stuck?{' '}
              <a className="font-medium text-foreground underline underline-offset-4" href="#contact">
                Contact us
              </a>
              .
            </p>
          }
        />

        <NewsletterSignup
          title="Get 10% off your first order"
          description="Join for new arrivals, restocks and stories from the workshop."
          privacyNote="One email a month. Unsubscribe anytime."
          formLabels={{ submit: 'Join now' }}
          onSubscribe={subscribe}
        />
      </main>

      <Footer
        variant={footerVariant}
        {...footerContent}
        newsletter={footerVariant === 'newsletter' || footerVariant === 'dark' ? { ...newsletter, onSubscribe: subscribe } : undefined}
        bottomSlot={<span className="text-sm text-foreground-muted">Prices in USD</span>}
        onNavigate={(item) => log(`Footer: ${item.label}`)}
      />

      {/* Preview-only controls, not part of the page design. */}
      <details className="fixed end-3 bottom-3 z-40 max-w-[calc(100vw-1.5rem)] rounded-surface border border-border bg-surface text-sm shadow-lg">
        <summary className="cursor-pointer rounded-surface px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-ring">
          Demo options
        </summary>
        <div className="flex flex-col gap-3 border-t border-border p-4">
          <Switcher label="Hero" options={['split', 'overlay']} value={heroLayout} onChange={setHeroLayout} />
          <Switcher label="Products" options={['grid', 'carousel']} value={productLayout} onChange={setProductLayout} />
          <Switcher label="Footer" options={['simple', 'columns', 'newsletter', 'dark']} value={footerVariant} onChange={setFooterVariant} />
          <p role="status" className="font-mono text-xs text-foreground-muted">
            {message}
          </p>
          <a href="#/preview" className="text-sm font-medium underline underline-offset-4">
            Back to the component preview
          </a>
        </div>
      </details>
    </div>
  )
}
