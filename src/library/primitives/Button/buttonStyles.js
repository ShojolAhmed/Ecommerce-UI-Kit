import { focusRing } from '../shared/styles.js'

/** Layout + focus shared by Button and IconButton. Radius comes from `buttonShapes`. */
export const buttonBase = [
  'relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap',
  'font-medium transition-colors',
  focusRing,
].join(' ')

/* `actionable:` = hover/active only while the button is neither disabled nor loading. */
export const buttonVariants = {
  primary:
    'bg-primary text-primary-foreground actionable:hover:bg-primary-hover actionable:active:bg-primary-active',
  secondary:
    'bg-secondary text-secondary-foreground actionable:hover:bg-secondary-hover actionable:active:bg-secondary-active',
  outline:
    'border border-border-strong bg-transparent text-foreground actionable:hover:bg-surface-muted actionable:active:bg-surface-sunken',
  ghost:
    'bg-transparent text-foreground actionable:hover:bg-surface-muted actionable:active:bg-surface-sunken',
  danger:
    'bg-danger text-danger-foreground actionable:hover:bg-danger-hover actionable:active:bg-danger-active',
}

export const buttonSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

/** Square sizes used when `iconOnly` is set (no horizontal padding). */
export const buttonIconSizes = {
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg',
}

export const buttonShapes = {
  rounded: 'rounded-control',
  pill: 'rounded-full',
}
