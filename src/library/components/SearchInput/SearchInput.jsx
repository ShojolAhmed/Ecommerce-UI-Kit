import { useRef } from 'react'
import { cn } from '../../utils/cn.js'
import { IconButton, Input } from '../../primitives/index.js'
import { CloseIcon, SearchIcon } from '../../icons/index.jsx'

/**
 * Controlled search field: the page owns `value`. It does no searching itself
 * (no requests, no debouncing); it only reports what the person types.
 *
 *  - `onChange(value)` on every keystroke (debounce it on your side if you query as they type)
 *  - `onSubmit(query)` on Enter, with the trimmed text
 *  - `onClear()` after the clear button or Escape empties the field (`onChange('')` fires too)
 *
 * It renders a `<form role="search">`, so give it a `label` that is unique on the
 * page if there is also a search field in the navbar. Escape clears a non-empty
 * field and stops there, so it will not also close a surrounding dialog.
 *
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string, event: React.ChangeEvent) => void} props.onChange
 * @param {(query: string, event: React.FormEvent) => void} [props.onSubmit]
 * @param {() => void} [props.onClear]
 * @param {string} [props.label='Search products']       Accessible name of the field and the search landmark.
 * @param {string} [props.clearLabel='Clear search']
 * @param {string} [props.placeholder='Search products']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {'rounded'|'pill'} [props.shape='rounded']
 * @param {React.ReactNode} [props.icon]                  Replaces the built-in search icon.
 * @param {string} [props.className]                      Classes for the <form>.
 */
export default function SearchInput({
  value,
  onChange,
  onSubmit,
  onClear,
  label = 'Search products',
  clearLabel = 'Clear search',
  placeholder = 'Search products',
  size = 'md',
  shape = 'rounded',
  icon,
  className,
  ...rest
}) {
  const inputRef = useRef(null)

  if (value === undefined && import.meta.env?.DEV) {
    console.warn('[SearchInput] The "value" prop is required: the component is controlled.')
  }

  const text = value ?? ''

  const clear = () => {
    onChange?.('', undefined)
    onClear?.()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(text.trim(), event)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && text !== '') {
      event.preventDefault()
      event.stopPropagation()
      clear()
    }
  }

  return (
    <form role="search" aria-label={label} onSubmit={handleSubmit} className={cn('relative', className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-foreground-subtle"
      >
        {icon ?? <SearchIcon />}
      </span>
      {/* `!` suffixes: Tailwind's important modifier, so these override the Input primitive's padding and radius deterministically. */}
      <Input
        {...rest}
        ref={inputRef}
        type="search"
        size={size}
        value={text}
        onChange={(event) => onChange?.(event.target.value, event)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={label}
        enterKeyHint="search"
        autoComplete="off"
        className={cn(
          'pl-10! pr-10! [&::-webkit-search-cancel-button]:hidden',
          shape === 'pill' && 'rounded-full!',
        )}
      />
      {text !== '' && (
        <span className="absolute inset-y-0 right-1 flex items-center">
          <IconButton
            size="sm"
            shape={shape === 'pill' ? 'pill' : 'rounded'}
            label={clearLabel}
            onClick={() => {
              clear()
              inputRef.current?.focus()
            }}
          >
            <CloseIcon />
          </IconButton>
        </span>
      )}
    </form>
  )
}
