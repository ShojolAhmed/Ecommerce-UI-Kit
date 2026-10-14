/**
 * Join class names, skipping falsy values.
 * Keeps components free of a classnames dependency.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
