import {
  CartDrawer,
  CartItemRow,
  CartSummary,
  ConfirmDialog,
  EmptyCartState,
  QuantitySelector,
  Toast,
} from '../../../library/index.js'
import { sampleCartIssues, sampleCartItems } from '../../data/index.js'
import { defineFamily } from '../define.js'
import { fn, node, setter, state, update } from '../markers.js'
import { BorderedStage, CartDrawerStage, ConfirmDialogStage, ListStage } from '../stages.jsx'

const CATEGORY = 'shopping'

export const quantitySelector = defineFamily({
  id: 'quantity-selector',
  name: 'Quantity Selector',
  category: CATEGORY,
  summary: 'Stepper with a typeable number. Controlled (value / onChange) or uncontrolled (defaultValue); always reports a whole number inside [min, max].',
  component: QuantitySelector,
  importName: 'QuantitySelector',
  source: 'src/library/components/QuantitySelector',
  baseProps: { label: 'Merino Crewneck Sweater', value: state('quantity', 1), min: 1, onChange: setter('quantity'), onLimitReached: fn('handleLimitReached') },
  variants: [
    { id: 'default', label: 'Default', description: 'No maximum.' },
    { id: 'with-limit', label: 'With limit', description: 'max={5}. Typing past it or stepping at the limit calls onLimitReached.', props: { value: state('quantity', 4), max: 5 } },
    { id: 'small', label: 'Small', description: 'size="sm".', props: { size: 'sm' } },
    { id: 'large', label: 'Large', description: 'size="lg".', props: { size: 'lg' } },
    { id: 'disabled', label: 'Disabled', description: 'Disables the buttons and the field.', props: { value: 2, disabled: true, onChange: undefined } },
  ],
  frame: { desktop: 220, mobile: 220 },
  docs: { sections: [{ title: 'Props', file: 'components/QuantitySelector/QuantitySelector.jsx' }] },
})

const rowHandlers = {
  item: state('item', sampleCartItems[0]),
  onQuantityChange: update('item', (item, _line, quantity) => ({ ...item, quantity }), 'handleQuantityChange'),
  onRemove: fn('handleRemove'),
  onLimitReached: fn('handleLimitReached'),
}

export const cartItemRow = defineFamily({
  id: 'cart-item-row',
  name: 'Cart Item Row',
  category: CATEGORY,
  summary: 'One cart line: image, name, options, price, stepper and remove. Presentational: your page owns the cart.',
  component: CartItemRow,
  importName: 'CartItemRow',
  source: 'src/library/components/CartItemRow',
  baseProps: rowHandlers,
  variants: [
    { id: 'default', label: 'Default', description: 'Stacked on phones, one row from sm.' },
    { id: 'limits', label: 'At the limit', description: 'Quantity equals maxQuantity: plus is disabled and a note shows.', props: { item: state('item', sampleCartItems[1]) } },
    { id: 'unavailable', label: 'Unavailable', description: 'inStock={false} locks the quantity; the line can still be removed.', props: { item: state('item', sampleCartIssues[1]) } },
    { id: 'compact', label: 'Compact', description: "layout=\"compact\": the narrow arrangement used in drawers.", props: { layout: 'compact' } },
    { id: 'read-only', label: 'Read-only', description: 'readOnly shows "Qty 1" for order review.', props: { readOnly: true } },
    { id: 'pending', label: 'Pending', description: 'A request is running: controls locked, row dimmed, aria-busy.', props: { pending: true } },
  ],
  Stage: ListStage,
  frame: { desktop: 260, mobile: 360 },
  docs: { sections: [{ title: 'Props', file: 'components/CartItemRow/CartItemRow.jsx' }], shapes: ['utils/cart.js'] },
})

const summaryBase = {
  subtotal: 346,
  itemCount: 4,
  headingLevel: 3,
  onCheckout: fn('handleCheckout'),
  secondaryAction: { label: 'Continue shopping', onClick: fn('handleContinue') },
}

export const cartSummary = defineFamily({
  id: 'cart-summary',
  name: 'Cart Summary',
  category: CATEGORY,
  summary: 'Order totals and the checkout button. You pass the amounts; it adds no rules of its own.',
  component: CartSummary,
  importName: 'CartSummary',
  source: 'src/library/components/CartSummary',
  baseProps: summaryBase,
  variants: [
    { id: 'default', label: 'Default', description: 'Free shipping, tax calculated later.', props: { shipping: 0, tax: null, note: 'Taxes are calculated when you enter your address.' } },
    { id: 'with-discount', label: 'With discount', description: 'discount shows as a negative amount.', props: { shipping: 0, discount: 34.6, discountLabel: 'Code SPRING10', tax: 28.4 } },
    { id: 'calculated-later', label: 'Calculated later', description: 'null reads "Calculated at checkout".', props: { shipping: null, tax: null } },
    { id: 'checkout-disabled', label: 'Checkout disabled', description: 'The reason is shown under the button and linked with aria-describedby.', props: { shipping: 8, checkoutDisabled: true, checkoutDisabledReason: 'Remove the unavailable item to check out.' } },
    { id: 'loading', label: 'Loading', description: 'checkoutLoading shows the busy state.', props: { shipping: 8, checkoutLoading: true } },
  ],
  frame: { desktop: 520, mobile: 560, stageClassName: 'max-w-sm' },
  docs: { sections: [{ title: 'Props', file: 'components/CartSummary/CartSummary.jsx' }] },
})

export const emptyCartState = defineFamily({
  id: 'empty-cart-state',
  name: 'Empty Cart State',
  category: CATEGORY,
  summary: 'What to show when the cart is empty, as a page or inside a drawer.',
  component: EmptyCartState,
  importName: 'EmptyCartState',
  source: 'src/library/components/EmptyCartState',
  baseProps: { headingLevel: 3, action: { label: 'Continue shopping', onClick: fn('handleContinue') } },
  variants: [
    { id: 'page', label: 'Page', description: 'size="md" for a cart page.', props: { size: 'md' } },
    { id: 'compact', label: 'Compact', description: 'size="sm" for a drawer.', props: { size: 'sm' } },
    { id: 'two-actions', label: 'Two actions', description: 'secondaryAction adds a second button.', props: { size: 'md', secondaryAction: { label: 'View wishlist', onClick: fn('handleWishlist') } } },
  ],
  Stage: BorderedStage,
  frame: { desktop: 420, mobile: 460 },
  docs: { sections: [{ title: 'Props', file: 'components/EmptyCartState/EmptyCartState.jsx' }], shapes: ['components/shared/types.js'] },
})

const drawerBase = {
  open: state('open', true),
  onClose: setter('open', { to: false }),
  triggerRef: node('triggerRef', undefined),
  onQuantityChange: update('items', (items, item, quantity) => items.map((line) => (line.id === item.id ? { ...line, quantity } : line)), 'handleQuantityChange'),
  onRemove: update('items', (items, item) => items.filter((line) => line.id !== item.id), 'handleRemove'),
  onLimitReached: fn('handleLimitReached'),
  summary: { shipping: 0, tax: null, onCheckout: fn('handleCheckout') },
  emptyAction: { label: 'Continue shopping', onClick: setter('open', { to: false }) },
}

export const cartDrawer = defineFamily({
  id: 'cart-drawer',
  name: 'Cart Drawer',
  category: CATEGORY,
  summary: 'Slide-out cart: a modal drawer composing CartItemRow, CartSummary and EmptyCartState. Fully controlled. Starts open here; close it, then use Open cart.',
  component: CartDrawer,
  importName: 'CartDrawer',
  reactImports: ['useRef'],
  source: 'src/library/components/CartDrawer',
  baseProps: drawerBase,
  variants: [
    { id: 'right', label: 'Right', description: 'placement="right" (default). Quantity and remove work on the sample lines.', props: { items: state('items', sampleCartItems.slice(0, 3)), placement: 'right' } },
    { id: 'left', label: 'Left', description: 'placement="left".', props: { items: state('items', sampleCartItems.slice(0, 3)), placement: 'left' } },
    { id: 'with-issues', label: 'With issues', description: 'An unavailable line and a quantity above stock; the summary can block checkout.', props: { items: state('items', sampleCartIssues), summary: { shipping: 8, checkoutDisabled: true, checkoutDisabledReason: 'Fix the highlighted items to check out.', onCheckout: fn('handleCheckout') } } },
    { id: 'empty', label: 'Empty', description: 'No items: the built-in empty state.', props: { items: [] } },
    { id: 'loading', label: 'Loading', description: 'Empty cart that is still loading: a spinner.', props: { items: [], loading: true } },
  ],
  Stage: CartDrawerStage,
  frame: { desktop: 680, mobile: 760 },
  docs: { sections: [{ title: 'Props', file: 'components/CartDrawer/CartDrawer.jsx' }], shapes: ['utils/cart.js'] },
})

export const confirmDialog = defineFamily({
  id: 'confirm-dialog',
  name: 'Confirm Dialog',
  category: CATEGORY,
  summary: 'An alertdialog for destructive or important choices. Starts open here; close it, then use Open dialog.',
  component: ConfirmDialog,
  importName: 'ConfirmDialog',
  reactImports: ['useRef'],
  source: 'src/library/components/ConfirmDialog',
  baseProps: {
    open: state('open', true),
    triggerRef: node('triggerRef', undefined),
    onConfirm: setter('open', { to: false }),
    onCancel: setter('open', { to: false }),
  },
  variants: [
    { id: 'default', label: 'Default', description: 'Neutral confirmation; focus starts on Confirm.', props: { title: 'Apply code SPRING10?', description: 'This takes 10% off eligible items. You can remove the code at any time.', confirmLabel: 'Apply' } },
    { id: 'danger', label: 'Danger', description: 'tone="danger"; focus starts on Cancel.', props: { tone: 'danger', title: 'Clear your cart?', description: 'All 4 items will be removed from your cart. This cannot be undone.', confirmLabel: 'Clear cart' } },
    { id: 'loading', label: 'Loading', description: 'loading blocks Cancel, Escape and the backdrop so a request cannot be abandoned. Use Reload preview to reset.', props: { tone: 'danger', title: 'Clear your cart?', description: 'Working…', confirmLabel: 'Clear cart', loading: true } },
  ],
  Stage: ConfirmDialogStage,
  frame: { desktop: 480, mobile: 560 },
  docs: { sections: [{ title: 'Props', file: 'components/ConfirmDialog/ConfirmDialog.jsx' }] },
})

const toastBase = { onDismiss: fn('handleDismiss') }

export const toast = defineFamily({
  id: 'toast',
  name: 'Toast',
  category: CATEGORY,
  summary: 'The toast card in each tone. In an app you rarely render it yourself: wrap the page in ToastProvider and call useToast().',
  component: Toast,
  importName: 'Toast',
  extraImports: ['ToastProvider', 'useToast'],
  source: 'src/library/components/Toast',
  baseProps: toastBase,
  variants: [
    { id: 'info', label: 'Info', description: 'Announced politely (role="status").', props: { tone: 'info', title: 'Free shipping over $100', description: 'Add one more item to qualify.' } },
    { id: 'success', label: 'Success', description: 'Announced politely.', props: { tone: 'success', title: 'Added to cart', description: 'Merino Crewneck Sweater' } },
    { id: 'warning', label: 'Warning', description: 'Announced assertively (role="alert").', props: { tone: 'warning', title: 'Only 2 left in stock' } },
    { id: 'error', label: 'Error', description: 'Announced assertively; stays twice as long by default.', props: { tone: 'error', title: 'Could not update your cart', description: 'Check your connection and try again.' } },
    { id: 'with-action', label: 'With action', description: 'One action button such as Undo; pressing it also dismisses.', props: { tone: 'success', title: 'Removed from cart', description: 'Cashmere Scarf', action: { label: 'Undo', onClick: fn('handleUndo') } } },
  ],
  frame: { desktop: 260, mobile: 300, stageClassName: 'max-w-md' },
  docs: {
    sections: [
      { title: 'Toast props', file: 'components/Toast/Toast.jsx' },
      { title: 'ToastProvider props', file: 'components/Toast/ToastProvider.jsx' },
    ],
  },
})
