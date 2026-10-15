/** Status line under a product demo: the last callback that fired and the demo cart total. */
export default function DemoStatus({ lastEvent, cartCount }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-surface border border-border bg-surface px-4 py-2">
      <p role="status" className="font-mono text-xs text-foreground-muted">
        {lastEvent}
      </p>
      <p className="font-mono text-xs text-foreground-muted">Demo cart: {cartCount}</p>
    </div>
  )
}
