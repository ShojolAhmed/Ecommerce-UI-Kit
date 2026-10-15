import { Button } from '../../library/index.js'

/** Preview-only row of toggle buttons for switching a demo option. */
export default function Switcher({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1">
      <span aria-hidden="true" className="mr-1 text-sm text-foreground-muted">
        {label}
      </span>
      {options.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={value === option ? 'primary' : 'outline'}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  )
}
