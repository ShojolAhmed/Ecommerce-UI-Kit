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

/**
 * Open dialogs, oldest first. Only the last one (the topmost) reacts to the keyboard and to
 * focus changes, so a confirmation dialog opened from inside a drawer does not fight the
 * drawer for focus, and Escape closes just the dialog on top.
 */
const dialogStack = []

/**
 * Elements outside a dialog that stay reachable while it is open (toast notifications). Mark
 * them with this attribute; their controls join the end of the dialog's Tab cycle.
 */
const COMPANION_SELECTOR = '[data-ui-dialog-companion]'

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

/** The dialog panel followed by every companion region. */
const scopeOf = (panel) => [panel, ...document.querySelectorAll(COMPANION_SELECTOR)]

/**
 * Modal behaviour shared by the Navbar mobile menu and the FilterDrawer:
 *  - moves focus inside on open and returns it to the trigger on close
 *  - traps Tab / Shift+Tab (and pulls stray focus back in)
 *  - closes on Escape
 *  - locks page scroll while open
 *
 * Dialogs can stack (a confirmation over a drawer): only the topmost one handles keys and
 * focus. Regions marked `data-ui-dialog-companion` (toasts) stay reachable by Tab.
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
    const token = {}
    dialogStack.push(token)
    const isTopmost = () => dialogStack[dialogStack.length - 1] === token
    const unlock = lockScroll()
    ;(initialFocusRef?.current ?? focusableIn(panel)[0] ?? panel).focus()

    const onKeyDown = (event) => {
      if (!isTopmost()) return
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const scope = scopeOf(panel)
      const items = scope.flatMap(focusableIn)
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (!scope.some((part) => part.contains(active))) {
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
      if (!isTopmost()) return
      if (scopeOf(panel).some((part) => part.contains(event.target))) return
      ;(focusableIn(panel)[0] ?? panel).focus()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
      dialogStack.splice(dialogStack.indexOf(token), 1) // before focus returns, so the dialog below takes over
      unlock()
      returnTarget?.focus?.()
    }
  }, [open, panelRef, returnFocusRef, initialFocusRef])
}
