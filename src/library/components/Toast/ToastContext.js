import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

/**
 * Show notifications from anywhere under a `ToastProvider`:
 * `const { success, error, show, dismiss, clear } = useToast()`.
 * The returned functions never change, so using this hook does not re-render on every toast.
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.')
  return context
}
