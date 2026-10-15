/**
 * Preview-only frame: shows the last callback under the component and stops the sample `#links`
 * from changing the page address.
 */
export default function DemoFrame({ children, message, onLog, className = '' }) {
  const handleClickCapture = (event) => {
    const anchor = event.target.closest?.('a[href]')
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (href.startsWith('#') || href.startsWith('http')) {
      event.preventDefault()
      const name = anchor.getAttribute('aria-label') || anchor.textContent.trim()
      onLog?.(`Link: ${name}`)
    }
  }

  return (
    <div className="overflow-hidden rounded-surface border border-border">
      <div onClickCapture={handleClickCapture} className={`bg-background ${className}`}>
        {children}
      </div>
      <p role="status" className="border-t border-border bg-surface px-4 py-2 font-mono text-xs text-foreground-muted">
        {message}
      </p>
    </div>
  )
}
