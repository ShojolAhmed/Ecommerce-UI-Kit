import { useCallback, useMemo, useRef, useState } from 'react'

/**
 * @typedef {object} ToastData
 * @property {string|number} id
 * @property {'info'|'success'|'warning'|'error'} tone
 * @property {React.ReactNode} [title]
 * @property {React.ReactNode} [description]
 * @property {{ label: string, onClick: (event) => void }} [action]
 * @property {number} duration       Milliseconds before it closes itself; `0` or `Infinity` keeps it until dismissed.
 * @property {boolean} dismissible   `false` hides the close button.
 * @property {number} revision       Bumped when a toast with the same id is shown again (restarts its timer).
 */

/**
 * State for a list of toasts. Pair it with `ToastViewport`:
 *
 * ```jsx
 * const { toasts, success, dismiss } = useToasts()
 * <ToastViewport toasts={toasts} onDismiss={dismiss} />
 * ```
 *
 * `show(input)` takes a string (the title) or `{ id?, tone?, title?, description?, action?, duration?, dismissible? }`
 * and returns the toast's id. Showing a toast with an existing `id` updates it in place and restarts
 * its timer, which keeps a quick series of cart changes from stacking up identical messages.
 * `success`, `info`, `warning` and `error` are shorthands for `show` with a tone. Only the newest
 * `limit` toasts are kept. Every function is stable between renders.
 *
 * @param {{ duration?: number, limit?: number }} [options]  `duration` is the default (5000 ms); errors default to twice as long.
 */
export function useToasts({ duration: defaultDuration = 5000, limit = 5 } = {}) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const show = useCallback(
    (input) => {
      const data = typeof input === 'string' ? { title: input } : input ?? {}
      const id = data.id ?? `toast-${(counter.current += 1)}`
      const tone = data.tone ?? 'info'

      setToasts((current) => {
        const existing = current.find((toast) => toast.id === id)
        const toast = {
          dismissible: true,
          duration: tone === 'error' ? defaultDuration * 2 : defaultDuration,
          ...data,
          tone,
          id,
          revision: (existing?.revision ?? 0) + 1,
        }
        const next = existing ? current.map((item) => (item.id === id ? toast : item)) : [...current, toast]
        return next.slice(-limit)
      })
      return id
    },
    [defaultDuration, limit],
  )

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])
  const clear = useCallback(() => setToasts([]), [])

  const withTone = useCallback(
    (tone) => (input) => show({ ...(typeof input === 'string' ? { title: input } : input), tone }),
    [show],
  )
  const shorthands = useMemo(
    () => ({ info: withTone('info'), success: withTone('success'), warning: withTone('warning'), error: withTone('error') }),
    [withTone],
  )

  return { toasts, show, dismiss, clear, ...shorthands }
}
