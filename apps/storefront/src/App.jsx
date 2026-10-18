import { Route, Routes } from 'react-router-dom'
import { infoPages } from './data/infoPages.js'
import StoreLayout from './layout/StoreLayout.jsx'
import AccountPage from './pages/AccountPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import HomePage from './pages/HomePage.jsx'
import InfoPage from './pages/InfoPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import { patterns } from './routing/paths.js'

// The route table. To add a page: create it in src/pages, add its path to src/routing/paths.js, and add one line here.
// Every route renders inside <StoreLayout> (navbar, footer, <main>).
export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path={patterns.home} element={<HomePage />} />
        <Route path={patterns.shop} element={<ShopPage />} />
        <Route path={patterns.category} element={<ShopPage />} />
        <Route path={patterns.product} element={<ProductPage />} />
        <Route path={patterns.search} element={<SearchPage />} />
        <Route path={patterns.cart} element={<CartPage />} />
        <Route path={patterns.wishlist} element={<WishlistPage />} />
        <Route path={patterns.checkout} element={<CheckoutPage />} />
        <Route path={patterns.account} element={<AccountPage />} />
        {infoPages.map((page) => (
          <Route key={page.id} path={page.path} element={<InfoPage id={page.id} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
