import { cn } from '../../../utils/cn.js'

// Built-in icons for the product cards (decorative; the buttons that hold them carry the names).
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

/** `filled` shows the "in wishlist" state. */
export const HeartIcon = ({ filled = false, className, ...props }) => (
  <svg {...base} {...props} fill={filled ? 'currentColor' : 'none'} className={sized(className)}>
    <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
)

export const BagIcon = ({ className, ...props }) => (
  <svg {...base} {...props} className={sized(className)}>
    <path d="M6 7h12l1 13H5L6 7Z" />
    <path d="M9 7V6a3 3 0 0 1 6 0v1" />
  </svg>
)

export const StarIcon = ({ className, ...props }) => (
  <svg {...base} {...props} fill="currentColor" stroke="none" className={cn('size-[1em] shrink-0', className)}>
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9 2.9-6Z" />
  </svg>
)

export const ImageIcon = ({ className, ...props }) => (
  <svg {...base} {...props} strokeWidth={1.25} className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.75" />
    <path d="m21 16-5-5-8 9" />
  </svg>
)
