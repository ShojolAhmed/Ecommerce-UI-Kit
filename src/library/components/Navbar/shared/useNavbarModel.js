import { resolveIcons } from './resolveIcons.jsx'
import { buildActions, normalizeSearch } from './model.js'
import { useMobileMenu } from './useMobileMenu.js'

/** Everything the variants have in common, derived from the shared props. */
export function useNavbarModel(props, { closeAbove }) {
  const { icons: iconOverrides, account, wishlist, cart, search } = props
  const icons = resolveIcons(iconOverrides)

  return {
    icons,
    actions: buildActions({ account, wishlist, cart }, icons),
    search: normalizeSearch(search),
    mobileMenu: useMobileMenu({ closeAbove }),
  }
}
