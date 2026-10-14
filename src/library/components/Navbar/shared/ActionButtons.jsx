import { Badge, IconButton } from '../../../primitives/index.js'

/**
 * Icon buttons for account / wishlist / cart. Renders a link when the action
 * has an `href`, otherwise a button. The count badge is visual only; the
 * count is part of the accessible name ("Cart, 3 items").
 */
export function ActionButton({ action, size = 'md', shape = 'rounded', badgeVariant = 'brand' }) {
  const asLink = Boolean(action.href)

  return (
    <IconButton
      as={asLink ? 'a' : 'button'}
      href={action.href}
      onClick={action.onClick}
      label={action.accessibleLabel}
      size={size}
      shape={shape}
    >
      {action.icon}
      {action.count && (
        <Badge
          variant={badgeVariant}
          className="pointer-events-none absolute right-0 top-0 min-w-4 justify-center px-1 py-0 text-[0.625rem] leading-4"
        >
          {action.count}
        </Badge>
      )}
    </IconButton>
  )
}

/** A row of action buttons. */
export function ActionButtons({ actions, className, ...buttonProps }) {
  return (
    <div className={className}>
      {actions.map((action) => (
        <ActionButton key={action.id} action={action} {...buttonProps} />
      ))}
    </div>
  )
}
