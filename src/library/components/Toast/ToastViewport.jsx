import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn.js'
import Portal from '../shared/Portal.jsx'
import Toast from './Toast.jsx'

const placements = {
  'top-left': 'top-0 left-0',
  'top-center': 'top-0 left-1/2 sm:-translate-x-1/2',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-center': 'bottom-0 left-1/2 sm:-translate-x-1/2',
  'bottom-right': 'bottom-0 right-0',
}

const defaultLabels = {
  region: 'Notifications',
  dismiss: 'Dismiss notification',
}

/** One toast with its own auto-dismiss timer. The timer pauses while hovered or focused and keeps its remaining time. */
function TimedToast({ toast, onDismiss, labels }) {
  const [paused, setPaused] = useState(false)
  const remaining = useRef(toast.duration)
  const onDismissRef = useRef(onDismiss)
  useEffect(() => {
    onDismissRef.current = onDismiss
  })

  const { id, duration, revision } = toast

  // A toast that was updated (same id, new `revision`) starts its countdown again.
  useEffect(() => {
    remaining.current = duration
  }, [revision, duration])

  useEffect(() => {
    if (paused || !(duration > 0) || !Number.isFinite(duration)) return undefined
    const startedAt = Date.now()
    const timer = setTimeout(() => onDismissRef.current(id), remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current -= Date.now() - startedAt
    }
  }, [paused, duration, revision, id])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      className="pointer-events-auto"
    >
      <Toast
        tone={toast.tone}
        title={toast.title}
        description={toast.description}
        action={toast.action}
        onDismiss={toast.dismissible === false ? undefined : () => onDismiss(id)}
        labels={labels}
      />
    </div>
  )
}

/**
 * Stack of toasts in a screen corner. Controlled: pass `toasts` and `onDismiss(id)`, usually from
 * `useToasts()` or `ToastProvider`. Each toast dismisses itself after its `duration`, unless the
 * pointer is over it or focus is inside it, and it can always be closed with its button.
 *
 * Accessibility: the stack is a labelled region and each toast announces itself (polite for
 * info and success, assertive for warning and error) without taking focus. The region is marked as
 * a companion of open dialogs, so while a drawer or confirmation is open its buttons ("Undo")
 * stay reachable at the end of the Tab order. Fade-in is off under reduced motion.
 *
 * Mount one viewport per page. On screens narrower than `sm` toasts span the full width.
 *
 * @param {object} props
 * @param {import('./useToasts.js').ToastData[]} props.toasts
 * @param {(id: string|number) => void} props.onDismiss
 * @param {'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'} [props.placement='bottom-right']
 * @param {Partial<typeof defaultLabels>} [props.labels]
 * @param {boolean} [props.portal=true]
 * @param {string} [props.className]
 */
export default function ToastViewport({
  toasts = [],
  onDismiss,
  placement = 'bottom-right',
  labels: labelOverrides,
  portal = true,
  className,
}) {
  const labels = { ...defaultLabels, ...labelOverrides }
  const top = placement.startsWith('top')
  // Newest toast nearest the screen edge, with the DOM order matching what is seen.
  const ordered = top ? [...toasts].reverse() : toasts

  // No empty landmark when there is nothing to announce.
  if (toasts.length === 0) return null

  return (
    <Portal enabled={portal}>
      <div
        role="region"
        aria-label={labels.region}
        data-ui-dialog-companion=""
        className={cn(
          'pointer-events-none fixed z-[60] flex w-full flex-col gap-2 p-4 sm:max-w-sm',
          placements[placement] ?? placements['bottom-right'],
          className,
        )}
      >
        {ordered.map((toast) => (
          <TimedToast key={toast.id} toast={toast} onDismiss={onDismiss} labels={labels} />
        ))}
      </div>
    </Portal>
  )
}
