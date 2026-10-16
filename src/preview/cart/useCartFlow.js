import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '../../library/index.js'
import { getDemoSummary, useCartDemo } from './cartState.js'

/**
 * Preview-only wiring of one cart experience: a removal asks for confirmation, then shows an
 * "Undo" toast; quantity limits show a warning toast. The library components stay unaware of
 * any of this; they only receive items and callbacks.
 */
export function useCartFlow(initialItems) {
  const cart = useCartDemo(initialItems)
  const toast = useToast()
  const [toRemove, setToRemove] = useState(null) // { item, index } waiting for an answer
  const [removing, setRemoving] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const requestRemove = useCallback(
    (item) => setToRemove({ item, index: cart.items.findIndex((line) => line.id === item.id) }),
    [cart.items],
  )

  const confirmRemove = () => {
    const { item, index } = toRemove
    setRemoving(true)
    // Fake latency so the dialog's busy state is visible. A real store would await its API here.
    timer.current = setTimeout(() => {
      cart.remove(item.id)
      setToRemove(null)
      setRemoving(false)
      toast.show({
        id: `removed-${item.id}`,
        tone: 'success',
        title: 'Removed from cart',
        description: item.name,
        action: { label: 'Undo', onClick: () => cart.restore(item, index) },
      })
    }, 600)
  }

  const onLimitReached = useCallback(
    (item, limit, value) =>
      toast.warning({
        id: 'quantity-limit',
        title: limit === 'max' ? `Only ${value} available` : `Minimum quantity is ${value}`,
        description: item.name,
      }),
    [toast],
  )

  const summary = getDemoSummary(cart.items)
  const { freeShippingRemaining, ...summaryProps } = summary

  return {
    ...cart,
    summary,
    freeShippingRemaining,
    lineProps: {
      onQuantityChange: (item, quantity) => cart.setQuantity(item.id, quantity),
      onRemove: requestRemove,
      onLimitReached,
    },
    summaryProps: {
      ...summaryProps,
      onCheckout: () =>
        toast.info({ id: 'checkout', title: 'Checkout is not connected', description: 'This preview has no payment gateway or backend.' }),
    },
    confirmProps: {
      open: Boolean(toRemove),
      tone: 'danger',
      title: 'Remove this item?',
      description: toRemove ? `“${toRemove.item.name}” will be removed from your cart.` : undefined,
      confirmLabel: 'Remove',
      cancelLabel: 'Keep it',
      loading: removing,
      onCancel: () => setToRemove(null),
      onConfirm: confirmRemove,
    },
  }
}
