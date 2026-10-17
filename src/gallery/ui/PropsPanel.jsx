import { useEffect, useState } from 'react'
import { loadDocs } from '../engine/docs.js'

function PropsTable({ props, caption }) {
  return (
    <div className="overflow-x-auto rounded-surface border border-border">
      <table className="w-full min-w-[34rem] text-start text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-muted text-xs uppercase tracking-wide text-foreground-muted">
          <tr>
            <th scope="col" className="px-3 py-2 text-start font-semibold">Prop</th>
            <th scope="col" className="px-3 py-2 text-start font-semibold">Type</th>
            <th scope="col" className="px-3 py-2 text-start font-semibold">Default</th>
            <th scope="col" className="px-3 py-2 text-start font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border align-top">
          {props.map((prop) => (
            <tr key={prop.name}>
              <th scope="row" className="px-3 py-2 text-start font-mono text-xs font-semibold">
                {prop.name}
                {!prop.optional && <span className="ms-1 text-danger" title="Required">*<span className="sr-only"> required</span></span>}
              </th>
              <td className="px-3 py-2"><code className="break-words font-mono text-xs text-foreground-muted" title={prop.type}>{prop.type.length > 90 ? `${prop.type.slice(0, 89)}…` : prop.type}</code></td>
              <td className="px-3 py-2 font-mono text-xs text-foreground-muted">{prop.default ?? '—'}</td>
              <td className="px-3 py-2 text-foreground-muted">{prop.description || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Props and data shapes, read from the library's JSDoc when the tab opens. */
export default function PropsPanel({ family }) {
  const [result, setResult] = useState({ id: null })

  useEffect(() => {
    let cancelled = false
    loadDocs(family.docs).then(
      (docs) => !cancelled && setResult({ id: family.id, docs }),
      (error) => !cancelled && setResult({ id: family.id, error }),
    )
    return () => {
      cancelled = true
    }
  }, [family])

  if (result.id !== family.id) return <p role="status" className="text-sm text-foreground-muted">Reading props from the library…</p>
  if (result.error) return <p role="alert" className="text-sm text-danger">Could not read the props: {result.error.message}</p>

  const { sections, shapes } = result.docs
  return (
    <div className="space-y-6">
      <p className="text-xs text-foreground-muted">
        Generated from the JSDoc in <code className="font-mono">src/library</code>, so it matches the code. <span className="text-danger">*</span> marks required props.
      </p>
      {sections.map((section) => (
        <section key={section.title} className="space-y-2">
          <h3 className="text-sm font-semibold">{section.title}</h3>
          {section.note && <p className="text-sm text-foreground-muted">{section.note}</p>}
          {section.missing || section.props.length === 0 ? (
            <p className="text-sm text-foreground-muted">No documented props found in <code className="font-mono">src/library/{section.source}</code>.</p>
          ) : (
            <PropsTable props={section.props} caption={section.title} />
          )}
        </section>
      ))}
      {shapes.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Data shapes</h3>
          {shapes.map((shape) => (
            <details key={shape.name} className="rounded-surface border border-border bg-surface px-3 py-2">
              <summary className="cursor-pointer font-mono text-xs font-semibold">
                {shape.name}
                {shape.alias && <span className="ms-2 font-normal text-foreground-muted">{shape.alias}</span>}
              </summary>
              <div className="mt-2 space-y-2">
                {shape.description && <p className="text-sm text-foreground-muted">{shape.description}</p>}
                {shape.props.length > 0 && <PropsTable props={shape.props} caption={shape.name} />}
              </div>
            </details>
          ))}
        </section>
      )}
    </div>
  )
}
