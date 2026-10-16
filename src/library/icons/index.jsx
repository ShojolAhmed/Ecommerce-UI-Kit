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

/* ---- Added for footers and homepage sections ---- */

export const PlusIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const MinusIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <path d="M5 12h14" />
  </svg>
)

export const ArrowRightIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const PauseIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <path d="M9 5v14M15 5v14" />
  </svg>
)

export const PlayIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <path d="M7 4.5v15l12-7.5-12-7.5Z" />
  </svg>
)

export const CopyIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={cn('size-[1em] shrink-0', className)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
)

export const StarIcon = ({ className, ...props }) => (
  <svg {...base} {...props} fill="currentColor" strokeWidth={1} className={cn('size-[1em] shrink-0', className)}>
    <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8L12 3Z" />
  </svg>
)

export const QuoteIcon = ({ className, ...props }) => (
  <svg {...base} {...props} fill="currentColor" stroke="none" className={cn('size-[1.5em] shrink-0', className)}>
    <path d="M4 18v-5.5C4 8.4 6.2 6 9.5 5.5l.5 1.9C8.4 7.9 7.6 9 7.5 10.5H10V18H4Zm9 0v-5.5c0-4.1 2.2-6.5 5.5-7l.5 1.9c-1.6.5-2.4 1.6-2.5 3.1H19V18h-6Z" />
  </svg>
)

/* Social glyphs: simple outlines, so they match the rest of the icon set. */
export const InstagramIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
)

export const FacebookIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" />
  </svg>
)

export const XIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="M4 4h4.5l11.5 16h-4.5L4 4Z" />
    <path d="m4.5 20 6.3-6.8M19.5 4l-6.3 6.8" />
  </svg>
)

export const YouTubeIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" />
  </svg>
)

export const GlobeIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z" />
  </svg>
)

/* ---- Added for the cart, dialogs and toasts ---- */

export const TrashIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </svg>
)

export const ShoppingBagIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
)

export const InfoIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
)

export const AlertTriangleIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="M12 3.5 2.5 20h19L12 3.5Z" />
    <path d="M12 10v4.5M12 17.5h.01" />
  </svg>
)
