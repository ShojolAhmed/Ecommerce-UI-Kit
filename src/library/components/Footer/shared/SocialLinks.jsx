import { cn } from '../../../utils/cn.js'
import { IconButton } from '../../../primitives/index.js'
import { FacebookIcon, GlobeIcon, InstagramIcon, XIcon, YouTubeIcon } from '../../../icons/index.jsx'
import { socialPlatformNames } from './model.js'

const platformIcons = { instagram: InstagramIcon, facebook: FacebookIcon, x: XIcon, youtube: YouTubeIcon }

/** Row of icon links. Each link is named by its platform ("Instagram"), never by the icon. */
export default function SocialLinks({ items = [], label, onNavigate, className }) {
  const entries = items.filter((item) => item?.href && (item.label || socialPlatformNames[item.platform]))
  if (entries.length === 0) return null

  return (
    <ul role="list" aria-label={label} className={cn('flex flex-wrap items-center gap-1', className)}>
      {entries.map((item) => {
        const name = item.label ?? socialPlatformNames[item.platform]
        const Icon = platformIcons[item.platform] ?? GlobeIcon
        return (
          <li key={item.id ?? item.href}>
            <IconButton
              as="a"
              href={item.href}
              label={name}
              size="md"
              shape="pill"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => onNavigate?.({ ...item, label: name }, event)}
            >
              {item.icon ?? <Icon />}
            </IconButton>
          </li>
        )
      })}
    </ul>
  )
}
