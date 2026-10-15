import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn.js'
import { focusRing } from '../../primitives/shared/styles.js'
import { inputSizes } from '../../primitives/index.js'
import { CheckIcon, ChevronDownIcon } from '../../icons/index.jsx'

const triggerBase = [
  'w-full min-w-44 rounded-control border border-border-strong bg-surface text-foreground transition-colors',
  'hover:border-foreground-subtle',
  focusRing,
].join(' ')

const step = (options, from, direction) => {
  for (let index = from + direction; index >= 0 && index < options.length; index += direction) {
    if (!options[index].disabled) return index
  }
  return from
}
const firstEnabled = (options) => options.findIndex((option) => !option.disabled)
const lastEnabled = (options) => options.findLastIndex((option) => !option.disabled)

/** Native <select>: the OS picker on phones, zero custom behaviour to get wrong. */
function NativeSort({ options, value, onChange, labelId, id, size, placeholder, disabled }) {
  const selectedIndex = options.findIndex((option) => option.value === value)

  return (
    <div className="relative">
      <select
        id={id}
        aria-labelledby={labelId}
        disabled={disabled}
        value={selectedIndex === -1 ? '' : String(selectedIndex)}
        onChange={(event) => {
          const option = options[Number(event.target.value)]
          if (option) onChange?.(option.value, option)
        }}
        className={cn(
          triggerBase,
          'cursor-pointer appearance-none pr-9! disabled:cursor-not-allowed disabled:opacity-50',
          inputSizes[size],
        )}
      >
        {selectedIndex === -1 && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={String(option.value)} value={String(index)} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-foreground-subtle"
      >
        <ChevronDownIcon />
      </span>
    </div>
  )
}

/**
 * Select-only combobox (WAI-ARIA APG pattern): focus stays on the trigger and
 * the highlighted option is exposed through `aria-activedescendant`.
 * It is a <div role="combobox">, not a <button>, so Space cannot fire a stray click on key-up.
 */
function MenuSort({ options, value, onChange, labelId, size, placeholder, align, disabled, triggerRef }) {
  const baseId = useId()
  const listId = `${baseId}-list`
  const optionId = (index) => `${baseId}-option-${index}`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const typeahead = useRef({ text: '', timer: undefined })

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = options[selectedIndex]

  useEffect(() => {
    const pending = typeahead.current
    return () => clearTimeout(pending.timer)
  }, [])

  useEffect(() => {
    if (open && active >= 0) {
      document.getElementById(`${baseId}-option-${active}`)?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [open, active, baseId])

  const openMenu = (index) => {
    setActive(index ?? (selectedIndex >= 0 ? selectedIndex : firstEnabled(options)))
    setOpen(true)
  }

  const choose = (index) => {
    const option = options[index]
    if (!option || option.disabled) return
    if (option.value !== value) onChange?.(option.value, option)
    setOpen(false)
  }

  const search = (character) => {
    const state = typeahead.current
    clearTimeout(state.timer)
    state.text += character.toLowerCase()
    state.timer = setTimeout(() => {
      state.text = ''
    }, 500)

    // Repeating one letter cycles through the options that start with it.
    const from = state.text.length === 1 ? active + 1 : active
    const ordered = options.map((_, index) => (index + from + options.length) % options.length)
    const match = ordered.find(
      (index) => !options[index].disabled && options[index].label.toLowerCase().startsWith(state.text),
    )
    if (match !== undefined) {
      if (!open) setOpen(true)
      setActive(match)
    }
  }

  const handleKeyDown = (event) => {
    if (disabled || event.altKey || event.ctrlKey || event.metaKey) return
    const { key } = event

    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault()
        openMenu()
      } else if (key === 'Home') {
        event.preventDefault()
        openMenu(firstEnabled(options))
      } else if (key === 'End') {
        event.preventDefault()
        openMenu(lastEnabled(options))
      } else if (key.length === 1) {
        search(key)
      }
      return
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((index) => step(options, index, 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((index) => step(options, index, -1))
        break
      case 'Home':
        event.preventDefault()
        setActive(firstEnabled(options))
        break
      case 'End':
        event.preventDefault()
        setActive(lastEnabled(options))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        event.preventDefault()
        event.stopPropagation() // do not also close a surrounding dialog
        setOpen(false)
        break
      case 'Tab':
        choose(active) // APG: Tab commits the highlighted option, then focus moves on as usual
        setOpen(false)
        break
      default:
        if (key.length === 1) search(key)
    }
  }

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-disabled={disabled || undefined}
        onClick={() => (disabled ? undefined : open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
        className={cn(
          triggerBase,
          'flex cursor-pointer select-none items-center justify-between gap-2',
          disabled && 'cursor-not-allowed opacity-50',
          inputSizes[size],
        )}
      >
        <span className={cn('truncate', !selected && 'text-foreground-subtle')}>{selected?.label ?? placeholder}</span>
        <span aria-hidden="true" className={cn('shrink-0 text-foreground-subtle transition-transform', open && 'rotate-180')}>
          <ChevronDownIcon />
        </span>
      </div>

      {open && options.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          // Keep focus on the trigger while pointing at (or scrolling) the list.
          onMouseDown={(event) => event.preventDefault()}
          className={cn(
            'absolute z-30 mt-1 max-h-64 w-max min-w-full max-w-[min(20rem,90vw)] overflow-auto rounded-surface border border-border bg-surface p-1 shadow-lg',
            align === 'start' ? 'left-0' : 'right-0',
          )}
        >
          {options.map((option, index) => (
            <li
              key={String(option.value)}
              id={optionId(index)}
              role="option"
              aria-selected={index === selectedIndex}
              aria-disabled={option.disabled || undefined}
              onClick={() => choose(index)}
              onMouseMove={() => active !== index && !option.disabled && setActive(index)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-3 rounded-control px-3 py-2 text-sm text-foreground',
                index === active && 'bg-surface-muted',
                index === selectedIndex && 'font-semibold',
                option.disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <span>{option.label}</span>
              {index === selectedIndex && <CheckIcon />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Sort control. Controlled: the page owns `value` and does the sorting.
 *
 * Two renderings of the same API:
 *  - default: a styled listbox following the WAI-ARIA "select-only combobox" pattern
 *    (Enter / Space / ArrowDown open, arrows + Home / End move, Enter or Space picks,
 *    Escape closes, Tab commits, typing jumps to a matching label);
 *  - `native`: a styled native <select>, which gives the OS picker on phones.
 *
 * @param {object} props
 * @param {{ value: string|number, label: string, disabled?: boolean }[]} props.options
 * @param {string|number} [props.value]               Value of the selected option. No match shows the placeholder.
 * @param {(value: string|number, option: object) => void} [props.onChange]
 * @param {string} [props.label='Sort by']            Visible label, and the accessible name of the control.
 * @param {boolean} [props.hideLabel=false]           Hide the label visually (it stays available to screen readers).
 * @param {boolean} [props.native=false]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {'start'|'end'} [props.align='end']         Which edge the open list lines up with (listbox rendering only).
 * @param {string} [props.placeholder='Select']
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 */
export default function SortDropdown({
  options = [],
  value,
  onChange,
  label = 'Sort by',
  hideLabel = false,
  native = false,
  size = 'md',
  align = 'end',
  placeholder = 'Select',
  disabled = false,
  className,
}) {
  const baseId = useId()
  const labelId = `${baseId}-label`
  const selectId = `${baseId}-select`
  const triggerRef = useRef(null)

  const labelClass = cn('whitespace-nowrap text-sm text-foreground-muted', hideLabel && 'sr-only')

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {native ? (
        <label id={labelId} htmlFor={selectId} className={labelClass}>
          {label}
        </label>
      ) : (
        <span id={labelId} onClick={() => triggerRef.current?.focus()} className={labelClass}>
          {label}
        </span>
      )}
      {native ? (
        <NativeSort
          id={selectId}
          options={options}
          value={value}
          onChange={onChange}
          labelId={labelId}
          size={size}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <MenuSort
          options={options}
          value={value}
          onChange={onChange}
          labelId={labelId}
          size={size}
          placeholder={placeholder}
          align={align}
          disabled={disabled}
          triggerRef={triggerRef}
        />
      )}
    </div>
  )
}
