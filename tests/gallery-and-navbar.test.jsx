import { afterEach, describe, expect, it } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { Navbar } from '../src/library/index.js'
import FramePage from '../src/gallery/FramePage.jsx'

afterEach(() => {
  window.location.hash = ''
})

describe('FramePage opened on its own', () => {
  it('follows the address bar when the hash changes', async () => {
    window.location.hash = '#/gallery-frame/navbar/minimal'
    const { container } = render(<FramePage />)
    await waitFor(() => expect(container.querySelector('[data-gallery-family="navbar"][data-gallery-variant="minimal"]')).not.toBeNull())
    await act(async () => {
      window.location.hash = '#/gallery-frame/navbar/compact'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    await waitFor(() => expect(container.querySelector('[data-gallery-variant="compact"]')).not.toBeNull())
    expect(container.querySelector('[data-gallery-variant="minimal"]')).toBeNull()
  })
})

describe('compact navbar tab bar', () => {
  it('shows the visible label before the count so it matches the accessible name (WCAG 2.5.3)', () => {
    render(
      <Navbar
        variant="compact"
        brand={{ name: 'Northwind', href: '/' }}
        links={[{ id: 'new', label: 'New', href: '/new' }]}
        wishlist={{ count: 3 }}
      />,
    )
    // The wishlist control appears in the header and in the bottom bar; the bar tab shows a visible label.
    const labelled = screen.getAllByLabelText('Wishlist, 3 items').filter((el) => /wishlist/i.test(el.textContent))
    expect(labelled.length).toBeGreaterThan(0)
    for (const tab of labelled) expect(tab.textContent.replace(/\s+/g, ' ').trim()).toBe('Wishlist 3')
  })
})
