import { cn } from '../utils/cn.js'

// Built-in icons for the product discovery components. They are decorative:
// the buttons that hold them carry the accessible names.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

const sized = (className) => cn('size-[1.25em] shrink-0', className)

export const SearchIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const CloseIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const ChevronDownIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const ChevronLeftIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
)

export const ChevronRightIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const CheckIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

/** "Sliders" glyph used for filter buttons. */
export const FilterIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </svg>
)
