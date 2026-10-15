import { useId, useState } from 'react'
import { cn } from '../../../utils/cn.js'
import { focusRing } from '../../../primitives/shared/styles.js'
import { Button, Input } from '../../../primitives/index.js'
import { ChevronDownIcon } from '../../../icons/index.jsx'
import {
  clearFilterGroup,
  filterType,
  getFilterValue,
  parseNumber,
  setFilterValue,
  toggleFilterOption,
} from '../../../utils/discovery.js'

const DEFAULT_VISIBLE_OPTIONS = 6

const rowBase = [
  'flex cursor-pointer items-center gap-3 rounded-control px-2 text-sm text-foreground transition-colors',
  'hover:bg-surface-muted',
  'has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:hover:bg-transparent',
].join(' ')

const rowSizes = { md: 'min-h-9', lg: 'min-h-11' }
const controlSizes = { md: 'size-4', lg: 'size-5' }

/** One checkbox or radio row. The native input is the control, so keyboard and screen readers work unchanged. */
function OptionRow({ type, name, option, checked, onChange, size, labels }) {
  return (
    <li>
      <label className={cn(rowBase, rowSizes[size])}>
        <input
          type={type}
          name={name}
          checked={checked}
          disabled={option.disabled}
          onChange={onChange}
          className={cn('shrink-0 accent-primary', controlSizes[size], focusRing)}
        />
        <span className="min-w-0 flex-1">{option.label}</span>
        {option.count !== undefined && (
          <>
            <span aria-hidden="true" className="shrink-0 text-xs tabular-nums text-foreground-subtle">
              {option.count}
            </span>
            <span className="sr-only">, {labels.itemCount(option.count)}</span>
          </>
        )}
      </label>
    </li>
  )
}

const toDraft = (amount) => (amount === undefined ? '' : String(amount))

/**
 * Min / max price-style inputs. Typing only edits a local draft; the value is
 * committed to the page on blur or Enter, so the page is not asked to refilter
 * on every keystroke. Bounds are clamped and swapped if entered in reverse.
 */
function RangeFilter({ group, value, onCommit, size, labels }) {
  const key = `${value?.min ?? ''}|${value?.max ?? ''}`
  const [seenKey, setSeenKey] = useState(key)
  const [draft, setDraft] = useState({ min: toDraft(value?.min), max: toDraft(value?.max) })

  // Follow external changes (chip removed, "clear all", URL navigation).
  if (key !== seenKey) {
    setSeenKey(key)
    setDraft({ min: toDraft(value?.min), max: toDraft(value?.max) })
  }

  const commit = () => {
    let min = parseNumber(draft.min)
    let max = parseNumber(draft.max)
    if (min !== undefined && group.min !== undefined) min = Math.max(min, group.min)
    if (max !== undefined && group.max !== undefined) max = Math.min(max, group.max)
    if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min]

    setDraft({ min: toDraft(min), max: toDraft(max) })
    if (min !== value?.min || max !== value?.max) {
      onCommit(min === undefined && max === undefined ? undefined : { min, max })
    }
  }

  const field = (side, label) => (
    <Input
      type="number"
      inputMode="decimal"
      size={size === 'lg' ? 'md' : 'sm'}
      label={label}
      value={draft[side]}
      min={group.min}
      max={group.max}
      step={group.step}
      placeholder={group[side] === undefined ? undefined : String(group[side])}
      onChange={(event) => setDraft((current) => ({ ...current, [side]: event.target.value }))}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          commit()
        }
      }}
    />
  )

  return (
    <div className="grid grid-cols-2 gap-2 px-0.5 pb-1 pt-1">
      {field('min', labels.min)}
      {field('max', labels.max)}
    </div>
  )
}

function FilterGroup({ group, filters, onFiltersChange, accordion, size, headingLevel, labels }) {
  const baseId = useId()
  const headingId = `${baseId}-heading`
  const panelId = `${baseId}-panel`
  const [open, setOpen] = useState(group.defaultOpen ?? true)
  const [showAll, setShowAll] = useState(false)

  const type = filterType(group)
  const value = getFilterValue(group, filters)
  const active = value !== undefined
  const expanded = !accordion || open
  const Heading = `h${headingLevel}`
  const emit = (next) => onFiltersChange?.(next)

  const isSelected = (option) => (type === 'radio' ? value === option.value : Boolean(value?.includes(option.value)))
  const options = group.options ?? []
  const limit = group.visibleOptions ?? DEFAULT_VISIBLE_OPTIONS
  const collapsible = type === 'checkbox' && options.length > limit
  // Selected options stay visible even when they would fall behind "Show more".
  const visible = collapsible && !showAll ? options.filter((option, index) => index < limit || isSelected(option)) : options

  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-2">
        <Heading id={headingId} className="min-w-0 flex-1 text-sm font-semibold text-foreground">
          {accordion ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={open ? panelId : undefined}
              onClick={() => setOpen((current) => !current)}
              className={cn(
                'flex w-full items-center gap-2 rounded-control py-2 text-left',
                size === 'lg' && 'min-h-11',
                focusRing,
              )}
            >
              <span aria-hidden="true" className={cn('text-foreground-subtle transition-transform', !open && '-rotate-90')}>
                <ChevronDownIcon />
              </span>
              <span className="truncate">{group.label}</span>
            </button>
          ) : (
            <span className="block py-2">{group.label}</span>
          )}
        </Heading>
        {active && (
          <Button
            variant="ghost"
            size="sm"
            aria-label={labels.clearGroup(group.label)}
            onClick={() => emit(clearFilterGroup(filters, group.id))}
          >
            {labels.clear}
          </Button>
        )}
      </div>

      {expanded && (
        <div id={panelId} role={type === 'radio' ? 'radiogroup' : 'group'} aria-labelledby={headingId}>
          {type === 'range' ? (
            <RangeFilter
              group={group}
              value={value}
              size={size}
              labels={labels}
              onCommit={(next) => emit(setFilterValue(filters, group, next))}
            />
          ) : (
            <>
              <ul role="list">
                {visible.map((option) => (
                  <OptionRow
                    key={String(option.value)}
                    type={type === 'radio' ? 'radio' : 'checkbox'}
                    name={type === 'radio' ? `${baseId}-radio` : undefined}
                    option={option}
                    checked={isSelected(option)}
                    onChange={() => emit(toggleFilterOption(filters, group, option.value))}
                    size={size}
                    labels={labels}
                  />
                ))}
              </ul>
              {collapsible && (
                <Button variant="ghost" size="sm" aria-expanded={showAll} onClick={() => setShowAll((current) => !current)}>
                  {showAll ? labels.showLess : labels.showMore}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * The filter groups of a sidebar or drawer. Controlled: it reads `filters` and
 * asks the page for the next object through `onFiltersChange`.
 *
 * `accordion` makes each group collapsible (open state is local UI state only).
 */
export default function FilterGroups({
  groups,
  filters,
  onFiltersChange,
  accordion = false,
  size = 'md',
  headingLevel = 3,
  labels,
}) {
  return (
    <div className="divide-y divide-border">
      {groups.map((group) => (
        <FilterGroup
          key={group.id}
          group={group}
          filters={filters}
          onFiltersChange={onFiltersChange}
          accordion={accordion}
          size={size}
          headingLevel={headingLevel}
          labels={labels}
        />
      ))}
    </div>
  )
}
