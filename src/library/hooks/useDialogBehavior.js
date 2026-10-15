import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

let lockCount = 0
let saved = null

/** Lock page scroll (ref-counted, compensates for the scrollbar so nothing jumps). */
function lockScroll() {
  if (lockCount === 0) {
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
  }
  lockCount += 1
  return () => {
    lockCount -= 1
    if (lockCount === 0 && saved) {
      document.body.style.overflow = saved.overflow
      document.body.style.paddingRight = saved.paddingRight
      saved = null
    }
  }
}

function focusableIn(root) {
  return [...root.querySelectorAll(FOCUSABLE)].filter((el) => !el.closest('[hidden]'))
}

/**
 * Modal behaviour shared by the Navbar mobile menu and the FilterDrawer:
 *  - moves focus inside on open and returns it to the trigger on close
 *  - traps Tab / Shift+Tab (and pulls stray focus back in)
 *  - closes on Escape
 *  - locks page scroll while open
 */
export function useDialogBehavior({ open, onClose, panelRef, returnFocusRef, initialFocusRef }) {
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const panel = panelRef.current
    if (!open || !panel) return undefined

    const returnTarget = returnFocusRef?.current ?? document.activeElement
    const unlock = lockScroll()
    ;(initialFocusRef?.current ?? focusableIn(panel)[0] ?? panel).focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusableIn(panel)
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (!panel.contains(active)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const onFocusIn = (event) => {
      if (!panel.contains(event.target)) (focusableIn(panel)[0] ?? panel).focus()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
      unlock()
      returnTarget?.focus?.()
    }
  }, [open, panelRef, returnFocusRef, initialFocusRef])
}
