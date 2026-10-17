import { cn } from '../../library/utils/cn.js'

/** Small segmented control for the toolbar (viewport, theme). A radio group built from buttons. */
export default function Segmented({ label, options, value, onChange }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-control border border-border bg-surface p-0.5">
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              'rounded-sm px-2.5 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
              selected ? 'bg-primary text-primary-foreground' : 'text-foreground-muted hover:text-foreground',
            )}
          >
            {option.label}
            {option.hint && <span className="ms-1 font-mono opacity-70">{option.hint}</span>}
          </button>
        )
      })}
    </div>
  )
}
