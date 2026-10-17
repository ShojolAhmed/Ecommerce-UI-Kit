import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuantitySelector } from '../src/library/index.js'

function Controlled(props) {
  const [value, setValue] = useState(props.initial ?? 2)
  return <QuantitySelector {...props} value={value} onChange={(next) => { setValue(next); props.onChange?.(next) }} />
}

describe('QuantitySelector', () => {
  it('steps with the buttons and reports the next value', async () => {
    const onChange = vi.fn()
    render(<Controlled label="Sweater" max={5} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Increase quantity: Sweater' }))
    expect(onChange).toHaveBeenLastCalledWith(3)
    await userEvent.click(screen.getByRole('button', { name: 'Decrease quantity: Sweater' }))
    expect(onChange).toHaveBeenLastCalledWith(2)
  })

  it('disables minus at min and plus at max, and keeps focus in the control', async () => {
    render(<Controlled initial={4} min={1} max={5} label="Sweater" />)
    const plus = screen.getByRole('button', { name: /Increase/ })
    await userEvent.click(plus)
    expect(plus.disabled).toBe(true)
    expect(document.activeElement).toBe(screen.getByRole('spinbutton'))
    expect(screen.getByRole('status').textContent).toContain('Maximum of 5 reached')
  })

  it('clamps typed values, commits on Enter and tells the page a limit was hit', async () => {
    const onChange = vi.fn()
    const onLimitReached = vi.fn()
    render(<Controlled max={5} onChange={onChange} onLimitReached={onLimitReached} />)
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '99{Enter}')
    expect(onChange).toHaveBeenLastCalledWith(5)
    expect(onLimitReached).toHaveBeenCalledWith('max', 5)
    expect(input.value).toBe('5')
  })

  it('ignores non-digits and discards an edit on Escape', async () => {
    render(<Controlled initial={3} max={9} />)
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, 'a7b')
    expect(input.value).toBe('7')
    await userEvent.keyboard('{Escape}')
    expect(input.value).toBe('3')
  })

  it('an emptied field falls back to the previous value on blur instead of becoming 0', async () => {
    const onChange = vi.fn()
    render(<Controlled initial={3} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.tab()
    expect(onChange).not.toHaveBeenCalled()
    expect(input.value).toBe('3')
  })

  it('supports arrow keys, Home and End', async () => {
    render(<Controlled initial={2} min={1} max={6} />)
    const input = screen.getByRole('spinbutton')
    input.focus()
    await userEvent.keyboard('{ArrowUp}')
    expect(input.value).toBe('3')
    await userEvent.keyboard('{End}')
    expect(input.value).toBe('6')
    await userEvent.keyboard('{Home}')
    expect(input.value).toBe('1')
  })

  it('is fully inert when disabled', async () => {
    const onChange = vi.fn()
    render(<QuantitySelector value={2} onChange={onChange} disabled />)
    expect(screen.getByRole('spinbutton').disabled).toBe(true)
    for (const button of screen.getAllByRole('button')) expect(button.disabled).toBe(true)
  })
})
