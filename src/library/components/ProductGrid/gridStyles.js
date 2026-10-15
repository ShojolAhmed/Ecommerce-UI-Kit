/**
 * Responsive column presets for the `columns` prop (the number is the column
 * count on the widest screens). Keep full class names so Tailwind can detect them.
 * Without `columns`, ProductGrid uses the variant's own default layout.
 */
export const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
}
