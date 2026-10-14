import { cn } from '../../utils/cn.js'
import { badgeVariants, badgeSizes } from './badgeStyles.js'

/**
 * Small status label. Meaning is carried by its text, never by color alone.
 *
 * @param {object} props
 * @param {'neutral'|'brand'|'success'|'warning'|'danger'|'info'} [props.variant='neutral']
 * @param {'sm'|'md'} [props.size='sm']
 */
export default function Badge({ variant = 'neutral', size = 'sm', className, children, ...rest }) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full font-medium',
        badgeVariants[variant],
        badgeSizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
