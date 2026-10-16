import {
  productCardVariants,
  navbarVariants,
  footerVariants,
  sidebarVariants,
  Button,
  buttonVariants,
  IconButton,
  Badge,
  badgeVariants,
  Input,
  Spinner,
  Container,
  containerSizes,
} from '../library/index.js'
import NavbarDemo from './navbar/NavbarDemo.jsx'
import ProductCardDemo from './product/ProductCardDemo.jsx'
import ProductGridDemo from './product/ProductGridDemo.jsx'
import SidebarDemo from './discovery/SidebarDemo.jsx'
import DrawerDemo from './discovery/DrawerDemo.jsx'
import DiscoveryDemo from './discovery/DiscoveryDemo.jsx'
import {
  ActiveFiltersDemo,
  BreadcrumbsDemo,
  SearchInputDemo,
  SortDropdownDemo,
} from './discovery/ControlsDemos.jsx'
import {
  AnnouncementBarDemo,
  CategoryGridDemo,
  FaqDemo,
  FeaturedProductsDemo,
  FooterDemo,
  HeroBannerDemo,
  NewsletterSignupDemo,
  PromoBannerDemo,
  TestimonialsDemo,
} from './home/SectionDemos.jsx'
import {
  AccordionDemo,
  CartItemRowDemo,
  CartSummaryDemo,
  ConfirmDialogDemo,
  EmptyCartDemo,
  QuantitySelectorDemo,
  TabsDemo,
  ToastDemo,
} from './cart/ComponentDemos.jsx'
import CartDrawerDemo from './cart/CartDrawerDemo.jsx'
import CartExperienceDemo from './cart/CartExperienceDemo.jsx'
import TokenShowcase from './foundation/TokenShowcase.jsx'
import Row from './foundation/Row.jsx'
import { tokenSections } from './foundation/tokenSections.js'
import { CartIcon, HeartIcon, ArrowRightIcon } from './foundation/icons.jsx'

/**
 * Preview registry: one entry per component family.
 * Add a family here and it appears on the preview page automatically.
 * Each entry lists its variants and how to render one.
 */

export const families = [
  {
    id: 'design-tokens',
    name: 'Design Tokens',
    variants: tokenSections,
    render: (section) => <TokenShowcase section={section} />,
  },
  {
    id: 'button',
    name: 'Button',
    variants: Object.keys(buttonVariants),
    render: (variant) => (
      <div className="space-y-4">
        <Row>
          <Button variant={variant} size="sm">Small</Button>
          <Button variant={variant}>Medium</Button>
          <Button variant={variant} size="lg">Large</Button>
          <Button variant={variant} shape="pill">Pill</Button>
        </Row>
        <Row>
          <Button variant={variant} leadingIcon={<CartIcon />}>Add to cart</Button>
          <Button variant={variant} trailingIcon={<ArrowRightIcon />}>Checkout</Button>
          <Button variant={variant} disabled>Disabled</Button>
          <Button variant={variant} loading>Loading</Button>
          <Button variant={variant} as="a" href="#button">As link</Button>
        </Row>
      </div>
    ),
  },
  {
    id: 'icon-button',
    name: 'Icon Button',
    variants: Object.keys(buttonVariants),
    render: (variant) => (
      <Row>
        <IconButton label="Add to wishlist" variant={variant} size="sm"><HeartIcon /></IconButton>
        <IconButton label="Add to wishlist" variant={variant}><HeartIcon /></IconButton>
        <IconButton label="Add to wishlist" variant={variant} size="lg"><HeartIcon /></IconButton>
        <IconButton label="Add to wishlist" variant={variant} shape="pill"><HeartIcon /></IconButton>
        <IconButton label="Add to wishlist" variant={variant} disabled><HeartIcon /></IconButton>
        <IconButton label="Adding to wishlist" variant={variant} loading><HeartIcon /></IconButton>
      </Row>
    ),
  },
  {
    id: 'badge',
    name: 'Badge',
    variants: Object.keys(badgeVariants),
    render: (variant) => (
      <Row>
        <Badge variant={variant}>New</Badge>
        <Badge variant={variant} size="md">In stock</Badge>
        <Badge variant={variant}>-20%</Badge>
      </Row>
    ),
  },
  {
    id: 'input',
    name: 'Input',
    variants: ['default', 'with-hint', 'required', 'invalid', 'disabled', 'sizes'],
    render: (state) => {
      const field = {
        default: <Input label="Email" type="email" placeholder="you@example.com" />,
        'with-hint': <Input label="Coupon code" hint="Codes are case-insensitive." />,
        required: <Input label="Full name" required autoComplete="name" />,
        invalid: (
          <Input label="Email" type="email" defaultValue="not-an-email" error="Enter a valid email address." />
        ),
        disabled: <Input label="Country" defaultValue="Bangladesh" disabled />,
        sizes: (
          <div className="space-y-3">
            <Input aria-label="Small" size="sm" placeholder="Small" />
            <Input aria-label="Medium" placeholder="Medium" />
            <Input aria-label="Large" size="lg" placeholder="Large" />
          </div>
        ),
      }[state]
      return <div className="max-w-sm">{field}</div>
    },
  },
  {
    id: 'spinner',
    name: 'Spinner',
    variants: ['sm', 'md', 'lg'],
    render: (size) => (
      <Row>
        <Spinner size={size} />
        <span className="text-primary"><Spinner size={size} label="Loading cart" /></span>
        <span className="text-danger"><Spinner size={size} label="Retrying" /></span>
      </Row>
    ),
  },
  {
    id: 'container',
    name: 'Container',
    variants: Object.keys(containerSizes),
    render: (size) => (
      <div className="rounded-md bg-surface-sunken py-2">
        <Container size={size}>
          <div className="rounded-md border border-dashed border-border-strong bg-surface p-3 text-center font-mono text-xs">
            size=&quot;{size}&quot;
          </div>
        </Container>
      </div>
    ),
  },
  {
    id: 'navbar',
    name: 'Navbar',
    variants: Object.keys(navbarVariants),
    render: (variant) => <NavbarDemo variant={variant} />,
  },
  {
    id: 'product-card',
    name: 'Product Card',
    variants: Object.keys(productCardVariants),
    render: (variant) => <ProductCardDemo variant={variant} />,
  },
  {
    id: 'product-grid',
    name: 'Product Grid',
    variants: ['interactive', 'empty'],
    render: (mode) => <ProductGridDemo mode={mode} />,
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    variants: Object.keys(sidebarVariants),
    render: (variant) => <SidebarDemo variant={variant} />,
  },
  {
    id: 'filter-drawer',
    name: 'Filter Drawer',
    variants: ['bottom', 'left', 'right'],
    render: (placement) => <DrawerDemo placement={placement} />,
  },
  {
    id: 'search-input',
    name: 'Search Input',
    variants: ['default', 'pill', 'sizes'],
    render: (mode) => <SearchInputDemo mode={mode} />,
  },
  {
    id: 'sort-dropdown',
    name: 'Sort Dropdown',
    variants: ['menu', 'native'],
    render: (mode) => <SortDropdownDemo mode={mode} />,
  },
  {
    id: 'breadcrumbs',
    name: 'Breadcrumbs',
    variants: ['default', 'collapsed', 'custom-separator'],
    render: (mode) => <BreadcrumbsDemo mode={mode} />,
  },
  {
    id: 'active-filters',
    name: 'Active Filters',
    variants: ['filters', 'with-search'],
    render: (mode) => <ActiveFiltersDemo mode={mode} />,
  },
  {
    id: 'product-discovery',
    name: 'Product Discovery (all together)',
    variants: ['together'],
    render: () => <DiscoveryDemo />,
  },
  {
    id: 'footer',
    name: 'Footer',
    variants: Object.keys(footerVariants),
    render: (variant) => <FooterDemo variant={variant} />,
  },
  {
    id: 'announcement-bar',
    name: 'Announcement Bar',
    variants: ['static', 'rotating', 'dismissible', 'tones'],
    render: (mode) => <AnnouncementBarDemo mode={mode} />,
  },
  {
    id: 'hero-banner',
    name: 'Hero Banner',
    variants: ['split', 'split-image-start', 'overlay', 'overlay-centered'],
    render: (mode) => <HeroBannerDemo mode={mode} />,
  },
  {
    id: 'featured-category-grid',
    name: 'Featured Category Grid',
    variants: ['grid', 'mosaic', 'three-columns'],
    render: (mode) => <CategoryGridDemo mode={mode} />,
  },
  {
    id: 'featured-products',
    name: 'Featured Products',
    variants: ['grid', 'grid-sale', 'carousel', 'carousel-overlay'],
    render: (mode) => <FeaturedProductsDemo mode={mode} />,
  },
  {
    id: 'promo-banner',
    name: 'Promo Banner',
    variants: ['split', 'split-image-start', 'strip', 'dark-strip', 'accent', 'no-code'],
    render: (mode) => <PromoBannerDemo mode={mode} />,
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    variants: ['grid', 'slider'],
    render: (mode) => <TestimonialsDemo mode={mode} />,
  },
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion',
    variants: ['stacked', 'split', 'allow-multiple'],
    render: (mode) => <FaqDemo mode={mode} />,
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup',
    variants: ['centered', 'split', 'split-image', 'dark', 'with-consent'],
    render: (mode) => <NewsletterSignupDemo mode={mode} />,
  },
  {
    id: 'quantity-selector',
    name: 'Quantity Selector',
    variants: ['default', 'with-limit', 'disabled', 'sizes'],
    render: (mode) => <QuantitySelectorDemo mode={mode} />,
  },
  {
    id: 'cart-item-row',
    name: 'Cart Item Row',
    variants: ['default', 'limits', 'unavailable', 'compact', 'read-only', 'pending', 'disabled'],
    render: (mode) => <CartItemRowDemo mode={mode} />,
  },
  {
    id: 'cart-summary',
    name: 'Cart Summary',
    variants: ['default', 'with-discount', 'calculated-later', 'checkout-disabled', 'loading'],
    render: (mode) => <CartSummaryDemo mode={mode} />,
  },
  {
    id: 'empty-cart-state',
    name: 'Empty Cart State',
    variants: ['page', 'compact', 'two-actions'],
    render: (mode) => <EmptyCartDemo mode={mode} />,
  },
  {
    id: 'cart-drawer',
    name: 'Cart Drawer',
    variants: ['right', 'left', 'with-issues', 'empty', 'loading'],
    render: (variant) => <CartDrawerDemo variant={variant} />,
  },
  {
    id: 'confirm-dialog',
    name: 'Confirm Dialog',
    variants: ['default', 'danger', 'loading'],
    render: (mode) => <ConfirmDialogDemo mode={mode} />,
  },
  {
    id: 'toast',
    name: 'Toast Notifications',
    variants: ['tones', 'with-action', 'sticky'],
    render: (mode) => <ToastDemo mode={mode} />,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    variants: ['underline', 'pills', 'vertical', 'manual', 'full-width', 'scrolling'],
    render: (mode) => <TabsDemo mode={mode} />,
  },
  {
    id: 'accordion',
    name: 'Accordion',
    variants: ['divided', 'boxed', 'allow-multiple', 'always-one-open', 'small'],
    render: (mode) => <AccordionDemo mode={mode} />,
  },
  {
    id: 'cart-experience',
    name: 'Cart Experience (all together)',
    variants: ['drawer-flow', 'cart-page'],
    render: (mode) => <CartExperienceDemo mode={mode} />,
  },
]
