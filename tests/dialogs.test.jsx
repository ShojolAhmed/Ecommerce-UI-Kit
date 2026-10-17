import { describe, expect, it, vi } from 'vitest'
import { useRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog, CartDrawer } from '../src/library/index.js'

const dialogProps = { title: 'Remove item?', description: 'It will leave your cart.', confirmLabel: 'Remove', cancelLabel: 'Keep' }

describe('ConfirmDialog', () => {
  it('renders nothing while closed', () => {
    render(<ConfirmDialog open={false} onConfirm={() => {}} onCancel={() => {}} {...dialogProps} />)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('is named by its title and described by its description', () => {
    render(<ConfirmDialog open onConfirm={() => {}} onCancel={() => {}} {...dialogProps} />)
    const dialog = screen.getByRole('alertdialog', { name: 'Remove item?' })
    const describedBy = dialog.getAttribute('aria-describedby')
    expect(document.getElementById(describedBy).textContent).toBe('It will leave your cart.')
  })

  it('puts a danger dialog on Cancel and a default dialog on Confirm', () => {
    const { rerender } = render(<ConfirmDialog open tone="danger" onConfirm={() => {}} onCancel={() => {}} {...dialogProps} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Keep' }))
    rerender(<ConfirmDialog open={false} onConfirm={() => {}} onCancel={() => {}} {...dialogProps} />)
    rerender(<ConfirmDialog open onConfirm={() => {}} onCancel={() => {}} {...dialogProps} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Remove' }))
  })

  it('cancels on Escape and on a backdrop click, confirms on the button', async () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    const { container } = render(<ConfirmDialog open onConfirm={onConfirm} onCancel={onCancel} {...dialogProps} />)
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
    await userEvent.click(document.querySelector('[aria-hidden="true"].absolute'))
    expect(onCancel).toHaveBeenCalledTimes(2)
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(container).toBeDefined()
  })

  it('cannot be dismissed while loading', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog open loading onConfirm={() => {}} onCancel={onCancel} {...dialogProps} />)
    await userEvent.keyboard('{Escape}')
    await userEvent.click(document.querySelector('[aria-hidden="true"].absolute'))
    expect(onCancel).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Keep' }).disabled).toBe(true)
    expect(screen.getByRole('alertdialog').getAttribute('aria-busy')).toBe('true')
  })

  it('traps Tab inside, locks page scroll and restores both on close, returning focus to the trigger', async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      const triggerRef = useRef(null)
      return (
        <>
          <button ref={triggerRef} onClick={() => setOpen(true)}>Open</button>
          <ConfirmDialog open={open} onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} triggerRef={triggerRef} {...dialogProps} />
        </>
      )
    }
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)
    expect(document.body.style.overflow).toBe('hidden')
    const keep = screen.getByRole('button', { name: 'Keep' })
    const remove = screen.getByRole('button', { name: 'Remove' })
    for (let i = 0; i < 6; i += 1) {
      await userEvent.tab()
      expect([keep, remove, screen.getByRole('alertdialog')]).toContain(document.activeElement)
    }
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })
})

describe('stacked dialogs', () => {
  it('Escape closes only the dialog on top (a confirmation over the cart drawer)', async () => {
    const onClose = vi.fn()
    const onCancel = vi.fn()
    render(
      <>
        <CartDrawer open onClose={onClose} items={[{ id: 1, name: 'Sweater', price: 10, quantity: 1 }]} />
        <ConfirmDialog open onConfirm={() => {}} onCancel={onCancel} {...dialogProps} />
      </>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })
})
