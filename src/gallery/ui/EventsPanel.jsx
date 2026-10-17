import { Button } from '../../library/index.js'

/** Callbacks the previewed component has made, newest first. The gallery only logs them. */
export default function EventsPanel({ events, onClear }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">Interact with the preview: every callback the component makes is listed here.</p>
        <Button size="sm" variant="outline" onClick={onClear} disabled={events.length === 0}>Clear</Button>
      </div>
      {events.length === 0 ? (
        <p role="status" className="rounded-surface border border-dashed border-border p-4 text-sm text-foreground-muted">No callbacks yet.</p>
      ) : (
        <ol aria-live="polite" className="divide-y divide-border rounded-surface border border-border bg-surface font-mono text-xs">
          {events.map((event) => (
            <li key={event.id} className="flex flex-wrap gap-x-3 gap-y-0.5 px-3 py-2">
              <time className="text-foreground-muted" dateTime={new Date(event.at).toISOString()}>{new Date(event.at).toLocaleTimeString()}</time>
              <span className="font-semibold">{event.label}</span>
              {event.detail && <span className="min-w-0 break-words text-foreground-muted">{event.detail}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
