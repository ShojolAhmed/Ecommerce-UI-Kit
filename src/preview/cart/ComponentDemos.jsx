import { useState } from 'react'
import {
  Accordion,
  Button,
  CartItemRow,
  CartSummary,
  ConfirmDialog,
  EmptyCartState,
  QuantitySelector,
  Tabs,
  useToast,
} from '../../library/index.js'
import { sampleCartIssues, sampleCartItems } from './sampleCart.js'
import { useCartDemo } from './cartState.js'
import EventLog from '../discovery/EventLog.jsx'
import Row from '../foundation/Row.jsx'

/* ------------------------------------------------------------------ */
/* Quantity selector                                                    */
/* ------------------------------------------------------------------ */

export function QuantitySelectorDemo({ mode }) {
  const [value, setValue] = useState(mode === 'with-limit' ? 4 : 1)
  const [log, setLog] = useState('Press the buttons, type a number, or use the arrow keys.')

  if (mode === 'sizes') {
    return (
      <Row>
        <QuantitySelector size="sm" label="Small" defaultValue={1} />
        <QuantitySelector size="md" label="Medium" defaultValue={2} />
        <QuantitySelector size="lg" label="Large" defaultValue={3} />
      </Row>
    )
  }

  if (mode === 'disabled') {
    return (
      <Row>
        <QuantitySelector label="Disabled" value={2} disabled />
        <QuantitySelector label="At minimum" value={1} min={1} max={5} onChange={setValue} />
        <QuantitySelector label="Sold out (min = max)" value={3} min={3} max={3} />
      </Row>
    )
  }

  const limited = mode === 'with-limit'
  return (
    <div className="space-y-3">
      <QuantitySelector
        label="Merino Crewneck Sweater"
        value={value}
        min={1}
        max={limited ? 5 : undefined}
        onChange={(next) => {
          setValue(next)
          setLog(`onChange: ${next}`)
        }}
        onLimitReached={(limit, limitValue) => setLog(`onLimitReached: ${limit} (${limitValue})`)}
      />
      <EventLog lastEvent={log} state={{ value, min: 1, max: limited ? 5 : null }} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cart item row                                                        */
/* ------------------------------------------------------------------ */

export function CartItemRowDemo({ mode }) {
  const initial = mode === 'unavailable' ? sampleCartIssues.slice(1) : mode === 'limits' ? [sampleCartItems[1], sampleCartItems[3]] : sampleCartItems.slice(0, 3)
  const cart = useCartDemo(initial)
  const [log, setLog] = useState('Change a quantity or remove a line.')

  const common = {
    onQuantityChange: (item, quantity) => {
      cart.setQuantity(item.id, quantity)
      setLog(`onQuantityChange: ${item.name} -> ${quantity}`)
    },
    onRemove: (item) => {
      cart.remove(item.id)
      setLog(`onRemove: ${item.name}`)
    },
    onLimitReached: (item, limit, value) => setLog(`onLimitReached: ${item.name} (${limit} ${value})`),
  }

  return (
    <div className="space-y-3">
      <ul className="divide-y divide-border rounded-surface border border-border bg-surface px-4">
        {cart.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            layout={mode === 'compact' ? 'compact' : 'comfortable'}
            readOnly={mode === 'read-only'}
            pending={mode === 'pending' && item.id === cart.items[0].id}
            disabled={mode === 'disabled'}
            {...(mode === 'read-only' ? {} : common)}
          />
        ))}
        {cart.items.length === 0 && <li className="py-6 text-center text-sm text-foreground-muted">All lines removed. Reload the page to reset.</li>}
      </ul>
      <EventLog lastEvent={log} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cart summary                                                         */
/* ------------------------------------------------------------------ */

export function CartSummaryDemo({ mode }) {
  const [log, setLog] = useState('Press Checkout to see the callback.')
  const base = { subtotal: 346, itemCount: 4, onCheckout: () => setLog('onCheckout()') }
  const variants = {
    default: { ...base, shipping: 0, tax: null },
    'with-discount': { ...base, shipping: 0, discount: 34.6, discountLabel: 'Code SPRING10', tax: 28.4 },
    'calculated-later': { ...base, shipping: null, tax: null },
    'checkout-disabled': {
      ...base,
      shipping: 8,
      checkoutDisabled: true,
      checkoutDisabledReason: 'Remove the unavailable item to check out.',
    },
    loading: { ...base, shipping: 8, checkoutLoading: true },
  }
  return (
    <div className="max-w-sm space-y-3">
      <CartSummary
        {...variants[mode]}
        headingLevel={3}
        secondaryAction={{ label: 'Continue shopping', onClick: () => setLog('Continue shopping') }}
        note={mode === 'default' ? 'Taxes are calculated when you enter your address.' : undefined}
      />
      <EventLog lastEvent={log} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Empty cart                                                           */
/* ------------------------------------------------------------------ */

export function EmptyCartDemo({ mode }) {
  const [log, setLog] = useState('Press a button to see the callback.')
  const size = mode === 'compact' ? 'sm' : 'md'
  return (
    <div className="space-y-3">
      <div className={`rounded-surface border border-border bg-surface ${size === 'sm' ? 'max-w-sm' : ''}`}>
        <EmptyCartState
          size={size}
          headingLevel={3}
          action={{ label: 'Continue shopping', onClick: () => setLog('Continue shopping') }}
          secondaryAction={mode === 'two-actions' ? { label: 'View wishlist', onClick: () => setLog('View wishlist') } : undefined}
        />
      </div>
      <EventLog lastEvent={log} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Confirmation dialog                                                  */
/* ------------------------------------------------------------------ */

export function ConfirmDialogDemo({ mode }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState('Open the dialog, then try Escape, Tab and the backdrop.')
  const danger = mode !== 'default'

  const confirm = () => {
    if (mode === 'loading') {
      setBusy(true)
      setLog('onConfirm: working (the dialog cannot be dismissed meanwhile)…')
      setTimeout(() => {
        setBusy(false)
        setOpen(false)
        setLog('onConfirm: done')
      }, 1500)
    } else {
      setOpen(false)
      setLog('onConfirm')
    }
  }

  return (
    <div className="space-y-3">
      <Button variant={danger ? 'danger' : 'primary'} onClick={() => setOpen(true)}>
        {mode === 'default' ? 'Apply code' : 'Clear cart'}
      </Button>
      <ConfirmDialog
        open={open}
        tone={danger ? 'danger' : 'default'}
        title={mode === 'default' ? 'Apply code SPRING10?' : 'Clear your cart?'}
        description={
          mode === 'default'
            ? 'This takes 10% off eligible items. You can remove the code at any time.'
            : 'All 4 items will be removed from your cart. This cannot be undone.'
        }
        confirmLabel={mode === 'default' ? 'Apply' : 'Clear cart'}
        loading={busy}
        onConfirm={confirm}
        onCancel={() => {
          setOpen(false)
          setLog('onCancel')
        }}
      />
      <EventLog lastEvent={log} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Toasts                                                               */
/* ------------------------------------------------------------------ */

export function ToastDemo({ mode }) {
  const toast = useToast()
  const [log, setLog] = useState('Toasts appear in the bottom-right corner (or the full width on phones).')

  const buttons = {
    tones: [
      ['Info', () => toast.info({ title: 'Free shipping over $100', description: 'Add one more item to qualify.' })],
      ['Success', () => toast.success({ title: 'Added to cart', description: 'Merino Crewneck Sweater' })],
      ['Warning', () => toast.warning({ title: 'Only 2 left in stock' })],
      ['Error', () => toast.error({ title: 'Could not update your cart', description: 'Check your connection and try again.' })],
    ],
    'with-action': [
      [
        'Removed (with Undo)',
        () =>
          toast.show({
            tone: 'success',
            title: 'Removed from cart',
            description: 'Cashmere Scarf',
            action: { label: 'Undo', onClick: () => setLog('Undo pressed') },
          }),
      ],
    ],
    sticky: [
      ['Stays until dismissed', () => toast.show({ tone: 'warning', title: 'Your cart expires soon', duration: 0 })],
      ['Same id (updates in place)', () => toast.show({ id: 'demo-count', tone: 'info', title: `Updated at ${new Date().toLocaleTimeString()}` })],
      ['Clear all', () => toast.clear()],
    ],
  }[mode]

  return (
    <div className="space-y-3">
      <Row>
        {buttons.map(([label, onClick]) => (
          <Button key={label} variant="outline" onClick={onClick}>
            {label}
          </Button>
        ))}
      </Row>
      <p className="text-sm text-foreground-muted">
        Toasts pause while hovered or focused. Warnings and errors are announced assertively, the others politely.
      </p>
      <EventLog lastEvent={log} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tabs and accordion                                                   */
/* ------------------------------------------------------------------ */

const productTabs = [
  { id: 'details', label: 'Details', content: <p className="text-sm text-foreground-muted">Midweight, ethically sourced merino in a relaxed fit. Machine washable and naturally odor-resistant.</p> },
  { id: 'shipping', label: 'Shipping', content: <p className="text-sm text-foreground-muted">Free standard delivery over $100, usually within 3 to 5 working days.</p> },
  { id: 'reviews', label: 'Reviews', badge: 312, content: <p className="text-sm text-foreground-muted">4.7 out of 5 from 312 reviews.</p> },
  { id: 'returns', label: 'Returns', disabled: true, content: <p>Not shown: this tab is disabled.</p> },
]

export function TabsDemo({ mode }) {
  const [log, setLog] = useState('Use the arrow keys, Home and End on the tabs.')
  const [value, setValue] = useState('details')
  const many = Array.from({ length: 12 }, (_, index) => ({
    id: `t${index}`,
    label: `Category ${index + 1}`,
    content: <p className="text-sm text-foreground-muted">Panel {index + 1}. The tab row scrolls sideways on narrow screens.</p>,
  }))

  const props = {
    underline: { items: productTabs },
    pills: { items: productTabs, variant: 'pills' },
    vertical: { items: productTabs, orientation: 'vertical' },
    manual: { items: productTabs, activation: 'manual' },
    'full-width': { items: productTabs, fullWidth: true },
    scrolling: { items: many },
  }[mode]

  return (
    <div className="space-y-3">
      <Tabs
        label={`Product information (${mode})`}
        {...props}
        value={value}
        onChange={(id) => {
          setValue(id)
          setLog(`onChange: ${id}`)
        }}
      />
      <EventLog lastEvent={log} />
    </div>
  )
}

const accordionItems = [
  { id: 'care', title: 'Care instructions', content: 'Machine wash cold on a wool cycle. Dry flat. Do not tumble dry.' },
  { id: 'delivery', title: 'Delivery and returns', content: 'Free delivery over $100. Returns are free within 30 days of delivery.' },
  { id: 'materials', title: 'Materials', content: '100% extra-fine merino wool from certified farms.' },
  { id: 'warranty', title: 'Warranty (unavailable)', disabled: true, content: 'Not shown.' },
]

export function AccordionDemo({ mode }) {
  const [log, setLog] = useState('Use Arrow Up / Down, Home and End on the headings.')
  return (
    <div className="max-w-2xl space-y-3">
      <Accordion
        items={accordionItems}
        variant={mode === 'boxed' ? 'boxed' : 'divided'}
        size={mode === 'small' ? 'sm' : 'md'}
        allowMultiple={mode === 'allow-multiple'}
        collapsible={mode !== 'always-one-open'}
        defaultOpenIds={['care']}
        headingLevel={3}
        onOpenChange={(ids) => setLog(`onOpenChange: ${ids.length ? ids.join(', ') : 'none'}`)}
      />
      <EventLog lastEvent={log} />
    </div>
  )
}
