import { useCallback, useEffect, useState } from 'react'

/**
 * State for the mobile menu (drawer or sheet). The trigger button's ref is created by
 * the variant and passed to <MobileMenu> so focus can return to it on close.
 *
 * @param {object} [options]
 * @param {string} [options.closeAbove] Media query at which the menu button is
 *   hidden. The menu closes itself when it starts matching (e.g. device rotated
 *   or window resized), so it never stays open without a way to dismiss it.
 */
export function useMobileMenu({ closeAbove = '(min-width: 48rem)' } = {}) {
  const [open, setOpen] = useState(false)

  const openMenu = useCallback(() => setOpen(true), [])
  const closeMenu = useCallback(() => setOpen(false), [])
  const toggleMenu = useCallback(() => setOpen((value) => !value), [])

  useEffect(() => {
    if (!open || typeof window.matchMedia !== 'function') return undefined
    const query = window.matchMedia(closeAbove)
    const onChange = (event) => {
      if (event.matches) setOpen(false)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [open, closeAbove])

  return { open, openMenu, closeMenu, toggleMenu }
}
