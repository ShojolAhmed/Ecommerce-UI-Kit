import { Badge, Button } from '../../primitives/index.js'
import { FilterIcon } from '../../icons/index.jsx'

/**
 * The button that opens a <FilterDrawer>: filter icon, label and active-filter count.
 * Accepts every Button prop (variant, size, shape, className…). Pass a `ref` and
 * give the same ref to the drawer as `triggerRef` so focus returns here on close.
 *
 * @param {object} props
 * @param {number} [props.activeCount=0]   Shown as a badge and announced ("Filters, 3 active").
 * @param {boolean} [props.open]           Sets `aria-expanded`. Pass the drawer's `open` state.
 * @param {string} [props.label='Filters']
 * @param {(count: number) => string} [props.activeLabel]  Screen-reader text for the count.
 */
export default function FilterButton({
  activeCount = 0,
  open,
  label = 'Filters',
  activeLabel = (count) => `${count} active`,
  variant = 'outline',
  children,
  ...props
}) {
  return (
    <Button
      {...props}
      variant={variant}
      aria-haspopup="dialog"
      aria-expanded={open}
      leadingIcon={<FilterIcon />}
    >
      {children ?? label}
      {activeCount > 0 && (
        <>
          <Badge variant="brand" aria-hidden="true">
            {activeCount}
          </Badge>
          <span className="sr-only">, {activeLabel(activeCount)}</span>
        </>
      )}
    </Button>
  )
}
