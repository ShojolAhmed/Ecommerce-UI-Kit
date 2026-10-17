import { useState } from 'react'
import { Button } from '../../library/index.js'

export default function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="relative">
      <div className="absolute end-2 top-2">
        <Button size="sm" variant="outline" onClick={copy} aria-label={`Copy ${label}`}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre tabIndex={0} aria-label={label} className="max-h-[32rem] overflow-auto rounded-surface border border-border bg-surface-sunken p-4 pe-20 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
