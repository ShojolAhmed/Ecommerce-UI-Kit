import { cn } from '../../utils/cn.js'
import { containerSizes } from './containerStyles.js'

/**
 * Centered, width-constrained page wrapper with fluid side padding.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div']
 * @param {'narrow'|'default'|'wide'|'full'} [props.size='default']
 * @param {boolean} [props.padded=true]  Apply the fluid `gutter` side padding.
 */
export default function Container({
  as: Component = 'div',
  size = 'default',
  padded = true,
  className,
  children,
  ...rest
}) {
  return (
    <Component
      {...rest}
      className={cn('mx-auto w-full', containerSizes[size], padded && 'px-gutter', className)}
    >
      {children}
    </Component>
  )
}
