import { cn } from '../../utils/cn.js'
import { Button, IconButton } from '../../primitives/index.js'
import { AlertTriangleIcon, CheckIcon, CloseIcon, InfoIcon } from '../../icons/index.jsx'

const tones = {
  info: { icon: InfoIcon, color: 'text-info', role: 'status' },
  success: { icon: CheckIcon, color: 'text-success', role: 'status' },
  warning: { icon: AlertTriangleIcon, color: 'text-warning', role: 'alert' },
  error: { icon: AlertTriangleIcon, color: 'text-danger', role: 'alert' },
}

const defaultLabels = {
  dismiss: 'Dismiss notification',
}

/**
 * One notification card. Purely visual: `ToastViewport` positions and times a list of them, but a
 * `Toast` can also be used alone (an inline confirmation). Meaning never rests on color: each tone
 * has its own icon, and the title says what happened.
 *
 * Roles: `info` and `success` are polite (`role="status"`); `warning` and `error` interrupt
 * (`role="alert"`). Because the element is added to the page when the toast appears, screen readers
 * announce it without moving focus.
 *
 * @param {object} props
 * @param {'info'|'success'|'warning'|'error'} [props.tone='info']
 * @param {React.ReactNode} [props.title]
 * @param {React.ReactNode} [props.description]
 * @param {{ label: string, onClick: (event) => void }} [props.action]  A single action such as "Undo". Clicking it also dismisses.
 * @param {() => void} [props.onDismiss]   Shows the close button when set.
 * @param {Partial<typeof defaultLabels>} [props.labels]
 */
export default function Toast({ tone = 'info', title, description, action, onDismiss, labels: labelOverrides, className, ...rest }) {
  const labels = { ...defaultLabels, ...labelOverrides }
  const style = tones[tone] ?? tones.info
  const Icon = style.icon

  return (
    <div
      {...rest}
      role={style.role}
      aria-atomic="true"
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-surface border border-border bg-surface p-3 text-foreground shadow-lg',
        'motion-safe:animate-ui-fade-in',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('mt-0.5 flex shrink-0 text-lg', style.color)}>
        <Icon />
      </span>
      <div className="min-w-0 flex-1 space-y-0.5 py-0.5">
        {title && <p className="text-sm font-semibold text-pretty">{title}</p>}
        {description && <p className="text-sm text-foreground-muted text-pretty">{description}</p>}
      </div>
      {action && (
        <Button
          size="sm"
          variant="outline"
          onClick={(event) => {
            action.onClick?.(event)
            onDismiss?.()
          }}
        >
          {action.label}
        </Button>
      )}
      {onDismiss && (
        <IconButton size="sm" label={labels.dismiss} onClick={onDismiss} className="-me-1 -mt-0.5 shrink-0">
          <CloseIcon />
        </IconButton>
      )}
    </div>
  )
}
