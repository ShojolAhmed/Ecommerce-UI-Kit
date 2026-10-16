import { createPortal } from 'react-dom'

/**
 * Renders children in `document.body` so a `position: fixed` overlay is never clipped or
 * re-positioned by a transformed, filtered or overflow-hidden ancestor. `enabled={false}`
 * renders them in place (and during server rendering, where there is no document).
 */
export default function Portal({ enabled = true, children }) {
  if (!enabled || typeof document === 'undefined') return children
  return createPortal(children, document.body)
}
