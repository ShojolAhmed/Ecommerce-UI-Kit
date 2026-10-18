import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnnouncementBar, Footer, Navbar, useToast } from 'ecom-ui-kit'
import { footer, getNavLinks, site } from '../config/site.js'
import { announcements } from '../data/promotions.js'
import { paths, SEARCH_PARAM } from '../routing/paths.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'
import ScrollToTop from '../routing/ScrollToTop.jsx'
import { useStore } from '../state/useStore.js'

/**
 * Shared shell for every route: announcement bar, navbar, page content (<Outlet />) and footer.
 * Pages render inside <main id="main">; do not add another <main> or navbar in a page.
 */
export default function StoreLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const handleLink = useLinkHandler()
  const toast = useToast()
  const { cartCount, wishlistCount } = useStore()

  const query = pathname === paths.search ? (new URLSearchParams(search).get(SEARCH_PARAM) ?? '') : ''
  const action = (href) => ({ href, onClick: (event) => handleLink({ href }, event) })

  return (
    <div className="shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      <AnnouncementBar messages={announcements} tone="dark" onLinkClick={handleLink} />
      <Navbar
        // Remount when the URL's query changes so the search field shows it (back/forward, or a search elsewhere).
        key={query}
        variant="mega"
        sticky
        brand={site.brand}
        links={getNavLinks(pathname)}
        search={{ defaultValue: query, onSubmit: (value) => value && navigate(paths.search(value)) }}
        account={action(paths.account)}
        wishlist={{ ...action(paths.wishlist), count: wishlistCount }}
        cart={{ ...action(paths.cart), count: cartCount }}
        onNavigate={handleLink}
      />
      <main id="main" tabIndex={-1} className="shell-main">
        <Outlet />
      </main>
      <Footer
        variant="newsletter"
        brand={footer.brand}
        columns={footer.columns}
        legalLinks={footer.legalLinks}
        newsletter={{
          ...footer.newsletter,
          // Mock only: nothing is sent anywhere in this phase.
          onSubscribe: () => toast.success({ title: 'Thanks for subscribing', description: 'This is a demo: no email was sent.' }),
        }}
        onNavigate={handleLink}
      />
    </div>
  )
}
