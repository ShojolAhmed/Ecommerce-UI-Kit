import {
  productCardVariants,
  navbarVariants,
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
]
