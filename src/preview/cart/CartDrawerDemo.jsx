import { useRef, useState } from 'react'
import { Button, CartDrawer, ConfirmDialog } from '../../library/index.js'
import { sampleCartIssues, sampleCartItems } from './sampleCart.js'
import { useCartFlow } from './useCartFlow.js'

/** Free-shipping hint shown in the drawer's `children` slot (the rule itself lives in cartState.js). */
export function ShippingNotice({ remaining }) {
  if (remaining <= 0) return <p className="rounded-control bg-success-soft px-3 py-2 text-sm text-success-soft-foreground">You have free shipping.</p>
  return <p className="rounded-control bg-surface-muted px-3 py-2 text-sm">Add ${remaining.toFixed(2)} more for free shipping.</p>
}

/**
 * The cart drawer wired to sample state: removing a line asks for confirmation (a second dialog
 * above the drawer), then shows an Undo toast. Variants: right, left, with-issues, empty, loading.
 */
export default function CartDrawerDemo({ variant }) {
  const initial = variant === 'empty' || variant === 'loading' ? [] : variant === 'with-issues' ? sampleCartIssues : sampleCartItems
  const flow = useCartFlow(initial)
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button ref={triggerRef} onClick={() => setOpen(true)}>
          Open cart ({flow.summary.itemCount})
        </Button>
        <p className="text-sm text-foreground-muted">
          {variant === 'with-issues'
            ? 'Includes an unavailable line and one over the stock limit, so checkout is disabled.'
            : 'Change quantities, remove a line (confirm, then Undo), press Escape or click the backdrop.'}
        </p>
      </div>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        placement={variant === 'left' ? 'left' : 'right'}
        items={flow.items}
        loading={variant === 'loading'}
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
