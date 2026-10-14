import { useState } from 'react'
import { cn } from '../../../utils/cn.js'
import { Input } from '../../../primitives/index.js'

/**
 * Search form shared by every variant.
 *  - With `search.onSubmit` the form stays on the page and calls it with the trimmed query.
 *  - Without it the form does a native GET to `search.action` (field name: `q`).
 *
 * Note: the `!` suffixes below are Tailwind's important modifier. They let this
 * field override the Input primitive's own padding and radius deterministically.
 */
export default function SearchField({
  search,
  icon,
  size = 'md',
  shape = 'rounded',
  autoFocus = false,
  onSubmitted,
  className,
}) {
  const [value, setValue] = useState(search.defaultValue ?? '')

  const handleSubmit = (event) => {
    if (search.onSubmit) {
      event.preventDefault()
      search.onSubmit(value.trim(), event)
    }
    onSubmitted?.(value.trim())
  }

  return (
    <form role="search" action={search.action} method="get" onSubmit={handleSubmit} className={cn('relative', className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-foreground-subtle"
      >
        {icon}
      </span>
      <Input
        type="search"
        name="q"
        size={size}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={search.placeholder}
        aria-label={search.label}
        enterKeyHint="search"
        autoComplete="off"
        autoFocus={autoFocus}
        className={cn('pl-10!', shape === 'pill' && 'rounded-full!')}
      />
    </form>
  )
}
