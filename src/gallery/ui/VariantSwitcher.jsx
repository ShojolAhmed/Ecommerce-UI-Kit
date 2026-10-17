import { useRef } from 'react'
import { cn } from '../../library/utils/cn.js'

/** Radio group of variant buttons with roving focus: Arrow keys move and select, Home / End jump. */
export default function VariantSwitcher({ variants, value, onChange }) {
  const refs = useRef({})

  const onKeyDown = (event) => {
    const index = variants.findIndex((variant) => variant.id === value)
    const last = variants.length - 1
    const target = { ArrowRight: index === last ? 0 : index + 1, ArrowDown: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, ArrowUp: index === 0 ? last : index - 1, Home: 0, End: last }[event.key]
    if (target === undefined) return
    event.preventDefault()
    const next = variants[target]
    onChange(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div role="radiogroup" aria-label="Variant" onKeyDown={onKeyDown} className="flex flex-wrap gap-1.5">
      {variants.map((variant) => {
        const selected = variant.id === value
        return (
          <button
            key={variant.id}
            ref={(node) => {
              refs.current[variant.id] = node
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(variant.id)}
            className={cn(
              'rounded-control border px-3 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-surface text-foreground hover:bg-surface-muted',
            )}
          >
            {variant.label}
          </button>
        )
      })}
    </div>
  )
}
