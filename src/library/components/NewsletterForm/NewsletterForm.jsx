import { useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn.js'
import { Button, Input } from '../../primitives/index.js'
import { focusRing } from '../../primitives/shared/styles.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const defaultLabels = {
  email: 'Email address',
  placeholder: 'you@example.com',
  submit: 'Subscribe',
  success: 'Thanks for subscribing.',
  invalidEmail: 'Enter a valid email address, like name@example.com.',
  consentRequired: 'Tick the box to confirm you want these emails.',
  failed: 'Something went wrong. Try again in a moment.',
}

/**
 * Email signup form. It validates the address, then calls `onSubscribe` and
 * reflects the outcome. It never talks to an email service: you decide what
 * happens in the callback.
 *
 *  - `onSubscribe` may be sync or return a promise. While the promise is
 *    pending the button shows its busy state; if it rejects, the form shows
 *    `error.message` (or `labels.failed`) and keeps what was typed.
 *  - On success the field is cleared and `labels.success` is announced.
 *
 * @param {object} props
 * @param {(values: { email: string, consent?: boolean }, event: React.FormEvent) => void | Promise<void>} [props.onSubscribe]
 * @param {Partial<typeof defaultLabels>} [props.labels]  Override any string (localisation, brand voice).
 * @param {React.ReactNode} [props.consent]  Consent checkbox label. Setting it makes the box required.
 * @param {'inline'|'stacked'} [props.layout='inline']  Field and button on one row (from `sm`), or always stacked.
 * @param {'sm'|'md'|'lg'} [props.size='lg']
 * @param {string} [props.name='email']
 * @param {string} [props.buttonVariant='primary']
 */
export default function NewsletterForm({
  onSubscribe,
  labels: labelOverrides,
  consent,
  layout = 'inline',
  size = 'lg',
  name = 'email',
  buttonVariant = 'primary',
  shape = 'rounded',
  className,
}) {
  const labels = { ...defaultLabels, ...labelOverrides }
  const id = useId()
  const emailRef = useRef(null)
  const consentRef = useRef(null)

  const [email, setEmail] = useState('')
  const [consented, setConsented] = useState(false)
  const [fieldError, setFieldError] = useState(null)
  const [consentError, setConsentError] = useState(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'submitting') return

    const trimmed = email.trim()
    if (!EMAIL_PATTERN.test(trimmed)) {
      setFieldError(labels.invalidEmail)
      emailRef.current?.focus()
      return
    }
    if (consent && !consented) {
      setConsentError(labels.consentRequired)
      consentRef.current?.focus()
      return
    }

    setFieldError(null)
    setConsentError(null)
    setStatus('submitting')
    try {
      await onSubscribe?.(consent ? { email: trimmed, consent: consented } : { email: trimmed }, event)
      setStatus('success')
      setEmail('')
      setConsented(false)
    } catch (error) {
      setServerMessage(error?.message || labels.failed)
      setStatus('error')
    }
  }

  const rowLayout = layout === 'inline' ? 'sm:flex-row sm:items-start' : ''

  return (
    <form noValidate onSubmit={handleSubmit} className={cn('flex flex-col gap-3', className)}>
      <div className={cn('flex flex-col gap-3', rowLayout)}>
        <Input
          ref={emailRef}
          type="email"
          name={name}
          autoComplete="email"
          inputMode="email"
          size={size}
          required
          aria-label={labels.email}
          placeholder={labels.placeholder}
          value={email}
          invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? `${id}-error` : undefined}
          className={cn(layout === 'inline' && 'sm:flex-1', shape === 'pill' && 'rounded-full! px-5!')}
          onChange={(event) => {
            setEmail(event.target.value)
            if (fieldError) setFieldError(null)
            if (status !== 'idle' && status !== 'submitting') setStatus('idle')
          }}
        />
        <Button
          type="submit"
          size={size}
          shape={shape}
          variant={buttonVariant}
          loading={status === 'submitting'}
          className={layout === 'inline' ? 'sm:w-auto' : undefined}
        >
          {labels.submit}
        </Button>
      </div>

      {fieldError && (
        <p id={`${id}-error`} className="-mt-1 text-sm font-medium text-danger">
          {fieldError}
        </p>
      )}

      {consent && (
        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-2.5 text-sm text-foreground-muted">
            <input
              ref={consentRef}
              type="checkbox"
              checked={consented}
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? `${id}-consent-error` : undefined}
              onChange={(event) => {
                setConsented(event.target.checked)
                if (consentError) setConsentError(null)
              }}
              className={cn('mt-0.5 size-4 shrink-0 accent-primary', focusRing)}
            />
            <span>{consent}</span>
          </label>
          {consentError && (
            <p id={`${id}-consent-error`} className="text-sm font-medium text-danger">
              {consentError}
            </p>
          )}
        </div>
      )}

      {/* Always mounted so screen readers announce the result when it appears. */}
      <p
        role="status"
        className={cn(
          'text-sm font-medium empty:-mt-3',
          status === 'success' && 'text-success',
          status === 'error' && 'text-danger',
        )}
      >
        {status === 'success' ? labels.success : status === 'error' ? serverMessage : ''}
      </p>
    </form>
  )
}
