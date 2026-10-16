import { useId, useRef } from 'react'
import { cn } from '../../utils/cn.js'
import { Button } from '../../primitives/index.js'
import { useDialogBehavior } from '../../hooks/useDialogBehavior.js'
import Portal from '../shared/Portal.jsx'

const defaultLabels = {
  confirm: 'Confirm',
  cancel: 'Cancel',
}

/**
 * Modal confirmation ("Remove this item?"). It is an `alertdialog`: it names itself with the title,
 * describes itself with the description, and waits for an answer. Controlled: the page owns `open`
 * and does the work in `onConfirm`; the dialog never changes anything itself.
 *
 * Behaviour: focus moves in on open (to Cancel for `tone="danger"`, so a stray Enter cannot destroy
 * something; to Confirm otherwise; override with `initialFocus`), Tab is trapped, Escape and a click
 * on the backdrop cancel, page scroll is locked, and focus returns to `triggerRef` (or to whatever
 * had focus when it opened). It can stack above another dialog, such as the cart drawer: only the
 * top one reacts to Escape and Tab. While `loading`, both buttons and every way of dismissing it are
 * blocked, so the request cannot be abandoned half way.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onCancel      Cancel button, Escape, backdrop click.
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {React.ReactNode} [props.confirmLabel]
 * @param {React.ReactNode} [props.cancelLabel]
 * @param {'default'|'danger'} [props.tone='default']   `danger` styles the confirm button as destructive.
 * @param {'cancel'|'confirm'} [props.initialFocus]    Default: `cancel` for danger, `confirm` otherwise.
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.closeOnBackdropClick=true]
 * @param {React.RefObject<HTMLElement>} [props.triggerRef]
 * @param {boolean} [props.portal=true]   Render in `document.body`; `false` renders in place.
 * @param {React.ReactNode} [props.children]  Extra content under the description (an item summary).
 */
export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = 'default',
  initialFocus,
  loading = false,
  closeOnBackdropClick = true,
  triggerRef,
  portal = true,
  className,
  children,
}) {
  const panelRef = useRef(null)
  const cancelRef = useRef(null)
  const confirmRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()
  const danger = tone === 'danger'
  const focusTarget = (initialFocus ?? (danger ? 'cancel' : 'confirm')) === 'cancel' ? cancelRef : confirmRef

  // While busy the dialog cannot be dismissed.
  const cancel = () => {
    if (!loading) onCancel()
  }

  useDialogBehavior({ open, onClose: cancel, panelRef, returnFocusRef: triggerRef, initialFocusRef: focusTarget })

  if (!open) return null

  return (
    <Portal enabled={portal}>
      <div className="fixed inset-0 z-[55] flex items-end justify-center p-4 sm:items-center">
        <div
          aria-hidden="true"
          onClick={closeOnBackdropClick ? cancel : undefined}
          className="absolute inset-0 bg-foreground/50 motion-safe:animate-ui-fade-in"
        />
        <div
          ref={panelRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          aria-busy={loading || undefined}
          tabIndex={-1}
          className={cn(
            'relative w-full max-w-md space-y-4 rounded-surface border border-border bg-surface p-5 text-foreground shadow-xl outline-none sm:p-6',
            'motion-safe:animate-ui-slide-up sm:motion-safe:animate-ui-fade-in',
            className,
          )}
        >
          <div className="space-y-2">
            <h2 id={titleId} className="text-lg font-semibold text-balance">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-foreground-muted text-pretty">
                {description}
              </p>
            )}
          </div>
          {children}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button ref={cancelRef} variant="outline" disabled={loading} onClick={cancel}>
              {cancelLabel ?? defaultLabels.cancel}
            </Button>
            <Button ref={confirmRef} variant={danger ? 'danger' : 'primary'} loading={loading} onClick={() => onConfirm()}>
              {confirmLabel ?? defaultLabels.confirm}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
