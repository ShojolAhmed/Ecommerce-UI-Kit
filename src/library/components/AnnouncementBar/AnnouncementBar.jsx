import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn.js'
import { IconButton } from '../../primitives/index.js'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, PauseIcon, PlayIcon } from '../../icons/index.jsx'
import { focusRing } from '../../primitives/shared/styles.js'
import { useControllableState } from '../../hooks/useControllableState.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { getTone } from '../shared/tones.js'

const defaultLabels = {
  region: 'Announcements',
  dismiss: 'Dismiss announcements',
  previous: 'Previous announcement',
  next: 'Next announcement',
  pause: 'Pause automatic rotation',
  play: 'Start automatic rotation',
  position: (index, total) => `Announcement ${index} of ${total}`,
}

// Quiet controls that take the bar's own text color (the Button's colors are replaced on purpose).
const controlClass =
  'text-current! hover:bg-current/15! active:bg-current/25! focus-visible:outline-current!'

/**
 * Thin bar above the header for shipping thresholds, sales and notices.
 *
 *  - One message is static. Several rotate on a timer, with previous / next and
 *    a pause button. Rotation also stops while the pointer or keyboard focus is
 *    inside the bar, and never starts when the OS asks for reduced motion.
 *  - `dismissible` adds a close button. Visibility is uncontrolled by default
 *    (`defaultOpen`) or controlled with `open` + `onOpenChange`. Remember the
 *    choice yourself (cookie, storage) and pass `open={false}` next time.
 *
 * @param {object} props
 * @param {{ id?: string|number, text: React.ReactNode, href?: string, linkLabel?: string }[]} props.messages
 * @param {'default'|'muted'|'primary'|'accent'|'dark'} [props.tone='primary']
 * @param {boolean} [props.autoRotate=true]
 * @param {number} [props.interval=5000]  Milliseconds per message.
 * @param {boolean} [props.dismissible=false]
 * @param {boolean} [props.open]  Controlled visibility.
 * @param {boolean} [props.defaultOpen=true]
 * @param {(open: boolean) => void} [props.onOpenChange]
 * @param {(message, event) => void} [props.onLinkClick]
 * @param {Partial<typeof defaultLabels>} [props.labels]
 */
export default function AnnouncementBar({
  messages = [],
  tone = 'primary',
  autoRotate = true,
  interval = 5000,
  dismissible = false,
  open,
  defaultOpen = true,
  onOpenChange,
  onLinkClick,
  labels: labelOverrides,
  className,
}) {
  const labels = { ...defaultLabels, ...labelOverrides }
  const reducedMotion = usePrefersReducedMotion()
  const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange })
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [engaged, setEngaged] = useState(false) // pointer or focus inside

  const items = messages.filter((message) => message && message.text)
  const total = items.length
  const current = items[total > 0 ? index % total : 0]
  const rotates = total > 1 && autoRotate && !reducedMotion
  const playing = rotates && !userPaused && !engaged

  useEffect(() => {
    if (!playing) return undefined
    const timer = setInterval(() => setIndex((value) => (value + 1) % total), interval)
    return () => clearInterval(timer)
  }, [playing, interval, total])

  if (!isOpen || !current) return null

  const { root, theme } = getTone(tone, 'primary')
  const step = (direction) => setIndex((value) => (value + direction + total) % total)

  return (
    <section
      aria-label={labels.region}
      data-theme={theme}
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false)
      }}
      className={cn('relative', root, className)}
    >
      <div className="mx-auto flex min-h-10 w-full max-w-page-wide items-center gap-1 px-2 py-1 sm:px-4">
        {/* Left spacer keeps the message centered when the right side has buttons. */}
        <div className="hidden w-24 shrink-0 sm:block" aria-hidden="true" />

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
          {total > 1 && (
            <IconButton label={labels.previous} size="sm" shape="pill" className={controlClass} onClick={() => step(-1)}>
              <ChevronLeftIcon />
            </IconButton>
          )}
          {/* While rotating, a live region would interrupt screen readers every few seconds. */}
          <p
            aria-live={playing ? 'off' : 'polite'}
            aria-atomic="true"
            className="min-w-0 px-1 text-center text-sm text-balance"
          >
            <span>{current.text}</span>
            {current.href && (
              <>
                {' '}
                <a
                  href={current.href}
                  onClick={(event) => onLinkClick?.(current, event)}
                  className={cn(
                    'rounded-sm font-medium whitespace-nowrap underline underline-offset-4',
                    focusRing,
                    'focus-visible:outline-current!',
                  )}
                >
                  {current.linkLabel ?? 'Shop now'}
                </a>
              </>
            )}
            {total > 1 && <span className="sr-only"> ({labels.position(index % total + 1, total)})</span>}
          </p>
          {total > 1 && (
            <IconButton label={labels.next} size="sm" shape="pill" className={controlClass} onClick={() => step(1)}>
              <ChevronRightIcon />
            </IconButton>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-0.5 sm:w-24">
          {rotates && (
            <IconButton
              label={userPaused ? labels.play : labels.pause}
              size="sm"
              shape="pill"
              className={controlClass}
              onClick={() => setUserPaused((value) => !value)}
            >
              {userPaused ? <PlayIcon /> : <PauseIcon />}
            </IconButton>
          )}
          {dismissible && (
            <IconButton label={labels.dismiss} size="sm" shape="pill" className={controlClass} onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </div>
    </section>
  )
}
