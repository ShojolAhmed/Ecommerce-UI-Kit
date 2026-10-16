import { useRef, useState } from 'react'
import {
  CartDrawer,
  CartItemRow,
  CartSummary,
  ConfirmDialog,
  EmptyCartState,
  Navbar,
  ProductGrid,
  Tabs,
  Accordion,
  useToast,
} from '../../library/index.js'
import { sampleNavbar, sampleProducts } from '../sampleData.js'
import { sampleCartItems } from './sampleCart.js'
import { useCartFlow } from './useCartFlow.js'
import { ShippingNotice } from './CartDrawerDemo.jsx'

const policyItems = [
  { id: 'returns', title: 'Free returns within 30 days', content: 'Unworn items in their original packaging can be returned for a full refund.' },
  { id: 'delivery', title: 'Delivery', content: 'Orders over $100 ship free. Standard delivery takes 3 to 5 working days.' },
]

/** Full cart page: lines on the left, summary on the right (stacked on small screens). */
function CartPage({ flow }) {
  const { items } = flow
  return (
    <div className="p-4 sm:p-6">
      <h3 className="mb-4 text-2xl font-bold">Shopping cart</h3>
      {items.length === 0 ? (
        <div className="rounded-surface border border-border bg-surface">
          <EmptyCartState headingLevel={4} action={{ label: 'Continue shopping', href: '#shop' }} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="space-y-6">
            <ul aria-label="Cart items" className="divide-y divide-border rounded-surface border border-border bg-surface px-4">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} {...flow.lineProps} />
              ))}
            </ul>
            <Tabs
              label="Order information"
              items={[
                { id: 'policies', label: 'Policies', content: <Accordion items={policyItems} headingLevel={4} variant="boxed" size="sm" /> },
                { id: 'help', label: 'Need help?', content: <p className="text-sm text-foreground-muted">Our team replies within one working day.</p> },
              ]}
            />
          </div>
          <CartSummary headingLevel={4} subtotal={flow.summary.subtotal} itemCount={flow.summary.itemCount} {...flow.summaryProps} />
        </div>
      )}
    </div>
  )
}

/**
 * Everything together: a Navbar whose cart button opens the drawer, products that add to the cart
 * (with a toast that can reopen it), removal confirmation with Undo, and the same cart on a page.
 * The frame uses `transform` so the navbar's own fixed layers stay inside it; the cart drawer, the
 * dialog and the toasts render in <body>, like they would in a real page.
 */
export default function CartExperienceDemo({ mode }) {
  const flow = useCartFlow(sampleCartItems.slice(0, 2))
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  const openCart = () => setOpen(true)
  const addToCart = (product) => {
    flow.add(product)
    toast.show({
      id: `added-${product.id}`,
      tone: 'success',
      title: 'Added to cart',
      description: product.name,
      action: { label: 'View cart', onClick: openCart },
    })
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-surface border border-border">
        <div className="bg-background">
          {mode === 'drawer-flow' && (
            <>
              <Navbar
                variant="minimal"
                navLabel="Main (cart demo)"
                brand={sampleNavbar.brand}
                links={sampleNavbar.links.slice(0, 2)}
                onNavigate={(_item, event) => event.preventDefault()}
                cart={{ count: flow.summary.itemCount, onClick: openCart }}
              />
              <div className="p-4 sm:p-6">
                <ProductGrid
                  label="Products"
                  products={sampleProducts.slice(0, 4)}
                  variant="minimal"
                  columns={4}
                  onAddToCart={addToCart}
                  onProductClick={(_product, event) => event.preventDefault()}
                />
              </div>
            </>
          )}
          {mode === 'cart-page' && <CartPage flow={flow} />}
        </div>
      </div>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        items={flow.items}
        summary={flow.summaryProps}
        emptyAction={{ label: 'Continue shopping', onClick: () => setOpen(false) }}
        {...flow.lineProps}
      >
        <ShippingNotice remaining={flow.freeShippingRemaining} />
      </CartDrawer>
      <ConfirmDialog {...flow.confirmProps} />
    </div>
  )
}
