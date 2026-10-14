import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  BagIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
} from './icons.jsx'

/** Merge consumer-provided icon elements over the built-in defaults. */
export function resolveIcons(overrides = {}) {
  return {
    search: <SearchIcon />,
    account: <UserIcon />,
    wishlist: <HeartIcon />,
    cart: <BagIcon />,
    menu: <MenuIcon />,
    close: <CloseIcon />,
    chevron: <ChevronDownIcon />,
    ...overrides,
  }
}
