/**
 * Vertical padding of a homepage section. A prop (not a class override) because
 * two Tailwind `py-*` classes on one element are resolved by stylesheet order, not by className order.
 * Adjacent sections add their paddings together, so use `none` or `sm` when stacking many.
 */
export const sectionSpacing = {
  none: '',
  sm: 'py-6 sm:py-8',
  md: 'py-10 sm:py-14',
  lg: 'py-14 sm:py-20 lg:py-24',
}
