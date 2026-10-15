/** Status line under a discovery demo: the last callback that fired, and the state the page owns. */
export default function EventLog({ lastEvent, state }) {
  return (
    <div className="space-y-1 rounded-surface border border-border bg-surface px-4 py-2">
      <p role="status" className="break-words font-mono text-xs text-foreground-muted">
        {lastEvent}
      </p>
      {state !== undefined && (
        <p className="break-words font-mono text-xs text-foreground-subtle">state: {JSON.stringify(state)}</p>
      )}
    </div>
  )
}
