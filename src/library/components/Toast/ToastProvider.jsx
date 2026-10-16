import { useMemo } from 'react'
import { ToastContext } from './ToastContext.js'
import ToastViewport from './ToastViewport.jsx'
import { useToasts } from './useToasts.js'

/**
 * Convenience wrapper: owns the toast state, renders one `ToastViewport` and lets any child call
 * `useToast()`. Use `useToasts` + `ToastViewport` directly when you would rather keep the state
 * next to your own.
 *
 * @param {object} props
 * @param {'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'} [props.placement='bottom-right']
 * @param {number} [props.duration=5000]   Default display time in ms.
 * @param {number} [props.limit=5]         Most toasts shown at once.
 * @param {object} [props.labels]          Passed to `ToastViewport`.
 */
export default function ToastProvider({ placement, duration, limit, labels, portal, children }) {
  const { toasts, show, dismiss, clear, info, success, warning, error } = useToasts({ duration, limit })
  const api = useMemo(
    () => ({ show, dismiss, clear, info, success, warning, error }),
    [show, dismiss, clear, info, success, warning, error],
  )

  return (
    <ToastContext value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} placement={placement} labels={labels} portal={portal} />
    </ToastContext>
  )
}
