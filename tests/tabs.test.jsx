import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, Accordion } from '../src/library/index.js'

const tabItems = [
  { id: 'a', label: 'Details', content: 'Details panel' },
  { id: 'b', label: 'Shipping', content: 'Shipping panel', disabled: true },
  { id: 'c', label: 'Reviews', content: 'Reviews panel' },
]

describe('Tabs', () => {
  it('selects the first enabled tab and wires aria-controls to a panel', () => {
    render(<Tabs items={tabItems} label="Product info" />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    for (const tab of tabs) expect(document.getElementById(tab.getAttribute('aria-controls'))).not.toBeNull()
    expect(screen.getByRole('tabpanel').textContent).toContain('Details panel')
  })

  it('moves with the arrow keys, skipping disabled tabs, and wraps with Home and End', async () => {
    const onChange = vi.fn()
    render(<Tabs items={tabItems} label="Product info" onChange={onChange} />)
    screen.getByRole('tab', { name: 'Details' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenLastCalledWith('c', expect.anything())
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Reviews' }))
    await userEvent.keyboard('{Home}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Details' }))
  })

  it('does not select a disabled tab on click', async () => {
    const onChange = vi.fn()
    render(<Tabs items={tabItems} label="Product info" onChange={onChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Shipping' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders without crashing when items is empty', () => {
    render(<Tabs items={[]} label="Nothing" />)
    expect(screen.queryAllByRole('tab')).toHaveLength(0)
  })
})

describe('Accordion', () => {
  const entries = [
    { id: 'one', title: 'Shipping', content: 'Ships in 2 days' },
    { id: 'two', title: 'Returns', content: 'Free returns' },
  ]

  it('toggles a section with aria-expanded', async () => {
    render(<Accordion items={entries} />)
    const first = screen.getByRole('button', { name: 'Shipping' })
    expect(first.getAttribute('aria-expanded')).toBe('false')
    await userEvent.click(first)
    expect(first.getAttribute('aria-expanded')).toBe('true')
    await userEvent.click(first)
    expect(first.getAttribute('aria-expanded')).toBe('false')
  })
})
