import { describe, expect, it, vi } from 'vitest'
import { useRef, useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartDrawer, CartItemRow, getCartTotals } from '../src/library/index.js'

const items = [
  { id: 'a', name: 'Merino Sweater', price: 50, quantity: 2, maxQuantity: 3 },
  { id: 'b', name: 'Canvas Bag', price: 20, quantity: 1 },
]

describe('CartItemRow', () => {
  const renderRow = (props) => render(<ul><CartItemRow item={items[0]} {...props} /></ul>)

  it('reports the row item when removed and clamps quantity requests to the item limits', async () => {
    const onRemove = vi.fn()
    const onQuantityChange = vi.fn()
    const onLimitReached = vi.fn()
    renderRow({ onRemove, onQuantityChange, onLimitReached })
    await userEvent.click(screen.getByRole('button', { name: /Increase quantity/ })) // 2 -> 3 (the max)
    expect(onQuantityChange).toHaveBeenLastCalledWith(items[0], 3)
    await userEvent.click(screen.getByRole('button', { name: /Remove/ }))
    expect(onRemove).toHaveBeenCalledWith(items[0], expect.anything())
  })

  it('locks the controls when out of stock, disabled or pending', () => {
    for (const props of [{ disabled: true }, { pending: true }]) {
      const { unmount } = renderRow({ onRemove: () => {}, onQuantityChange: () => {}, ...props })
      expect(screen.getByRole('spinbutton').disabled).toBe(true)
      unmount()
    }
    render(<ul><CartItemRow item={{ ...items[0], inStock: false }} onQuantityChange={() => {}} /></ul>)
    expect(screen.getByRole('spinbutton').disabled).toBe(true)
  })

  it('readOnly drops the stepper and the remove button', () => {
    renderRow({ readOnly: true, onRemove: () => {}, onQuantityChange: () => {} })
    expect(screen.queryByRole('spinbutton')).toBeNull()
    expect(screen.queryByRole('button', { name: /Remove/ })).toBeNull()
  })
})

describe('CartDrawer', () => {
  it('shows the lines, the computed summary and reports checkout', async () => {
    const onCheckout = vi.fn()
    render(<CartDrawer open onClose={() => {}} items={items} summary={{ onCheckout }} />)
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Merino Sweater')).toBeTruthy()
    expect(within(dialog).getByText('Canvas Bag')).toBeTruthy()
    expect(getCartTotals({ items }).subtotal).toBe(120)
    expect(dialog.textContent).toContain('$120.00')
    await userEvent.click(within(dialog).getByRole('button', { name: /checkout/i }))
    expect(onCheckout).toHaveBeenCalled()
  })

  it('shows the empty state (and no checkout) when there are no items', () => {
    render(<CartDrawer open onClose={() => {}} items={[]} summary={{ onCheckout: () => {} }} />)
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).queryByRole('button', { name: /checkout/i })).toBeNull()
    expect(dialog.textContent.toLowerCase()).toContain('empty')
  })

  it('shows a busy state instead of the empty message while the cart is loading', () => {
    render(<CartDrawer open loading onClose={() => {}} items={[]} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent.toLowerCase()).not.toContain('empty')
    expect(dialog.querySelector('[aria-busy="true"], [role="status"]')).not.toBeNull()
  })

  it('skips invalid lines instead of crashing', () => {
    render(<CartDrawer open onClose={() => {}} items={[null, { id: 'x' }, { id: 'y', name: 'No price' }, items[1]]} />)
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(1)
    expect(within(dialog).getByText('Canvas Bag')).toBeTruthy()
  })

  it('closes on Escape and returns focus to the cart button', async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      const triggerRef = useRef(null)
      return (
        <>
          <button ref={triggerRef} onClick={() => setOpen(true)}>Cart</button>
          <CartDrawer open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} items={items} />
        </>
      )
    }
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Cart' })
    await userEvent.click(trigger)
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(document.body.style.overflow).toBe('hidden')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })

  it('does not lose focus to <body> when the focused line is removed', async () => {
    function Harness() {
      const [lines, setLines] = useState(items)
      return <CartDrawer open onClose={() => {}} items={lines} onRemove={(item) => setLines((all) => all.filter((l) => l.id !== item.id))} />
    }
    render(<Harness />)
    const remove = screen.getAllByRole('button', { name: /Remove/ })[0]
    await userEvent.click(remove)
    expect(screen.queryByText('Merino Sweater')).toBeNull()
    expect(document.activeElement).not.toBe(document.body)
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  })
})

describe('CartItemRow pending state', () => {
  it('locks the controls and marks the row busy without dimming its text (contrast)', () => {
    const { container } = render(<ul><CartItemRow item={items[0]} pending onQuantityChange={() => {}} onRemove={() => {}} /></ul>)
    const row = container.querySelector('[aria-busy="true"]')
    expect(row).not.toBeNull()
    expect(row.className).not.toMatch(/opacity-/)
    expect(screen.getByRole('spinbutton').disabled).toBe(true)
  })
})
